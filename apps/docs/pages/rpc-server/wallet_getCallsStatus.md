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

```ts
type Request = {
  method: 'wallet_getCallsStatus',
  // the call bundle ID
  params: [`0x${string}`],
}
```

## Response

```ts
type Response = {
  id: `0x${string}`,
  status: number, // See "Status Codes"
  receipts?: {
    logs: {
      chainId: `0x${string}`,
      address: `0x${string}`,
      data: `0x${string}`,
      topics: `0x${string}`[],
    }[],
    status: `0x${string}`, // Hex 1 or 0 for success or failure, respectively
    blockHash?: `0x${string}`,
    blockNumber?: `0x${string}`,
    gasUsed: `0x${string}`,
    transactionHash: `0x${string}`,
  }[],
}
```
