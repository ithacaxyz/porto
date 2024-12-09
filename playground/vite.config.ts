import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // https://github.com/AztecProtocol/aztec-packages/issues/10184
    target: 'esnext',
  },
  optimizeDeps: {
    esbuildOptions: {
      // https://github.com/AztecProtocol/aztec-packages/issues/10184
      target: 'esnext',
    },
  },
})
