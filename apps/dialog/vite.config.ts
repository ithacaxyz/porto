import { sentryVitePlugin as SentryVitePlugin } from '@sentry/vite-plugin'
import Tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import React from '@vitejs/plugin-react'
import Icons from 'unplugin-icons/vite'
import { defineConfig, PluginOption } from 'vite'
import Mkcert from 'vite-plugin-mkcert'
import TsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    Mkcert({
      force: true,
      hosts: [
        'localhost',
        'stg.localhost',
        process.env.ANVIL === 'true' ? 'anvil.localhost' : '',
      ],
    }),
    Tailwindcss(),
    React(),
    Icons({ compiler: 'jsx', jsx: 'react' }),
    TsconfigPaths(),
    TanStackRouterVite(),
  ] satisfies PluginOption[]

  if (mode !== 'development') {
    plugins.push(
      SentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: 'ithaca',
        project: 'porto-dialog',
      }),
    )
  }
  return {
    base: '/dialog/',
    build: {
      outDir: './dist/dialog',
      sourcemap: true,
    },
    plugins,
  }
})
