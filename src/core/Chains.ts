import type { Chain as Chain_viem, ChainContract } from 'viem'
import * as chains from 'viem/chains'

export type Chain = Chain_viem & {
  contracts: Chain_viem['contracts'] & {
    delegation?: ChainContract | undefined
  }
}

export function define<const chain extends Chain>(chain: chain): chain {
  return chain
}

export const anvil = /*#__PURE__*/ define({
  ...chains.anvil,
  contracts: {
    ...chains.anvil.contracts,
    delegation: {
      address: '0x8ce361602b935680e8dec218b820ff5056beb7af',
    },
  },
})

export const baseSepolia = /*#__PURE__*/ define({
  ...chains.baseSepolia,
  contracts: {
    ...chains.baseSepolia.contracts,
    delegation: {
      address: '0x79d7f2ab558ac7a4601f65d02f0fc695a644698a',
    },
  },
  rpcUrls: {
    default: {
      http: ['https://base-sepolia.ithaca.xyz'],
    },
  },
})

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
  },
})
