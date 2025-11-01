import type { ConfigContext, ExpoConfig } from 'expo/config'

const SCHEME = 'porto-relay-mode'
const BUNDLE_IDENTIFIER = `com.example.${SCHEME}`

const EXPO_TUNNEL_DOMAIN = `${process.env.EXPO_TUNNEL_SUBDOMAIN || SCHEME}.ngrok.io`

const ASSOCIATED_DOMAINS = [
  `applinks:${SCHEME}`,
  `applinks:${EXPO_TUNNEL_DOMAIN}`,
  `webcredentials:${SCHEME}`,
  `webcredentials:${EXPO_TUNNEL_DOMAIN}`,
]

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL
if (SERVER_URL) {
  ASSOCIATED_DOMAINS.push(
    `applinks:${SERVER_URL.replaceAll('https://', '')}`,
    `webcredentials:${SERVER_URL.replaceAll('https://', '')}`,
  )
} else console.warn('EXPO_PUBLIC_SERVER_URL is not set')

export default (_context: ConfigContext): ExpoConfig => ({
  android: {
    adaptiveIcon: {
      backgroundColor: '#ffffff',
      foregroundImage: './assets/adaptive-icon.png',
    },
    edgeToEdgeEnabled: true,
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        category: ['BROWSABLE', 'DEFAULT'],
        data: {
          host: SERVER_URL?.replaceAll('https://', ''),
          pathPrefix: '/',
          scheme: SCHEME,
        },
      },
    ],
    package: BUNDLE_IDENTIFIER.replaceAll('-', '_'),
    predictiveBackGestureEnabled: false,
  },
  experiments: {
    autolinkingModuleResolution: true,
    reactCompiler: true,
    turboModules: true,
  },
  extra: {
    eas: {
      projectId: 'f401cb79-1e2d-4ebe-a621-2e5f13d841ac',
    },
  },
  icon: './assets/icon.png',
  ios: {
    associatedDomains: ASSOCIATED_DOMAINS,
    bundleIdentifier: BUNDLE_IDENTIFIER,
    config: {
      usesNonExemptEncryption: false,
    },
    supportsTablet: true,
  },
  name: SCHEME,
  newArchEnabled: true,
  orientation: 'portrait',
  owner: 'ithaca',
  plugins: [
    ['expo-web-browser', { experimentalLauncherActivity: true }],
    ['expo-dev-client', { launchMode: 'most-recent' }],
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 36,
        },
        ios: {
          deploymentTarget: '26.0',
        },
      },
    ],
  ],
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
})
