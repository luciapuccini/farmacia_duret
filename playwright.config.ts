import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: 'playwright-report/raw',
  // applies to every test’s browser context => goto(baseUrl)
  use: { baseURL: 'http://localhost:4173' },
  webServer: {
    //builds and previews rather than running the dev server. Why: preview mode is closer to production
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report/html' }],
    ['json', { outputFile: 'playwright-report/report.json' }],
    ['list'],
  ],
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
