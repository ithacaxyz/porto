import {
  http,
  createConfig,
  createStorage,
  fallback,
  unstable_connector,
} from 'wagmi'
import { baseSepolia, odysseyTestnet, optimismSepolia } from 'wagmi/chains'
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

export const mipdConfig = createConfig({
  chains: [odysseyTestnet, optimismSepolia, baseSepolia],
  storage: createStorage({ storage: localStorage }),
  multiInjectedProviderDiscovery: true,
  transports: {
    [baseSepolia.id]: fallback([unstable_connector(injected), http()]),
    [odysseyTestnet.id]: fallback([unstable_connector(injected), http()]),
    [optimismSepolia.id]: fallback([unstable_connector(injected), http()]),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
