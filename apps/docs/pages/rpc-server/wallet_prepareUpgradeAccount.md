# `wallet_prepareUpgradeAccount`

Prepares an account for upgrade by generating initialization data and an EIP-7702 authorization item.

Upgrading an account is different from [creating an account](/rpc-server/wallet_prepareCreateAccount). Upgrading an account generates an EIP-7702 authorization for an existing EOA, whereas creating an account using the RPC server generates a new EOA using [PREP].

The returned EIP-7702 authorization item must be signed by the EOA root key.

:::tip
This method is intended to be used in conjunction with [`wallet_upgradeAccount`](/rpc-server/wallet_upgradeAccount).
:::

## Keys

There exists three different key roles:

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
| secp256r1 (P256) | `abi.encode(x, y) `   | Stores both x and y coordinates for the secp256r1 curve.                       |

## Signature encoding

The signature is encoded as follows: `abi.encodePacked(bytes(innerSignature), bytes32(keyHash), bool(prehash))`, where the key hash is `keccak(bytes32(keyType, publicKey))`.

The inner signature depends on the key type:

| Key Type | Signature |
| -------- | --------- |
| secp256r1 (p256) | `(r, s)` |
| webauthn | `(r, s)` |
| secp256k1 | `(r, s)` or `(r, vs)` |

## Request

```ts
type Request = {
  method: 'wallet_prepareUpgradeAccount',
  params: [{
    address: `0x${string}`,
    chainId: `0x${string}`,
    capabilities: {
      authorizeKeys: {
        // See "Keys"
        key: {
          expiry?: number,
          type: 'p256' | 'webauthnp256' | 'secp256k1',
          role: 'admin' | 'normal' | 'session',
          publicKey: `0x${string}`,
        },
        permissions: ({
          type: 'call',
          // See "Selectors"
          selector: string,
          to: `0x${string}`,
        } | {
          type: 'spend',
          limit: number,
          period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year',
          // defaults to the native token (address zero)
          token?: `0x${string}`,
        })[],
      }[],
      delegation: `0x${string}`,
      // defaults to the EOA
      feePayer?: `0x${string}`,
      // defaults to the native token
      feeToken?: `0x${string}`,
    },
  }],
}
```

## Response

```ts
type Response = {
  // The context returned depending on whether
  // a preop or normal bundle was prepared.
  //
  // In the case of a preop, the preop itself
  // is returned, otherwise a quote signed by the
  // relay is returned.
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
        y_parity: bool,
        r: `0x${string}`,
        s: `0x${string}`,
      },
      // The hash of the quote.
      hash: `0x${string}`,
    },
  },
  // the digest of the bundle that the user needs to sign
  digest: `0x${string}`,
  // EIP-712 typed data of the preop or bundle.
  typedData: any,
  // capabilities assigned to the account
  capabilities: {
    authorizeKeys: {
      // key hash
      hash: `0x${string}`,
      // See "Keys"
      key: {
        expiry?: number,
        type: 'p256' | 'webauthnp256' | 'secp256k1',
        role: 'admin' | 'normal' | 'session',
        publicKey: `0x${string}`,
      },
      permissions: ({
        type: 'call',
        // See "Selectors"
        selector: string,
        to: `0x${string}`,
      } | {
        type: 'spend',
        limit: number,
        period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year',
        // defaults to the native token (address zero)
        token?: `0x${string}`,
      })[],
    }[],
    // Key revocations.
    revokeKeys: {
      hash: `0x${string}`,
      id?: `0x${string}`
    }[],
    // Simulated asset diffs, where the first element of the tuple is the recipient or sender.
    assetDiff: [
       `0x${string}`,
       {
         // Omitted if this is the native token.
         address?: `0x${string}`,
         decimals?: number,
         direction: 'incoming' | 'outgoing',
         name?: string,
         symbol?: string,
         type?: 'erc20' | 'erc721',
         uri?: string,
         // For ERC721, the asset ID. For ERC20 the value moved.
         value: number,
       }[]
    ][],
  },
  // The key that will be used to sign the bundle. See "Keys".
  //
  // It can be omitted in the case of a preop, see "Preops".
  key?: {
    type: 'p256' | 'webauthnp256' | 'secp256k1',
    publicKey: `0x${string}`,
    // Whether the bundle digest will be prehashed by the key.
    prehash: boolean,
  },
}
```

[PREP]: https://blog.biconomy.io/prep-deep-dive/
