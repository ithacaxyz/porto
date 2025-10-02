import * as Environment from './environment.js'
import { isReactNative } from './utils.js'

if (isReactNative() && !Environment.isEnvironmentConfigured()) {
  void import('./expo.js')
    .then(({ configureExpoEnvironment }) => configureExpoEnvironment())
    .catch((error) => {
      if (typeof __DEV__ !== 'undefined' && __DEV__)
        console.warn(
          '[ReactNativeEnvironment] Failed to auto-configure Expo environment',
          error,
        )
    })
}

export * from './environment.js'
export * as Porto from './Porto.js'
