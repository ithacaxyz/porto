import { Porto } from 'porto'
import { createConfig, http } from 'wagmi'
import { odysseyTestnet } from 'wagmi/chains'

export const porto = Porto.create()

export const config = createConfig({
  chains: [odysseyTestnet],
  ssr: true,
  transports: {
    [odysseyTestnet.id]: http(),
  },
})
