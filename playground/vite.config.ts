import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { createServer } from 'prool'
import { anvil } from 'prool/instances'
import { defineConfig } from 'vite'

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
    react(),
    {
      name: 'anvil',
      async configureServer() {
        await createServer({
          instance(key) {
            return anvil({
              chainId: key,
              forkUrl: 'https://eth.merkle.io',
              hardfork: 'Prague',
              // @ts-ignore
              odyssey: true,
              loadState: resolve(import.meta.dirname, './anvil.json'),
              dumpState: resolve(import.meta.dirname, './anvil.dump.json'),
            })
          },
          port: 8545,
        }).start()
      },
    },
  ],
  server: {
    https: enableHttps ? https : undefined,
  },
})
