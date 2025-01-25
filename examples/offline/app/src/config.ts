import { Porto } from 'porto'
import { createClient, custom } from 'viem'
import { odysseyTestnet } from '@wagmi/core/chains'
import { http, createConfig, createStorage } from '@wagmi/core'

export const porto = Porto.create()

export const wagmiConfig = createConfig({
  chains: [odysseyTestnet],
  storage: createStorage({ storage: window.localStorage }),
  transports: {
    [odysseyTestnet.id]: http(),
  },
})

export const client = createClient({
  transport: custom(porto.provider),
})
