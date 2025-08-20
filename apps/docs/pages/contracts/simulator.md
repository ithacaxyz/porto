# Simulator
The Simulator is a versatile utility designed to help offchain services and Relays obtain accurate gas estimates for intents efficiently. 

It functions like an advanced multicall, enabling sophisticated operations such as searching for optimal `combinedGas` values, generating custom execution traces, and providing clearer error messages for transaction reverts.
It uses the primitive [simulateExecute](/contracts/orchestrator#simulation) function exposed by the orchestrator, and adds custom logic on top of it.

Developers have the flexibility to utilize the default `Simulator` provided by Ithaca or deploy a custom one tailored to their specific needs. 

Simulators operate without any special onchain privileges and any simulator can be used with any Orchestrator instance.

## State Override Convention

Certain simulation modes, especially those designed to generate detailed logs for tools like `eth_simulateV1`, depend on specific state overrides to operate correctly.

A general principle for enabling special simulation behaviors, such as skipping signature verification checks, involves checking the native token balance of `msg.sender`. If this balance is `type(uint256).max`, it signals a trusted simulation environment where certain validation steps can be relaxed.

- **For `simulateV1Logs`:**
    - The [simulateExecute](/contracts/orchestrator#simulation) function, when invoked with `isStateOverride = true`, requires its direct caller (`msg.sender`) to possess a native token balance equal to `type(uint256).max`.
    - When `simulateV1Logs` calls the Orchestrator, the Simulator contract acts as the `msg.sender`.
    - **Crucially, for `simulateV1Logs` to successfully produce a non-reverting trace, the Simulator contract's native token balance must be externally set to `type(uint256).max` *before* calling `simulateV1Logs`.**
    - Failure to meet this condition will typically cause the Orchestrator to revert with `StateOverrideError()`, which is then propagated by the Simulator.

:::info
**Paymaster Considerations:**
If an Intent utilizes a paymaster, the simulation might also need to bypass paymaster signature verification.

In this scenario, the Orchestrator is the `msg.sender` to the paymaster contract. Consequently, the Orchestrator's balance must also be set to `type(uint256).max` to facilitate this.

Developers creating paymasters should ensure their contracts can skip signature verification when called by an entity with a maximum balance (signifying a trusted simulation context) to maintain compatibility with the Simulator.
:::


## Endpoints
### `simulateGasUsed`
- **Signature:**
  ```solidity
  function simulateGasUsed(
    address oc,
    bool overrideCombinedGas,
    bytes calldata encodedIntent
  ) public payable virtual returns (uint256 gasUsed);
  ```
- **Description:**
  This function simulates the gas usage for a single encoded Intent. It calls the `simulateExecute` function on the specified Orchestrator contract with `isStateOverride` set to `false`.
  If the underlying simulation within the Orchestrator fails, this function will revert.
- **Usage:**
  - **Parameters:**
    - `oc`: Address of the Orchestrator contract.
    - `overrideCombinedGas`: Boolean indicating how `combinedGas` is handled:
      - If `true`: The `combinedGas` field in the `encodedIntent` is overridden to `type(uint256).max` for the simulation. This helps determine the raw gas cost without constraints from the Intent's specified gas limit.
      - If `false`: The `combinedGas` value from the `encodedIntent` is respected.
    - `encodedIntent`: The ABI-encoded [Intent](/contracts/orchestrator#intents)
  - **Returns:**
    - `gasUsed`: The amount of gas consumed by the simulated execution. This is extracted from the `SimulationPassed(uint256 gasUsed)` revert data from the Orchestrator.
  - **Reverts:**
    - If the simulation fails (e.g., due to an error in Intent logic or insufficient gas if `overrideCombinedGas` is `false`), it reverts with the Orchestrator's error.

### `simulateCombinedGas`
- **Signature:**
  ```solidity
  function simulateCombinedGas(
      address oc,
      bool isPrePayment,
      uint8 paymentPerGasPrecision,
      uint256 paymentPerGas,
      uint256 combinedGasIncrement,
      bytes calldata encodedIntent
  ) public payable virtual returns (uint256 gasUsed, uint256 combinedGas);
  ```
- **Description:**
  This function simulates an Intent's execution to iteratively find the minimum `combinedGas` value required for it to pass successfully. The process involves two main stages:
  1.  **Baseline Simulation:** 
      - Performs a primary simulation run by calling the Orchestrator's `simulateExecute` function.
      - `isStateOverride` is set to `false`.
      - `combinedGasOverride` is set to `type(uint256).max`.
      - This initial run establishes a baseline `gasUsed` for the Intent.
  2.  **Iterative Search:**
      - Iteratively increases the `combinedGas` field in a copy of the Intent.
      - Starts from `baseline_gasUsed + original_Intent.combinedGas`.
      - Associated payment amounts (`prePaymentAmount`, `totalPaymentAmount`) are adjusted accordingly in each iteration.
      - Continues until a call to the Orchestrator's `simulateExecute` (with `isStateOverride = false` and no `combinedGasOverride`) succeeds by reverting with `SimulationPassed`.
- **Usage:**
  - **Parameters:**
    - `oc`: Address of the Orchestrator contract.
    - `isPrePayment`: Boolean indicating how payment is handled:
        - If `true`: The gas-based payment is added to `prePaymentAmount` (and `totalPaymentAmount`).
        - If `false`: The gas-based payment is added only to `totalPaymentAmount`.
    - `paymentPerGasPrecision`: Defines precision for `paymentPerGas`. 
        - Example: If `paymentPerGas` is in Gwei, `paymentToken` has 18 decimals, and you want `paymentPerGas` to represent units with 9 decimal places of precision, this field would be `9`.
        - Payment amount is calculated as: `gas * paymentPerGas / (10 ** paymentPerGasPrecision)`.
    - `paymentPerGas`: Amount of `paymentToken` added to Intent's payment fields per unit of gas.
    - `combinedGasIncrement`: Basis points value for `combinedGas` increment step (e.g., `100` for 1%, `10000` for 100%).
        - `combinedGas` is updated in each iteration by: `current_combinedGas * combinedGasIncrement / 10000`
        
        - Ensure this value is greater than `10000` (e.g., `10100` for a 1% increment) to guarantee `combinedGas` increases.
    - `encodedIntent`: The ABI-encoded [Intent](/contracts/orchestrator#intents)
    
  - **Returns:**
    - `gasUsed`: Gas consumed in the first successful simulation identified during the iterative search (extracted from `SimulationPassed` revert data).
    - `combinedGas`: The `combinedGas` value from the Intent that resulted in the first successful simulation.
  - **Reverts:**
    - If the initial baseline simulation (with maximum `combinedGas`) fails.
    - If a `PaymentError` is encountered during the iterative search (increasing `combinedGas` and payments won't resolve this).

### `simulateV1Logs`
- **Signature:**
  ```solidity
  function simulateV1Logs(
      address oc,
      bool isPrePayment,
      uint8 paymentPerGasPrecision,
      uint256 paymentPerGas,
      uint256 combinedGasIncrement,
      uint256 combinedGasVerificationOffset,
      bytes calldata encodedIntent
  ) public payable virtual returns (uint256 gasUsed, uint256 combinedGas);
  ```
- **Description:**
  - Extends the functionality of `simulateCombinedGas`.
  - After determining `combinedGas` and `gasUsed` iteratively, it introduces a `combinedGasVerificationOffset`.
  - A final simulation run is performed by calling `simulateExecute` on the Orchestrator with `isStateOverride` set to `true`.
  - Goal: Generate a successful, non-reverting simulation trace compatible with tools like `eth_simulateV1` for detailed execution log retrieval.
  - Payment amounts in the Intent are updated based on the determined `combinedGas` (including the offset).
- **Usage:**
  - State override requirements are detailed [here](#state-override-convention).
  - **Parameters:**
    - `combinedGasVerificationOffset`: A static gas amount added to the `combinedGas` value found by the iterative search. This helps account for minor gas variations (e.g., with P256 signature schemes).
    - All other parameters function identically to those in [`simulateCombinedGas`](#simulatecombinedgas).

  - **Returns:**
    - `gasUsed`: Gas consumed during the final verification run.
    - `combinedGas`: Final `combinedGas` used in the verification run.
  - **Reverts:**
    - If any underlying simulation step fails.
    - If the necessary state override for the `Simulator` contract's balance is not in place, the final call to Orchestrator will likely revert with `StateOverrideError()`.





