import { Address, Value } from 'ox'
import { mainnet } from 'viem/chains'
import { createConfig, http, useReadContracts } from 'wagmi'
import { ValueFormatter } from '../utils'

export type Pair = keyof typeof priceFeedAddress

export type Price = {
  address: Address.Address
  decimals: number
  display: string
  formatted: string
  symbol: string
  value: bigint
}

/**
 * Instantiates a price.
 *
 * @param parameters - Parameters.
 * @returns Price.
 */
export function from(parameters: from.Parameters): Price {
  const { address, decimals, symbol, value } = parameters
  const formatted = ValueFormatter.format(value, decimals)
  const display = `${formatted} ${symbol}`
  return {
    address,
    decimals,
    display,
    formatted,
    symbol,
    value,
  }
}

export namespace from {
  export type Parameters = {
    address: Address.Address
    decimals: number
    symbol: string
    value: bigint
  }
}

/**
 * Instantiates a fiat price.
 *
 * @param parameters - Parameters.
 * @returns Price.
 */
export function fromFiat(parameters: fromFiat.Parameters): Price {
  const { address, decimals, symbol, value } = parameters
  const formatted = Value.format(value, decimals)
  const display = format(Number(formatted))
  return {
    address,
    decimals,
    display,
    formatted,
    symbol,
    value,
  }
}

export namespace fromFiat {
  export type Parameters = {
    address: Address.Address
    decimals: number
    symbol: string
    value: bigint
  }
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
  parameters: useFiatPrice.Parameters<selectData> = {},
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
      enabled: !('value' in parameters) || !!parameters.value,
      select(data) {
        const [decimals, latestRoundData] = data
        if (decimals.error || latestRoundData.error) throw new Error(':(')

        const [, value] = latestRoundData.result
        const value_ = parameters.value
          ? (parameters.value * value) / 10n ** 18n
          : value
        return select(
          fromFiat({
            address: '0x0000000000000000000000000000000000000000',
            decimals: decimals.result,
            symbol: pair.split('/')[1] as string,
            value: value_,
          }),
        )
      },
    },
  })
}

export namespace useFiatPrice {
  export type Parameters<selectData = Price> = {
    pair?: Pair | undefined
    select?: ((data: Price) => selectData) | undefined
    value?: bigint | undefined
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
