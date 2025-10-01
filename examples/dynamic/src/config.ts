import { Porto } from 'porto'
import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

Porto.create()

export const config = createConfig({
  chains: [baseSepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [baseSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
