import {
  http,
  type Client,
  createClient,
  fallback,
  type Transport as viem_Transport,
} from 'viem'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { type Mutate, type StoreApi, createStore } from 'zustand/vanilla'

import * as Chains from './Chains.js'
import * as Implementation from './Implementation.js'
import * as Storage from './Storage.js'
import type * as Account from './internal/account.js'
import * as Provider from './internal/provider.js'
import type { ExactPartial } from './internal/types.js'

export const defaultConfig = {
  announceProvider: true,
  chains: [Chains.odysseyTestnet],
  implementation: Implementation.local(),
  storage: Storage.idb(),
  transports: {
    [Chains.odysseyTestnet.id]: {
      default: http(),
      // relay: http('https://t9uhvbea8n.eu-central-1.awsapprunner.com'),
    },
  },
} as const satisfies Config

export type Clients<chain extends Chains.Chain = Chains.Chain> = {
  default: Client<viem_Transport, chain>
  relay: Client<viem_Transport, chain>
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
  _internal: {
    config: Config<chains>
    store: Store<chains>
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

export type State<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = {
  accounts: readonly Account.Account[]
  chain: chains[number]
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

export type Transport =
  | viem_Transport
  | { default: viem_Transport; relay?: viem_Transport | undefined }

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

  const provider = Provider.from({
    config,
    store,
  })

  return {
    destroy() {
      provider._internal.destroy()
    },
    provider,
    _internal: {
      config,
      store,
    },
  }
}

/**
 * Extracts a Viem Client from a Porto instance, and an optional chain ID.
 * By default, the Client for the current chain ID will be extracted.
 *
 * @param porto - Porto instance.
 * @param parameters - Parameters.
 * @returns Client.
 */
export function getClients<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(
  porto: { _internal: Porto<chains>['_internal'] },
  parameters: { chainId?: number | undefined } = {},
): Clients<chains[number]> {
  const { chainId } = parameters
  const { config, store } = porto._internal
  const { chains } = config

  const state = store.getState()
  const chain = chains.find((chain) => chain.id === chainId || state.chain.id)
  if (!chain) throw new Error('chain not found')

  const transport = (config.transports as Record<number, Transport>)[chain.id]
  if (!transport) throw new Error('transport not found')

  const { default: default_, relay } = (() => {
    if (typeof transport === 'object') {
      if (transport.relay)
        return {
          default: transport.default,
          relay: transport.relay,
        } as const
      return { default: transport.default, relay: undefined } as const
    }
    return { default: transport, relay: undefined } as const
  })()

  const client = (transport: viem_Transport) =>
    createClient({
      chain,
      transport,
      pollingInterval: 1_000,
    })

  return {
    default: client(default_),
    relay: relay ? client(fallback([relay, default_])) : client(default_),
  }
}
