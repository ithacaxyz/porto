import { Chains } from 'porto'
import { Hooks, Porto } from 'porto/remote'
import * as React from 'react'

/**
 * Hook to extract a supported chain from a Porto instance.
 * Defaults to the active chain if no chain ID is provided.
 *
 * @param porto - Porto instance.
 * @param parameters - Parameters.
 * @returns Chain.
 */
export function useChain<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(
  porto: Pick<Porto.Porto<chains>, '_internal'>,
  parameters: useChain.Parameters = {},
) {
  const { chainId } = parameters

  const activeChain = Hooks.useActiveChain(porto)

  if (!chainId) return activeChain
  return React.useMemo(
    () => porto._internal.config.chains.find((x) => x.id === chainId),
    [chainId, porto._internal.config.chains.find],
  )
}

export namespace useChain {
  export type Parameters = {
    chainId?: number | undefined
  }
}
