# Capabilities

Porto supports [EIP-5792 Capabilities](https://eips.ethereum.org/EIPS/eip-5792#wallet_getcapabilities).
Capabilites are extension features that allow for extra functionality to be requested on particular JSON-RPC requests such as `wallet_connect` and `wallet_sendCalls`, and also enable additional JSON-RPC methods. Such features could be requesting to [grant permissions](#permissions) on connection, or [setting a custom fee token](#feetoken).

Porto supports the following capabilities:

| Capability                    | Description                                                  | Standard                                                              |
| ----------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------- |
| [`atomic`](#atomic)           | Indicates if call bundles will be executed atomically.       | [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792#atomic-capability) |
| [`feeToken`](#feetoken)       | Indicates if a custom fee token can be requested by the app. | Experimental                                                          |
| [`permissions`](#permissions) | Indicates if permissions can be requested by the app.        | Experimental                                                          |
| [`sponsor`](#sponsor)         | Indicates if app sponsoring is supported.                    | Experimental                                                          |

## `atomic`

The Porto Account supports atomic batch calls. This means that multiple calls will be executed in a single transaction upon using [`wallet_sendCalls`](https://eips.ethereum.org/EIPS/eip-5792#wallet_sendcalls).

## `feeToken`

A custom fee token can be provided as a capability to [`wallet_sendCalls`](/sdk/rpc/wallet_sendCalls).

### Request Capabilities

#### `feeToken`

Custom fee token to use for the request.

The following JSON-RPC methods support the `feeToken` request capability:

- [`wallet_sendCalls`](/sdk/rpc/wallet_sendCalls)
- [`wallet_prepareCalls`](/sdk/rpc/wallet_prepareCalls)
- [`wallet_prepareUpgradeAccount`](#TODO)
- [`experimental_revokePermissions`](/sdk/rpc/experimental_revokePermissions)

```ts
type Capability = {
  /** Custom fee token address. */
  feeToken: `0x${string}`
}
```

##### Example

```ts twoslash
// @noErrors
const capabilities = await provider.request({
  method: 'wallet_sendCalls',
  params: [{
    capabilities: { // [!code focus]
      feeToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC // [!code focus]
    }, // [!code focus]
    /* ... */
  }]
})
```

## `permissions`

Porto supports account permission management.

### Methods

The `permissions` capability enables the following methods:

- [`experimental_getPermissions`](/sdk/rpc/experimental_getPermissions)
- [`experimental_grantPermissions`](/sdk/rpc/experimental_grantPermissions)
- [`experimental_revokePermissions`](/sdk/rpc/experimental_revokePermissions)

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

## `sponsor`

A sponsor server can be set up by the Application to sponsor actions on
behalf of their users.

### Request Capabilities

#### `sponsorUrl`

URL of the endpoint that will be used to front and sponsor call bundles for users.

The following JSON-RPC methods support the `sponsorUrl` request capability:

- [`wallet_prepareCalls`](/sdk/rpc/wallet_prepareCalls)
- [`wallet_sendCalls`](/sdk/rpc/wallet_sendCalls)

```ts
type Capability = {
  sponsorUrl: string
}
```

### Example

```ts twoslash
// @noErrors
const capabilities = await provider.request({
  method: 'wallet_sendCalls',
  params: [{
    capabilities: {
      sponsorUrl: 'https://myapp.com/sponsor'
    },
    /* ... */
  }]
})
```
