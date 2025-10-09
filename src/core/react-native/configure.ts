import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { Platform } from 'react-native'

import {
  isEnvironmentConfigured,
  type ReactNativeEnvironment,
  reactNative,
} from './environment.js'
import { isReactNative } from './utils.js'

export function configureReactNativeEnvironment() {
  if (isEnvironmentConfigured()) return reactNative.environment

  WebBrowser.maybeCompleteAuthSession()

  const environment = {
    dismissAuthSession() {
      if (Platform.OS !== 'android') WebBrowser.dismissAuthSession()
    },
    makeRedirectUri: AuthSession.makeRedirectUri,
    maybeCompleteAuthSession: WebBrowser.maybeCompleteAuthSession,
    openAuthSessionAsync: WebBrowser.openAuthSessionAsync,
  } satisfies ReactNativeEnvironment

  reactNative.environment = environment
  return environment
}

if (isReactNative() && !isEnvironmentConfigured())
  configureReactNativeEnvironment()
