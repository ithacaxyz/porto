import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { Platform } from 'react-native'

import { reactNative } from './environment.js'

WebBrowser.maybeCompleteAuthSession?.()

reactNative.environment = {
  dismissAuthSession() {
    if (Platform.OS !== 'android') WebBrowser.dismissAuthSession()
  },
  makeRedirectUri(options) {
    const path = options?.path ?? 'auth'
    const globalScheme =
      typeof globalThis !== 'undefined'
        ? (globalThis as { __PORTO_EXPO_SCHEME?: string }).__PORTO_EXPO_SCHEME
        : undefined

    const redirectOptions: AuthSession.AuthSessionRedirectUriOptions = { path }
    if (globalScheme) redirectOptions.scheme = globalScheme
    if (typeof __DEV__ !== 'undefined' && __DEV__)
      redirectOptions.preferLocalhost = true

    const uri = AuthSession.makeRedirectUri(redirectOptions)

    console.info('[ReactNativeEnvironment] makeRedirectUri', {
      path,
      preferLocalhost: redirectOptions.preferLocalhost,
      scheme: redirectOptions.scheme,
      uri,
    })

    return uri
  },
  maybeCompleteAuthSession() {
    return WebBrowser.maybeCompleteAuthSession()
  },
  async openAuthSessionAsync(url, redirectUri, options) {
    try {
      const result = await WebBrowser.openAuthSessionAsync(
        url,
        redirectUri,
        options,
      )
      console.info(
        '[ReactNativeEnvironment] openAuthSessionAsync result',
        result,
      )
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error
      console.error(errorMessage)
      throw error
    }
  },
  platform: Platform.OS,
}
