import {
  createConfig,
  createStorage,
  fallback,
  http,
  unstable_connector,
} from 'wagmi'
import { baseSepolia, odysseyTestnet, optimismSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { porto } from './Wagmi'

export const mipdConfig = createConfig({
  chains: [odysseyTestnet, optimismSepolia, baseSepolia],
  multiInjectedProviderDiscovery: true,
  storage: createStorage({ storage: localStorage }),
  transports: {
    [baseSepolia.id]: fallback([unstable_connector(injected), http()]),
    [odysseyTestnet.id]: fallback([unstable_connector(injected), http()]),
    [optimismSepolia.id]: fallback([unstable_connector(injected), http()]),
  },
  connectors: [
    injected({
      target: () => ({
        id: 'porto',
        name: 'Porto',
        provider: porto.provider as never,
      }),
    }),
  ],
})
