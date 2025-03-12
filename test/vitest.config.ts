import { basename, dirname, join } from 'node:path'
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
    passWithNoTests: true,
    resolveSnapshotPath: (path, ext) =>
      join(join(dirname(path), '_snapshots'), `${basename(path)}${ext}`),
    setupFiles: [join(__dirname, './setup.ts')],
    testTimeout: 30_000,
  },
})
