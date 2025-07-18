import type { Chain as Chain_viem, ChainContract } from 'viem'
import * as chains from 'viem/chains'

export type Chain = Chain_viem & {
  contracts?:
    | (Chain_viem['contracts'] & {
        portoAccount?: ChainContract | undefined
      })
    | undefined
}

export function define<const chain extends Chain>(chain: chain): chain {
  return chain
}

export const anvil = /*#__PURE__*/ define({
  ...chains.anvil,
  contracts: {
    ...chains.anvil.contracts,
    portoAccount: {
      address: '0xb19b36b1456e65e3a6d514d3f715f204bd59f431',
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
      http: [
        'https://base-mainnet.rpc.ithaca.xyz',
        ...chains.base.rpcUrls.default.http,
      ],
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
      http: [
        'https://base-sepolia.rpc.ithaca.xyz',
        ...chains.baseSepolia.rpcUrls.default.http,
      ],
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
      address: '0xc6e7df5e7b4f2a278906862b61205850344d4e7d',
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

export const portoDevLeros = /*#__PURE__*/ define({
  blockExplorers: {
    default: {
      apiUrl: '',
      name: '',
      url: '',
    },
  },
  contracts: {
    portoAccount: {
      address: '0xdfd207d90463215cba68fee18e8aeabd2fd3782d',
    },
  },
  id: 28_407,
  name: 'Porto Dev (Leros)',
  nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
  rpcUrls: {
    default: { http: ['https://porto-dev-leros.rpc.ithaca.xyz'] },
  },
  testnet: true,
})

export const portoDevParos = /*#__PURE__*/ define({
  blockExplorers: {
    default: {
      apiUrl: '',
      name: '',
      url: '',
    },
  },
  contracts: {
    portoAccount: {
      address: '0xdfd207d90463215cba68fee18e8aeabd2fd3782d',
    },
  },
  id: 28_405,
  name: 'Porto Dev (Paros)',
  nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
  rpcUrls: {
    default: { http: ['https://porto-dev-paros.rpc.ithaca.xyz'] },
  },
  testnet: true,
})

export const portoDevTinos = /*#__PURE__*/ define({
  blockExplorers: {
    default: {
      apiUrl: '',
      name: '',
      url: '',
    },
  },
  contracts: {
    portoAccount: {
      address: '0xdfd207d90463215cba68fee18e8aeabd2fd3782d',
    },
  },
  id: 28_406,
  name: 'Porto Dev (Tinos)',
  nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
  rpcUrls: {
    default: { http: ['https://porto-dev-tinos.rpc.ithaca.xyz'] },
  },
  testnet: true,
})
