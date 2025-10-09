import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    mkcert({
      hosts: ['localhost', 'stg.localhost', 'anvil.localhost'],
    }),
  ],
  ...(mode === 'development'
    ? {
        resolve: {
          conditions: ['src'],
        },
      }
    : {}),
}))
