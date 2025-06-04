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
      passWithNoTests: true,
      resolveSnapshotPath: (path, ext) =>
        join(join(dirname(path), '_snapshots'), `${basename(path)}${ext}`),
      workspace: [
        {
          extends: true,
          test: {
            globalSetup: [join(__dirname, './globalSetup.ts')],
            hookTimeout: 20_000,
            include: [
              '!src/**/*.browser.test.ts',
              'src/**/*.test.ts',
              ...(env.VITE_LOCAL === 'false'
                ? ['!src/**/*ContractActions.test.ts']
                : []),
            ],
            name: 'default',
            poolOptions:
              env.VITE_LOCAL === 'false'
                ? {
                    forks: {
                      maxForks: 1,
                      singleFork: true,
                    },
                  }
                : {},
            setupFiles: [join(__dirname, './setup.ts')],
            testTimeout: 20_000,
          },
        },
        {
          extends: true,
          test: {
            browser: {
              enabled: true,
              headless: true,
              instances: [
                { browser: 'chromium' },
                { browser: 'firefox' },
                { browser: 'webkit' },
              ],
              provider: 'playwright',
              screenshotFailures: false,
            },
            globalSetup: [join(__dirname, './globalSetup.browser.ts')],
            include: ['src/**/*.browser.test.ts'],
            name: 'browser',
            testTimeout: 30_000,
          },
        },
        'apps/dialog/vite.config.ts',
      ],
    },
  }
})
