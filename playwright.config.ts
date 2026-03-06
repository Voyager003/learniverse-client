import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  expect: {
    timeout: 20000,
  },
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'bun run build && bun run start:e2e',
    url: 'http://localhost:3001',
    reuseExistingServer: process.env.PW_REUSE_SERVER === '1',
    timeout: 120 * 1000,
  },
});
