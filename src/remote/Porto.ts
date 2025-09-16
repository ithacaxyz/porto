import type * as RpcRequest from 'ox/RpcRequest'
import { createStore, type StoreApi } from 'zustand/vanilla'

import type * as Chains from '../core/Chains.js'
import type { ExactPartial, OneOf } from '../core/internal/types.js'
import * as Messenger from '../core/Messenger.js'
import * as Mode from '../core/Mode.js'
import * as Porto_ from '../core/Porto.js'
import type * as RpcSchema from '../core/RpcSchema.js'
import * as Storage from '../core/Storage.js'
import { hostnames } from '../trusted-hosts.js'
import * as MethodPolicies from './internal/methodPolicies.js'

const messenger = (() => {
  if (typeof window === 'undefined') return Messenger.noop()

  const url = new URL(window.location.href)
  const relayUrl = url.searchParams.get('relayUrl')
  if (relayUrl) return Messenger.cliRelay({ relayUrl })

  return Messenger.bridge({
    from: Messenger.fromWindow(window),
    to: Messenger.fromWindow(window.opener ?? window.parent),
  })
})() as Messenger.Bridge | Messenger.Messenger

export const defaultConfig = {
  ...Porto_.defaultConfig,
  messenger,
  methodPolicies: MethodPolicies.methodPolicies,
  mode: Mode.relay(),
  storage: Storage.localStorage(),
  trustedHosts: hostnames,
} as const satisfies Partial<Config>

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
  const chains extends readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ] = typeof defaultConfig.chains,
>(parameters?: ExactPartial<Config<chains>> | undefined): Porto<chains>
export function create(
  parameters: ExactPartial<Config> | undefined = {},
): Porto {
  const {
    chains = defaultConfig.chains,
    feeToken,
    mode = defaultConfig.mode,
    messenger = defaultConfig.messenger,
    methodPolicies = defaultConfig.methodPolicies,
    merchantUrl,
    relay = defaultConfig.relay,
    storage = defaultConfig.storage,
    storageKey = defaultConfig.storageKey,
    transports,
    trustedHosts = defaultConfig.trustedHosts,
  } = parameters

  const porto = Porto_.create({
    announceProvider: false,
    chains,
    feeToken,
    merchantUrl,
    mode,
    relay,
    storage,
    storageKey,
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
    methodPolicies,
    mode,
    async ready() {
      await porto._internal.store.persist.rehydrate()
      const { chainIds } = porto._internal.store.getState()

      if (!('ready' in messenger)) return
      return (messenger as Messenger.WithReady).ready({
        chainIds,
        methodPolicies,
        trustedHosts,
      })
    },
  } as unknown as Porto
}

export type Porto<
  chains extends readonly [Chains.Chain, ...Chains.Chain[]] = readonly [
    Chains.Chain,
    ...Chains.Chain[],
  ],
> = Porto_.Porto<chains> & {
  mode: Mode.Mode
  messenger: OneOf<Messenger.WithReady | Messenger.Messenger>
  methodPolicies?: MethodPolicies.MethodPolicies | undefined
  ready: () => Promise<void>
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
  messenger?: OneOf<Messenger.Bridge | Messenger.Messenger> | undefined
  methodPolicies?: MethodPolicies.MethodPolicies | undefined
  trustedHosts?: string[] | undefined
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
