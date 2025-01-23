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
> This repository is work-in-progress and highly experimental. It is recommended not to use it in production just yet.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [Usage with Wagmi](#usage-with-wagmi)
- [JSON-RPC Reference](#json-rpc-reference)
  - [`experimental_authorizeKey`](#experimental_authorizeKey)
  - [`experimental_createAccount`](#experimental_createaccount)
  - [`experimental_prepareCreateAccount`](#experimental_prepareCreateAccount)
  - [`experimental_keys`](#experimental_keys)
  - [`experimental_revokeKey`](#experimental_revokeKey)
- [Available ERC-5792 Capabilities](#available-erc-5792-capabilities)
  - [`atomicBatch`](#atomicbatch)
  - [`createAccount`](#createaccount)
  - [`keys`](#keys)
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
- `wallet_sendCalls` [(ERC-5792: Wallet Call API)](https://eips.ethereum.org/EIPS/eip-5792)

In addition to the above, Porto implements the following **experimental** JSON-RPC methods:

> [!NOTE]
> These JSON-RPC methods intend to be upstreamed as an ERC (or deprecated in favor of upcoming/existing ERCs) in the near future. They are purposefully minimalistic and intend to be iterated on.

### `experimental_authorizeKey`

Authorizes a key that can perform actions on behalf of the account.

If the `key` property is absent, Porto will generate a new arbitrary "session" key to authorize on the account.

The following `role` values are supported:

- `admin`: 
  - MUST specify a `key`
  - CAN have an infinite expiry 
  - CAN have permissions (`permissions`)
  - CAN execute calls (e.g. `eth_sendTransaction`, `wallet_sendCalls`)
  - CAN sign arbitrary data (e.g. `personal_sign`, `eth_signTypedData_v4`)
- `session`: 
  - CAN specify a `key` - if absent, a new arbitrary key will be generated
  - MUST have a limited expiry
  - MUST have permissions (`permissions`)
  - CAN only execute calls
  - CANNOT sign arbitrary data

> Minimal alternative to the draft [ERC-7715](https://github.com/ethereum/ERCs/blob/23fa3603c6181849f61d219f75e8a16d6624ac60/ERCS/erc-7715.md) specification. We hope to upstream concepts from this method and eventually use ERC-7715 or similar.

#### Request

```ts
type Request = {
  method: 'experimental_authorizeKey',
  params: [{
    // Address of the account to authorize a key on.
    address?: `0x${string}`
    // Expiry of the key.
    expiry?: number
    // Key to authorize.
    key?: {
      // Public key. Accepts an address for `contract` type.
      publicKey?: `0x${string}`,
      // Key type.
      type?: 'contract' | 'p256' | 'secp256k1' | 'webauthn-p256', 
    }
    // Key permissions.
    permissions?: {
      // Call permissions to authorize on the key.
      calls?: {
        // Function signature or 4-byte selector.
        signature?: string
        // Authorized target address.
        to?: `0x${string}`
      }[],
      // Spend permissions of the key.
      spend?: {
        // Spending limit (in wei) per period.
        limit: bigint
        // Period of the spend limit.
        period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
        // ERC20 token to set the limit on. 
        // If not provided, the limit will be set on the native token (e.g. ETH).
        token?: `0x${string}`
      }[]
    }
    // Role of key.
    role?: 'admin' | 'session',
  }]
}
```

#### Response

```ts
type Response = {
  expiry: number,
  key?: {
    publicKey: `0x${string}`,
    type: 'contract' | 'p256' | 'secp256k1' | 'webauthn-p256',
  },
  permissions?: {
    calls?: {
      signature?: string
      to?: `0x${string}`
    }[]
    spend?: {
      limit: bigint
      period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
      token?: `0x${string}`
    }[]
  }
  role: 'admin' | 'session',
}
```

#### Example

```ts
// Generate and authorize a session key with two call scopes.
const key = await porto.provider.request({
  method: 'experimental_authorizeKey',
  params: [{ 
    permissions: {
      calls: [
        { 
          signature: 'mint()', 
          to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef' 
        },
        { 
          signature: 'transfer(address,uint256)', 
          to: '0xcafebabecafebabecafebabecafebabecafebabe' 
        },
      ] 
    } 
  }],
})

// Provide and authorize a P256 session key with a spend limit.
const key = await porto.provider.request({
  method: 'experimental_authorizeKey',
  params: [{
    key: {
      publicKey: '0x...',
      type: 'p256',
    },
    permissions: {
      spend: [{
        limit: 100_000_000n, // 100 USDC
        period: 'day',
        token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      }]
    },
  }],
})
```

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
      // Whether to authorize a key with an optional expiry.
      authorizeKey?: { 
        expiry?: number,
        key?: {
          publicKey?: `0x${string}`,
          type?: 'p256' | 'secp256k1' | 'webauthn-p256'
        },
        permissions?: {
          calls?: {
            signature?: string
            to?: `0x${string}`
          }[]
          spend?: {
            limit: bigint
            period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
            token?: `0x${string}`
          }[]
        }
        role?: 'admin' | 'session'
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

### `experimental_keys`

Lists active keys that can perform actions on behalf of the account.

#### Request

```ts
type Request = {
  method: 'experimental_keys',
  params: [{
    // Address of the account to list keys on.
    address?: `0x${string}`
  }]
}
```

#### Response

```ts
type Response = { 
  expiry: number, 
  permissions?: {
    calls?: {
      signature?: string
      to?: `0x${string}`
    }[]
    spend?: {
      limit: bigint
      period: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
      token?: `0x${string}`
    }[]
  }
  publicKey: `0x${string}`, 
  role: 'admin' | 'session', 
  type: 'p256' | 'secp256k1' | 'webauthn-p256' 
}[]
```

#### Example

```ts
const keys = await porto.provider.request({
  method: 'experimental_keys',
})
```

### `experimental_revokeKey`

Revokes a key.

#### Request

```ts
type Request = {
  method: 'experimental_revokeKey',
  params: [{ 
    // Address of the account to revoke a key on.
    address?: `0x${string}`
    // Public key of the key to revoke.
    publicKey: `0x${string}` 
  }]
}
```

#### Example

```ts
await porto.provider.request({
  method: 'experimental_revokeKey',
  params: [{ publicKey: '0x...' }],
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

### `keys`

Porto supports account key management (ie. authorized keys & their scopes).

#### Authorizing keys via `experimental_authorizeKey`

Keys may be authorized via the [`experimental_authorizeKey`](#experimental_authorizeKey) JSON-RPC method.

If the `key` property is absent, Porto will generate a new arbitrary "session" key to authorize on the account.

Example:

```ts
{
  method: 'experimental_authorizeKey',
  params: [{ 
    address: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbe', 
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

#### Authorizing keys via `wallet_connect`

Keys may be authorized upon connection with the `authorizeKey` capability on the [`wallet_connect`]([#wallet_connect](https://github.com/ethereum/ERCs/blob/abd1c9f4eda2d6ad06ade0e3af314637a27d1ee7/ERCS/erc-7846.md)) JSON-RPC method.

If the `authorizeKey.key` property is absent, Porto will generate a new arbitrary "session" key to authorize on the account.

Example:

```ts
{
  method: 'wallet_connect',
  params: [{ 
    capabilities: { 
      authorizeKey: {
        expiry: 1727078400,
        permissions: {
          calls: [{
            signature: 'mint()',
            to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbe',
          }],
        }
      }
    } 
  }]
}
```

If a key is authorized upon connection, the `wallet_connect` JSON-RPC method will return the key on the `capabilities.keys` parameter of the response.

Example:

```ts
{
  accounts: [{
    address: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbe',
    capabilities: {
      keys: [{ 
        expiry: 1727078400,
        permissions: {
          calls: [{
            signature: 'mint()',
            to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbe',
          }],
        },
        publicKey: '0x...', 
        role: 'session', 
        type: 'p256' 
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

- `authorizeKey`
- `connect`
- `createAccount`
- `disconnect`
- `keys`
- `revokeKey`
- `upgradeAccount`

```ts
import { Actions } from 'porto/wagmi' // Actions.connect()
import { connect } from 'porto/wagmi/Actions'
```

### React Hooks

Import via named export or `Hooks` namespace (better autocomplete DX and does not impact tree shaking).

- `useAuthorizeKey`
- `useConnect`
- `useCreateAccount`
- `useDisconnect`
- `useKeys`
- `useRevokeKey`
- `useUpgradeAccount`

```ts
import { Hooks } from 'porto/wagmi' // Hooks.useConnect()
import { useConnect } from 'porto/wagmi/Hooks'
```

## FAQs

### Is Webauthn required or can any EOA be used?
Any EOA can be used see [`experimental_prepareCreateAccount`](#experimental_prepareCreateAccount).

### Can sessions be revoked?
Yes, see [`revokable`](https://github.com/ithacaxyz/porto/blob/main/contracts/src/account/ExperimentalDelegation.sol#L132-L141) on the Account contract.

### Do sessions expire?
Yes, this can be done by calling [`experimental_authorizeKey`](#experimental_authorizekey) with an unix timestamp.

### When a session is created what permissions are granted?
Currently full control over the account is granted, but in the future this can be more restricted (see [`execute`](https://github.com/ithacaxyz/account/blob/main/src/GuardedExecutor.sol#L78-L83)).


## Development

```bash
# Install pnpm
$ curl -fsSL https://get.pnpm.io/install.sh | sh - 

$ pnpm install # Install modules
$ pnpm wagmi generate # get ABIs, etc.
$ pnpm dev # Run playground
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
