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
      animationStyles: {
        spin: {
          value: {
            animation: 'spin 1s linear infinite',
          },
        },
      },
      keyframes: {
        'arc-pulse': {
          '0%, 100%': { strokeDashoffset: 'var(--arc-offset-min)' },
          '50%': { strokeDashoffset: 'var(--arc-offset-max)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
})
