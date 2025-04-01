import type * as Address from 'ox/Address'
import type { Chain as Chain_viem } from 'viem'
import * as chains from 'viem/chains'

export type Chain = Chain_viem & {
  contracts: Chain_viem['contracts'] & {
    delegation: {
      address: Address.Address
    }
    entryPoint: {
      address: Address.Address
    }
  }
}

export function define<const chain extends Chain>(chain: chain): chain {
  return chain
}

export const base = chains.base

export const baseSepolia = chains.baseSepolia

export const odysseyTestnet = /*#__PURE__*/ define({
  ...chains.odysseyTestnet,
  contracts: {
    ...chains.odysseyTestnet.contracts,
    delegation: {
      address: '0x63e0B807c3E872152645103462BD403D4e48fE7e',
    },
    entryPoint: {
      address: '0x5197adb49b4ecaa8e00f60f43757d3f5ad630227',
    },
  },
})
