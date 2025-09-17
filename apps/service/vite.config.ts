import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig, loadEnv } from 'vite'
import Mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const skipMkcert = env.SKIP_MKCERT === 'true' || mode === 'test'
  const allowedHosts = env.ALLOWED_HOSTS?.split(',') ?? []

  return {
    plugins: [
      skipMkcert
        ? null
        : Mkcert({
            hosts: ['localhost'],
          }),
      // https://developers.cloudflare.com/workers/vite-plugin
      cloudflare(),
      // TODO: Sentry
    ],
    server: {
      allowedHosts,
      cors: false,
    },
  }
})
