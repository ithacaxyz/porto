## Overview

Porto implements the following [Wagmi](https://github.com/wevm/wagmi) Connector, VanillaJS Actions, and React Hooks that map directly to the [experimental JSON-RPC methods](#json-rpc-reference).

:::info
Porto only supports the React version of Wagmi at the moment. If you are interested in adding support for other Wagmi Adapters, please create a Pull Request.
:::

### Connector

Import the `porto` connector from the `'porto/wagmi'` entrypoint and add to your Wagmi Config.

```ts
import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { porto } from 'wagmi/connectors' // [!code focus]

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [porto()], // [!code focus]
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
})
```

### VanillaJS Actions

Import via named export or `Actions` namespace (better autocomplete DX and does not impact tree shaking).

- `addFunds`
- `createAccount`
- `getPermissions`
- `grantPermissions`
- `revokePermissions`
- `upgradeAccount`

```ts
import { Actions } from 'porto/wagmi' // Actions.getPermissions()
import { connect } from 'porto/wagmi/Actions'
```

### React Hooks

Import via named export or `Hooks` namespace (better autocomplete DX and does not impact tree shaking).

- `useAddFunds`
- `useCreateAccount`
- `useGrantPermissions`
- `usePermissions`
- `useRevokePermissions`
- `useUpgradeAccount`

```ts
import { Hooks } from 'porto/wagmi' // Hooks.usePermissions()
import { usePermissions } from 'porto/wagmi/Hooks'
```
