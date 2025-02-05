import type * as RpcRequest from 'ox/RpcRequest'
import { type StoreApi, createStore } from 'zustand/vanilla'

import type * as Chains from '../core/Chains.js'
import * as Implementation from '../core/Implementation.js'
import * as Messenger from '../core/Messenger.js'
import * as Porto_ from '../core/Porto.js'
import type * as RpcSchema from '../core/RpcSchema.js'
import * as Storage from '../core/Storage.js'
import type { ExactPartial } from '../core/internal/types.js'

export type Porto<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = Porto_.Porto<chains> & {
  implementation: Implementation.Implementation
  messenger: Messenger.Bridge
  ready: () => void
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
  implementation: Implementation.local(),
  messenger:
    typeof window !== 'undefined'
      ? Messenger.bridge({
          from: Messenger.fromWindow(window),
          to: Messenger.fromWindow(window.opener ?? window.parent),
        })
      : Messenger.noop(),
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
    implementation = defaultConfig.implementation,
    messenger = defaultConfig.messenger,
    storage = defaultConfig.storage,
    transports = defaultConfig.transports,
  } = parameters

  const porto = Porto_.create({
    announceProvider: false,
    chains,
    implementation,
    storage,
    transports,
  })

  const remoteStore = createStore<RemoteState>(() => ({
    requests: [],
  }))

  return {
    ...porto,
    implementation,
    messenger,
    ready: messenger.ready,
    _internal: {
      ...porto._internal,
      remoteStore,
    },
  } as unknown as Porto
}
