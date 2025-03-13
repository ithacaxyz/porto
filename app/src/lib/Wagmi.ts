import { http, createConfig, createStorage } from 'wagmi'
import { odysseyTestnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

import { porto } from './Porto'

export const config = createConfig({
  chains: [odysseyTestnet],
  storage: createStorage({ storage: localStorage }),
  multiInjectedProviderDiscovery: false,
  connectors: [
    injected({
      target: () => ({
        id: 'porto',
        name: 'Porto',
        provider: porto.provider as never,
      }),
    }),
  ],
  transports: {
    [odysseyTestnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
