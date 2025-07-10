import type { wallet_getCapabilities } from 'porto/core/RpcSchema'
import type { ValueOf } from 'viem'
import { createConfig, createStorage, injected } from 'wagmi'

import { porto } from './Porto'

export const config = createConfig({
  chains: porto._internal.config.chains,
  connectors: [
    injected({
      target: () => ({
        id: 'porto',
        name: 'Porto',
        provider: porto.provider as never,
      }),
    }),
  ],
  multiInjectedProviderDiscovery: false,
  storage: createStorage({ storage: localStorage }),
  transports: porto._internal.config.transports,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

declare module 'viem' {
  interface Register {
    CapabilitiesSchema: {
      getCapabilities: {
        ReturnType: ValueOf<wallet_getCapabilities.Response_raw>
      }
    }
  }
}
