# Overview

## Methods

| Method                                                                      | Description                                                                        | Standard                                            |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------- |
| [`eth_accounts`](/sdk/rpc/eth_accounts)                                     | Returns an array of all **connected** Account addresses.                           | [EIP-1474](https://eips.ethereum.org/EIPS/eip-1474) |
| [`eth_requestAccounts`](/sdk/rpc/eth_requestAccounts)                       | Requests access to Account addresses.                                              |                                                     |
| [`eth_sendTransaction`](/sdk/rpc/eth_sendTransaction)                       | Broadcasts a transaction to the network.                                           | [EIP-1474](https://eips.ethereum.org/EIPS/eip-1474) |
| [`eth_signTypedData_v4`](/sdk/rpc/eth_signTypedData_v4)                     | Signs [EIP-712](https://eips.ethereum.org/EIPS/eip-712) typed data.                | [EIP-712](https://eips.ethereum.org/EIPS/eip-712)   |
| [`personal_sign`](/sdk/rpc/personal_sign)                                   | Signs an [EIP-191](https://eips.ethereum.org/EIPS/eip-191) personal message.       | [EIP-191](https://eips.ethereum.org/EIPS/eip-191)   |
| [`wallet_connect`](/sdk/rpc/wallet_connect)                                 | Requests to connect account(s) with optional capabilities.                         | [ERC-7846](https://eips.ethereum.org/EIPS/eip-7846) |
| [`wallet_disconnect`](/sdk/rpc/wallet_disconnect)                           | Disconnects the Application from Porto.                                            | [ERC-7846](https://eips.ethereum.org/EIPS/eip-7846) |
| [`wallet_getCapabilities`](/sdk/rpc/wallet_getCapabilities)                 | Gets supported capabilities of Porto..                                             | [ERC-5792](https://eips.ethereum.org/EIPS/eip-5792) |
| [`wallet_getCallsStatus`](/sdk/rpc/wallet_getCallsStatus)                   | Gets the status of a call bundle.                                                  | [ERC-5792](https://eips.ethereum.org/EIPS/eip-5792) |
| [`wallet_prepareCalls`](/sdk/rpc/wallet_prepareCalls)                       | Prepares a call bundle.                                                            | [ERC-7836](https://eips.ethereum.org/EIPS/eip-7836) |
| [`wallet_sendCalls`](/sdk/rpc/wallet_sendCalls)                             | Broadcast a bundle of calls to the network.                                        | [ERC-5792](https://eips.ethereum.org/EIPS/eip-5792) |
| [`wallet_sendPreparedCalls`](/sdk/rpc/wallet_sendPreparedCalls)             | Executes a signed and prepared call bundle.                                        | [ERC-7836](https://eips.ethereum.org/EIPS/eip-7836) |
| [`experimental_createAccount`](/sdk/rpc/experimental_createAccount)         | Creates an account.                                                                | Experimental                                        |
| [`experimental_getPermissions`](/sdk/rpc/experimental_getPermissions)       | Returns the active permissions for an account.                                     | Experimental                                        |
| [`experimental_grantPermissions`](/sdk/rpc/experimental_grantPermissions)   | Grants permissions for an Application to perform actions on behalf of the account. | Experimental                                        |
| [`experimental_revokePermissions`](/sdk/rpc/experimental_revokePermissions) | Revokes a permission.                                                              | Experimental                                        |


:::warning
JSON-RPC methods prefixed as `experimental_` intend to be upstreamed as an ERC (or deprecated in favor of upcoming/existing ERCs) in the near future. They are purposefully minimalistic and intend to be iterated on.
:::

## ERC-5792 Capabilities

Porto implements the following [ERC-5792 capabilities](https://eips.ethereum.org/EIPS/eip-5792#wallet_getcapabilities) to define extended behavior:

### `atomicBatch`

The Porto Account supports atomic batch calls. This means that multiple calls will be executed in a single transaction upon using [`wallet_sendCalls`](https://eips.ethereum.org/EIPS/eip-5792#wallet_sendcalls).

### `createAccount`

Porto supports programmatic account creation.

#### Creation via `experimental_createAccount`

Accounts may be created via the [`experimental_createAccount`](#experimental_createaccount) JSON-RPC method.

Example:

```ts
{ method: 'experimental_createAccount' }
```

#### Creation via `wallet_connect`

Accounts may be created upon connection with the `createAccount` capability on the [`wallet_connect`](https://github.com/ethereum/ERCs/blob/abd1c9f4eda2d6ad06ade0e3af314637a27d1ee7/ERCS/erc-7846.md) JSON-RPC method.

Example:

```ts
{
  method: 'wallet_connect',
  params: [{
    capabilities: {
      createAccount: true
      // OR
      createAccount: { label: "My Example Account" }
    }
  }]
}
```

### `permissions`

Porto supports account permission management.

#### Granting permissions via `experimental_grantPermissions`

Permissions may be granted via the [`experimental_grantPermissions`](#experimental_grantPermissions) JSON-RPC method.

Example:

```ts
{
  method: 'experimental_grantPermissions',
  params: [{ 
    expiry: 1727078400,
    permissions: {
      calls: [{
        signature: 'mint()',
        to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbe',
      }],
    },
  }]
}
```

#### Granting permissions via `wallet_connect`

Permissions may be granted upon connection with the `grantPermissions` capability on the [`wallet_connect`]([#wallet_connect](https://github.com/ethereum/ERCs/blob/abd1c9f4eda2d6ad06ade0e3af314637a27d1ee7/ERCS/erc-7846.md)) JSON-RPC method.

Example:

```ts
{
  method: 'wallet_connect',
  params: [{ 
    capabilities: { 
      grantPermissions: {
        expiry: 1727078400,
        permissions: {
          calls: [{ signature: 'subscribe()' }],
          spend: [{
            limit: '0x5f5e100', // 100 USDC
            period: 'day',
            token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
          }]
        }
      }
    } 
  }]
}
```

If a permission is granted upon connection, the `wallet_connect` JSON-RPC method will return the permission on the `capabilities.permissions` parameter of the response.

Example:

```ts
{
  accounts: [{
    address: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbe',
    capabilities: {
      permissions: [{ 
        expiry: 1727078400,
        key: {
          publicKey: '0x...', 
          type: 'p256' 
        },
        permissions: {
          calls: [{
            signature: 'subscribe()',
          }],
          spend: [{
            limit: '0x5f5e100', // 100 USDC
            period: 'day',
            token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
          }]
        }
      }]
    }
  }],
}
```