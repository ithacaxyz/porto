import { PortoConfig } from '@porto/apps'
import { Mode, Storage } from 'porto'
import { Porto } from 'porto/remote'

import { isReactNativeRequest } from './ReactNative.js'

const baseConfig = PortoConfig.getConfig()
const { mode: baseMode, ...restConfig } = baseConfig

const reactNativeHost = (() => {
  if (typeof window === 'undefined' || !isReactNativeRequest()) return undefined
  const current = new URL(window.location.href)
  current.pathname = current.pathname.replace(/\/[\w-]+$/, '/')
  const preserved = new URLSearchParams()
  const allowed = new Set(['relayEnv'])
  for (const [key, value] of current.searchParams.entries()) {
    if (allowed.has(key)) preserved.set(key, value)
  }
  current.search = preserved.toString()
  current.hash = ''
  return current.toString()
})()

const mode = isReactNativeRequest()
  ? Mode.reactNative({
      ...(baseMode ? { fallback: baseMode } : {}),
      ...(reactNativeHost ? { host: reactNativeHost } : {}),
    })
  : baseMode

export const porto = Porto.create({
  ...restConfig,
  mode,
  storage: Storage.combine(Storage.cookie(), Storage.localStorage()),
})
