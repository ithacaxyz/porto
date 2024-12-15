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
  - [`experimental_connect`](#experimental_connect)
  - [`experimental_createAccount`](#experimental_createaccount)
  - [`experimental_disconnect`](#experimental_disconnect)
  - [`experimental_grantSession`](#experimental_grantsession)
  - [`experimental_prepareImportAccount`](#experimental_prepareImportAccount)
  - [`experimental_importAccount`](#experimental_importAccount)
  - [`experimental_sessions`](#experimental_sessions)
- [Available ERC-5792 Capabilities](#available-erc-5792-capabilities)
  - [`atomicBatch`](#atomicbatch)
  - [`createAccount`](#createaccount)
  - [`sessions`](#sessions)
- [Wagmi Reference](#wagmi-reference)
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

const account = await porto.provider.request({ 
  method: 'experimental_connect',
  params: [{ capabilities: { grantSession: true } }]
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
import { W } from 'porto/wagmi'
import { useConnectors } from 'wagmi'

function Connect() {
  const connect = W.useConnect()
  const connectors = useConnectors()

  return connectors?.map((connector) => (
    <div key={connector.uid}>
      <button
        onClick={() =>
          connect.mutate({ 
            connector, 
            grantSession: true,
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
            grantSession: true,
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
- `wallet_getCapabilities`
- `wallet_getCallsStatus`
- `wallet_sendCalls`

In addition to the above, Porto implements the following **experimental** JSON-RPC methods:

> [!NOTE]
> These JSON-RPC methods intend to be upstreamed as an ERC (or deprecated in favor of upcoming/existing ERCs) in the near future. They are purposefully minimalistic and intend to be iterated on.

### `experimental_connect`

Connects an end-user to an application.

#### Parameters

```ts
{
  method: 'experimental_connect',
  params: [{ 
    // ERC-5792 capabilities to define extended behavior.
    capabilities: {
      // Whether to create a new account.
      createAccount?: boolean | { label?: string },

      // Whether to grant a session with an optional expiry.
      // Defaults to user-configured expiry on the account.
      grantSession?: boolean | { expiry?: number },
    } 
  }]
}
```

#### Returns

```ts
{
  account: {
    // The address of the account.
    address: `0x${string}`,

    // ERC-5792 capabilities to define extended behavior.
    capabilities: {
      // The sessions granted to the account.
      sessions: {
        // The expiry of the session.
        expiry: number,

        // The ID of the session.
        id: `0x${string}`,
      }[],
    }
  }[]
}
```

### `experimental_createAccount`

Creates (and connects) a new account.

#### Parameters

```ts
{
  method: 'experimental_createAccount',
  params: [{ 
    // Label for the account. Used as the Passkey
    // credential display name.
    label?: string 
  }]
}
```

#### Returns

```ts
// Address of the created account.
`0x${string}`
```

### `experimental_disconnect`

Disconnects the account.

#### Parameters

```ts
{
  method: 'experimental_disconnect'
}
```

### `experimental_grantSession`

Grants a session on the account. 

> Minimal alternative to the draft [ERC-7715](https://github.com/ethereum/ERCs/blob/23fa3603c6181849f61d219f75e8a16d6624ac60/ERCS/erc-7715.md) specification. We hope to upstream concepts from this method and eventually use ERC-7715 or similar.

#### Parameters

```ts
{
  method: 'experimental_grantSession',
  params: [{
    // Address of the account to grant a session on.
    address?: `0x${string}`

    // The expiry of the session.
    // Defaults to user-configured expiry on the account.
    expiry?: number

    // The keys to grant on the session.
    keys?: {
      algorithm: 'p256' | 'secp256k1',
      publicKey: `0x${string}`,
    }[]
  }]
}
```

#### Returns

```ts
{
  // The expiry of the session.
  expiry: number,

  // The ID of the session.
  id: `0x${string}`,
}
```

### `experimental_prepareImportAccount`

Returns a set of hex payloads to sign over to import an external account, and prepares values needed to fill context for the `experimental_importAccount` JSON-RPC method.

#### Parameters

```ts
{
  method: 'experimental_prepareImportAccount',
  params: [{ 
    // Address of the account to import.
    address?: `0x${string}`,

    // ERC-5792 capabilities to define extended behavior.
    capabilities: {
      // Whether to grant a session with an optional expiry.
      // Defaults to user-configured expiry on the account.
      grantSession?: boolean | { expiry?: number },
    } 
  }]
}
```

#### Returns

```ts
{
  // Filled context for the `experimental_importAccount` JSON-RPC method.
  context: unknown

  // Hex payloads to sign over.
  signPayloads: `0x${string}`[]
}
```

### `experimental_importAccount`

Imports an account.

#### Parameters

```ts
{
  method: 'experimental_importAccount',
  params: [{ 
    // Context from the `experimental_prepareImportAccount` JSON-RPC method.
    context: unknown, 

    // Signatures over the payloads returned by `experimental_prepareImportAccount`.
    signatures: `0x${string}`[] 
  }]
}
```

#### Returns

```ts
{
  // The address of the account.
  address: `0x${string}`,

  // ERC-5792 capabilities to define extended behavior.
  capabilities: {
    // The sessions granted to the account.
    sessions: {
      // The expiry of the session.
      expiry: number,

      // The ID of the session.
      id: `0x${string}`,
    }[],
  }
}
```

### `experimental_sessions`

Lists the active sessions on the account.

#### Parameters

```ts
{
  method: 'experimental_sessions',
  params: [{
    // Address of the account to list sessions on.
    address?: `0x${string}`
  }]
}
```

#### Returns

```ts
{ expiry: number, id: `0x${string}` }[]
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

#### Creation via `experimental_connect`

Accounts may be created upon connection with the `createAccount` parameter on the [`experimental_connect`](#experimental_connect) JSON-RPC method.

Example:

```ts
{
  method: 'experimental_connect',
  params: [{
    capabilities: {
      createAccount: true
      // OR
      createAccount: { label: "My Example Account" }
    }
  }]
}
```

### `sessions`

Porto supports account session management (ie. session keys & their permissions).

#### Granting sessions via `experimental_grantSession`

Sessions may be granted via the [`experimental_grantSession`](#experimental_grantsession) JSON-RPC method.

Example:

```ts
{
  method: 'experimental_grantSession',
  params: [{ 
    address: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbe', 
    expiry: 1727078400 
  }]
}
```

#### Granting sessions via `experimental_connect`

Sessions may be granted upon connection with the `grantSession` parameter on the [`experimental_connect`](#experimental_connect) JSON-RPC method.

Example:

```ts
{
  method: 'experimental_connect',
  params: [{ 
    capabilities: { 
      grantSession: {
        expiry: 1727078400
      }
    } 
  }]
}
```

If a session is granted upon connection, the `experimental_connect` JSON-RPC method will return the session on the `capabilities.sessions` parameter of the response.

Example:

```ts
{
  address: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbe',
  capabilities: {
    sessions: [{ expiry: 1727078400, id: '0x...' }]
  }
}
```

## Wagmi Reference

Porto implements the following [Wagmi](https://github.com/wevm/wagmi) VanillaJS Actions and React Hooks that map directly to the [experimental JSON-RPC methods](#json-rpc-reference).

> [!NOTE]
> Porto only supports the React version of Wagmi at the moment. If you are interested in adding support for other Wagmi Adapters, please create a Pull Request.

### VanillaJS Actions

Import via named export or `A` namespace (better autocomplete DX and does not impact tree shaking).

- `connect`
- `createAccount`
- `disconnect`
- `grantSession`
- `importAccount`
- `sessions`

```ts
import { A } from 'porto/wagmi/actions' // A.connect()
import { connect } from 'porto/wagmi/actions'
```

### React Hooks

Import via named export or `W` namespace (better autocomplete DX and does not impact tree shaking).

- `useConnect`
- `useCreateAccount`
- `useDisconnect`
- `useGrantSession`
- `useImportAccount`
- `useSessions`

```ts
import { W } from 'porto/wagmi' // W.useConnect()
import { useConnect } from 'porto/wagmi'
```

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
