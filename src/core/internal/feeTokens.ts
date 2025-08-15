import * as Address from 'ox/Address'
import { zeroAddress } from 'viem'
import * as ServerActions_internal from '../../viem/internal/serverActions.js'
import type * as ServerClient from '../../viem/ServerClient.js'
import type * as Chains from '../Chains.js'
import type * as FeeToken_schema from './schema/feeToken.js'

export type FeeToken = FeeToken_schema.FeeToken
export type FeeTokens = readonly FeeToken[]

export async function fetch<
  const chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(
  client: ServerClient.ServerClient,
  parameters?: fetch.Parameters | undefined,
): Promise<fetch.ReturnType> {
  const { addressOrSymbol: overrideFeeToken } = parameters ?? {}

  const feeTokens = await ServerActions_internal.getCapabilities(client).then(
    (capabilities) => capabilities.fees.tokens,
  )

  const index = feeTokens?.findIndex((feeToken) => {
    if (overrideFeeToken) {
      if (Address.validate(overrideFeeToken))
        return Address.isEqual(feeToken.address, overrideFeeToken)
      return overrideFeeToken === feeToken.symbol
    }
    return feeToken.symbol === 'ETH'
  })

  if (overrideFeeToken && index === -1)
    console.warn(
      `Fee token ${overrideFeeToken} not found. Falling back to native token.`,
    )
  const feeToken =
    feeTokens?.[index] ??
    feeTokens.find((feeToken) => feeToken.address === zeroAddress)!

  return [feeToken, ...feeTokens.toSpliced(index, 1)]
}

export declare namespace fetch {
  export type Parameters = {
    /**
     * Fee token to use. If provided, and the token exists, it will take precedence over
     * the fee token stored in state, and will be returned as first fee token.
     */
    addressOrSymbol?: FeeToken_schema.Symbol | Address.Address | undefined
  }

  export type ReturnType = readonly [FeeToken, ...FeeTokens]
}
