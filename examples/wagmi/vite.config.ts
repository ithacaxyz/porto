import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const https = {
  key: resolve(import.meta.dirname, '../../localhost-key.pem'),
  cert: resolve(import.meta.dirname, '../../localhost.pem'),
} as const
const enableHttps = existsSync(https.cert) && existsSync(https.key)

// https://vite.dev/config/
export default defineConfig({
  define:
    process.env.NODE_ENV === 'development'
      ? {
          'import.meta.env.VITE_DIALOG_HOST': JSON.stringify(
            (enableHttps ? 'https' : 'http') + '://localhost:5174/dialog',
          ),
        }
      : undefined,
  plugins: [react()],
})
