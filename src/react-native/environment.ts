import type * as AuthSession from 'expo-auth-session'
import type * as WebBrowser from 'expo-web-browser'
import type { Platform } from 'react-native'

export type ReactNativeEnvironment = {
  platform?: Platform['OS']
  redirectUri?: string
  makeRedirectUri: typeof AuthSession.makeRedirectUri
  openAuthSessionAsync: typeof WebBrowser.openAuthSessionAsync
  dismissAuthSession: typeof WebBrowser.dismissAuthSession
  maybeCompleteAuthSession?: typeof WebBrowser.maybeCompleteAuthSession
}

let environment: ReactNativeEnvironment

export function isEnvironmentConfigured(): boolean {
  return environment !== undefined
}

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
