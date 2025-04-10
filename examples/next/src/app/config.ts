import { porto } from 'porto/wagmi'
import { createConfig, http } from 'wagmi'
import { odysseyTestnet } from 'wagmi/chains'

export const config = createConfig({
  chains: [odysseyTestnet],
  connectors: [porto()],
  ssr: true,
  transports: {
    [odysseyTestnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
