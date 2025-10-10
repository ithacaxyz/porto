import { defineConfig } from '@pandacss/dev'
import { portoUiConfig } from './panda-porto-config.js'

export default defineConfig({
  ...portoUiConfig,
  include: ['./src/**/*.{ts,tsx}'],
})
