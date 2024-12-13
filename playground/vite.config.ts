import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import resolve from 'vite-plugin-resolve'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    resolve({
      util: 'export const inspect = {}', // https://github.com/AztecProtocol/aztec-packages/issues/8881
    }),
  ],
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
