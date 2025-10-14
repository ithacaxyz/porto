import type { ConfigContext, ExpoConfig } from 'expo/config'

const HOSTNAME = 'porto-relay-mode.app'
const SCHEME = 'porto-relay-mode'
const BUNDLE_IDENTIFIER = `com.example.${SCHEME}`

const EXPO_TUNNEL_DOMAIN = `${process.env.EXPO_TUNNEL_SUBDOMAIN || SCHEME}.ngrok.io`

const ASSOCIATED_DOMAINS = [
  `applinks:${HOSTNAME}`,
  `applinks:${EXPO_TUNNEL_DOMAIN}`,
  `webcredentials:${HOSTNAME}`,
  `webcredentials:${EXPO_TUNNEL_DOMAIN}`,
]

const SERVER_DOMAIN = process.env.EXPO_PUBLIC_SERVER_DOMAIN
if (SERVER_DOMAIN) {
  ASSOCIATED_DOMAINS.push(
    `applinks:${SERVER_DOMAIN}`,
    `webcredentials:${SERVER_DOMAIN}`,
  )
} else console.warn('\n\n\nEXPO_PUBLIC_SERVER_DOMAIN is not set\n\n\n')

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
  plugins: [
    ['expo-web-browser'],
    ['expo-dev-client', { launchMode: 'most-recent' }],
    [
      'expo-build-properties',
      {
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
} satisfies ExpoConfig

export default (_context: ConfigContext): ExpoConfig => expoConfig
