import type * as AuthSession from 'expo-auth-session'
import type * as WebBrowser from 'expo-web-browser'
import type { Platform } from 'react-native'

export type AuthSessionResult = AuthSession.AuthSessionResult

export type ReactNativeEnvironment = {
  platform?: Platform['OS']
  makeRedirectUri: typeof AuthSession.makeRedirectUri
  openAuthSessionAsync: typeof WebBrowser.openAuthSessionAsync
  dismissAuthSession?: typeof WebBrowser.dismissAuthSession
  maybeCompleteAuthSession?: typeof WebBrowser.maybeCompleteAuthSession
}

let environment: ReactNativeEnvironment

export const reactNative = {
  get environment() {
    if (!environment)
      throw new Error(
        'React Native environment is not configured. ' +
          "Import 'porto/react-native/expo' or call setReactNativeEnvironment() with an AuthSession implementation.",
      )
    return environment
  },
  set environment(env: ReactNativeEnvironment) {
    environment = env
  },
}
