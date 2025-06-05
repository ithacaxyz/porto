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
    Icons({
      compiler: 'jsx',
      customCollections: {
        porto: {
          'scan-face':
            '<svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.125 3.125H4.375C3.4085 3.125 2.625 3.9085 2.625 4.875V6.625" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.875 3.125H16.625C17.5915 3.125 18.375 3.9085 18.375 4.875V6.625" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 7.5V9.25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 7.5V9.25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.875 14.5C7.875 14.5 8.75 15.375 10.5 15.375C12.25 15.375 13.125 14.5 13.125 14.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 7.5V11.875H9.625" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.125 18.875H4.375C3.4085 18.875 2.625 18.0915 2.625 17.125V15.375" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.875 18.875H16.625C17.5915 18.875 18.375 18.0915 18.375 17.125V15.375" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
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
})
