import {
  configure,
  isEnvironmentConfigured,
  isReactNative,
  Porto,
} from '../core/react-native/index.js'

/**
 * React Native entrypoint
 * @see https://reactnative.dev/docs/platform-specific-code#native-specific-extensions-ie-sharing-code-with-nodejs-and-web
 **/
export * as Mode from '../core/Mode.js'
export { Porto }

if (isReactNative() && !isEnvironmentConfigured()) configure()
