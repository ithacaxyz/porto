import * as Address from 'ox/Address'
import type { Client, Transport } from 'viem'
import type { GetChainParameter } from '../../viem/internal/utils.js'
import * as RelayActions from '../../viem/RelayActions.js'
import type * as Chains from '../Chains.js'
import type { Store } from '../Porto.js'
import type * as Token from './schema/token.js'

export type { Token } from './schema/token.js'
export type Tokens = readonly Token.Token[]

export async function getTokens<chain extends Chains.Chain | undefined>(
  client: Client<Transport, chain>,
  parameters?: getTokens.Parameters<chain>,
): Promise<getTokens.ReturnType> {
  const { chain = client.chain, addressOrSymbol } = parameters ?? {}

  const tokens = await RelayActions.getCapabilities(client, {
    chainId: chain?.id,
  }).then((capabilities) => capabilities.fees.tokens)

  if (addressOrSymbol)
    return tokens.filter((token) => {
      if (Address.validate(addressOrSymbol))
        return Address.isEqual(addressOrSymbol, token.address)
      return addressOrSymbol === token.symbol
    })

  return tokens
}

export declare namespace getTokens {
  export type Parameters<
    chain extends Chains.Chain | undefined = Chains.Chain | undefined,
  > = GetChainParameter<chain> & {
    addressOrSymbol?: Token.Symbol | Address.Address | undefined
  }

  export type ReturnType = readonly Token.Token[]
}

export async function resolveFeeTokens<chain extends Chains.Chain | undefined>(
  client: Client<Transport, chain>,
  parameters?: resolveFeeTokens.Parameters<chain> | undefined,
): Promise<resolveFeeTokens.ReturnType> {
  const {
    addressOrSymbol: overrideFeeToken,
    chain = client.chain,
    store,
  } = parameters ?? {}
  const { feeToken: defaultFeeToken } = store?.getState() ?? {}

  const feeTokens = await getTokens(client, { chain: chain! }).then((tokens) =>
    tokens.filter((token) => token.feeToken),
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

  const feeToken = feeTokens?.[index !== -1 ? index : 0]!
  if (index === -1)
    console.warn(
      `Fee token ${overrideFeeToken ?? defaultFeeToken} not found. Falling back to ${feeToken?.symbol} (${feeToken?.address}).`,
    )

  return [feeToken, ...feeTokens.toSpliced(index, 1)]
}

export declare namespace resolveFeeTokens {
  export type Parameters<
    chain extends Chains.Chain | undefined = Chains.Chain | undefined,
  > = getTokens.Parameters<chain> & {
    /**
     * Fee token to use. If provided, and the token exists, it will take precedence over
     * the fee token stored in state, and will be returned as first fee token.
     */
    addressOrSymbol?: Token.Symbol | Address.Address | undefined
    /**
     * Porto store. If provided, the fee token stored in state will take precedence
     * and will be returned as first fee token.
     */
    store?: Store<any> | undefined
  }

  export type ReturnType = readonly [Token.Token, ...Token.Token[]]
}
