import type * as Address from 'ox/Address'
import type * as RpcRequest from 'ox/RpcRequest'
import type * as RpcResponse from 'ox/RpcResponse'
import { http, type Transport } from 'viem'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { createStore, type Mutate, type StoreApi } from 'zustand/vanilla'
import type * as Account from '../viem/Account.js'
import * as Chains from './Chains.js'
import type * as internal from './internal/porto.js'
import * as Provider from './internal/provider.js'
import type * as FeeToken from './internal/typebox/feeToken.js'
import type { ExactPartial, OneOf } from './internal/types.js'
import * as Utils from './internal/utils.js'
import * as Mode from './Mode.js'
import * as Storage from './Storage.js'

const browser = typeof window !== 'undefined' && typeof document !== 'undefined'

export const defaultConfig = {
  announceProvider: true,
  chains: [Chains.baseSepolia],
  feeToken: 'EXP',
  mode: browser ? Mode.dialog() : Mode.rpcServer(),
  storage: browser ? Storage.idb() : Storage.memory(),
  storageKey: 'porto.store',
  transports: {
    [Chains.baseSepolia.id]: http(),
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
  const chains = parameters.chains ?? defaultConfig.chains
  const transports = Object.fromEntries(
    chains!.map((chain) => [
      chain.id,
      parameters.transports?.[chain.id] ?? http(),
    ]),
  )

  const config = {
    announceProvider:
      parameters.announceProvider ?? defaultConfig.announceProvider,
    chains,
    feeToken: parameters.feeToken ?? defaultConfig.feeToken,
    merchantRpcUrl: parameters.merchantRpcUrl,
    mode: parameters.mode ?? defaultConfig.mode,
    storage: parameters.storage ?? defaultConfig.storage,
    storageKey: parameters.storageKey ?? defaultConfig.storageKey,
    transports,
  } satisfies Config

  const store = createStore(
    subscribeWithSelector(
      persist<State>(
        (_) => ({
          accounts: [],
          chainId: config.chains[0].id,
          feeToken: config.feeToken,
          requestQueue: [],
        }),
        {
          name: config.storageKey,
          partialize(state) {
            return {
              accounts: state.accounts.map((account) =>
                // omit non-serializable properties (e.g. functions).
                Utils.normalizeValue(account),
              ),
              chainId: state.chainId,
              feeToken: state.feeToken,
            } as unknown as State
          },
          storage: config.storage,
          version: 2,
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
   * Token to use to pay for fees.
   * @default 'ETH'
   */
  feeToken?: State['feeToken'] | undefined
  /**
   * Mode to use.
   * @default Mode.dialog()
   */
  mode: Mode.Mode | null
  /**
   * URL to use for merchant functionality.
   */
  merchantRpcUrl?: string | undefined
  /**
   * Storage to use.
   * @default Storage.idb()
   */
  storage: Storage.Storage
  /**
   * Key to use for store.
   */
  storageKey?: string | undefined
  /**
   * Transport overrides to use for each chain.
   */
  transports: Record<chains[number]['id'], Transport>
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
  chainId: chains[number]['id']
  feeToken: FeeToken.Symbol | undefined
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

export type QueuedRequest<result = unknown> = {
  account:
    | {
        address: Address.Address
        credentialId?: string | undefined
      }
    | undefined
  request: RpcRequest.RpcRequest & { _internal?: unknown }
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
