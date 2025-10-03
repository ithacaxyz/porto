import type { ReactNativeEnvironment } from './types.js'

let environment: ReactNativeEnvironment

export const isEnvironmentConfigured = () => environment !== undefined

export const reactNative = {
  get environment() {
    if (!environment)
      throw new Error('React Native environment is not configured')
    return environment
  },
  set environment(env) {
    environment = env
  },
} satisfies {
  environment: ReactNativeEnvironment
}

export * from './types.js'
