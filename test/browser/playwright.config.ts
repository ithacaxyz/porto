import { defineConfig, devices } from '@playwright/test'

/** https://playwright.dev/docs/test-configuration */
export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  reporter: process.env.CI ? 'github' : 'list',
  retries: process.env.CI ? 2 : 0,
  testDir: './',
  use: {
    baseURL: 'https://porto.localhost',
  },
  webServer: [
    {
      command: ['pnpm dev'].join(' && '),
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: !process.env.CI,
      stdout: 'ignore',
      stderr: 'pipe',
      timeout: 5_000,
    },
    {
      command: [
        'anvil',
        '--chain-id 911867',
        `--fork-url ${process.env.ODYSSEY_FORK_URL ?? 'https://911867.rpc.thirdweb.com'}`,
        '--fork-block-number 6030102',
      ].join(' '),
      url: 'http://127.0.0.1:8545',
      reuseExistingServer: !process.env.CI,
      stdout: 'ignore',
      stderr: 'pipe',
      timeout: 5_000,
    },
    {
      command: 'caddy run -c Caddyfile',
      url: 'http://localhost:2019/reverse_proxy/upstreams',
      reuseExistingServer: !process.env.CI,
      stdout: 'ignore',
      stderr: 'pipe',
      timeout: 5_000,
    },
  ],
})
