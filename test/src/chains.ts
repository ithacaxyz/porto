import { Chains } from 'porto'

export function getChains(env: string) {
  if (env === 'anvil')
    return [Chains.anvil, Chains.anvil2, Chains.anvil3] as const
  if (env === 'prod') return [Chains.base] as const
  if (env === 'stg')
    return [
      {
        ...Chains.baseSepolia,
        rpcUrls: {
          default: {
            http: [
              // TODO: Remove hardcoded and use high perf RPC URL in env var
              'https://base-sepolia-int.rpc.ithaca.xyz',
              'https://base-sepolia.rpc.ithaca.xyz',
              ...Chains.baseSepolia.rpcUrls.default.http,
            ],
          },
        },
      },
      {
        ...Chains.optimismSepolia,
        rpcUrls: {
          default: {
            http: [
              // TODO: Remove hardcoded and use high perf RPC URL in env var
              'https://optimism-sepolia-int.rpc.ithaca.xyz',
              'https://optimism-sepolia.rpc.ithaca.xyz',
              ...Chains.optimismSepolia.rpcUrls.default.http,
            ],
          },
        },
      },
    ] as const satisfies Chains.Chain[]
  throw new Error(`env ${env} not supported`)
}

export type ChainId = ReturnType<typeof getChains>[number]['id']
