import * as React from 'react'
import { Chains } from 'porto'
import { Hooks, Porto } from 'porto/remote'
import { createConfig, http, useReadContract } from 'wagmi'
import { mainnet } from 'viem/chains'
import { Value } from 'ox'
import { PriceFormatter } from '../utils'

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

/**
 * Hook to extract the price of ETH in USD.
 *
 * @returns Price of ETH in USD.
 */
export function useEthPrice() {
  return useReadContract({
    ...getUsdcPriceConfig,
    config: mainnetConfig,
    query: {
      select(data) {
        const [, value] = data
        const decimals = 8
        const formatted = Value.format(value, decimals)
        return {
          currency: 'USD',
          decimals,
          display: PriceFormatter.format(Number(formatted)),
          formatted,
          value,
        }
      },
    },
  })
}

/** @internal */
const mainnetConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
})

/** @internal */
const getUsdcPriceConfig = {
  address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  abi: [
    {
      inputs: [],
      name: 'latestRoundData',
      outputs: [
        { internalType: 'uint80', name: 'roundId', type: 'uint80' },
        { internalType: 'int256', name: 'answer', type: 'int256' },
        { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
        { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
        { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
  functionName: 'latestRoundData',
} as const
