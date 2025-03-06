import { join } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      porto: join(__dirname, '../src'),
    },
    coverage: {
      all: false,
      include: ['**/src/**'],
      provider: 'v8',
      reporter: process.env.CI ? ['lcov'] : ['text', 'json', 'html'],
    },
    globalSetup: [join(__dirname, './globalSetup.ts')],
    include: ['src/**/*.test.ts'],
    // TODO(relay_old): remove
    exclude: ['src/core/internal/relay_old'],
    passWithNoTests: true,
    setupFiles: [join(__dirname, './setup.ts')],
    testTimeout: 30_000,
  },
})
