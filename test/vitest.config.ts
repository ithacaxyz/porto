import { join } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      porto: join(__dirname, '../src'),
    },
    globalSetup: [join(__dirname, './globalSetup.ts')],
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
    setupFiles: [join(__dirname, './setup.ts')],
    testTimeout: 10_000,
  },
})
