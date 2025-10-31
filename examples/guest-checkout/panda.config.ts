import { defineConfig } from '@pandacss/dev'
import { portoUiConfig } from '@porto/ui/panda-config'

export default defineConfig({
  ...portoUiConfig,
  include: ['./src/**/*.{ts,tsx}', '../../apps/ui/src/**/*.{ts,tsx}'],
})
