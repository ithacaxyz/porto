import ChildProcess from 'node:child_process'
import { stylex } from '@stylex-extend/vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const commitSha =
  ChildProcess.execSync('git rev-parse --short HEAD').toString().trim() ||
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const allowedHosts = env.ALLOWED_HOSTS?.split(',') ?? []

  return {
    define: {
      __APP_VERSION__: JSON.stringify(commitSha),
    },
    plugins: [stylex(), react(), tailwindcss()],
    server: {
      allowedHosts,
    },
  }
})
