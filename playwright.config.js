// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    /* Base URL allows you to use relative paths like page.goto('/') in tests */
    baseURL: 'http://localhost:5173', 
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev', // Triggers concurrently at your root
    url: 'http://localhost:5173', // Playwright waits for the frontend to be ready here
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // Gives your API and Web apps 2 minutes to boot up
  },
});