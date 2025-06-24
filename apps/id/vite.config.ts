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
            'finger-print':
              '<svg viewBox="0 0 24 24" width="1.2em" height="1.2em" class="size-7 text-blue9"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4M14 13.12c0 2.38 0 6.38-1 8.88m4.29-.98c.12-.6.43-2.3.5-3.02M2 12a10 10 0 0 1 18-6M2 16h.01m19.79 0c.2-2 .131-5.354 0-6"></path><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2m2.31 12c.21-.66.45-1.32.57-2M9 6.8a6 6 0 0 1 9 5.2v2"></path></g></svg>',
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
