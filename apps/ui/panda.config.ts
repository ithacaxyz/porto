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
  theme: { extend: {} },
})
