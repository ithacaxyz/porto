import type { Chain as Chain_viem, ChainContract } from 'viem'
import * as chains from 'viem/chains'

export type Chain = Chain_viem & {
  contracts: Chain_viem['contracts'] & {
    portoAccount?: ChainContract | undefined
  }
}

export function define<const chain extends Chain>(chain: chain): chain {
  return chain
}

export const anvil = /*#__PURE__*/ define({
  ...chains.anvil,
  contracts: {
    ...chains.anvil.contracts,
    portoAccount: {
      address: '0x8ce361602b935680e8dec218b820ff5056beb7af',
    },
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:9119'],
    },
  },
})

export const base = /*#__PURE__*/ define({
  ...chains.base,
  contracts: {
    ...chains.base.contracts,
    portoAccount: {
      address: '0x664ab8c20b629422f5398e58ff8989e68b26a4e6',
    },
  },
  rpcUrls: {
    default: {
      http: ['https://base-mainnet.rpc.ithaca.xyz'],
    },
  },
})

export const baseSepolia = /*#__PURE__*/ define({
  ...chains.baseSepolia,
  contracts: {
    ...chains.baseSepolia.contracts,
    portoAccount: {
      address: '0x623b5b44647871268d481d2930f60d5d7f37a1fe',
    },
  },
  rpcUrls: {
    default: {
      http: ['https://base-sepolia.rpc.ithaca.xyz'],
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
    portoAccount: {
      address: '0x44c2b63838b6115ad6bcc7340c82badd8983ad98',
    },
  },
  id: 28_404,
  name: 'Porto Dev',
  nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
  rpcUrls: {
    default: { http: ['https://porto-dev.rpc.ithaca.xyz'] },
  },
  testnet: true,
})
