import ChildProcess from 'node:child_process'
import { sentryVitePlugin as SentryVitePlugin } from '@sentry/vite-plugin'
import Tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import React from '@vitejs/plugin-react'
import Icons from 'unplugin-icons/vite'
import { defineConfig, loadEnv } from 'vite'
import Mkcert from 'vite-plugin-mkcert'
import TsconfigPaths from 'vite-tsconfig-paths'

const commitSha =
  ChildProcess.execSync('git rev-parse --short HEAD').toString().trim() ||
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const skipMkcert = env.SKIP_MKCERT === 'true' || mode === 'test'
  const allowedHosts = env.ALLOWED_HOSTS?.split(',') ?? []

  return {
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
          ? mode === 'test'
            ? '"http://localhost:5173/faucet"'
            : '"https://anvil.localhost:5173/faucet"'
          : process.env.VITE_FAUCET_URL,
    },
    plugins: [
      skipMkcert
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
      Icons({
        compiler: 'jsx',
        customCollections: {
          porto: {
            'scan-face':
              '<svg viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.125 3.125H4.375C3.4085 3.125 2.625 3.9085 2.625 4.875V6.625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.875 3.125H16.625C17.5915 3.125 18.375 3.9085 18.375 4.875V6.625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 7.5V9.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 7.5V9.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.875 14.5C7.875 14.5 8.75 15.375 10.5 15.375C12.25 15.375 13.125 14.5 13.125 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 7.5V11.875H9.625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.125 18.875H4.375C3.4085 18.875 2.625 18.0915 2.625 17.125V15.375" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.875 18.875H16.625C17.5915 18.875 18.375 18.0915 18.375 17.125V15.375" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          },
        },
        jsx: 'react',
      }),
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
    server: {
      allowedHosts,
    },
  }
})
