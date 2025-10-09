import './crypto.js'
import {
  isEnvironmentConfigured,
  isReactNative,
} from '../core/react-native/index.js'

export const configure = () =>
  void import('../core/react-native/configure.js')
    .then(({ configureReactNativeEnvironment }) =>
      configureReactNativeEnvironment(),
    )
    .catch((error) => {
      console.error(
        [
          '[porto:react-native] React Native environment not configured',
          'You need to import the configuration entrypoint at the top of your app',
          "import 'porto/react-native/configure'",
          'then import `Porto` and the rest',
        ].join('\n'),
        error,
      )
    })

if (isReactNative() && !isEnvironmentConfigured()) configure()
