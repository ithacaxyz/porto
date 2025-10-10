import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [mkcert(), react()],
  ...(mode === 'development'
    ? {
        resolve: {
          conditions: ['src'],
        },
      }
    : {}),
}))
