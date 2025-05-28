import * as Json from 'ox/Json'
import {
  custom,
  fallback,
  http,
  type PublicRpcSchema,
  type Transport,
} from 'viem'
import {
  createClient,
  type Account as viem_Account,
  type Client as viem_Client,
} from 'viem'

import type * as Chains from '../Chains.js'
import type * as Mode from '../Mode.js'
import type { Config, Store } from '../Porto.js'
import type * as RpcSchema from '../RpcSchema.js'
import type * as Provider from './provider.js'
import type * as RpcSchema_server from './rpcServer/rpcSchema.js'

export type Client<chain extends Chains.Chain = Chains.Chain> = viem_Client<
  Transport,
  chain,
  viem_Account | undefined,
  [...PublicRpcSchema, ...RpcSchema_server.Viem]
>

export type ProviderClient<chain extends Chains.Chain = Chains.Chain> =
  viem_Client<
    Transport,
    chain,
    viem_Account | undefined,
    [...PublicRpcSchema, ...RpcSchema.Viem]
  >

export type Internal<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = {
  config: Config<chains>
  id: string
  getMode: () => Mode.Mode
  setMode: (i: Mode.Mode) => void
  store: Store<chains>
}

const clientCache = new Map<string, Client<any>>()

/**
 * Extracts a Viem Client from a Porto instance, and an optional chain ID.
 * By default, the Client for the current chain ID will be extracted.
 *
 * @param porto - Porto instance.
 * @param parameters - Parameters.
 * @returns Client.
 */
export function getClient<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(
  porto: { _internal: Internal<chains> },
  parameters: { chainId?: number | undefined } = {},
): Client<chains[number]> {
  const { config, id, store } = porto._internal
  const { chains } = config

  const state = store.getState()
  const chainId = parameters.chainId ?? state.chainId
  const chain = chains.find((chain) => chain.id === chainId)
  if (!chain) throw new Error('chain not found')

  const transport =
    (config.transports as Record<number, Transport>)[chain.id] ??
    fallback(chain.rpcUrls.default.http.map((url) => http(url)))
  if (!transport) throw new Error('transport not found')

  const key = [id, Json.stringify(chain)].filter(Boolean).join(':')
  if (clientCache.has(key)) return clientCache.get(key)!
  const client = createClient({
    chain,
    pollingInterval: 1_000,
    transport,
  })
  clientCache.set(key, client)
  return client
}

/**
 * Extracts a Viem Client from a Porto EIP-1193 Provider instance.
 *
 * @param porto - Porto instance.
 * @returns Client.
 */
export function getProviderClient<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(porto: {
  _internal: Internal<chains>
  provider: Provider.Provider
}): ProviderClient<chains[number]> {
  const { provider } = porto
  const { id } = porto._internal

  const key = ['provider', id].filter(Boolean).join(':')
  if (clientCache.has(key)) return clientCache.get(key)!
  const client = createClient({
    pollingInterval: 1_000,
    transport: custom(provider),
  })
  clientCache.set(key, client)
  return client as never
}
