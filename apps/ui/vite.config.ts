import * as path from 'node:path'
import React from '@vitejs/plugin-react-swc'
import Dts from 'unplugin-dts/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
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
      external: ['porto', 'react', 'react-dom', 'react/jsx-runtime'],
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
      customCollections: {
        chains: FileSystemIconLoader(
          path.resolve(__dirname, './src/ChainIcon/icons'),
        ),
      },
      jsx: 'react',
    }),
    React(),
    TsconfigPaths(),
    Dts({ exclude: ['styled-system'] }),
  ],
})
