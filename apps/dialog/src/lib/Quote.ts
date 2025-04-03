import { Token } from '@porto/apps'
import { Value } from 'ox'
import { Chains } from 'porto'
import * as Quote_relay from 'porto/core/internal/relay/typebox/quote'
import { Porto } from 'porto/remote'
import * as React from 'react'
import { ValueFormatter } from '../utils'
import * as Hooks from './Hooks'
import * as Price from './Price'

export type Fee = Price.Price

export type Quote = {
  fee: Fee & {
    native: Fee
  }
  ttl: number
}

/**
 * Hook to extract a quote from a `wallet_prepareCalls` context.
 *
 * @param porto - Porto instance.
 * @param parameters - Parameters.
 * @returns Quote.
 */
export function useQuote<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(
  porto: Pick<Porto.Porto<chains>, '_internal'>,
  parameters: useQuote.Parameters,
): Quote | undefined {
  const { chainId } = parameters
  const context = parameters.context as Quote_relay.Quote | undefined
  const { op, nativeFeeEstimate, txGas, ttl } = context ?? {}
  const { paymentToken, paymentMaxAmount } = op ?? {}

  const chain = Hooks.useChain(porto, { chainId })!

  const fee = React.useMemo(() => {
    if (!nativeFeeEstimate || !txGas || !paymentMaxAmount) return undefined

    function getFee(parameters: {
      decimals: number
      symbol: string
      value: bigint
    }) {
      const { decimals, symbol, value } = parameters
      const formatted = ValueFormatter.format(value, decimals)
      const display = `${formatted} ${symbol}`
      return {
        decimals,
        display,
        formatted,
        symbol,
        value,
      }
    }

    const nativeConfig = {
      decimals: chain.nativeCurrency.decimals,
      symbol: chain.nativeCurrency.symbol,
      value: nativeFeeEstimate.maxFeePerGas * txGas,
    } as const

    const config = paymentToken
      ? {
          ...(Token.tokens as any)[chain.id][paymentToken],
          value: paymentMaxAmount,
        }
      : nativeConfig

    const fee = getFee(config)
    const native = getFee(nativeConfig)
    return {
      ...fee,
      native,
    }
  }, [
    chain.id,
    chain.nativeCurrency.decimals,
    chain.nativeCurrency.symbol,
    nativeFeeEstimate,
    txGas,
    paymentMaxAmount,
    paymentToken,
  ])

  if (!fee) return undefined
  if (!ttl) return undefined
  return {
    fee,
    ttl,
  }
}

export namespace useQuote {
  export type Parameters = {
    chainId?: number | undefined
    context: unknown
  }
}

export function useFiatFee(quote: Quote | undefined) {
  return Price.useFiatPrice({
    pair: 'ETH/USD',
    select(price) {
      if (!quote) return undefined

      const weiFee = quote.fee.native.value
      const ethFee = Value.formatEther(weiFee)

      const feePrice = Number(ethFee) * Number(price.formatted)

      const symbol = price.symbol
      const formatted = Price.format(feePrice)
      const display = `${formatted} ${symbol}`

      return {
        display,
        formatted,
        symbol,
      }
    },
  })
}
