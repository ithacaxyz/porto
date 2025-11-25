import { cloudflare } from '@cloudflare/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'

import packageJson from './package.json' with { type: 'json' }

export default defineConfig((config) => ({
  plugins: [
    react(),
    mkcert(),
    cloudflare(),
    VitePWA({
      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
      injectRegister: false,
      manifest: {
        description:
          'An example showcasing authentication with SIWE and Porto in a PWA',
        name: packageJson.name,
        short_name: packageJson.name,
        theme_color: '#ffffff',
      },
      pwaAssets: {
        config: true,
        disabled: false,
      },
      registerType: 'prompt',
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
  server: {
    cors: {
      origin: config.mode === 'development' ? '*' : 'https://id.porto.sh',
    },
  },
}))
