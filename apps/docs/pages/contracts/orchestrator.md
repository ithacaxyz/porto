# Orchestrator
The Orchestrator is a privileged contract that facilitates trustless interactions between the relay and the account.

## Concepts
### Intents 
The orchestrator accepts executions in the form of an intent. 

An `intent` struct contains all the relevant data that allows a 3rd party like the relay to make an execution on behalf of the user, and get paid for it.

The intent has to be signed by one of the [Keys](/contracts/account#keys) authorized in the user's account. Optionally, the intent can use a `paymaster` to pay on behalf of the user, in which case the intent also needs to be signed by the paymaster.

```solidity
    struct Intent {
        ////////////////////////////////////////////////////////////////////////
        // EIP-712 Fields
        ////////////////////////////////////////////////////////////////////////
        /// @dev The user's address.
        address eoa;
        /// @dev An encoded array of calls, using ERC7579 batch execution encoding.
        /// `abi.encode(calls)`, where `calls` is of type `Call[]`.
        /// This allows for more efficient safe forwarding to the EOA.
        bytes executionData;
        /// @dev Per delegated EOA.
        /// This nonce is a 4337-style 2D nonce with some specializations:
        /// - Upper 192 bits are used for the `seqKey` (sequence key).
        ///   The upper 16 bits of the `seqKey` is `MULTICHAIN_NONCE_PREFIX`,
        ///   then the Intent EIP712 hash will exclude the chain ID.
        /// - Lower 64 bits are used for the sequential nonce corresponding to the `seqKey`.
        uint256 nonce;
        /// @dev The account paying the payment token.
        /// If this is `address(0)`, it defaults to the `eoa`.
        address payer;
        /// @dev The ERC20 or native token used to pay for gas.
        address paymentToken;
        /// @dev The maximum amount of the token to pay.
        uint256 paymentMaxAmount;
        /// @dev The combined gas limit for payment, verification, and calling the EOA.
        uint256 combinedGas;
        /// @dev Optional array of encoded SignedCalls that will be verified and executed
        /// before the validation of the overall Intent.
        /// A PreCall will NOT have its gas limit or payment applied.
        /// The overall Intent's gas limit and payment will be applied, encompassing all its PreCalls.
        /// The execution of a PreCall will check and increment the nonce in the PreCall.
        /// If at any point, any PreCall cannot be verified to be correct, or fails in execution,
        /// the overall Intent will revert before validation, and execute will return a non-zero error.
        bytes[] encodedPreCalls;
        /// @dev Only relevant for multi chain intents.
        /// There should not be any duplicate token addresses. Use address(0) for native token.
        /// If native token is used, the first transfer should be the native token transfer.
        /// If encodedFundTransfers is not empty, then the intent is considered the output intent.
        bytes[] encodedFundTransfers;
        /// @dev The settler address.
        address settler;
        /// @dev The expiry timestamp for the intent. The intent is invalid after this timestamp.
        /// If expiry timestamp is set to 0, then expiry is considered to be infinite.
        uint256 expiry;
        ////////////////////////////////////////////////////////////////////////
        // Additional Fields (Not included in EIP-712)
        ////////////////////////////////////////////////////////////////////////
        /// @dev Whether the intent should use the multichain mode - i.e verify with merkle sigs
        /// and send the cross chain message.
        bool isMultichain;
        /// @dev The funder address.
        address funder;
        /// @dev The funder signature.
        bytes funderSignature;
        /// @dev The settler context data to be passed to the settler.
        bytes settlerContext;
        /// @dev The actual payment amount, requested by the filler. MUST be less than or equal to `paymentMaxAmount`
        uint256 paymentAmount;
        /// @dev The payment recipient for the ERC20 token.
        /// Excluded from signature. The filler can replace this with their own address.
        /// This enables multiple fillers, allowing for competitive filling, better uptime.
        address paymentRecipient;
        /// @dev The wrapped signature.
        /// `abi.encodePacked(innerSignature, keyHash, prehash)`.
        bytes signature;
        /// @dev Optional payment signature to be passed into the `compensate` function
        /// on the `payer`. This signature is NOT included in the EIP712 signature.
        bytes paymentSignature;
        /// @dev Optional. If non-zero, the EOA must use `supportedAccountImplementation`.
        /// Otherwise, if left as `address(0)`, any EOA implementation will be supported.
        /// This field is NOT included in the EIP712 signature.
        address supportedAccountImplementation;
    }
```

Let's go through each of these fields, to discuss the features enabled by intents.

#### Gas Abstraction

One of the most powerful use cases of executing through intents is that the Relay can abstract gas for users and get compensated in any token the user holds.

We've removed the need for gas refunds. Instead, Relay uses the `pay` function on the account to request payment in two almost identical tranches:

1. **paymentAmount** (after intent validation):
   - If successful, the account's **nonce is incremented** and will pay for the transaction, even if the call bundle fails during execution.

Here's how the flow works:

1. The user sends their calls to the relay.
2. The relay analyzes the calls and determines the amount they want to be paid, in the `paymentToken` specified in the intent.
3. The relay simulates this operation and runs sophisticated griefing checks to assess risk, and returns a `paymentAmount` that the operation would cost.
4. The relay can also set the `supportedAccountImplementation` field in the intent when sending it onchain, to reduce the risk of the user frontrunning them by upgrading their account.

:::warning
Beyond this, the contracts do not provide native griefing protection. It is up to the relay to simulate the call and evaluate the risk associated with each intent.

Relay may choose to:
- Only support accounts that follow ERC-4337 validation rules.
:::

Our recommendations:

1. Relay should build sophisticated offchain griefing defenses, such as reputation systems and risk premiums for new users and implementations that have custom validation paths.
2. Relayers that are less sophisticated can opt to rely on the `supportedAccountImplementation` check provided by the orchestrator.


#### Paymasters
On the topic of payments, DApps might want to sponsor payments for their users. 
This means that instead of the payment to the relay being collected from the user's porto account, it can be collected from any third-party contract that implements the [pay()](/contracts/account#pay) function.

To sponsor an intent, you just need to set the `payer` field to the paymaster contract's address. 

:::note
If left empty, the payer field is substituted with the intent's eoa address. 

This is done for a gas optimization, related to calldata compression.
:::

We've allowed porto accounts to act as paymasters for other porto accounts. This makes it extremely simple to spin up paymasters to sponsor gas for your users.

:::note
Paymasters should check that account implementations they sponsor gas for have a nonce implementation that invalidates nonces. Otherwise, an account could replay a paymaster signature infinitely many times to drain a paymaster.
:::

#### Execution
The intent contains the following execution information:

###### nonce
Same as the nonce mechanic detailed [here](/contracts/account#nonce-management) in the account.
All nonces are stored and incremented in the storage of the account. The orchestrator just has special privilege to access these storage slots.

###### executionData
Since all the data like nonce and signature is added in their corresponding fields in the intent. 
The executionData requires no additional `opData` and uses the `0x0100...` single batch encoding described [here](/contracts/account#modes).

### PreCalls
PreCalls are an optional sequence of operations that can be embedded within an Intent. They are executed *after* account initialization, but *before* the main Intent's signature is validated and before any of payment tranches are processed by the Orchestrator.

This makes `preCalls` particularly suited to perform key operations for the user, before the main intent is validated.

Although we don't enforce any onchain constraints about the contents of a preCall, it is recommended that relays only allow the following calls to be added as preCalls: 
- Authorizing a key (`Account.authorize`)
- Revoking a key (`Account.revoke`)
- Setting call permissions on a key (`Account.setCanExecute`)
- Setting spend limits on a key (`Account.setSpendLimit`)
- Removing spend limits on keys (`Account.removeSpendLimit`)
- Upgrading the account (`Account.upgradeProxyAccount`)

This restriction is recommended because `preCalls` do not have their own payment or gas limits. Although the cost of `preCalls` is expected to be included in the main intent's payment figures, they are executed *before* the main payment is processed. 

Therefore, allowing arbitrary calls within `preCalls` would increase the Relay's vulnerability to griefing attacks.

**The `SignedCall` Struct**
PreCalls are added to the `Intent.encodedPreCalls` field as an array of ABI-encoded `SignedCall` structs.

```solidity
struct SignedCall {
    /// @dev The user's address.
    /// This can be set to `address(0)`, which allows it to be
    /// coalesced to the parent Intent's EOA.
    address eoa;
    /// @dev An encoded array of calls, using ERC7579 batch execution encoding.
    /// `abi.encode(calls)`, where `calls` is of type `Call[]`.
    bytes executionData;
    /// @dev Per delegated EOA. Same logic as the `nonce` in Intent.
    uint256 nonce;
    /// @dev The wrapped signature.
    bytes signature;
}
```

*   `eoa`: The target EOA for this PreCall. If set to `address(0)`, it defaults to the `eoa` of the parent Intent. As mentioned, this resolved EOA must match the parent Intent's `eoa`.
*   `executionData`: The actual operations (calls) to be performed by this PreCall. Execution Data can be calculated as 
```solidity
bytes memory executionData = abi.encode(calls)
```
*   `nonce`: A dedicated nonce for this PreCall, specific to the `eoa`. It follows the same 2D nonce scheme as described [here](/contracts/account#nonce-management)   
It is recommended to always use a separate sequence key for PreCalls.
*   `signature`: The signature authorizing this specific `SignedCall`, typically created using a key already authorized on the `eoa`.

### Flow Diagram
![Intent Flow Diagram](/intent-flow.png)

## Endpoints

### Core Execution 

These are the main entry points for submitting and executing Intents.

####  `execute` (Single Intent)
```solidity
function execute(bytes calldata encodedIntent) public payable virtual nonReentrant returns (bytes4 err)
```
- **Description:** Executes a single encoded Intent. An Intent is a structured set of operations to be performed on behalf of an EOA, potentially including calls to other contracts and gas payment details. This function handles the entire lifecycle: payment, verification, and execution of the Intent.
- **Usage:**
    - `encodedIntent`: ABI-encoded `Intent` struct. The `Intent` struct includes fields like `eoa` (the target EOA), `executionData` (encoded calls to perform), `nonce`, `payer`, `paymentToken`, `paymentMaxAmount`s, `combinedGas`, and `encodedPreCalls`.
    - The function is `payable` to receive gas payments if the EOA or a designated payer is covering transaction costs with the native token.
    - Returns `err`: A `bytes4` error selector. Non-zero if there's an error during payment, verification, or execution. A zero value indicates overall success of the Intent processing through the Orchestrator's flow.
    - Emits an `IntentExecuted` event.

#### `execute` (Batch Intents)
```solidity
function execute(bytes[] calldata encodedIntents) public payable virtual nonReentrant returns (bytes4[] memory errs)
```
- **Description:** Executes an array of encoded Intents atomically.
- **Usage:**
    - `encodedIntents`: An array of ABI-encoded `Intent` structs.
    - Returns `errs`: An array of `bytes4` error selectors, one for each Intent in the batch.
    - Each Intent is processed sequentially.

---

### Simulation 

#### `simulateExecute`
```solidity
function simulateExecute(bool isStateOverride, uint256 combinedGasOverride, bytes calldata encodedIntent) external payable returns (uint256 gasUsed)
```
- **Description:** Simulates the execution of an Intent. This is primarily used for off-chain gas estimation and validation without actually changing state or consuming real funds (unless `isStateOverride` is true and specific conditions are met for on-chain simulation with logs).
    - Signature verification steps are still performed for accurate gas measurement but will effectively pass.
    - Errors during simulation are bubbled up.
- **Usage:**
    - `isStateOverride`:
        - If `false` (typical off-chain simulation): The function will *always* revert. If successful, it reverts with `SimulationPassed(uint256 gUsed)`. If failed, it reverts with the actual error from the execution flow.
        - If `true` (for on-chain simulation that generates logs, e.g., `eth_simulateV1`): The function will *not* revert on success if `msg.sender.balance == type(uint256).max` (proving a state override environment). Returns `gasUsed`. Otherwise, reverts with `StateOverrideError`.
    - `combinedGasOverride`: Allows overriding the `combinedGas` specified in the `Intent` for simulation purposes.
    - `encodedIntent`: The ABI-encoded `Intent` struct to simulate.
    - Returns `gasUsed`: The amount of gas consumed by the execution if `isStateOverride` is true and conditions are met. Otherwise, relies on revert data.

---

### Helpers

#### `accountImplementationOf`
```solidity
function accountImplementationOf(address eoa) public view virtual returns (address result)
```
- **Description:** Returns the implementation address of an EOA if it's an EIP-7702 proxy. It checks the EOA's bytecode to determine if it's a valid EIP-7702 proxy and then retrieves its current implementation.

### Events

#### `IntentExecuted`

  ```solidity
  event IntentExecuted(address indexed eoa, uint256 indexed nonce, bool incremented, bytes4 err);
  ```
- **Description:** Emitted when an Intent (including PreCalls that use nonces) is processed via the `_execute` flow.
    - `eoa`: The target EOA of the Intent.
    - `nonce`: The nonce of the Intent.
    - `incremented`: Boolean indicating if the nonce's sequence was successfully incremented on the account. This generally implies successful verification and pre-payment.
    - `err`: The `bytes4` error selector resulting from the Intent's processing. `0` indicates no error *from the Orchestrator's perspective for that phase*. A non-zero `err` along with `incremented == true` means the verification and pre-payment were likely okay, but the main execution or post-payment failed. If `incremented == false`, an earlier stage (like verification) failed.

---