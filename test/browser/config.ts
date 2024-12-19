import { Chains, Porto } from 'porto'
import { http, type Chain } from 'viem'

const odysseyTestnet = {
  ...Chains.odysseyTestnet,
  rpcUrls: {
    default: {
      http: ['https://anvil.porto.localhost'],
      webSocket: ['wss://anvil.porto.localhost'],
    },
    public: {
      http: ['https://anvil.porto.localhost'],
      webSocket: ['wss://anvil.porto.localhost'],
    },
  },
} as const satisfies Chain

export const porto = Porto.create({
  chains: [odysseyTestnet],
  transports: {
    [odysseyTestnet.id]: http(),
  },
})
