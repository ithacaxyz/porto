# `eth_signTypedData_v4`

Signs [EIP-712](https://eips.ethereum.org/EIPS/eip-712) typed data.

## Request

```ts
type Request = {
  method: 'eth_signTypedData_v4',
  params: [
    /** Address of the signer. */
    address: `0x${string}`,
    /** Serialized typed data to sign. */
    data: string,
  ],
}
```

## Response

Signature.

```ts
type Response = `0x${string}`
```

## Example

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()

const signature = await provider.request({ // [!code focus]
  method: 'eth_signTypedData_v4', // [!code focus]
  params: ['0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef', '...'], // [!code focus]
}) // [!code focus]
```
