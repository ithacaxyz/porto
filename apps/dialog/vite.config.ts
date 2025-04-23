import { sentryVitePlugin as SentryVitePlugin } from '@sentry/vite-plugin'
import Tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import React from '@vitejs/plugin-react'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import Mkcert from 'vite-plugin-mkcert'
import TsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/dialog/',
  build: {
    outDir: './dist/dialog',
    sourcemap: true,
  },
  plugins: [
    Mkcert({
      hosts: ['localhost', 'dev.localhost', 'stg.localhost', 'anvil.localhost'],
    }),
    Tailwindcss(),
    React(),
    Icons({ compiler: 'jsx', jsx: 'react' }),
    process.env.VERCEL_ENV === 'production'
      ? SentryVitePlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: 'ithaca',
          project: 'porto-dialog',
        })
      : null,
    TsconfigPaths(),
    TanStackRouterVite(),
  ],
})
