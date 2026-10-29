const { defineConfig, devices } = require('@playwright/test');
const dotenv = require('dotenv');
const os = require('os');

dotenv.config({ quiet: true });

const baseURL = process.env.BASE_URL;
if (!baseURL) {
  throw new Error('BASE_URL is not set. Copy .env.example to .env and set BASE_URL.');
}

module.exports = defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.js',
  timeout: 60000,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          Base_URL: baseURL,
          OS: `${os.platform()} ${os.release()}`,
          Node: process.version
        }
      }
    ]
  ],
  use: {
    baseURL,
    headless: true,
    // Playwright's failure screenshot, video and trace are attached to both the HTML
    // and Allure reports. ScreenshotUtil additionally saves passed/failed screenshots
    // to results/screenshots/ (see tests/fixtures/base.fixture.js).
    screenshot: 'only-on-failure',
    video: 'on',
    trace: 'on',
    actionTimeout: 15000,
    navigationTimeout: 30000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
