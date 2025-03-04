# `wallet_getCallsStatus`

Gets the status of a call bundle.

## Request

```ts
type Request = {
  method: 'wallet_getCallsStatus',
  params: [
    /** ID of the call bundle. */
    id: `0x${string}`
  ]
}
```

## Response

```ts
type Response = {
  /** Chain ID the calls were submitted to. */
  chainId: `0x${string}`,
  /** ID of the call bundle. */
  id: `0x${string}`,
  /** Transaction receipts of the calls. */
  receipts: {
    /** Block hash. */
    blockHash: `0x${string}`,
    /** Block number. */
    blockNumber: `0x${string}`,
    /** Gas used by the transaction. */
    gasUsed: `0x${string}`,
    /** Logs of the call. */
    logs: {
      /** Address of the contract that emitted the log. */
      address: `0x${string}`,
      /** Data of the log. */
      data: `0x${string}`,
      /** Topics of the log. */
      topics: `0x${string}`[],
    }[],
    /** Status. */
    status: `0x${string}`,
    /** Transaction hash. */
    transactionHash: `0x${string}`,
  }[],
  /** Status code. See "Status Codes" below. */
  status: number
}
```

## Example

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()

const status = await provider.request({ // [!code focus]
  method: 'wallet_getCallsStatus', // [!code focus]
  params: ['0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef'], // [!code focus]
}) // [!code focus]
```
