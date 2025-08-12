import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    mkcert({
      hosts: [
        'localhost',
        'prod.localhost',
        'stg.localhost',
        'dev.localhost',
        'anvil.localhost',
      ],
    }),
  ],
})
