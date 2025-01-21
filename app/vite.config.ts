import Tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import React from '@vitejs/plugin-react'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    Tailwindcss(),
    TanStackRouterVite(),
    React(),
    Icons({ compiler: 'jsx', jsx: 'react' }),
  ],
})
