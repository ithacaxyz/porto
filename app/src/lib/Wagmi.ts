import { http, createConfig, createStorage } from 'wagmi'
import { baseSepolia, odysseyTestnet, optimismSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

import { porto } from './Porto'

export const config = createConfig({
  chains: [odysseyTestnet, optimismSepolia, baseSepolia],
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
    [optimismSepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
