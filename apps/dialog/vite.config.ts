import ChildProcess from 'node:child_process'
import { sentryVitePlugin as SentryVitePlugin } from '@sentry/vite-plugin'
import Tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import React from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import Mkcert from 'vite-plugin-mkcert'
import TsconfigPaths from 'vite-tsconfig-paths'

import { Plugins } from '../~internal/vite/index'

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
      'import.meta.env.FORCE_REDUCED_MOTION':
        process.env.FORCE_REDUCED_MOTION === 'true',
      'import.meta.env.VITE_WORKERS_URL':
        process.env.ANVIL === 'true'
          ? mode === 'test'
            ? '"http://localhost:5173"'
            : '"https://anvil.localhost:5173"'
          : JSON.stringify(
              env.VITE_WORKERS_URL ?? 'https://service.porto.workers.dev',
            ),
    },
    plugins: [
      skipMkcert
        ? null
        : Mkcert({
            hosts: ['localhost', 'stg.localhost', 'anvil.localhost'],
          }),
      Tailwindcss(),
      React(),
      Plugins.Icons(),
      TsconfigPaths(),
      TanStackRouterVite(),
      // must come last
      // @see https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/sourcemaps/uploading/vite/#configuration
      SentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        disable: process.env.VERCEL_ENV !== 'production',
        org: 'ithaca',
        project: 'porto-dialog',
      }),
    ],
    server: {
      allowedHosts,
    },
  }
})
