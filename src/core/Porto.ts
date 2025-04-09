import type * as RpcRequest from 'ox/RpcRequest'
import type * as RpcResponse from 'ox/RpcResponse'
import { http } from 'viem'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { createStore, type Mutate, type StoreApi } from 'zustand/vanilla'

import * as Chains from './Chains.js'
import type * as Account from './internal/account.js'
import type * as internal from './internal/porto.js'
import * as Provider from './internal/provider.js'
import type { ExactPartial, OneOf } from './internal/types.js'
import * as Mode from './Mode.js'
import * as Storage from './Storage.js'

export const defaultConfig = {
  announceProvider: true,
  chains: [Chains.odysseyTestnet],
  mode: typeof window !== 'undefined' ? Mode.dialog() : Mode.relay(),
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
  const chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(parameters?: ExactPartial<Config<chains>> | undefined): Porto<chains>
export function create(
  parameters: ExactPartial<Config> | undefined = {},
): Porto {
  const config = {
    announceProvider:
      parameters.announceProvider ?? defaultConfig.announceProvider,
    chains: parameters.chains ?? defaultConfig.chains,
    mode: parameters.mode ?? defaultConfig.mode,
    storage: parameters.storage ?? defaultConfig.storage,
    transports: parameters.transports ?? defaultConfig.transports,
  } satisfies Config

  const store = createStore(
    subscribeWithSelector(
      persist<State>(
        (_) => ({
          accounts: [],
          chain: config.chains[0],
          requestQueue: [],
        }),
        {
          name: 'porto.store',
          partialize(state) {
            return {
              accounts: state.accounts.map((account) => ({
                ...account,
                keys: account.keys?.map((key) => ({
                  ...key,
                  privateKey:
                    typeof key.privateKey === 'function'
                      ? undefined
                      : key.privateKey,
                })),
                sign: undefined,
              })),
              chain: state.chain,
            } as unknown as State
          },
          storage: config.storage,
        },
      ),
    ),
  )
  store.persist.rehydrate()

  let mode = config.mode

  const internal = {
    config,
    getMode() {
      return mode
    },
    id: crypto.randomUUID(),
    setMode(i) {
      destroy?.()
      mode = i
      destroy = i.setup({
        internal,
      })
      return destroy
    },
    store,
  } satisfies internal.Internal

  const provider = Provider.from(internal)

  let destroy =
    mode !== null
      ? mode.setup({
          internal,
        })
      : () => {}

  return {
    _internal: internal,
    destroy() {
      destroy()
      provider._internal.destroy()
    },
    provider,
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
  chains: chains
  /**
   * Mode to use.
   * @default Mode.dialog()
   */
  mode: Mode.Mode | null
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
