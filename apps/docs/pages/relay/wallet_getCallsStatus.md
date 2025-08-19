# `wallet_getCallsStatus`

Get the status of a call bundle. This method is modeled after [ERC-5792](https://eips.ethereum.org/EIPS/eip-5792), but with slight modifications to better suit a multi-chain wallet, namely `chainId` is not a property of the bundle itself, but of the receipts in the bundle.

If the bundle failed off-chain, or if it is pending, there may be no receipts.

## Status Codes

The purpose of the `status` field is to provide a short summary of the current status of the bundle.
It provides some off-chain context to the array of inner transaction `receipts`.

| Code | Description                                                                                                                       |
|------|-----------------------------------------------------------------------------------------------------------------------------------|
| 100  | Batch has been received by the wallet but has not completed execution onchain (pending)                                           |
| 200  | Batch has been included onchain without reverts, receipts array contains info of all calls (confirmed)                            |
| 300  | Batch has not been included onchain and wallet will not retry (offchain failure)                                                  |
| 400  | Batch reverted **completely** and only changes related to gas charge may have been included onchain (chain rules failure)         |
| 500  | Batch reverted **partially** and some changes related to batch calls may have been included onchain (partial chain rules failure) |

## Request

The parameter is a call bundle ID, as returned by e.g. [`wallet_sendPreparedCalls`].

```ts twoslash
import { Hex } from 'viem'

// ---cut---
type Request = {
  method: 'wallet_getCallsStatus',
  // the call bundle ID
  params: [Hex],
}
```

## Response

```ts twoslash
import { Address, Hash, Hex } from 'viem'

// ---cut---
type Response = {
  id: Hex,
  status: number, // See "Status Codes"
  receipts: {
    logs: {
      chainId: Hex,
      address: Address,
      data: Hex,
      topics: Hex[],
    }[],
    status: Hex, // Hex 1 or 0 for success or failure, respectively
    blockHash?: Hash,
    blockNumber?: Hex,
    gasUsed: Hex,
    transactionHash: Hash,
  }[],
  /** Optional capabilities for cross-chain bundles */
  capabilities?: {
    /** Interop bundle status if this is an interop bundle */
    interopStatus?: 'pending' | 'confirmed' | 'failed',
  },
}
```

[`wallet_sendPreparedCalls`]: /relay/wallet_sendPreparedCalls
