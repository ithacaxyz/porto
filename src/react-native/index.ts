import * as Environment from './environment.js'

export * from './environment.js'
export * as Porto from './Porto.js'
export * from './types.js'
export * from './utils.js'

import { isReactNative } from './utils.js'

export const configure = () =>
  void import('./expo.js')
    .then(({ configureExpoEnvironment }) => configureExpoEnvironment())
    .catch((error) => {
      console.error(
        [
          '[porto:react-native] Expo environment not configured',
          'You need to import the configuration entrypoint at the top of your app',
          "import 'porto/react-native/expo'",
          'then import `Porto` and the rest',
        ].join('\n'),
        error,
      )
    })

if (isReactNative() && !Environment.isEnvironmentConfigured()) configure()
