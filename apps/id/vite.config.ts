import ChildProcess from 'node:child_process'
import NodeFS from 'node:fs'
import NodePath from 'node:path'
import { sentryVitePlugin as SentryVitePlugin } from '@sentry/vite-plugin'
import Tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

// import React from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import Mkcert from 'vite-plugin-mkcert'
import TsconfigPaths from 'vite-tsconfig-paths'

import { Plugins } from '../~internal/vite/index'

const portoCommitSha =
  ChildProcess.execSync('git rev-parse --short HEAD').toString().trim() ||
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)

export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), '')
  const skipMkcert = env.SKIP_MKCERT === 'true'

  // don't index id.porto.sh except in production
  if (env.NODE_ENV === 'production' && env.VITE_VERCEL_ENV === 'production') {
    NodeFS.writeFileSync(
      NodePath.join(process.cwd(), 'public', 'robots.txt'),
      ['User-agent: *', 'Allow: /'].join('\n'),
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
    plugins: [
      skipMkcert
        ? null
        : Mkcert({
            hosts: ['localhost', 'anvil.localhost'],
          }),
      Tailwindcss(),
      Plugins.Icons(),
      process.env.VERCEL_ENV === 'production'
        ? SentryVitePlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: 'ithaca',
            project: 'porto-manager',
          })
        : null,
      TsconfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tanstackStart({
        customViteReactPlugin: true,
      }),
    ],
    server: {
      port: Number(env.PORT) ?? 51_74,
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
  }
})
