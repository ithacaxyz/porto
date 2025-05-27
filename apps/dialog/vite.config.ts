import ChildProcess from 'node:child_process'
import { sentryVitePlugin as SentryVitePlugin } from '@sentry/vite-plugin'
import Tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import React from '@vitejs/plugin-react'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import Mkcert from 'vite-plugin-mkcert'
import TsconfigPaths from 'vite-tsconfig-paths'

const commitSha =
  ChildProcess.execSync('git rev-parse --short HEAD').toString().trim() ||
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)

// https://vitejs.dev/config/
export default defineConfig({
  base: '/dialog/',
  build: {
    outDir: './dist/dialog',
    sourcemap: true,
  },
  define: {
    __APP_VERSION__: JSON.stringify(commitSha),
    'import.meta.env.ANVIL': process.env.ANVIL === 'true',
    'import.meta.env.VITE_FAUCET_URL':
      process.env.ANVIL === 'true'
        ? process.env.VITEST === 'true'
          ? '"http://localhost:5173/faucet"'
          : '"https://anvil.localhost:5173/faucet"'
        : process.env.VITE_FAUCET_URL,
    'import.meta.env.VITEST': process.env.VITEST === 'true',
  },
  plugins: [
    process.env.VITEST === 'true'
      ? null
      : Mkcert({
          hosts: [
            'localhost',
            'prod.localhost',
            'stg.localhost',
            'dev.localhost',
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
          project: 'porto-dialog',
        })
      : null,
    TsconfigPaths(),
    TanStackRouterVite(),
  ],
})
