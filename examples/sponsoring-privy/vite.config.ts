import { cloudflare } from '@cloudflare/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), '')

  return {
    plugins: [react(), cloudflare(), mkcert()],
    server: {
      cors: {
        origin: '*',
      },
      port: Number(env.PORT ?? 69_69),
    },
  }
})
