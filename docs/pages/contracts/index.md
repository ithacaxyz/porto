# Overview

There are two main contracts:

- **Delegation** – Can be used by the EOA directly or via a relayer with a signed payload to `execute`.
- **EntryPoint** – Used when compensating the relayer for gas paid to call `execute`.

## Delegation

Calling `Delegation` directly is unreliable for relayers. 

Even if an EOA has a valid delegation during transaction preparation, the delegation can be swapped to a invalid delegation right before the transaction is mined, preventing compensation.

## EntryPoint

`EntryPoint` ensures atomic execution of compensation, UserOp validation, and execution. It also enables UserOp batching across EOAs, optimizing gas via address and storage access warming.

### Execution Flow (Single UserOp)

1. Check remaining gas using the 63/64 rule (reverts on insufficient gas).
2. Invalidate the UserOp nonce (non-reverting).
3. If step 2 succeeds, make a gas-limited compensation call (non-reverting).
4. If step 3 succeeds, make a gas-limited call for UserOp validation and execution (non-reverting).
5. Refund excess payment (will not revert).

Non-reverting steps return an error code instead of reverting to prevent griefing. A revert would still debit gas from the relayer while undoing any compensation.

Gas-limited calls use a self-call with a gas stipend to perform calls to untrusted external contracts. On revert, the error selector is extracted from returndata and returned.

### Execution Flow (Multi UserOp)

This is just a loop across an array of encoded UserOps. Only reverts if there is insufficient gas provided to the transaction.

The total amount of required gas can be reliably determined during transaction preparation via the `combinedGas` parameter in each UserOp.

## Upgradeability

There are 2 ways which an EOA can upgrade their `Delegation`:

- Execution layer: Sign a new EIP7702 transaction with the EOA key to redelegate. 
  Supports direct delegation to the `Delegation` itself, or via an `EIP7702Proxy`.

- Application layer: Delegate to an `EIP7702Proxy` (a novel proxy pattern tailored for EIP7702). 
  Upon fresh delegation, the initial implementation will be the latest official implementation on the proxy.
  A call to `execute` on the EOA is required for this initial implementation to be written to storage.
  Subsequent upgrades can be signed by an authorized passkey or the EOA key.

The `EntryPoint` is currently behind a minimal ERC1967 transparent proxy. This proxy can be upgraded if the expected `Delegation` ABI does not change, and this requires no action on the EOAs.
