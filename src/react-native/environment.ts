export type AuthSessionResult = {
  type: string
  url?: string | undefined
  error?: string | undefined
}

export type ReactNativeEnvironment = {
  platform?: string | undefined
  makeRedirectUri: (options?: { path?: string | undefined }) => string
  openAuthSessionAsync: (
    url: string,
    redirectUri: string,
    options?: Record<string, unknown>,
  ) => Promise<AuthSessionResult>
  dismissAuthSession?: (() => void) | undefined
  maybeCompleteAuthSession?: (() => void) | undefined
}

let environment: ReactNativeEnvironment | undefined

export function setReactNativeEnvironment(env: ReactNativeEnvironment) {
  environment = env
}

export function getReactNativeEnvironment(): ReactNativeEnvironment {
  if (!environment)
    throw new Error(
      'React Native environment is not configured. ' +
        "Import 'porto/react-native/expo' or call setReactNativeEnvironment() with an AuthSession implementation.",
    )
  return environment
}
