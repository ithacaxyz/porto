import type * as RpcRequest from 'ox/RpcRequest'
import type * as RpcResponse from 'ox/RpcResponse'
import { http } from 'viem'
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
    id: crypto.randomUUID(),
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
   * @default Implementation.dialog()
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

export type Transport = internal.Transport

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
