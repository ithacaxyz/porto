import {
  http,
  createConfig,
  createStorage,
  fallback,
  unstable_connector,
} from 'wagmi'
import { baseSepolia, odysseyTestnet, optimismSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const mipdConfig = createConfig({
  multiInjectedProviderDiscovery: true,
  storage: createStorage({ storage: localStorage }),
  chains: [odysseyTestnet, optimismSepolia, baseSepolia],
  transports: {
    [baseSepolia.id]: fallback([unstable_connector(injected), http()]),
    [odysseyTestnet.id]: fallback([unstable_connector(injected), http()]),
    [optimismSepolia.id]: fallback([unstable_connector(injected), http()]),
  },
})
