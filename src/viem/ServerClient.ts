import * as Json from 'ox/Json'
import { fallback, http, type Transport } from 'viem'
import { createClient, type Client as viem_Client } from 'viem'
import type * as Chains from '../core/Chains.js'
import type { Internal } from '../core/internal/porto.js'
import type { Account } from './Account.js'
import type * as RpcSchema from './RpcSchema.js'

export type ServerClient<
  transport extends Transport = Transport,
  chain extends Chains.Chain = Chains.Chain,
  account extends Account | undefined = Account | undefined,
> = viem_Client<transport, chain, account, RpcSchema.Server>

const clientCache = new Map<string, any>()

/**
 * Extracts a Viem Client from a Porto instance, and an optional chain ID.
 * By default, the Client for the current chain ID will be extracted.
 *
 * @param porto - Porto instance.
 * @param parameters - Parameters.
 * @returns Client.
 */
export function fromPorto<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(
  porto: { _internal: Internal<chains> },
  parameters: { chainId?: number | undefined } = {},
): ServerClient<Transport, chains[number]> {
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
