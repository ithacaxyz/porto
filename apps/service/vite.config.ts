import ChildProcess from 'node:child_process'
import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'

const commitSha =
  ChildProcess.execSync('git rev-parse --short HEAD').toString().trim() ||
  process.env.WORKERS_CI_COMMIT_SHA?.slice(0, 7)

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(commitSha),
  },
  plugins: [cloudflare()],
  server: {
    cors: false,
  },
})
