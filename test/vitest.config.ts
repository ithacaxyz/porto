import { basename, dirname, join } from 'node:path'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const defaultEnv = (() => {
    if (env.VITE_DEFAULT_ENV) return env.VITE_DEFAULT_ENV
    if (env.RPC_URL?.includes('sepolia')) return 'stg'
    if (env.RPC_URL?.includes('mainnet')) return 'prod'
    return 'anvil'
  })()

  return {
    define: {
      'import.meta.env.VITE_DEFAULT_ENV': JSON.stringify(defaultEnv),
    },
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
            exclude: [
              '**/*.yaml',
              'src/**/*.browser.test.ts',
              ...(env.VITE_DEFAULT_ENV !== 'anvil'
                ? ['src/**/*ContractActions.test.ts']
                : []),
            ],
            globalSetup: [join(__dirname, './globalSetup.ts')],
            hookTimeout: 20_000,
            include: ['src/**/*.test.ts'],
            name: 'default',
            poolOptions:
              env.VITE_DEFAULT_ENV !== 'anvil'
                ? {
                    forks: {
                      maxForks: 1,
                      singleFork: true,
                    },
                  }
                : {},
            retry: 3,
            setupFiles: [join(__dirname, './setup.ts')],
            testTimeout: 30_000,
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
