import * as Chains from '../../src/core/Chains.js'

export function getChain(env: string) {
  if (env === 'anvil') return Chains.anvil
  if (env === 'prod') return Chains.base
  if (env === 'stg') return Chains.baseSepolia
  return Chains.portoDev
}
