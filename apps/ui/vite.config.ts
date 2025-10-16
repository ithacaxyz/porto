import React from '@vitejs/plugin-react-swc'
import Dts from 'unplugin-dts/vite'
import { defineConfig } from 'vite'
import TsconfigPaths from 'vite-tsconfig-paths'
import { PortoUi } from './vite-plugin.js'

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
        'porto',
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@ariakit/react',
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
    PortoUi({ bundle: true }),
    React(),
    TsconfigPaths(),
    Dts({ exclude: ['styled-system'] }),
  ],
})
