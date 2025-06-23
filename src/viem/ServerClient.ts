import * as Json from 'ox/Json'
import {
  type ClientConfig,
  createClient,
  fallback,
  http,
  type Transport,
  type Client as viem_Client,
} from 'viem'
import type * as Chains from '../core/Chains.js'
import type { Internal } from '../core/internal/porto.js'
import type * as Account from './Account.js'
import type * as RpcSchema from './RpcSchema.js'

export type ServerClient<
  transport extends Transport = Transport,
  chain extends Chains.Chain = Chains.Chain,
  account extends Account.Account | undefined = Account.Account | undefined,
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
  account extends Account.Account | undefined = undefined,
>(
  porto: { _internal: Internal<chains> },
  config: fromPorto.Config<chains, account> = {},
): ServerClient<Transport, chains[number], account> {
  const { config: config_, id, store } = porto._internal
  const { chains } = config_

  const state = store.getState()
  const chainId = config.chainId ?? state.chainId
  const chain = chains.find((chain) => chain.id === chainId)
  if (!chain) throw new Error('chain not found')

  const transport =
    (config_.transports as Record<number, Transport>)[chain.id] ??
    fallback(chain.rpcUrls.default.http.map((url) => http(url)))
  if (!transport) throw new Error('transport not found')

  const key = [id, Json.stringify(chain)].filter(Boolean).join(':')
  if (clientCache.has(key)) return clientCache.get(key)!
  const client = createClient({
    ...config,
    chain,
    pollingInterval: 1_000,
    transport,
  })
  clientCache.set(key, client)
  return client as never
}

export declare namespace fromPorto {
  type Config<
    chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
      Chains.Chain,
      ...Chains.Chain[],
    ],
    account extends Account.Account | undefined = Account.Account | undefined,
  > = Pick<
    ClientConfig<Transport, Chains.Chain | undefined, account>,
    'account' | 'cacheTime' | 'key' | 'name' | 'pollingInterval'
  > & {
    chainId?: chains[number]['id'] | undefined
  }
}
