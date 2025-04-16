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
      address: '0x616dfc0fabbf4b377a7ef5d39f680ee0f6376f8d',
    },
    entryPoint: {
      address: '0xff975ecd6f690fdc091553606ecacdb5c503a54f',
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
