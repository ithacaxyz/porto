import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
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
