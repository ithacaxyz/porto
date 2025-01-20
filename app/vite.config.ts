import Tailwindcss from '@tailwindcss/vite'
import React from '@vitejs/plugin-react'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [React(), Tailwindcss(), Icons({ compiler: 'jsx', jsx: 'react' })],
})
