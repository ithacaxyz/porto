import { porto } from 'porto/wagmi'
import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [porto()],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
