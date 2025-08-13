import type * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import type * as RpcRequest from 'ox/RpcRequest'
import type * as RpcResponse from 'ox/RpcResponse'
import { http, type Transport, type ValueOf } from 'viem'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { createStore, type Mutate, type StoreApi } from 'zustand/vanilla'
import type * as Account from '../viem/Account.js'
import * as Chains from './Chains.js'
import { hostUrls } from './Dialog.js'
import type * as Mode from './internal/mode.js'
import { dialog } from './internal/modes/dialog.js'
import { rpcServer } from './internal/modes/rpcServer.js'
import type * as internal from './internal/porto.js'
import * as Provider from './internal/provider.js'
import type * as FeeToken from './internal/schema/feeToken.js'
import type * as Rpc from './internal/schema/rpc.js'
import type * as Siwe from './internal/siwe.js'
import type { ExactPartial, OneOf } from './internal/types.js'
import * as Utils from './internal/utils.js'
import * as Storage from './Storage.js'
import { relayUrls } from './Transport.js'

const browser = typeof window !== 'undefined' && typeof document !== 'undefined'

export const defaultConfig = {
  announceProvider: true,
  chains: [Chains.baseSepolia, Chains.optimismSepolia],
  mode: browser ? dialog() : rpcServer(),
  relay: http(relayUrls.stg.http),
  storage: browser ? Storage.idb() : Storage.memory(),
  storageKey: 'porto.store',
  transports: {
    [Chains.baseSepolia.id]: http(),
    [Chains.optimismSepolia.id]: http(),
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
    authUrl: parameters.authUrl,
    chains,
    feeToken: parameters.feeToken,
    merchantRpcUrl: parameters.merchantRpcUrl,
    mode: parameters.mode ?? defaultConfig.mode,
    relay: parameters.relay ?? defaultConfig.relay,
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
          merge(p, currentState) {
            const persistedState = p as State

            // Ensure that the persisted chain id is still exists in the current
            // configuration.
            const persistedChain = config.chains.find(
              (chain) => chain.id === persistedState.chainId,
            )
            const chainId = persistedChain?.id ?? currentState.chainId

            return {
              ...currentState,
              ...persistedState,
              chainId,
            }
          },
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
    config,
    destroy() {
      destroy()
      provider._internal.destroy()
    },
    provider,
  }
}

/**
 * Instantiates an Porto instance with future defaults (mainnet configuration).
 *
 * WARNING: This is not recommended for production use yet, and will become
 * stable in a future release.
 *
 * @example
 * ```ts twoslash
 * import { Porto } from 'porto'
 *
 * const porto = Porto.unstable_create()
 *
 * const blockNumber = await porto.provider.request({ method: 'eth_blockNumber' })
 * ```
 */
export function unstable_create<
  const chains extends readonly [Chains.Chain, ...Chains.Chain[]],
>(parameters?: ExactPartial<Config<chains>> | undefined): Porto<chains>
export function unstable_create(
  parameters: ExactPartial<Config> | undefined = {},
): Porto {
  return create({
    chains: [Chains.base],
    mode: browser ? dialog({ host: hostUrls.prod }) : rpcServer(),
    relay: http(relayUrls.prod.http),
    storageKey: 'prod.porto.store',
    transports: {
      [Chains.base.id]: http(),
    },
    ...parameters,
  })
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
   * API URL(s) to use for offchain SIWE authentication.
   */
  authUrl?: string | Siwe.AuthUrl | undefined
  /**
   * List of supported chains.
   */
  chains: chains
  /**
   * Token to use to pay for fees.
   * @default 'USDC'
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
   * Relay RPC Transport override.
   */
  relay: Transport
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
   * Public RPC Transport overrides to use for each chain.
   */
  transports: Record<chains[number]['id'], Transport>
}

export type Porto<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = {
  config: Config<chains>
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
  /** Account to assert the request for, and sync if neccessary. */
  account:
    | {
        /** Address of the account. */
        address: Address.Address
        /** Active key of the account. */
        key?:
          | {
              /** Credential ID. May be `undefined` when the key is not a WebAuthn credential. */
              credentialId?: string | undefined
              /** Public key */
              publicKey: Hex.Hex
            }
          | undefined
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

declare module 'viem' {
  interface Register {
    CapabilitiesSchema: {
      getCapabilities: {
        ReturnType: ValueOf<Rpc.wallet_getCapabilities.Response_encoded>
      }
      sendCalls: {
        Request: Rpc.wallet_sendCalls.Capabilities_encoded
      }
    }
  }
}
