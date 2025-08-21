import { type Chain, defineChain } from 'viem'
import { anvil as viem_anvil } from 'viem/chains'
import * as chains from './internal/_generated/chains.js'

export type { Chain } from 'viem/chains'
export * from './internal/_generated/chains.js'

export const all = [
  chains.riseTestnet,
  ...Object.values(chains).filter((c) => c.id !== chains.riseTestnet.id),
] as const satisfies [Chain, ...Chain[]]

export const anvil = /*#__PURE__*/ defineChain({
  ...viem_anvil,
  testnet: true,
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
