# `wallet_prepareCreateAccount`

Prepares an account creation.

Accounts created using the RPC server use [PREP](https://blog.biconomy.io/prep-deep-dive/) to generate an address. Using PREP, it is proven that no one knows the Secp256k1 private key of the account, even the RPC server.

The account is not fully created until `wallet_createAccount` is called.

## Keys

There exist three different key roles:

- **Admin keys** are capable of adding and modifying other keys, and capable of spending an unlimited amount of tokens and calling any contract and selector.
- **Normal keys** can only call contracts as defined by the permissions set on it, and spend the amount of tokens afforded to it by permissions.
- **Session keys** are like normal keys, except they also have an expiry.

Setting permissions on an admin key does nothing.

### Public key encoding

The encoding of a key pairs public key depends on the key type:

| Key Type         | Encoding Format       | Description                                                                    |
| ---------------- | --------------------- | ------------------------------------------------------------------------------ |
| secp256k1        | `abi.encode(address)` | Stores only the Ethereum address derived from the public key (truncated hash). |
| webAuth          | `abi.encode(x, y)`    | Stores both x and y coordinates of the public key on the elliptic curve.       |
| secp256r1 (P256) | `abi.encode(x, y)`   | Stores both x and y coordinates for the secp256r1 curve.                       |

## Selectors

Selectors for call permissions can either be a 4-byte selector, e.g. `0x12345678`, or a Solidity-style selector, like `transfer(address,uint256)`.

## Request

```ts
type Request = {
  method: 'wallet_prepareCreateAccount',
  params: [{
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
      // the contract the account should delegate to
      delegation: `0x${string}`,
    },
    chainId: `0x${string}`,
  }],
}
```

## Response

```ts
type Response = {
  context: {
    account: {
      address: `0x${string}`,
      signedAuthorization: {
        // usually 0 to allow for replayability
        chainId: `0x${string}`,
        // the contract the account delegates to
        address: `0x${string}`,
        nonce: `0x${string}`,
        yParity: `0x${string}`,
        r: `0x${string}`,
        s: `0x${string}`,
      },
      // the salt used to generate the prep account
      salt: number,
      // calls performed on account creation
      initCalls: {
        to: `0x${string}`,
        value: `0x${string}`,
        bytes: `0x${string}`,
      }[],
    },
    chainId: `0x${string}`,
  },
  // the address of the account
  address: `0x${string}`,
  // digests that need to be signed by each admin key
  digests: `0x${string}`[],
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
    // the contract the account delegates to
    delegation: `0x${string}`,
  },
}
```
