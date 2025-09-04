import * as Address from 'ox/Address'
import { type Client, type Transport, zeroAddress } from 'viem'
import type { GetChainParameter } from '../../viem/internal/utils.js'
import * as RelayActions from '../../viem/RelayActions.js'
import type * as Chains from '../Chains.js'
import type { Store } from '../Porto.js'
import type * as Token from './schema/token.js'

export type { Token } from './schema/token.js'
export type Tokens = readonly Token.Token[]

/**
 * Fetches all supported tokens for a given chain.
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Tokens.
 */
export async function getTokens<chain extends Chains.Chain | undefined>(
  client: Client<Transport, chain>,
  parameters?: getTokens.Parameters<chain>,
): Promise<getTokens.ReturnType> {
  const { chain = client.chain } = parameters ?? {}

  const tokens = await RelayActions.getCapabilities(client, {
    chainId: chain?.id,
  }).then((capabilities) => capabilities.fees.tokens)

  return tokens
}

export declare namespace getTokens {
  export type Parameters<
    chain extends Chains.Chain | undefined = Chains.Chain | undefined,
  > = GetChainParameter<chain>

  export type ReturnType = readonly Token.Token[]
}

/**
 * Fetches a token for a given chain, provided an address or symbol.
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Token.
 */
export async function getToken<chain extends Chains.Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getToken.Parameters<chain>,
): Promise<getToken.ReturnType> {
  const { addressOrSymbol } = parameters
  const tokens = await getTokens(client, parameters)
  return tokens.find(getToken.predicate(addressOrSymbol))
}

export namespace getToken {
  export type Parameters<
    chain extends Chains.Chain | undefined = Chains.Chain | undefined,
  > = getTokens.Parameters<chain> & {
    addressOrSymbol: Token.Symbol | Address.Address
  }

  export type ReturnType = Token.Token | undefined

  export function predicate(addressOrSymbol: Token.Symbol | Address.Address) {
    return (token: Token.Token) => {
      if (!addressOrSymbol) return false
      if (Address.validate(addressOrSymbol))
        return Address.isEqual(token.address, addressOrSymbol)
      if (addressOrSymbol === 'native') return token.address === zeroAddress
      return addressOrSymbol === token.symbol
    }
  }
}

/**
 * Resolves fee tokens for a given chain. Prioritizes the provided address or symbol,
 * or the default fee token stored in state.
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Fee tokens.
 */
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

  const feeTokens = await getTokens(client, { chain: chain! })
  // TODO: uncomment
  // .then((tokens) =>
  //   tokens.filter((token) => token.feeToken),
  // )
  const index = feeTokens?.findIndex((feeToken) => {
    if (overrideFeeToken) {
      if (overrideFeeToken === 'native') return feeToken.address === zeroAddress
      if (Address.validate(overrideFeeToken))
        return Address.isEqual(feeToken.address, overrideFeeToken)
      return overrideFeeToken === feeToken.symbol
    }
    if (defaultFeeToken) {
      if (defaultFeeToken === 'native') return feeToken.address === zeroAddress
      return defaultFeeToken === feeToken.symbol
    }
    return feeToken.address === zeroAddress
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
