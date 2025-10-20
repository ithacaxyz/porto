import { cloudflare } from '@cloudflare/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    cloudflare(),
    mkcert(),
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
        name: 'pwarto',
        short_name: 'authentication-pwa',
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
    react(),
  ],
  server: {
    cors: {
      origin: '*',
    },
  },
})
