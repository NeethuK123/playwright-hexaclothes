const fs = require('fs');
const path = require('path');

const SCREENSHOT_ROOT = path.join('results', 'screenshots');

class ScreenshotUtil {
  /**
   * Saves a full-page screenshot to results/screenshots/<passed|failed>/ and
   * attaches it to the test so it shows up in the Playwright and Allure reports.
   * @param {import('@playwright/test').Page} page
   * @param {import('@playwright/test').TestInfo} testInfo
   */
  static async capture(page, testInfo) {
    const passed = testInfo.status === testInfo.expectedStatus;
    const folder = path.join(SCREENSHOT_ROOT, passed ? 'passed' : 'failed');
    fs.mkdirSync(folder, { recursive: true });

    const describePath = testInfo.titlePath.slice(1).join(' ');
    const retry = testInfo.retry ? `_retry${testInfo.retry}` : '';
    const fileName = `${describePath.replace(/[^\w]+/g, '_')}${retry}.png`;
    const filePath = path.join(folder, fileName);

    await page.screenshot({ path: filePath, fullPage: true });
    await testInfo.attach(passed ? 'Screenshot (passed)' : 'Screenshot (failed)', {
      path: filePath,
      contentType: 'image/png'
    });
  }
}

module.exports = { ScreenshotUtil, SCREENSHOT_ROOT };
