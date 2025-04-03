import { Value } from 'ox'
import { mainnet } from 'viem/chains'
import { createConfig, http, useReadContracts } from 'wagmi'

export type Pair = keyof typeof priceFeedAddress

export type Price = {
  decimals: number
  display: string
  formatted: string
  symbol: string
  value: bigint
}

/**
 * Formats a number or bigint to a currency-formatted string.
 *
 * @param value - The number or bigint to format.
 * @returns The formatted string.
 */
export function format(value: number | bigint) {
  return numberIntl.format(value)
}

/**
 * Hook to fetch the price of a given crypto/fiat pair.
 *
 * @returns Price of the given pair.
 */
export function useFiatPrice<selectData = Price>(
  parameters: useFiatPrice.Parameters<selectData>,
) {
  const { pair = 'ETH/USD', select = (data) => data } = parameters

  return useReadContracts({
    config: priceFeedConfig,
    contracts: [
      {
        abi: priceFeedAbi,
        address: priceFeedAddress[pair],
        functionName: 'decimals',
      },
      {
        abi: priceFeedAbi,
        address: priceFeedAddress[pair],
        functionName: 'latestRoundData',
      },
    ],
    query: {
      select(data) {
        const [decimals, latestRoundData] = data
        if (decimals.error || latestRoundData.error) throw new Error(':(')

        const [, value] = latestRoundData.result
        const formatted = Value.format(value, decimals.result)
        return select({
          decimals: decimals.result,
          display: format(Number(formatted)),
          formatted,
          symbol: pair.split('/')[1] as string,
          value,
        })
      },
    },
  })
}

export namespace useFiatPrice {
  export type Parameters<selectData = Price> = {
    pair?: Pair | undefined
    select?: ((data: Price) => selectData) | undefined
  }
}

/** @internal */
const numberIntl = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
})

/** @internal */
const priceFeedConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
})

/** @internal */
const priceFeedAddress = {
  'ETH/USD': '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
} as const

/** @internal */
const priceFeedAbi = [
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
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
] as const
