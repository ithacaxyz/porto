import { defineChain } from 'viem'
import * as chains from 'viem/chains'

export type { Chain } from 'viem/chains'

export const anvil = /*#__PURE__*/ defineChain({
  ...chains.anvil,
  rpcUrls: {
    ...chains.anvil.rpcUrls,
    relay: {
      http: ['http://localhost:9119'],
    },
  },
})

/** Additional Anvil environment, purposed for interop. */
export const anvil2 = /*#__PURE__*/ defineChain({
  ...anvil,
  id: 31_338,
})

/** Additional Anvil environment, purposed for interop. */
export const anvil3 = /*#__PURE__*/ defineChain({
  ...anvil,
  id: 31_339,
})

export const base = /*#__PURE__*/ defineChain({
  ...chains.base,
  rpcUrls: {
    ...chains.base.rpcUrls,
    relay: {
      http: ['https://base-mainnet-int.rpc.ithaca.xyz'],
    },
  },
})

export const baseSepolia = /*#__PURE__*/ defineChain({
  ...chains.baseSepolia,
  rpcUrls: {
    ...chains.baseSepolia.rpcUrls,
    relay: {
      http: ['https://base-sepolia-int.rpc.ithaca.xyz'],
    },
  },
})

export const optimism = /*#__PURE__*/ defineChain({
  ...chains.optimism,
  rpcUrls: {
    ...chains.optimism.rpcUrls,
    relay: {
      http: ['https://optimism-mainnet-int.rpc.ithaca.xyz'],
    },
  },
})

export const optimismSepolia = /*#__PURE__*/ defineChain({
  ...chains.optimismSepolia,
  rpcUrls: {
    ...chains.optimismSepolia.rpcUrls,
    relay: {
      http: ['https://optimism-mainnet-int.rpc.ithaca.xyz'],
    },
  },
})
