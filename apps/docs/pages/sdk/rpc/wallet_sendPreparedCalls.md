# `wallet_sendPreparedCalls`

Executes a signed and prepared call bundle.

:::tip
This method is intended to be used in conjunction with [`wallet_prepareCalls`](/sdk/rpc/wallet_prepareCalls).
:::

## Request

:::info
The request is identical to the response of [`wallet_prepareCalls`](/sdk/rpc/wallet_prepareCalls), except that it includes a signature.
:::

```ts
type Request = {
  method: 'wallet_sendPreparedCalls',
  params: [{
    /** Chain ID to send the calls to. */
    chainId: `0x${string}`;
    /** Data to be forwarded from `wallet_prepareCalls`. */
    context: { quote: unknown };
    /** Key that signed the digest and produced the signature. Optional when using EOA accounts with built-in signing. */
    key?: {
      prehash?: boolean
      publicKey: `0x${string}`;
      type: 'address' | 'secp256k1' | 'p256' | 'webauthn-256';
    };
    /** Signature. */
    signature: `0x${string}`;
  }]
}
```

## Response

```ts
type Response = {
  /** ID of the bundle. */
  id: string;
}[]
```

## Example

```ts twoslash
import { Porto } from 'porto'
import { PublicKey, Signature, WebCryptoP256 } from 'ox'

const { provider } = Porto.create()

const { publicKey, privateKey } = await WebCryptoP256.createKeyPair()

const { digest, ...request } = await provider.request({
  method: 'wallet_prepareCalls',
  params: [{
    calls: [{
      to: '0xcafebabecafebabecafebabecafebabecafebabe',
      value: '0x12345678',
    }],
    key: {
      publicKey: PublicKey.toHex(publicKey),
      type: 'p256'
    }
  }]
})

const signature = await WebCryptoP256.sign({
  payload: digest,
  privateKey,
})

const response = await provider.request({ // [!code focus]
  method: 'wallet_sendPreparedCalls', // [!code focus]
  params: [{ // [!code focus]
    ...request, // [!code focus]
    signature: Signature.toHex(signature) // [!code focus]
  }] // [!code focus]
}) // [!code focus]
```
