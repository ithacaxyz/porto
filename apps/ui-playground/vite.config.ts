import Tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import React from '@vitejs/plugin-react-swc'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import TsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
    Tailwindcss(),
    React(),
    TsconfigPaths(),
    TanStackRouterVite(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
