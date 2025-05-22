# `wallet_prepareCalls`

Prepares a call bundle. The calls are simulated and a quote for executing the bundle by the server is provided. The quote lives for a certain amount of time, after which it expires.

:::tip
This method is intended to be used in conjunction with [`wallet_sendPreparedCalls`](/rpc-server/wallet_sendPreparedCalls).
:::

## Preops

Preops are calls that are executed prior to pre-verification of the signature of the bundle, and before any payment is made.

Only certain types of calls are allowed in preops:

- Authorizing a key (`Delegation.authorize`)
- Revoking a key (`Delegation.revoke`)
- Setting call permissions on a key (`Delegation.setCanExecute`)
- Setting spend limits on a key (`Delegation.setSpendLimit`)
- Removing spend limits on keys (`Delegation.removeSpendLimit`)
- Upgrading the delegation (`Delegation.upgradeProxyDelegation`)

Preops have their own signatures, and they must be signed with a key that is already attached to the account. The `from` and `key` fields can be omitted when building a preop (`preop: true`).

## Fees

Execution of bundles are paid for by the fee payer, which defaults to the EOA. This can be overriden using `feePayer`.

Fees are paid in `feeToken`, which is specified in the capabilities of `wallet_prepareCalls`. The fee token must be supported on the target chain. The list of supported tokens on each network can be found in the response of [`wallet_getCapabilities`](/rpc-server/wallet_getCapabilities).

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
  method: 'wallet_prepareCalls',
  params: [{
    calls: {
      to: `0x${string}`,
      value: `0x${string}`,
      bytes: `0x${string}`,
    }[],
    chainId: `0x${string}`,
    // The address of the account sending the bundle.
    // It can be omitted in the case of a preop, see "Preops".
    from?: `0x${string}`,
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
      meta: {
        // The account that pays fees for this bundle.
        // Defaults to the account the bundle is for.
        //
        // See "Fees".
        feePayer?: `0x${string}`,
        feeToken: `0x${string}`,
        nonce?: `0x${string}`,
      },
      // Set of keys to revoke.
      revokeKeys: {
        hash: `0x${string}`,
        id?: `0x${string}`,
      }[],
      // See "Preops"
      preOps: {
        eoa: `0x${string}`,
        executionData: `0x${string}`,
        nonce: `0x${string}`,
        signature: `0x${string}`,
      }[],
      preOp?: boolean,
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
  } | {
    preOp: {
      eoa: `0x${string}`,
      executionData: `0x${string}`,
      nonce: `0x${string}`,
      signature: `0x${string}`,
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
