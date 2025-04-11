import type { Chain as Chain_viem, ChainContract } from 'viem'
import * as chains from 'viem/chains'

export type Chain = Chain_viem & {
  contracts: Chain_viem['contracts'] & {
    delegation?: ChainContract | undefined
    entryPoint?: ChainContract | undefined
  }
}

export function define<const chain extends Chain>(chain: chain): chain {
  return chain
}

export const odysseyDevnet = /*#__PURE__*/ define({
  blockExplorers: {
    default: {
      apiUrl: '',
      name: '',
      url: '',
    },
  },
  contracts: {
    delegation: {
      address: '0xe09d7f4fbd33c6fc734e07d69e40d23f995b43c9',
    },
    entryPoint: {
      address: '0xcceed8216fe5b0a8438f5c4c8ce959e0823dec8d',
    },
  },
  id: 28_403,
  name: 'Odyssey Devnet',
  nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
  rpcUrls: {
    default: { http: ['https://odyssey-devnet.ithaca.xyz'] },
  },
  testnet: true,
})

export const odysseyTestnet = /*#__PURE__*/ define({
  ...chains.odysseyTestnet,
  contracts: {
    ...chains.odysseyTestnet.contracts,
    delegation: {
      address: '0x6faf9eb2742350c772a5c811e1b0e2f330650a25',
    },
    entryPoint: {
      address: '0x7cf6287013ef3d4558a98fcc2bc286e53341513f',
    },
  },
})
