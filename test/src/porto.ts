import { Porto } from 'porto'
import { custom, defineChain } from 'viem'
import * as chains from 'viem/chains'

import { anvilMainnet } from './anvil.js'

const anvil = defineChain({
  ...chains.mainnet,
  contracts: {
    ...chains.mainnet.contracts,
    accountDelegation: {
      address: '0x0ff027b63351364071425cF65d4FEce75a8e17B8',
    },
  },
  rpcUrls: {
    default: { http: [anvilMainnet.rpcUrl] },
  },
})

export const porto = Porto.create({
  chains: [anvil],
  transports: {
    [anvil.id]: custom(anvilMainnet),
  },
})

export const state = porto._internal.store.getState()
export const client = state.client.extend(() => ({ mode: 'anvil' }))
export const delegation = state.delegation
