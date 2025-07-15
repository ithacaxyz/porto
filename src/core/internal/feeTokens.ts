import * as Address from 'ox/Address'
import * as ServerActions_internal from '../../viem/internal/serverActions.js'
import type * as ServerClient from '../../viem/ServerClient.js'
import type * as Chains from '../Chains.js'
import type { Store } from '../Porto.js'
import type * as FeeToken_schema from './schema/feeToken.js'

export type FeeToken = FeeToken_schema.FeeToken
export type FeeTokens = readonly FeeToken[]

export async function fetch<
  const chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(
  client: ServerClient.ServerClient,
  parameters?: fetch.Parameters<chains> | undefined,
): Promise<fetch.ReturnType> {
  const { addressOrSymbol: overrideFeeToken, store } = parameters ?? {}
  const { feeToken: defaultFeeToken } = store?.getState() ?? {}

  const feeTokens = await ServerActions_internal.getCapabilities(client).then(
    (capabilities) => capabilities.fees.tokens,
  )
  const index = feeTokens?.findIndex((feeToken) => {
    if (overrideFeeToken) {
      if (Address.validate(overrideFeeToken))
        return Address.isEqual(feeToken.address, overrideFeeToken)
      return overrideFeeToken === feeToken.symbol
    }
    if (defaultFeeToken) return defaultFeeToken === feeToken.symbol
    return feeToken.symbol === 'ETH'
  })

  const feeToken = feeTokens?.[index ?? 0]!
  if (index === -1)
    console.warn(
      `Fee token ${overrideFeeToken ?? defaultFeeToken} not found. Falling back to ${feeToken?.symbol} (${feeToken?.address}).`,
    )

  return [feeToken, ...feeTokens.toSpliced(index, 1)]
}

export declare namespace fetch {
  export type Parameters<
    chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
      Chains.Chain,
      ...Chains.Chain[],
    ],
  > = {
    /**
     * Fee token to use. If provided, and the token exists, it will take precedence over
     * the fee token stored in state, and will be returned as first fee token.
     */
    addressOrSymbol?: FeeToken_schema.Symbol | Address.Address | undefined
    /**
     * Porto store. If provided, the fee token stored in state will take precedence
     * and will be returned as first fee token.
     */
    store?: Store<chains> | undefined
  }

  export type ReturnType = readonly [FeeToken, ...FeeTokens]
}
