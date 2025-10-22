import { PortoConfig } from '@porto/apps'
import { Mode, Storage } from 'porto'
import { Porto } from 'porto/remote'

import * as ReactNative from './ReactNative.js'

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
