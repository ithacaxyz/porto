import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import Tailwindcss from '@tailwindcss/vite'
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
  define:
    process.env.NODE_ENV === 'development'
      ? {
          'import.meta.env.VITE_DIALOG_HOST': JSON.stringify(
            (enableHttps ? 'https' : 'http') + '://localhost:5174/dialog',
          ),
        }
      : undefined,
  plugins: [
    Tailwindcss(),
    React(),
    Icons({ compiler: 'jsx', jsx: 'react' }),
    TsconfigPaths(),
  ],
  server: {
    https: enableHttps ? https : undefined,
  },
})
