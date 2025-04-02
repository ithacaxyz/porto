import { basename, dirname, join } from 'node:path'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
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
      include: [
        'src/**/*.test.ts',
        ...(env.VITE_ANVIL === 'false' ? ['!src/**/*delegation.test.ts'] : []),
      ],
      passWithNoTests: true,
      poolOptions:
        env.VITE_ANVIL === 'false'
          ? {
              forks: {
                maxForks: 1,
                singleFork: true,
              },
            }
          : {},
      resolveSnapshotPath: (path, ext) =>
        join(join(dirname(path), '_snapshots'), `${basename(path)}${ext}`),
      setupFiles: [join(__dirname, './setup.ts')],
      testTimeout: 30_000,
    },
  }
})
