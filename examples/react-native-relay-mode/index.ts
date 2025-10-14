// Polyfills Web Crypto APIs for React Native (Android, iOS)
import 'porto/react-native/register'

import { registerRootComponent } from 'expo'

import App from './src/App.tsx'

registerRootComponent(App)
