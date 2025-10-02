import {
  configure,
  isEnvironmentConfigured,
  isReactNative,
} from './react-native/index.js'

/**
 * React Native entrypoint
 * @see https://reactnative.dev/docs/platform-specific-code#native-specific-extensions-ie-sharing-code-with-nodejs-and-web
 **/
export * as Mode from './core/Mode.js'
export { Porto } from './react-native/index.js'

if (isReactNative() && !isEnvironmentConfigured()) configure()
