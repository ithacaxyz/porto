import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  include: ['./src/**/*.{ts,tsx}'],
  jsxFramework: 'react',
  jsxStyleProps: 'none',
  prefix: 'ui',
  preflight: false,
  presets: [],
  theme: {
    extend: {
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
