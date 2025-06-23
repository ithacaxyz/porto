import { type Address, Value } from 'ox'
import { ValueFormatter } from '../utils'

export type Price = {
  address: Address.Address
  decimals: number
  display: string
  kind?: string | undefined
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
  const { address, decimals, kind, symbol, value } = parameters
  const formatted = ValueFormatter.format(value, decimals)
  const display = `${formatted} ${symbol}`
  return {
    address,
    decimals,
    display,
    formatted,
    kind,
    symbol,
    value,
  }
}

export namespace from {
  export type Parameters = {
    address: Address.Address
    decimals: number
    kind?: string | undefined
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

/** @internal */
const numberIntl = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
})
