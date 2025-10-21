// Polyfills Web Crypto APIs for React Native (Android, iOS)
import 'porto/react-native/register'
import 'porto/react-native/crypto'

import { registerRootComponent } from 'expo'

import App from './src/App.tsx'

registerRootComponent(App)
