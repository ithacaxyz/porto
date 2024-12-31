import { join } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globalSetup: [join(__dirname, './globalSetup.ts')],
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
    setupFiles: [join(__dirname, './setup.ts')],
  },
})
