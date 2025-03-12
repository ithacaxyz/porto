import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import Tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import React from '@vitejs/plugin-react'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import TsconfigPaths from 'vite-tsconfig-paths'

const https = {
  key: resolve(import.meta.dirname, '../localhost-key.pem'),
  cert: resolve(import.meta.dirname, '../localhost.pem'),
} as const
const enableHttps = existsSync(https.cert) && existsSync(https.key)

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: enableHttps ? https : undefined,
  },
  define: {
    'process.env': {},
  },
  plugins: [
    Tailwindcss(),
    TanStackRouterVite(),
    React(),
    Icons({ compiler: 'jsx', jsx: 'react' }),
    TsconfigPaths(),
  ],
})
