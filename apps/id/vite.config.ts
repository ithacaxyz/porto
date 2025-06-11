import ChildProcess from 'node:child_process'
import NodeFS from 'node:fs'
import NodePath from 'node:path'
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
      __APP_VERSION__: JSON.stringify(commitSha),
      'process.env': {},
    },
    plugins: [
      Mkcert({
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
            project: 'porto-manager',
          })
        : null,
      TsconfigPaths(),
      TanStackRouterVite(),
    ],
    server: {
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
