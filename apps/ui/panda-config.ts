import type { Config } from '@pandacss/dev'

export const portoUiConfig = {
  jsxFramework: 'react',
  jsxStyleProps: 'none',
  prefix: 'ui',
  preflight: false,
  presets: [],
  include: ['./node_modules/@porto/ui/src/**/*.{ts,tsx}'],
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
} as const satisfies Partial<Config>
