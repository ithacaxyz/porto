import { type Chain, defineChain } from 'viem'
import { anvil } from 'viem/chains'
import * as chains from './internal/_generated/chains.js'

export type { Chain } from 'viem/chains'
export { anvil } from 'viem/chains'
export * from './internal/_generated/chains.js'

export const all = Object.values(chains) as unknown as [Chain, ...Chain[]]

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
