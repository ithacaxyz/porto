import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { porto } from 'wagmi/connectors'

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [porto()],
  transports: {
    [baseSepolia.id]: http(),
  },
})
