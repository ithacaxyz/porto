# `personal_sign`

Signs an [EIP-191](https://eips.ethereum.org/EIPS/eip-191) personal message.

## Request

```ts
type Request = {
  method: 'personal_sign',
  params: [
    /** Message to sign. */
    message: string,
    /** Address of the signer. */
    address: `0x${string}`,
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

const signature = await provider.request({
  method: 'personal_sign',
  params: [ // [!code focus]
    '0xcafebabe', // [!code focus]
    '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef', // [!code focus]
  ],
}) // [!code focus]
```
