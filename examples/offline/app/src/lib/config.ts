import {
  http,
  createConfig,
  createStorage,
  injected,
  reconnect,
} from '@wagmi/core'
import { odysseyTestnet } from '@wagmi/core/chains'
import { Porto } from 'porto'

export const porto = Porto.create()

export const wagmiConfig = createConfig({
  chains: [odysseyTestnet],
  storage: createStorage({ storage: window.localStorage }),
  transports: {
    [odysseyTestnet.id]: http(),
  },
})

reconnect(wagmiConfig)
