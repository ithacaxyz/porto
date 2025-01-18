import {
  http,
  injected,
  reconnect,
  createConfig,
  createStorage,
} from '@wagmi/core'
import { Porto } from 'porto'
import { odysseyTestnet } from '@wagmi/core/chains'

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
