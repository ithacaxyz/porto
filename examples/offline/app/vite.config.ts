import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'

export default defineConfig((_) => {
  return {
    plugins: [sveltekit(), tailwindcss()],
    optimizeDeps: {
      exclude: ['react'],
    },
    build: {
      rollupOptions: {
        external: ['react'],
      },
    },
  }
})
