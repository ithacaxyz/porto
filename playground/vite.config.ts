import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // headers to enable multithreaded proving
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  build: {
    target: 'esnext', // https://github.com/AztecProtocol/aztec-packages/issues/10184
  },
  optimizeDeps: {
    exclude: ['@noir-lang/noirc_abi', '@noir-lang/acvm_js'],
    esbuildOptions: {
      target: 'esnext', // https://github.com/AztecProtocol/aztec-packages/issues/10184
    },
  },
})
