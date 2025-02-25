import { http, createConfig, createStorage, injected } from 'wagmi'
import { odysseyTestnet } from 'wagmi/chains'

import { porto } from './Porto'

export const config = createConfig({
  chains: [odysseyTestnet],
  storage: createStorage({ storage: localStorage }),
  connectors: [
    injected({
      target() {
        return {
          name: 'Porto',
          id: 'porto',
          provider: porto.provider as never,
        }
      },
    }),
  ],
  multiInjectedProviderDiscovery: false,
  transports: {
    [odysseyTestnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
