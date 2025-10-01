import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { Platform } from 'react-native'

import { setReactNativeEnvironment } from './environment.js'

WebBrowser.maybeCompleteAuthSession?.()

setReactNativeEnvironment({
  dismissAuthSession() {
    if (Platform.OS !== 'android') WebBrowser.dismissAuthSession()
  },
  makeRedirectUri(options) {
    const path = options?.path ?? 'auth'

    const uri = AuthSession.makeRedirectUri({
      path,
      scheme: __DEV__ ? undefined : 'porto-rn',
      useProxy: __DEV__,
    } as AuthSession.AuthSessionRedirectUriOptions)

    console.info('[ReactNativeEnvironment] makeRedirectUri', {
      path,
      uri,
      useProxy: __DEV__,
    })

    return uri
  },
  maybeCompleteAuthSession() {
    WebBrowser.maybeCompleteAuthSession()
  },
  async openAuthSessionAsync(url, redirectUri, options) {
    try {
      console.info(
        '[ReactNativeEnvironment] openAuthSessionAsync',
        url,
        redirectUri,
        options,
      )
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
      console.info('[ReactNativeEnvironment] openAuthSessionAsync error', error)
      const errorMessage = error instanceof Error ? error.message : error
      console.error(errorMessage)
      // window.close()
      throw error
    } finally {
      // window.close()
    }
  },
  platform: Platform.OS,
})
