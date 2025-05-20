# `wallet_sendPreparedCalls`

Sends a prepared call bundle.

See [`wallet_prepareCalls`](/rpc-server/wallet_prepareCalls).

## Fees

Execution of bundles are paid for by the fee payer, which defaults to the EOA. This can be overridden using `feePayer`.

Fees are paid in `feeToken`, which is specified in the capabilities of `wallet_prepareCalls`. The fee token must be supported on the target chain. The list of supported tokens on each network can be found in the response of [`wallet_getCapabilities`](/rpc-server/wallet_getCapabilities).

## Keys

There are three different key roles:

- **Admin keys** are capable of adding and modifying other keys, and capable of spending an unlimited amount of tokens and calling any contract and selector.
- **Normal keys** can only call contracts as defined by the permissions set on it, and spend the amount of tokens afforded to it by permissions.
- **Session keys** are like normal keys, except they also have an expiry.

Setting permissions on an admin key does nothing.

### Public key encoding

The encoding of a key pair's public key depends on the key type:

| Key Type         | Encoding Format       | Description                                                                    |
| ---------------- | --------------------- | ------------------------------------------------------------------------------ |
| secp256k1        | `abi.encode(address)` | Stores only the Ethereum address derived from the public key (truncated hash). |
| webAuthn          | `abi.encode(x, y)`    | Stores both x and y coordinates of the public key on the elliptic curve.       |
| secp256r1 (P256) | `abi.encode(x, y)`   | Stores both x and y coordinates for the secp256r1 curve.                       |

## Signature encoding

The signature is encoded as follows: `abi.encodePacked(bytes(innerSignature), bytes32(keyHash), bool(prehash))`, where the key hash is `keccak(bytes32(keyType, publicKey))`.

The inner signature depends on the key type:

| Key Type | Signature |
| -------- | --------- |
| secp256r1 (p256) | `(r, s)` |
| webauthn | `(r, s)` |
| secp256k1 | `(r, s)` or `(r, vs)` |

## Selectors

Selectors for call permissions can either be a 4-byte selector, e.g. `0x12345678`, or a Solidity-style selector, like `transfer(address,uint256)`.

## Request

```ts
type Request = {
  method: 'wallet_sendPreparedCalls',
  params: [{
    capabilities?: {
      // This will be passed to `feePayer` if specified for additional on-chain verification.
      feeSignature?: `0x${string}`,
    },
    context: {
      quote: {
        chainId: `0x${string}`,
        op: {
          eoa: `0x${string}`,
          executionData: `0x${string}`,
          nonce: `0x${string}`,
          payer: `0x${string}`,
          paymentToken: `0x${string}`,
          prePaymentMaxAmount: `0x${string}`,
          totalPaymentMaxAmount: `0x${string}`,
          combinedGas: `0x${string}`,
          encodedPreOps: `0x${string}`[],
          initData: `0x${string}`,
          prePaymentAmount: `0x${string}`,
          totalPaymentAmount: `0x${string}`,
          paymentRecipient: `0x${string}`,
          signature: `0x${string}`,
          paymentSignature: `0x${string}`,
          supportedDelegationImplementation: `0x${string}`,
        },
        txGas: `0x${string}`,
        nativeFeeEstimate: {
          maxFeePerGas: number,
          maxPriorityFeePerGas: number,
        },
        // UNIX timestamp the quote expires at.
        ttl: number,
        authorizationAddress?: `0x${string}`,
        entrypoint: `0x${string}`,
        // The RPC servers signature over the quote.
        signature: {
          y_parity: boolean,
          r: `0x${string}`,
          s: `0x${string}`,
        },
        // The hash of the quote.
        hash: `0x${string}`,
      },
    },
    // The key that signed the bundle. See "Keys".
    key: {
      type: 'p256' | 'webauthnp256' | 'secp256k1',
      publicKey: `0x${string}`,
      // Whether the bundle digest will be prehashed by the key.
      prehash: boolean,
    },
    signature: `0x${string}`,
  }],
}
```

## Response

```ts
type Response = {
  // The bundle ID
  id: `0x${string}`
}
```
