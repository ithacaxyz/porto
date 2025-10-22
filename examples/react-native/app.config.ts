import type { ConfigContext, ExpoConfig } from 'expo/config'

const SCHEME = 'porto-react-native'
const BUNDLE_IDENTIFIER = `com.example.${SCHEME}`

export const expoConfig = {
  android: {
    adaptiveIcon: {
      backgroundColor: '#ffffff',
      foregroundImage: './assets/adaptive-icon.png',
    },
    edgeToEdgeEnabled: true,
    package: BUNDLE_IDENTIFIER.replaceAll('-', '_'),
    predictiveBackGestureEnabled: false,
  },
  experiments: {
    reactCompiler: true,
  },
  icon: './assets/icon.png',
  ios: {
    bundleIdentifier: BUNDLE_IDENTIFIER,
    config: {
      usesNonExemptEncryption: false,
    },
    supportsTablet: true,
  },
  name: SCHEME,
  newArchEnabled: true,
  orientation: 'portrait',
  plugins: ['expo-web-browser'],
  scheme: SCHEME,
  slug: SCHEME,
  splash: {
    backgroundColor: '#ffffff',
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
  },
  userInterfaceStyle: 'light',
  version: '0.0.0',
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png',
    output: 'single',
  },
} as const satisfies ExpoConfig

export default (_context: ConfigContext): ExpoConfig => expoConfig
