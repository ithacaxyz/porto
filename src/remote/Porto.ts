import type * as RpcRequest from 'ox/RpcRequest'
import { createStore, type StoreApi } from 'zustand/vanilla'

import type * as Chains from '../core/Chains.js'
import type { ExactPartial } from '../core/internal/types.js'
import * as Messenger from '../core/Messenger.js'
import * as Mode from '../core/Mode.js'
import * as Porto_ from '../core/Porto.js'
import type * as RpcSchema from '../core/RpcSchema.js'
import * as Storage from '../core/Storage.js'

export type Porto<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = Porto_.Porto<chains> & {
  mode: Mode.Mode
  messenger: Messenger.Bridge
  ready: Messenger.Bridge['ready']
  _internal: Porto_.Porto<chains>['_internal'] & {
    remoteStore: StoreApi<RemoteState>
  }
}

export type Config<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = Porto_.Config<chains> & {
  messenger?: Messenger.Bridge | undefined
}

export type State<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = Porto_.State<chains>

export type RemoteState = {
  requests: readonly (Porto_.QueuedRequest & {
    request: RpcRequest.RpcRequest<RpcSchema.Schema>
  })[]
}

export const defaultConfig = {
  ...Porto_.defaultConfig,
  messenger:
    typeof window !== 'undefined'
      ? Messenger.bridge({
          from: Messenger.fromWindow(window),
          to: Messenger.fromWindow(window.opener ?? window.parent),
        })
      : Messenger.noop(),
  mode: Mode.contract(),
  storage: Storage.localStorage(),
} as const satisfies Config

/**
 * Instantiates an Porto instance to be used in a remote context (e.g. an iframe or popup).
 *
 * @example
 * ```ts twoslash
 * import { Porto } from 'porto/remote'
 * const porto = Porto.create()
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
    chains = defaultConfig.chains,
    mode = defaultConfig.mode,
    messenger = defaultConfig.messenger,
    storage = defaultConfig.storage,
    transports = defaultConfig.transports,
  } = parameters

  const porto = Porto_.create({
    announceProvider: false,
    chains,
    mode,
    storage,
    transports,
  })

  const remoteStore = createStore<RemoteState>(() => ({
    requests: [],
  }))

  return {
    ...porto,
    _internal: {
      ...porto._internal,
      remoteStore,
    },
    messenger,
    mode,
    ready: messenger.ready,
  } as unknown as Porto
}
