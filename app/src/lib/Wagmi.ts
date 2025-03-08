import { http, createConfig, createStorage } from 'wagmi'
import { baseSepolia, odysseyTestnet, optimismSepolia } from 'wagmi/chains'

// import { porto } from './Porto'

export const config = createConfig({
  chains: [odysseyTestnet, optimismSepolia, baseSepolia],
  storage: createStorage({ storage: localStorage }),
  multiInjectedProviderDiscovery: true,
  transports: {
    [baseSepolia.id]: http(),
    [odysseyTestnet.id]: http(),
    [optimismSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
