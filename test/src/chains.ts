import { Chains } from 'porto'

export function getChains(env: string) {
  if (env === 'anvil')
    return [Chains.anvil, Chains.anvil2, Chains.anvil3] as const
  if (env === 'prod') return [Chains.base] as const
  if (env === 'stg')
    return [Chains.baseSepolia, Chains.optimismSepolia] as const
  throw new Error(`env ${env} not supported`)
}

export type ChainId = ReturnType<typeof getChains>[number]['id']
