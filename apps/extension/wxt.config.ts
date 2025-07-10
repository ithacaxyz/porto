import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'Porto',
  },
  vite: () => ({
    build: {
      rollupOptions: {
        external: ['wxt/utils/storage'],
      },
    },
  }),
})
