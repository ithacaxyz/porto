import React from '@vitejs/plugin-react-swc'
import Dts from 'unplugin-dts/vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import TsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: ['./src/index.ts'],
      formats: ['es'],
    },
    outDir: './dist',
    rollupOptions: {
      external: [
        '@react-spring/web',
        'react',
        'react-dom',
        'react/jsx-runtime',
      ],
      output: {
        dir: 'dist',
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
    sourcemap: true,
  },
  plugins: [
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
    React(),
    TsconfigPaths(),
    Dts({ exclude: ['styled-system'] }),
  ],
})
