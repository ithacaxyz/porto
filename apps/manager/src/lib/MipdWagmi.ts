import {
  createConfig,
  createStorage,
  fallback,
  http,
  unstable_connector,
} from 'wagmi'
import { odysseyTestnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const mipdConfig = createConfig({
  chains: [odysseyTestnet],
  multiInjectedProviderDiscovery: true,
  storage: createStorage({ storage: localStorage }),
  transports: {
    [odysseyTestnet.id]: fallback([unstable_connector(injected), http()]),
  },
})
