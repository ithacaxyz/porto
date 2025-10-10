import ChildProcess from 'node:child_process'
import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig, loadEnv } from 'vite'
import Mkcert from 'vite-plugin-mkcert'

const commitSha =
  ChildProcess.execSync('git rev-parse --short HEAD').toString().trim() ||
  process.env.WORKERS_CI_COMMIT_SHA?.slice(0, 7)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const skipMkcert = env.SKIP_MKCERT === 'true' || mode === 'test'
  const allowedHosts = env.ALLOWED_HOSTS?.split(',') ?? []

  return {
    define: {
      __APP_VERSION__: JSON.stringify(commitSha),
    },
    plugins: [
      skipMkcert
        ? null
        : Mkcert({
            hosts: ['localhost'],
          }),
      cloudflare(),
      // TODO: Sentry
    ],
    server: {
      allowedHosts,
      cors: false,
    },
  }
})
