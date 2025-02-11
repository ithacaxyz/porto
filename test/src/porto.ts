import { Implementation, Porto, Storage } from 'porto'
import { custom, defineChain } from 'viem'
import * as chains from 'viem/chains'

import { anvilMainnet } from './anvil.js'

const anvil = defineChain({
  ...chains.mainnet,
  contracts: {
    ...chains.mainnet.contracts,
    delegation: {
      address: '0xF9a8529Bb95ac7707129700f06343338E4767A27',
    },
  },
  rpcUrls: {
    default: { http: [anvilMainnet.rpcUrl] },
  },
})

export const createPorto = () =>
  Porto.create({
    chains: [anvil],
    implementation: Implementation.mock(),
    storage: Storage.memory(),
    transports: {
      [anvil.id]: custom(anvilMainnet),
    },
  })

export const porto = createPorto()
export const client = Porto.getClient(porto).extend(() => ({
  mode: 'anvil',
}))
export const delegation = client.chain.contracts.delegation.address
