import { TryItOut } from '../../../components/TryItOut'

# Capabilities

Porto supports [EIP-5792 Capabilities](https://eips.ethereum.org/EIPS/eip-5792#wallet_getcapabilities).
Capabilites are extension features that allow for extra functionality to be requested on particular JSON-RPC requests such as `wallet_connect` and `wallet_sendCalls`, and also enable additional JSON-RPC methods. Such features could be requesting to [grant permissions](#permissions) on connection, or [setting a custom fee token](#feetoken).

Porto supports the following capabilities:

| Capability                    | Description                                            | Standard                                                              |
| ----------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------- |
| [`feeToken`](#feetoken)       | Indicates if custom fee tokens are supported.          | Experimental |
| [`merchant`](#merchant)       | Indicates if merchant functionality is supported.              | Experimental                                                          |
| [`permissions`](#permissions) | Indicates if permissions can be requested by the app.  | Experimental                                                          |
| [`requiredFunds`](#requiredfunds) | Indicates if required funds (sourcing funds from supported chains) are supported.  | Experimental                                                          |
| [`signInWithEthereum`](#signinwithethereum) | Adds support for ERC-4361 Sign in with Ethereum.  | Experimental                                                          |

## Fee Tokens

Porto allows for an application developer to use custom fee (gas) tokens to pay for the execution of a call bundle.

Custom fee tokens are indicated by the `feeToken` capability on [`wallet_getCapabilities`](/sdk/rpc/wallet_getCapabilities)

### Discovery

Tokens can be discovered by the application via `feeToken.tokens` on the [`wallet_getCapabilities`](/sdk/rpc/wallet_getCapabilities) method.

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()

const capabilities = await provider.request({ // [!code focus]
  method: 'wallet_getCapabilities', // [!code focus]
}) // [!code focus]

const tokens = Object.values(capabilities)[0].feeToken.tokens // [!code focus]
```

<TryItOut
  fn={async ({ provider }) => {
    const capabilities = await provider.request({ method: 'wallet_getCapabilities' })
    const tokens = Object.values(capabilities)[0].feeToken.tokens
    return tokens
  }}
  requireConnection={false}
  transformResultCode={(code) => {
    return 'const tokens = ' + code
  }}
/>

### Request Capabilities

#### `feeToken`

Custom fee token to use for the request.

The following JSON-RPC methods support the `feeToken` request capability:

- [`wallet_sendCalls`](/sdk/rpc/wallet_sendCalls)
- [`wallet_prepareCalls`](/sdk/rpc/wallet_prepareCalls)
- [`wallet_prepareUpgradeAccount`](#TODO)
- [`wallet_revokePermissions`](/sdk/rpc/wallet_revokePermissions)

```ts
type Capability = {
  /** Custom fee token address or symbol. */
  feeToken: `0x${string}` | string
}
```

##### Example

```ts twoslash
// @noErrors
const capabilities = await provider.request({
  method: 'wallet_sendCalls',
  params: [{
    capabilities: { // [!code focus]
      feeToken: 'USDC', // [!code focus]
    }, // [!code focus]
    /* ... */
  }]
})
```

```ts twoslash
// @noErrors
const capabilities = await provider.request({
  method: 'wallet_sendCalls',
  params: [{
    capabilities: { // [!code focus]
      feeToken: '0x036cbd53842c5426634e7929541ec2318f3dcf7e', // USDC // [!code focus]
    }, // [!code focus]
    /* ... */
  }]
})
```

## `permissions`

Porto supports account permission management.

### Methods

The `permissions` capability enables the following methods:

- [`wallet_getPermissions`](/sdk/rpc/wallet_getPermissions)
- [`wallet_grantPermissions`](/sdk/rpc/wallet_grantPermissions)
- [`wallet_revokePermissions`](/sdk/rpc/wallet_revokePermissions)

### Request Capabilities

#### `grantPermissions`

Requests for the wallet to grant permissions.

The following JSON-RPC methods support the `grantPermissions` request capability:

- [`wallet_connect`](/sdk/rpc/wallet_connect)
- [`wallet_prepareUpgradeAccount`](#TODO)

```ts
type Capability = {
  /** Requests for the wallet to grant these permissions. */
  grantPermissions: {
    /** Expiry of the permissions. */
    expiry: number

    /** 
     * Fee token that will be used with these permissions.
     */
    feeToken: {
      /** Value of the limit in the symbols's unit (e.g. '1' = 1 USDC). */
      limit: string
      /** Symbol of the fee token. `undefined` for native token. */
      symbol?: Token.Symbol | undefined
    } | undefined,

    /**
     * Key to grant permissions to.
     * Defaults to a wallet-managed key.
     */
    key?: {
      /**
       * Public key.
       * Accepts an address for `address` & `secp256k1` types.
       */
      publicKey?: `0x${string}`,
      /** Key type. */
      type?: 'address' | 'p256' | 'secp256k1' | 'webauthn-p256',
    }

    /** Permissions. */
    permissions: {
      /** Call permissions. */
      calls: {
        /** Function signature or 4-byte signature. */
        signature?: string
        /** Authorized target address. */
        to?: `0x${string}`
      }[],

      /** Spend permissions. */
      spend: {
        /** Spending limit (in wei) per period. */
        limit: `0x${string}`,
        /** Period of the spend limit. */
        period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
        /**
         * ERC20 token to set the limit on.
         * If not provided, the limit will be set on the
         * native token (e.g. ETH).
         */
        token?: `0x${string}`
      }[],
    }
  },
}
```

##### Example

```ts twoslash
// @noErrors
const capabilities = await provider.request({
  method: 'wallet_connect',
  params: [{
    capabilities: { // [!code focus]
      grantPermissions: { // [!code focus]
        expiry: 1727078400, // [!code focus]
        feeToken: { // [!code focus]
          limit: '1', // [!code focus] 
          symbol: 'USDC', // [!code focus]
        }, // [!code focus]
        permissions: { // [!code focus]
          calls: [{ signature: 'subscribe()' }], // [!code focus]
          spend: [{ // [!code focus]
            limit: '0x5f5e100', // 100 USDC // [!code focus]
            period: 'day', // [!code focus]
            token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC // [!code focus]
          }] // [!code focus]
        } // [!code focus]
      }, // [!code focus]
    }, // [!code focus]
    /* ... */
  }]
})
```

#### `permissions`

Use a provided permission for the request.

The following JSON-RPC methods support the `permissions` request capability:

- [`wallet_prepareCalls`](/sdk/rpc/wallet_prepareCalls)
- [`wallet_sendCalls`](/sdk/rpc/wallet_sendCalls)

```ts
type Capability = {
  /** Permission to use for the request. */
  permissions: {
    /** ID of the permission to use. */
    id: `0x${string}`
  }
}
```

##### Example

```ts twoslash
// @noErrors
const capabilities = await provider.request({
  method: 'wallet_sendCalls',
  params: [{
    capabilities: { // [!code focus]
      permissions: { // [!code focus]
        id: '0x...', // [!code focus]
      }, // [!code focus]
    }, // [!code focus]
    /* ... */
  }]
})
```

### Response Capabilities

#### `permissions`

Returns the permissions granted on the request.

The following JSON-RPC methods support the `permissions` response capability:

- [`wallet_connect`](/sdk/rpc/wallet_connect)
- [`wallet_upgradeAccount`](#TODO)

```ts
type Capability = {
  permissions: {
    expiry: number,
    id: `0x${string}`,
    key: {
      publicKey: `0x${string}`,
      type: 'address' | 'p256' | 'secp256k1' | 'webauthn-p256',
    },
    permissions: {
      calls: {
        signature?: string
        to?: `0x${string}`
      }[],
      spend: {
        limit: bigint
        period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
        token?: `0x${string}`
      }[]
    }
    publicKey: `0x${string}`,
    type: 'address' | 'p256' | 'secp256k1' | 'webauthn-p256'
  }[]
}
```

##### Example

```ts twoslash
// @noErrors
const capabilities = await provider.request({
  method: 'wallet_connect',
  params: [{
    capabilities: {
      grantPermissions: { /* ... */ },
    },
    /* ... */
  }]
})
// @log: [{
// @log:   address: '0x1234567890123456789012345678901234567890',
// @log:   capabilities: {
// @log:     permissions: [{
// @log:       expiry: 1727078400,
// @log:       id: '0x...',
// @log:       key: {
// @log:         publicKey: '0x...',
// @log:         type: 'p256'
// @log:       },
// @log:       permissions: {
// @log:         calls: [{
// @log:           signature: 'subscribe()',
// @log:         }],
// @log:         spend: [{
// @log:           limit: '0x5f5e100', // 100 USDC
// @log:           period: 'day',
// @log:           token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
// @log:         }]
// @log:       }
// @log:     }]
// @log:   },
// @log: }]
```

## `merchant`

A merchant server can be set up by the Application to sponsor actions on
behalf of their users.

### Request Capabilities

#### `merchantUrl`

URL of the endpoint that will be used to front (and sponsor) call bundles for users.

The following JSON-RPC methods support the `merchantUrl` request capability:

- [`wallet_prepareCalls`](/sdk/rpc/wallet_prepareCalls)
- [`wallet_sendCalls`](/sdk/rpc/wallet_sendCalls)

```ts
type Capability = {
  merchantUrl: string
}
```

#### Example

```ts twoslash
// @noErrors
const capabilities = await provider.request({
  method: 'wallet_sendCalls',
  params: [{
    capabilities: {
      merchantUrl: 'https://myapp.com/rpc'
    },
    /* ... */
  }]
})
```

## `requiredFunds`

The `requiredFunds` capability allows an application to specify the funds required on the target chain.
Porto will automatically source funds from its supported chains to cover the required funds.

### Discovery

Tokens can be discovered by the application via `requiredFunds.tokens` on the [`wallet_getCapabilities`](/sdk/rpc/wallet_getCapabilities) method.

```ts twoslash
import { Porto } from 'porto'

const { provider } = Porto.create()

const capabilities = await provider.request({ // [!code focus]
  method: 'wallet_getCapabilities', // [!code focus]
}) // [!code focus]

const tokens = Object.values(capabilities)[0].requiredFunds.tokens // [!code focus]
```

<TryItOut
  fn={async ({ provider }) => {
    const capabilities = await provider.request({ method: 'wallet_getCapabilities' })
    const tokens = Object.values(capabilities)[0].requiredFunds.tokens
    return tokens
  }}
  requireConnection={false}
  transformResultCode={(code) => {
    return 'const tokens = ' + code
  }}
/>

### Request Capabilities

#### `requiredFunds`

Funds required on the target chain.

The following JSON-RPC methods support the `requiredFunds` request capability:

- [`wallet_prepareCalls`](/sdk/rpc/wallet_prepareCalls)
- [`wallet_sendCalls`](/sdk/rpc/wallet_sendCalls)

```ts
type Capability = {
  requiredFunds?: ({
    /** Address of the token. */
    address: `0x${string}`;
    /** Value of the token. */
    value: `0x${string}`;
  } | {
    /** Symbol of the token. */
    symbol: string;
    /** Value of the token. */
    value: string;
  })[]
}
```

#### Example

```ts twoslash
// @noErrors
const capabilities = await provider.request({
  method: 'wallet_sendCalls',
  params: [{
    capabilities: {
      requiredFunds: [{ // [!code focus]
        symbol: 'USDC', // [!code focus]
        value: '100', // [!code focus]
      }] // [!code focus]
    },
    /* ... */
  }]
})
```

```ts twoslash
// @noErrors
const capabilities = await provider.request({
  method: 'wallet_sendCalls',
  params: [{
    capabilities: {
      requiredFunds: [{ // [!code focus]
        address: '0xaf3b0a5b4becc4fa1dfafe74580efa19a2ea49fa', // USDC // [!code focus]
        value: '0x5f5e100', // 100 USDC // [!code focus]
      }] // [!code focus]
    },
    /* ... */
  }]
})
```

## `signInWithEthereum`

Adds support for [ERC-4361](https://eips.ethereum.org/EIPS/eip-4361) Sign-In with Ethereum.

### Request Capabilities

#### `signInWithEthereum`

[ERC-4361](https://eips.ethereum.org/EIPS/eip-4361) Sign-In with Ethereum options.

The following JSON-RPC methods support the `signInWithEthereum` request capability:

- [`wallet_connect`](/sdk/rpc/wallet_connect)

```ts
type Capability = {
  signInWithEthereum: {
    /* Required fields */
    authUrl: string | {
      logout: string
      nonce: string
      verify: string
    }
    // OR
    nonce: string
    
    /* Optional fields */
    chainId?: number | undefined
    domain?: string | undefined // Defaults to window/iframe parent
    expirationTime?: Date | undefined
    issuedAt?: Date | undefined
    notBefore?: Date | undefined
    requestId?: string | undefined
    resources?: string[] | undefined
    scheme?: string | undefined
    statement?: string | undefined
    uri?: string | undefined // Defaults to window/iframe parent
    version?: '1' | undefined
  }
}
```

#### Example

```ts twoslash
// @noErrors
const capabilities = await provider.request({
  method: 'wallet_connect',
  params: [{
    capabilities: {
      signInWithEthereum: {
        nonce: await fetch("/api/nonce"),
      }
    },
    /* ... */
  }]
})
```

### Response Capabilities

#### `signInWithEthereum`

The following JSON-RPC methods support the `signInWithEthereum` request capability:

- [`wallet_connect`](/sdk/rpc/wallet_connect)

```ts
type Capability = {
  message: string
  signature: `0x${string}`
}
```

#### Example

```ts twoslash
// @noErrors
const capabilities = await provider.request({
  method: 'wallet_connect',
  params: [{
    capabilities: {
      signInWithEthereum: {
        nonce: await fetch("/api/nonce"),
      }
    },
    /* ... */
  }]
})
```
