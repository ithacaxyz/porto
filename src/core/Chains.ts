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

export const anvil3 = /*#__PURE__*/ define({
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

export const anvil2 = /*#__PURE__*/ define({
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
      address: '0xf6c6ac93076be50f087cdfcee0002d34a6f672c0',
    },
  },
  experimental_preconfirmationTime: 200,
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
      address: '0xf6c6ac93076be50f087cdfcee0002d34a6f672c0',
    },
  },
  experimental_preconfirmationTime: 200,
  rpcUrls: {
    default: {
      http: [
        'https://base-sepolia.rpc.ithaca.xyz',
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
      address: '0xf6c6ac93076be50f087cdfcee0002d34a6f672c0',
    },
  },
  experimental_preconfirmationTime: 200,
  rpcUrls: {
    default: {
      http: [
        'https://optimism-sepolia.rpc.ithaca.xyz',
        ...chains.optimismSepolia.rpcUrls.default.http,
      ],
    },
  },
})
