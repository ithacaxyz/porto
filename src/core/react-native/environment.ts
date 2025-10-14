import type * as AuthSession from 'expo-auth-session'
import type * as WebBrowser from 'expo-web-browser'

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

export type AuthSessionOpenOptions = WebBrowser.AuthSessionOpenOptions

export type ReactNativeEnvironment = {
  redirectUri?:
    | {
        /**
         * the app scheme, usually defined in `app.json` / `app.config.ts`
         * run `npx uri-scheme list` to get your app's scheme
         */
        scheme: string
        /**
         * the path to redirect to
         *
         * @default '/'
         */
        path?: string
      }
    | undefined
  makeRedirectUri: typeof AuthSession.makeRedirectUri
  openAuthSessionAsync: typeof WebBrowser.openAuthSessionAsync
  dismissAuthSession: typeof WebBrowser.dismissAuthSession
  maybeCompleteAuthSession?: typeof WebBrowser.maybeCompleteAuthSession
}
