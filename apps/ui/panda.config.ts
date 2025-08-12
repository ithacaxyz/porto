import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  exclude: [],
  include: ['./src/**/*.{ts,tsx}'],
  jsxFramework: 'react',
  jsxStyleProps: 'none',
  outdir: 'styled-system',
  prefix: 'ui',
  preflight: false, // no css reset
  presets: [],
  theme: {
    extend: {
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
})
