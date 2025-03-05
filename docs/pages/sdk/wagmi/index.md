## Overview

Porto implements the following [Wagmi](https://github.com/wevm/wagmi) VanillaJS Actions and React Hooks that map directly to the [experimental JSON-RPC methods](#json-rpc-reference).

:::info
Porto only supports the React version of Wagmi at the moment. If you are interested in adding support for other Wagmi Adapters, please create a Pull Request.
:::

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