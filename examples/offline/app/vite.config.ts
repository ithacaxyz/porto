import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig((_) => {
  return {
    plugins: [
      sveltekit(),
      tailwindcss(),
      nodePolyfills({
        include: ['stream'],
        globals: { process: true, Buffer: true, global: true },
      }),
    ],
  }
})
