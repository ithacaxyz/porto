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

export const anvilLeros = /*#__PURE__*/ define({
  ...chains.anvil,
  contracts: {
    ...chains.anvil.contracts,
    portoAccount: {
      address: '0xb19b36b1456e65e3a6d514d3f715f204bd59f431',
    },
  },
  id: 31_339,
  rpcUrls: {
    default: {
      http: ['http://localhost:9120'],
    },
  },
})

export const anvilParos = /*#__PURE__*/ define({
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

export const anvilTinos = /*#__PURE__*/ define({
  ...chains.anvil,
  contracts: {
    ...chains.anvil.contracts,
    portoAccount: {
      address: '0xb19b36b1456e65e3a6d514d3f715f204bd59f431',
    },
  },
  id: 31_338,
  rpcUrls: {
    default: {
      http: ['http://localhost:9120'],
    },
  },
})

export const base = /*#__PURE__*/ define({
  ...chains.base,
  contracts: {
    ...chains.base.contracts,
    portoAccount: {
      address: '0x96e9ded822ffd4c65d8e09340ee95d2dc8fa209f',
    },
  },
  preconfirmationTime: 200,
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
      address: '0x76334de3a35b0e824b8cfe36bb8b735f1a4a338e',
    },
  },
  preconfirmationTime: 200,
  rpcUrls: {
    default: {
      http: [
        'https://base-sepolia-int.rpc.ithaca.xyz',
        ...chains.baseSepolia.rpcUrls.default.http,
      ],
    },
  },
})

export const optimismSepolia = /*#__PURE__*/ define({
  ...chains.optimismSepolia,
  contracts: {
    ...chains.optimismSepolia.contracts,
    portoAccount: {
      address: '0x76334de3a35b0e824b8cfe36bb8b735f1a4a338e',
    },
  },
  preconfirmationTime: 200,
  rpcUrls: {
    default: {
      http: [
        'https://optimism-sepolia-int.rpc.ithaca.xyz',
        ...chains.optimismSepolia.rpcUrls.default.http,
      ],
    },
  },
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
