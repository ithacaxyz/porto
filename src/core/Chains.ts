import type { Chain as Chain_viem, ChainContract } from 'viem'
import * as chains from 'viem/chains'

export type Chain = Chain_viem & {
  contracts: Chain_viem['contracts'] & {
    accountRegistry?: ChainContract | undefined
    delegation?: ChainContract | undefined
    entryPoint?: ChainContract | undefined
  }
}

export function define<const chain extends Chain>(chain: chain): chain {
  return chain
}

export const anvil = /*#__PURE__*/ define({
  ...chains.anvil,
  contracts: {
    ...chains.anvil.contracts,
    accountRegistry: {
      address: '0x700b6a60ce7eaaea56f065753d8dcb9653dbad35',
    },
    delegation: {
      address: '0x8ce361602b935680e8dec218b820ff5056beb7af',
    },
    entryPoint: {
      address: '0xa15bb66138824a1c7167f5e85b957d04dd34e468',
    },
    simulator: {
      address: '0x12975173b87f7595ee45dffb2ab812ece596bf84',
    },
  },
})

export const baseSepolia = /*#__PURE__*/ define({
  ...chains.baseSepolia,
  contracts: {
    ...chains.baseSepolia.contracts,
    accountRegistry: {
      address: '0xf742e7cfc857611be27859bf910bc1ea59f52b24',
    },
    delegation: {
      address: '0x79d7f2ab558ac7a4601f65d02f0fc695a644698a',
    },
    entryPoint: {
      address: '0xf2595965b86e647d9b666087d785d54094b0a0c1',
    },
  },
  rpcUrls: {
    default: {
      http: ['https://base-sepolia.ithaca.xyz'],
    },
  },
})

export const portoDev = /*#__PURE__*/ define({
  blockExplorers: {
    default: {
      apiUrl: '',
      name: '',
      url: '',
    },
  },
  contracts: {
    delegation: {
      address: '0x1bd84b4584a60cbcc1b3153694a69315f795c1ba',
    },
  },
  id: 28_404,
  name: 'Porto Dev',
  nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
  rpcUrls: {
    default: { http: ['https://porto-dev.ithaca.xyz'] },
  },
  testnet: true,
})
