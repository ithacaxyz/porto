import { PortoUi } from '@porto/ui/vite-plugin'
import Tailwindcss from '@tailwindcss/vite'
import { tanstackRouter as TanStackRouterVite } from '@tanstack/router-plugin/vite'
import React from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import TsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    PortoUi(),
    Tailwindcss(),
    TsconfigPaths(),
    TanStackRouterVite(),
    React(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
