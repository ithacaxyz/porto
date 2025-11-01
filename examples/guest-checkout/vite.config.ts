import { cloudflare } from '@cloudflare/vite-plugin'
import Tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import TsconfigPaths from 'vite-tsconfig-paths'
import Icons from 'unplugin-icons/vite'
import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    cloudflare(),
    mkcert(),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
    {
      name: 'panda-cssgen',
      buildStart() {
        execSync('panda cssgen', { cwd: process.cwd(), stdio: 'inherit' })
      },
    },
    {
      name: 'styled-system-alias',
      config() {
        return {
          resolve: {
            alias: {
              'styled-system': path.resolve(__dirname, './styled-system'),
            },
          },
        }
      },
    },
    Tailwindcss(),
    react(),
    TsconfigPaths(),
  ],
  server: {
    port: 14624,
  },
})
