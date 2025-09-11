import * as Address from 'ox/Address'
import { type Client, type Transport, zeroAddress } from 'viem'
import type { GetChainParameter } from '../../viem/internal/utils.js'
import * as RelayActions from '../../viem/RelayActions.js'
import type * as Chains from '../Chains.js'
import type { State, Store } from '../Porto.js'
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
 * Resolves the fee token to use. Resolves the provided address or symbol,
 * or the defaults to the fee token stored in state.
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Fee token.
 */
export async function resolveFeeToken<chain extends Chains.Chain | undefined>(
  client: Client<Transport, chain>,
  parameters?: resolveFeeToken.Parameters<chain> | undefined,
): Promise<resolveFeeToken.ReturnType> {
  const { chain = client.chain, store } = parameters ?? {}
  const state = (store?.getState() ?? {}) as State
  const addressOrSymbol = parameters?.addressOrSymbol ?? state.feeToken

  const feeTokens = await getTokens(client, { chain: chain! }).then((tokens) =>
    tokens.filter((token) => token.feeToken),
  )
  const feeToken = feeTokens?.find((feeToken) => {
    if (!addressOrSymbol) return false
    if (addressOrSymbol === 'native' && feeToken.address === zeroAddress)
      return true
    if (
      Address.validate(addressOrSymbol) &&
      Address.isEqual(feeToken.address, addressOrSymbol)
    )
      return true
    return addressOrSymbol === feeToken.symbol
  })

  return feeToken
}

export declare namespace resolveFeeToken {
  export type Parameters<
    chain extends Chains.Chain | undefined = Chains.Chain | undefined,
  > = getTokens.Parameters<chain> & {
    /**
     * Fee token to resolve.
     */
    addressOrSymbol?: Token.Symbol | Address.Address | undefined
    /**
     * Porto store.
     */
    store?: Store<any> | undefined
  }

  export type ReturnType = Token.Token | undefined
}
