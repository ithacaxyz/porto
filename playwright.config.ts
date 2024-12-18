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
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  testDir: './test/browser',
  use: {
    baseURL: 'https://porto.localhost',
  },
  webServer: {
    command:
      'caddy start -c test/browser/Caddyfile && pnpm --filter browser-app dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 5_000,
  },
  // workers: process.env.CI ? 1 : undefined,
})
