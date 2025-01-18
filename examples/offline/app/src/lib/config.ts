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
  syncConnectedChain: true,
  connectors: [
    injected({ shimDisconnect: true, unstable_shimAsyncInject: true }),
  ],
  storage: createStorage({ storage: window.localStorage }),
  transports: {
    [odysseyTestnet.id]: http(),
  },
})

reconnect(wagmiConfig)
