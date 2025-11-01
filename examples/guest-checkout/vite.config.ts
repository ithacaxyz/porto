import { cloudflare } from '@cloudflare/vite-plugin'
import { PortoUi } from '@porto/ui/vite-plugin'
import Tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import TsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    cloudflare(),
    mkcert(),
    PortoUi(),
    Tailwindcss(),
    react(),
    TsconfigPaths(),
  ],
  server: {
    port: 14624,
  },
})
