import { PortoUi } from '@porto/ui/vite-plugin'
import Tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import TsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [mkcert(), PortoUi(), Tailwindcss(), react(), TsconfigPaths()],
})
