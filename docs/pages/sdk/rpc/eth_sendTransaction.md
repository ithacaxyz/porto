# `eth_sendTransaction`

Instructs the Wallet to broadcast a transaction to the network.

:::warning
This method is deprecated and exists for compatibility. Please [use `wallet_sendCalls` instead](/sdk/rpc/wallet_sendCalls).
:::

## Request

```ts
type Request = {
  method: 'eth_sendTransaction',
  params: [{
    /** Target chain ID. Defaults to the connected chain. */
    chainId?: `0x${string}`,
    /** Calldata to send with the transaction. */
    data?: `0x${string}`,
    /** Address of the sender. */
    from: `0x${string}`,
    /** Address of the recipient. */
    to: `0x${string}`,
    /** Value to transfer. Defaults to 0. */
    value?: `0x${string}`,
  }]
}
```

## Response

Transaction hash.

```ts
type Response = `0x${string}`
```

## Example

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()

const hash = await provider.request({ // [!code focus]
  method: 'eth_sendTransaction', // [!code focus]
  params: [{ // [!code focus]
    from: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef', // [!code focus]
    to: '0xcafebabecafebabecafebabecafebabecafebabe', // [!code focus]
    value: '0x1', // [!code focus]
  }], // [!code focus]
}) // [!code focus]
```
