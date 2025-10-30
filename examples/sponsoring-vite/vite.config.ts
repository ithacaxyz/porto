import { cloudflare } from '@cloudflare/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig((config) => {
  return {
    plugins: [react(), cloudflare(), mkcert()],
    server: {
      cors: {
        origin: config.mode === 'development' ? '*' : 'https://id.porto.sh',
      },
      port: 22753,
    },
  }
})
