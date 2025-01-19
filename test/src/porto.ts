import { Implementation, Porto, Storage } from 'porto'
import { custom, defineChain } from 'viem'
import * as chains from 'viem/chains'

import { anvilMainnet } from './anvil.js'

const anvil = defineChain({
  ...chains.mainnet,
  contracts: {
    ...chains.mainnet.contracts,
    delegation: {
      address: '0x0ff027b63351364071425cF65d4FEce75a8e17B8',
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
