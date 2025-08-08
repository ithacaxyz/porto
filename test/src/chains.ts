import { Chains } from 'porto'

export function getChains(env: string) {
  if (env === 'anvil')
    return [Chains.anvilParos, Chains.anvilTinos, Chains.anvilLeros] as const
  if (env === 'prod') return [Chains.base] as const
  if (env === 'stg')
    return [Chains.baseSepolia, Chains.optimismSepolia] as const
  return [
    Chains.portoDevParos,
    Chains.portoDevTinos,
    Chains.portoDevLeros,
  ] as const
}

export type ChainId = ReturnType<typeof getChains>[number]['id']
