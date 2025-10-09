import {
  isEnvironmentConfigured,
  isReactNative,
} from '../core/react-native/index.js'
import { configure } from './register.js'

if (isReactNative() && !isEnvironmentConfigured()) configure()

/**
 * React Native entrypoint
 * @see https://reactnative.dev/docs/platform-specific-code#native-specific-extensions-ie-sharing-code-with-nodejs-and-web
 **/
export * as Mode from '../core/Mode.js'
export * from '../core/react-native/index.js'
export * as Porto from '../core/react-native/Porto.js'
