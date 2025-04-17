import { sentryVitePlugin as SentryVitePlugin } from '@sentry/vite-plugin'
import Tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import React from '@vitejs/plugin-react'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import Mkcert from 'vite-plugin-mkcert'
import TsconfigPaths from 'vite-tsconfig-paths'
import { getRandomPort } from './scripts/random-port'
/**
 * To automatically use a random port
 * set the USE_RANDOM_PORT environment variable to true
 *
 * reason for random port: skip cache and state from previous runs
 */
const DEVELOPMENT_PORT = (() => {
  console.info('USE_RANDOM_PORT', process.env.USE_RANDOM_PORT)
  if (process.env.USE_RANDOM_PORT !== 'true') return 5174

  const randomPort = getRandomPort()
  return randomPort || 5174
})()

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  define: {
    'process.env': {},
  },
  plugins: [
    Mkcert({
      hosts: [
        'localhost',
        'testnet.localhost',
        'stg.localhost',
        'anvil.localhost',
      ],
    }),
    Tailwindcss(),
    React(),
    Icons({ compiler: 'jsx', jsx: 'react' }),
    process.env.VERCEL_ENV === 'production'
      ? SentryVitePlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: 'ithaca',
          project: 'porto-manager',
        })
      : null,
    TsconfigPaths(),
    TanStackRouterVite(),
  ],
  server: {
    port: DEVELOPMENT_PORT,
    proxy: {
      '/dialog/': {
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dialog/, ''),
        secure: false,
        target: 'https://localhost:5175/dialog/',
        ws: true,
      },
    },
  },
})
