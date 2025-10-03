import ChildProcess from 'node:child_process'
import NodeFS from 'node:fs'
import NodePath from 'node:path'
import { cloudflare } from '@cloudflare/vite-plugin'
import { sentryVitePlugin as SentryVitePlugin } from '@sentry/vite-plugin'
import Tailwindcss from '@tailwindcss/vite'
import { tanstackStart as TanstackStart } from '@tanstack/react-start/plugin/vite'
import React from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import Mkcert from 'vite-plugin-mkcert'
import Terminal from 'vite-plugin-terminal'

import TsconfigPaths from 'vite-tsconfig-paths'

import { Plugins } from '../~internal/vite/index'

const portoCommitSha =
  ChildProcess.execSync('git rev-parse --short HEAD').toString().trim() ||
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const skipMkcert = env.SKIP_MKCERT === 'true'

  // don't index id.porto.sh except in production
  if (env.NODE_ENV === 'production' && env.VITE_VERCEL_ENV === 'production') {
    NodeFS.writeFileSync(
      NodePath.join(process.cwd(), 'public', 'robots.txt'),
      ['User-agent: *', 'Allow: /'].join('\n'),
    )
  }

  const plugins = [
    skipMkcert
      ? null
      : Mkcert({
          hosts: ['localhost', 'stg.localhost', 'anvil.localhost'],
        }),
    Tailwindcss(),
    Plugins.Icons({ autoInstall: true }),
    TsconfigPaths({
      projects: ['./tsconfig.json'],
    }),
    TanstackStart({
      server: { entry: './server.ts' },
      srcDirectory: './src',
      start: { entry: './start.tsx' },
    }),
    // must come after TanstackStart
    React(),
    cloudflare({
      viteEnvironment: {
        name: 'ssr',
      },
    }),
  ]

  if (mode === 'development') plugins.push(Terminal({ console: 'terminal' }))

  if (mode === 'production') {
    plugins.push(
      // must come last
      // @see https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/sourcemaps/uploading/vite/#configuration
      SentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        disable: process.env.VERCEL_ENV !== 'production',
        org: 'ithaca',
        project: 'porto-manager',
      }),
    )
  }

  return {
    build: {
      sourcemap: true,
    },
    define: {
      __APP_VERSION__: JSON.stringify(portoCommitSha),
      'process.env': {},
    },
    optimizeDeps: {
      include: ['react/jsx-runtime'],
    },
    plugins,
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    server: {
      proxy: {
        '/dialog/': {
          changeOrigin: true,
          rewrite: (path) => {
            console.info('rewrite', path)
            return path.replace(/^\/dialog/, '')
          },
          secure: false,
          target: 'https://localhost:5175/dialog/',
          ws: true,
        },
      },
    },
  }
})
