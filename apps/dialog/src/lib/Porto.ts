import { PortoConfig } from '@porto/apps'
import * as Provider from 'ox/Provider'
import { Mode, Storage } from 'porto'
import { Porto } from 'porto/remote'

import * as ReactNative from './ReactNative.js'

export const accountCreationEnabled = import.meta.env.DEV
export const accountCreationDisabledReason = 'Porto is deprecated.'

const baseConfig = PortoConfig.getConfig()
const { mode: baseMode, ...restConfig } = baseConfig

const mode = ReactNative.isReactNativeRequest()
  ? Mode.reactNative({
      ...(baseMode ? { fallback: baseMode } : {}),
      ...(ReactNative.reactNativeHost
        ? { host: ReactNative.reactNativeHost }
        : {}),
    })
  : baseMode

export const porto = Porto.create({
  ...restConfig,
  mode,
  storage: Storage.combine(Storage.cookie(), Storage.localStorage()),
})

if (!accountCreationEnabled) {
  const request = porto.provider.request.bind(porto.provider)
  porto.provider.request = ((rpcRequest) => {
    const capabilities =
      rpcRequest.method === 'wallet_connect'
        ? (
            rpcRequest as typeof rpcRequest & {
              params?: readonly [
                {
                  capabilities?: {
                    createAccount?: unknown
                    email?: unknown
                  }
                },
              ]
            }
          ).params?.[0]?.capabilities
        : undefined
    if (
      rpcRequest.method === 'wallet_prepareUpgradeAccount' ||
      capabilities?.createAccount ||
      capabilities?.email
    )
      return Promise.reject(
        new Provider.UnauthorizedError({
          message: accountCreationDisabledReason,
        }),
      )
    return request(rpcRequest as never)
  }) as typeof porto.provider.request
}

if (
  ReactNative.isReactNativeRequest() &&
  ReactNative.reactNativePreferredChainIds.length > 0
)
  porto._internal.store.setState((state) => {
    const nextChainIds = ReactNative.reorderChainIds({
      current: state.chainIds,
      preferred: ReactNative.reactNativePreferredChainIds,
    })
    if (ReactNative.arraysEqual(state.chainIds, nextChainIds)) return state
    return { ...state, chainIds: nextChainIds }
  })
