import * as React from 'react'
import { Chains } from 'porto'
import { Porto } from 'porto/remote'
import * as Quote_relay from 'porto/core/internal/relay/typebox/quote'

import * as Hooks from './Hooks'
import { ValueFormatter } from '../utils'

export type Fee = {
  display: string
  formatted: string
  value: bigint
}

export type Quote = {
  fee: Fee
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
  const { chainId, context } = parameters
  const { nativeFeeEstimate, txGas, ttl } =
    (context as Quote_relay.Quote | undefined) ?? {}

  const chain = Hooks.useChain(porto, { chainId })!

  const fee = React.useMemo(() => {
    if (!nativeFeeEstimate || !txGas) return undefined
    const value = nativeFeeEstimate.maxFeePerGas * txGas
    const formatted = ValueFormatter.format(value, 18)
    const display = `${formatted} ${chain.nativeCurrency.symbol}`
    return {
      display,
      formatted,
      value,
    }
  }, [nativeFeeEstimate, txGas, chain.nativeCurrency.symbol])

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
