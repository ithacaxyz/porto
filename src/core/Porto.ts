import type * as RpcRequest from 'ox/RpcRequest'
import type * as RpcResponse from 'ox/RpcResponse'
import {
  http,
  type TransportConfig,
  createClient,
  createTransport,
  fallback,
  type Client as viem_Client,
  type Transport as viem_Transport,
} from 'viem'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { type Mutate, type StoreApi, createStore } from 'zustand/vanilla'

import * as Chains from './Chains.js'
import * as Implementation from './Implementation.js'
import * as Storage from './Storage.js'
import type * as Account from './internal/account.js'
import type * as internal from './internal/porto.js'
import * as Provider from './internal/provider.js'
import type { ExactPartial, OneOf } from './internal/types.js'

export const defaultConfig = {
  announceProvider: true,
  chains: [Chains.odysseyTestnet],
  implementation: Implementation.dialog(),
  storage: Storage.idb(),
  transports: {
    [Chains.odysseyTestnet.id]: {
      default: http(),
      relay: http('https://relay.ithaca.xyz'),
    },
  },
} as const satisfies Config

/**
 * Instantiates an Porto instance.
 *
 * @example
 * ```ts twoslash
 * import { Porto } from 'porto'
 *
 * const porto = Porto.create()
 *
 * const blockNumber = await porto.provider.request({ method: 'eth_blockNumber' })
 * ```
 */
export function create<
  chains extends readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ] = typeof defaultConfig.chains,
>(parameters?: ExactPartial<Config> | undefined): Porto<chains>
export function create(
  parameters: ExactPartial<Config> | undefined = {},
): Porto {
  const {
    announceProvider = defaultConfig.announceProvider,
    chains = defaultConfig.chains,
    implementation = defaultConfig.implementation,
    storage = defaultConfig.storage,
    transports = defaultConfig.transports,
  } = parameters

  const store = createStore(
    subscribeWithSelector(
      persist<State>(
        (_) => ({
          accounts: [],
          chain: chains[0],
          requestQueue: [],
        }),
        {
          name: 'porto.store',
          partialize(state) {
            return {
              accounts: state.accounts.map((account) => ({
                ...account,
                sign: undefined,
                keys: account.keys?.map((key) => ({
                  ...key,
                  privateKey:
                    typeof key.privateKey === 'function'
                      ? undefined
                      : key.privateKey,
                })),
              })),
              chain: state.chain,
            } as unknown as State
          },
          storage,
        },
      ),
    ),
  )
  store.persist.rehydrate()

  const config = {
    announceProvider,
    chains,
    implementation,
    storage,
    transports,
  } satisfies Config

  const internal = {
    config,
    store,
  } satisfies internal.Internal

  const provider = Provider.from(internal)

  const destroy = implementation.setup({
    internal,
  })

  return {
    destroy() {
      destroy()
      provider._internal.destroy()
    },
    provider,
    _internal: internal,
  }
}

export type Config<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = {
  /**
   * Whether to announce the provider via EIP-6963.
   * @default true
   */
  announceProvider: boolean
  /**
   * List of supported chains.
   */
  chains: chains | readonly [Chains.Chain, ...Chains.Chain[]]
  /**
   * Implementation to use.
   * @default Implementation.local()
   */
  implementation: Implementation.Implementation
  /**
   * Storage to use.
   * @default Storage.idb()
   */
  storage: Storage.Storage
  /**
   * Transport to use for each chain.
   */
  transports: Record<
    chains[number]['id'],
    Transport | { default: Transport; relay?: Transport | undefined }
  >
}

export type Porto<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = {
  destroy: () => void
  provider: Provider.Provider
  /**
   * Not part of versioned API, proceed with caution.
   * @deprecated
   */
  _internal: internal.Internal<chains>
}

export type State<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = {
  accounts: readonly Account.Account[]
  chain: chains[number]
  requestQueue: readonly QueuedRequest[]
}

export type Store<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = Mutate<
  StoreApi<State<chains>>,
  [['zustand/subscribeWithSelector', never], ['zustand/persist', any]]
>

const clientCache = new Map<number, Client>()

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
  porto: { _internal: internal.Internal<chains> },
  parameters: { chainId?: number | undefined } = {},
): Client<chains[number]> {
  const { chainId } = parameters
  const { config, store } = porto._internal
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

  if (clientCache.has(chain.id)) return clientCache.get(chain.id)!
  const client = createClient({
    chain,
    transport: relay
      ? fallback([
          getTransport(relay, { include: ['wallet_sendTransaction'] }),
          getTransport(default_, {
            exclude: ['eth_sendTransaction', 'wallet_sendTransaction'],
          }),
        ])
      : default_,
    pollingInterval: 1_000,
  })
  clientCache.set(chain.id, client)
  return client
}

export type Client<chain extends Chains.Chain = Chains.Chain> = viem_Client<
  viem_Transport,
  chain
>

export type Transport =
  | viem_Transport
  | { default: viem_Transport; relay?: viem_Transport | undefined }

export type QueuedRequest<result = unknown> = {
  request: RpcRequest.RpcRequest
} & OneOf<
  | {
      status: 'pending'
    }
  | {
      result: result
      status: 'success'
    }
  | {
      error: RpcResponse.ErrorObject
      status: 'error'
    }
>
