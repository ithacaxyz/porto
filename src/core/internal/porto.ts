import { type PublicRpcSchema, fallback } from 'viem'
import {
  type TransportConfig,
  createClient,
  createTransport,
  type Account as viem_Account,
  type Client as viem_Client,
  type Transport as viem_Transport,
} from 'viem'

import type * as Chains from '../Chains.js'
import type * as Implementation from '../Implementation.js'
import type { Config, Store } from '../Porto.js'
import type * as RpcSchema_relay from './relay/rpcSchema.js'

export type Client<chain extends Chains.Chain = Chains.Chain> = viem_Client<
  viem_Transport,
  chain,
  viem_Account | undefined,
  [...PublicRpcSchema, ...RpcSchema_relay.Viem]
>

export type Internal<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = {
  config: Config<chains>
  id: string
  getImplementation: () => Implementation.Implementation
  setImplementation: (i: Implementation.Implementation) => void
  store: Store<chains>
}

export type Transport =
  | viem_Transport
  | { default: viem_Transport; relay?: viem_Transport | undefined }

const clientCache = new Map<string, Client>()

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
  const { chainId } = parameters
  const { config, id, store } = porto._internal
  const { chains } = config

  const state = store.getState()
  const chain = chains.find((chain) => chain.id === chainId || state.chain.id)
  if (!chain) throw new Error('chain not found')

  const transport = (config.transports as Record<number, Transport>)[chain.id]
  if (!transport) throw new Error('transport not found')

  function getTransport(
    transport: viem_Transport,
    methods: TransportConfig['methods'],
  ): viem_Transport {
    return (config) => {
      const t = transport(config)
      return createTransport({ ...t.config, methods }, t.value)
    }
  }

  let relay: viem_Transport | undefined
  let default_: viem_Transport
  if (typeof transport === 'object') {
    default_ = transport.default
    relay = transport.relay
  } else {
    default_ = transport
  }

  const relayMethods = [
    'relay_estimateFee',
    'relay_sendAction',
    'wallet_createAccount',
    'wallet_getAccounts',
    'wallet_getKeys',
    'wallet_prepareCalls',
    'wallet_prepareCreateAccount',
    'wallet_prepareUpgradeAccount',
    'wallet_sendPreparedCalls',
    'wallet_sendTransaction',
    'wallet_upgradeAccount',
  ]

  const key = [id, chainId].filter(Boolean).join(':')
  if (clientCache.has(key)) return clientCache.get(key)!
  const client = createClient({
    chain,
    transport: relay
      ? fallback([
          getTransport(relay, {
            include: relayMethods,
          }),
          getTransport(default_, {
            exclude: ['eth_sendTransaction', ...relayMethods],
          }),
        ])
      : default_,
    pollingInterval: 1_000,
  })
  clientCache.set(key, client)
  return client
}
