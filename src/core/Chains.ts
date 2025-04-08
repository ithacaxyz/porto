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
      address: '0xcc22bfa7947b41e4aff122267b3d4cd2d351d6eb',
    },
    entryPoint: {
      address: '0x63d9ce30d98762bfe1a26852116f031a1857b674',
    },
  },
  id: 28403,
  rpcUrls: {
    default: {
      http: ['https://odyssey-devnet.ithaca.xyz'],
    },
  },
})
