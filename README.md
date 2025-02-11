![Porto](https://github.com/ithacaxyz/porto/blob/main/.github/banner.png)

# Porto

Experimental Next-gen Account for Ethereum.

<p>
  <a href="https://www.npmjs.com/package/porto">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/porto?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/npm/v/porto?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="Version">
    </picture>
  </a>
  <a href="https://github.com/ithacaxyz/porto/blob/main/LICENSE-MIT">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/license-MIT-blue.svg?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="MIT License">
    </picture>
  </a>
  <a href="https://github.com/ithacaxyz/porto/blob/main/LICENSE-APACHE">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/license-APACHE-blue.svg?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/badge/license-APACHE-blue.svg?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="APACHE License">
    </picture>
  </a>
</p>

> [!WARNING]
> Do not use in production. This repository is work-in-progress and highly experimental. Non-major version bumps may contain breaking changes.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [Usage with Wagmi](#usage-with-wagmi)
- [JSON-RPC Reference](#json-rpc-reference)
  - [`experimental_createAccount`](#experimental_createaccount)
  - [`experimental_grantPermissions`](#experimental_grantpermissions)
  - [`experimental_permissions`](#experimental_permissions)
  - [`experimental_revokePermissions`](#experimental_revokepermissions)
  - [`experimental_prepareCreateAccount`](#experimental_preparecreateaccount)
- [Available ERC-5792 Capabilities](#available-erc-5792-capabilities)
  - [`atomicBatch`](#atomicbatch)
  - [`createAccount`](#createaccount)
  - [`permissions`](#permissions)
- [Wagmi Reference](#wagmi-reference)
- [FAQs](#faqs)
- [Development](#development)
- [License](#license)

## Install

```bash
pnpm i porto
```

## Usage

The example below demonstrates usage of Porto's [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) Provider:

```ts twoslash
import { Porto } from 'porto'

const porto = Porto.create()

const { accounts } = await porto.provider.request({ 
  method: 'wallet_connect'
})
```

### Usage with Wagmi

Porto can be used in conjunction with [Wagmi](https://wagmi.sh/) to provide a seamless experience for developers and end-users.

#### 1. Set up Wagmi

Get started with Wagmi by following the [official guide](https://wagmi.sh/react/getting-started).

#### 2. Set up Porto

After you have set up Wagmi, you can set up Porto by calling `Porto.create()`. This will automatically
inject a Porto-configured EIP-1193 Provider into your Wagmi instance via [EIP-6963: Multi Injected Provider Discovery](https://eips.ethereum.org/EIPS/eip-6963).

```tsx twoslash
import { Porto } from 'porto'
import { http, createConfig, createStorage } from 'wagmi'
import { odysseyTestnet } from 'wagmi/chains'

Porto.create()

export const wagmiConfig = createConfig({
  chains: [odysseyTestnet],
  storage: createStorage({ storage: localStorage }),
  transports: {
    [odysseyTestnet.id]: http(),
  },
})
```

This means you can now use Wagmi-compatible Hooks like `useConnect`. For more info, check out the [Wagmi Reference](#wagmi-reference).

```tsx
import { Hooks } from 'porto/wagmi'
import { useConnectors } from 'wagmi'

function Connect() {
  const connect = Hooks.useConnect()
  const connectors = useConnectors()

  return connectors?.map((connector) => (
    <div key={connector.uid}>
      <button
        onClick={() =>
          connect.mutate({ 
            connector,
          })
        }
      >
        Login
      </button>
      <button
        onClick={() =>
          connect.mutate({ 
            connector, 
            createAccount: true,
          }
        )}
      >
        Register
      </button>
    </div>
  ))
}
```

## JSON-RPC Reference

Porto implements the following **standardized wallet** JSON-RPC methods:

- `eth_accounts`
- `eth_requestAccounts`
- `eth_sendTransaction`
- `eth_signTypedData_v4`
- `personal_sign`
- `wallet_connect` [(ERC-7846: Wallet Connection API)](https://github.com/ethereum/ERCs/blob/abd1c9f4eda2d6ad06ade0e3af314637a27d1ee7/ERCS/erc-7846.md)
- `wallet_disconnect` [(ERC-7846: Wallet Connection API)](https://github.com/ethereum/ERCs/blob/abd1c9f4eda2d6ad06ade0e3af314637a27d1ee7/ERCS/erc-7846.md)
- `wallet_getCapabilities` [(ERC-5792: Wallet Call API)](https://eips.ethereum.org/EIPS/eip-5792)
- `wallet_getCallsStatus` [(ERC-5792: Wallet Call API)](https://eips.ethereum.org/EIPS/eip-5792)
- `wallet_prepareCalls` [(ERC-7836: Wallet Call Preparation API)](https://eips.ethereum.org/EIPS/eip-7836)
- `wallet_sendCalls` [(ERC-5792: Wallet Call API)](https://eips.ethereum.org/EIPS/eip-5792)
- `wallet_sendPreparedCalls` [(ERC-7836: Wallet Call Preparation API)](https://eips.ethereum.org/EIPS/eip-7836)

In addition to the above, Porto implements the following **experimental** JSON-RPC methods:

> [!NOTE]
> These JSON-RPC methods intend to be upstreamed as an ERC (or deprecated in favor of upcoming/existing ERCs) in the near future. They are purposefully minimalistic and intend to be iterated on.

### `experimental_createAccount`

Creates (and connects) a new account.

#### Request

```ts
type Request = {
  method: 'experimental_createAccount',
  params: [{ 
    // Chain ID to create the account on.
    chainId?: Hex.Hex
    // Label for the account. 
    // Used as the Passkey credential display name.
    label?: string 
  }]
}
```

#### Returns

```ts
// Address of the created account.
type Response = `0x${string}`
```

#### Example

```ts
// Creates an account and associates its WebAuthn credential with a label.
const address = await porto.provider.request({
  method: 'experimental_createAccount',
  params: [{ label: 'My Example Account' }],
})
```

### `experimental_grantPermissions`

Grants permissions for an Application to perform actions on behalf of the account.

> Alternative to the draft [ERC-7715](https://github.com/ethereum/ERCs/blob/23fa3603c6181849f61d219f75e8a16d6624ac60/ERCS/erc-7715.md) specification with a tighter API. We hope to upstream concepts from this method and eventually use ERC-7715 or similar.

#### Request

```ts
type Request = {
  method: 'experimental_grantPermissions',
  params: [{
    // Address of the account to grant permissions on. Defaults to the current account.
    address?: `0x${string}`

    // Chain ID to grant permissions on.
    chainId?: `0x${string}`

    // Expiry of the permissions.
    expiry: number

    // Key to grant permissions to. Defaults to a wallet-managed key.
    key?: {
      // Public key. Accepts an address for `contract` & `secp256k1` types.
      publicKey?: `0x${string}`,
      // Key type.
      type?: 'contract' | 'p256' | 'secp256k1' | 'webauthn-p256', 
    }
    
    // Permissions to grant.
    permissions: {
      // Call permissions.
      calls?: {
        // Function signature or 4-byte selector.
        signature?: string
        // Authorized target address.
        to?: `0x${string}`
      }[],

      // ERC-1271 verification permissions.
      signatureVerification?: {
        // Authorized contract addresses that can call the
        // account's ERC-1271 `isValidSignature` function.
        addresses: readonly `0x${string}`[]
      },

      // Spend permissions.
      spend?: {
        // Spending limit (in wei) per period.
        limit: `0x${string}`,
        // Period of the spend limit.
        period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
        // ERC20 token to set the limit on. 
        // If not provided, the limit will be set on the native token (e.g. ETH).
        token?: `0x${string}`
      }[]
    },
  }]
}
```

#### Response

```ts
type Response = {
  address: `0x${string}`,
  chainId: `0x${string}`,
  expiry: number,
  id: `0x${string}`,
  key: {
    publicKey: `0x${string}`,
    type: 'contract' | 'p256' | 'secp256k1' | 'webauthn-p256',
  },
  permissions: {
    calls?: {
      signature?: string,
      to?: `0x${string}`,
    }[],
    signatureVerification?: {
      addresses: `0x${string}`[]
    },
    spend?: {
      limit: `0x${string}`,
      period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year',
      token?: `0x${string}`,
    }[],
  },
}
```

#### Example

```ts
// Grant a spend limit permission.
const permissions = await porto.provider.request({
  method: 'experimental_grantPermissions',
  params: [{
    permissions: {
      spend: [{
        limit: '0x5f5e100', // 100 USDC,
        period: 'day',
        token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      }]
    },
  }],
})

// Grant a contract address to verify signatures (via ERC-1271).
const permissions = await porto.provider.request({
  method: 'experimental_grantPermissions',
  params: [{
    permissions: {
      signatureVerification: {
        addresses: ['0xb3030d74b87321d620f2d0cdf3f97cc4598b9248'],
      },
    },
  }],
})

// Grant spend & call scope permissions to a specific key.
const permissions = await porto.provider.request({
  method: 'experimental_grantPermissions',
  params: [{
    key: {
      publicKey: '0x...',
      type: 'p256',
    },
    permissions: {
      calls: [{ 
        signature: 'transfer(address,uint256)', 
        to: '0xcafebabecafebabecafebabecafebabecafebabe' 
      }],
      spend: [{
        limit: '0x5f5e100', // 100 USDC,
        period: 'day',
        token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      }]
    },
  }],
})
```


### `experimental_permissions`

Lists active permissions of the account.

#### Request

```ts
type Request = {
  method: 'experimental_permissions',
  params: [{
    // Address of the account to list permissions on.
    address?: `0x${string}`
  }]
}
```

#### Response

```ts
type Response = { 
  address: `0x${string}`,
  chainId: `0x${string}`,
  expiry: number, 
  id: `0x${string}`,
  key: {
    publicKey: `0x${string}`,
    type: 'contract' | 'p256' | 'secp256k1' | 'webauthn-p256',
  },
  permissions: {
    calls?: {
      signature?: string
      to?: `0x${string}`
    }[]
    signatureVerification?: {
      addresses: `0x${string}`[]
    },
    spend?: {
      limit: bigint
      period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
      token?: `0x${string}`
    }[]
  }
  publicKey: `0x${string}`, 
  type: 'p256' | 'secp256k1' | 'webauthn-p256' 
}[]
```

#### Example

```ts
const permissions = await porto.provider.request({
  method: 'experimental_permissions',
})
```

### `experimental_revokePermissions`

Revokes a permission.

#### Request

```ts
type Request = {
  method: 'experimental_revokePermissions',
  params: [{ 
    // Address of the account to revoke a permission on.
    address?: `0x${string}`
    // ID of the permission to revoke.
    id: `0x${string}` 
  }]
}
```

#### Example

```ts
await porto.provider.request({
  method: 'experimental_revokePermissions',
  params: [{ id: '0x...' }],
})
```

### `experimental_prepareCreateAccount`

Returns a set of hex payloads to sign over to upgrade an existing EOA to a Porto Account. Additionally, it will prepare values needed to fill context for the `experimental_createAccount` JSON-RPC method.

#### Request

```ts
type Request = {
  method: 'experimental_prepareCreateAccount',
  params: [{ 
    // Address of the account to import.
    address?: `0x${string}`,
    // ERC-5792 capabilities to define extended behavior.
    capabilities: {
      // Whether to grant permissions with an optional expiry.
      grantPermissions?: { 
        expiry: number,
        key?: {
          publicKey?: `0x${string}`,
          type?: 'p256' | 'secp256k1' | 'webauthn-p256'
        },
        permissions: {
          calls?: {
            signature?: string
            to?: `0x${string}`
          }[]
          signatureVerification?: {
            addresses: `0x${string}`[]
          },
          spend?: {
            limit: bigint
            period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
            token?: `0x${string}`
          }[]
        }
      },
    } 
  }]
}
```

#### Response

```ts
type Response = {
  // Filled context for the `experimental_createAccount` JSON-RPC method.
  context: unknown
  // Hex payloads to sign over.
  signPayloads: `0x${string}`[]
}
```

#### Example

```ts
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

// Create a random EOA.
const eoa = privateKeyToAccount(generatePrivateKey())

// Extract the payloads to sign over to upgrade the EOA to a Porto Account.
const { context, signPayloads } = await porto.provider.request({
  method: 'experimental_prepareCreateAccount',
  params: [{ address: eoa.address }],
})

// Sign over the payloads.
const signatures = signPayloads.map((payload) => eoa.sign(payload))

// Upgrade the EOA to a Porto Account.
const { address, capabilities } = await porto.provider.request({
  method: 'experimental_createAccount',
  params: [{ context, signatures }],
})
```

## Available ERC-5792 Capabilities

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

## Wagmi Reference

Porto implements the following [Wagmi](https://github.com/wevm/wagmi) VanillaJS Actions and React Hooks that map directly to the [experimental JSON-RPC methods](#json-rpc-reference).

> [!NOTE]
> Porto only supports the React version of Wagmi at the moment. If you are interested in adding support for other Wagmi Adapters, please create a Pull Request.

### VanillaJS Actions

Import via named export or `Actions` namespace (better autocomplete DX and does not impact tree shaking).

- `connect`
- `createAccount`
- `disconnect`
- `grantPermissions`
- `permissions`
- `revokePermissions`
- `upgradeAccount`

```ts
import { Actions } from 'porto/wagmi' // Actions.connect()
import { connect } from 'porto/wagmi/Actions'
```

### React Hooks

Import via named export or `Hooks` namespace (better autocomplete DX and does not impact tree shaking).

- `useConnect`
- `useCreateAccount`
- `useDisconnect`
- `useGrantPermissions`
- `usePermissions`
- `useRevokePermissions`
- `useUpgradeAccount`

```ts
import { Hooks } from 'porto/wagmi' // Hooks.useConnect()
import { useConnect } from 'porto/wagmi/Hooks'
```

## Development

### Playground

```bash
# (Optional) Set up SSL for localhost
# Install: https://github.com/FiloSottile/mkcert?tab=readme-ov-file#installation
$ mkcert -install
$ mkcert localhost

# Install pnpm
$ curl -fsSL https://get.pnpm.io/install.sh | sh - 

$ pnpm install # Install modules
$ pnpm wagmi generate # get ABIs, etc.
$ pnpm dev # Run playground + iframe embed
```

### Contracts

```bash
# Install Foundry
$ foundryup

$ forge build --config-path ./contracts/foundry.toml # Build
$ forge test --config-path ./contracts/foundry.toml # Test
```

## License

<sup>
Licensed under either of <a href="LICENSE-APACHE">Apache License, Version
2.0</a> or <a href="LICENSE-MIT">MIT license</a> at your option.
</sup>

<br>

<sub>
Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in these packages by you, as defined in the Apache-2.0 license,
shall be dual licensed as above, without any additional terms or conditions.
</sub>
