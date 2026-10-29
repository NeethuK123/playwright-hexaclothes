class CommonUtil {
  /**
   * Runs `action`, accepts the browser dialog it opens (window.alert etc.) and
   * returns the dialog's message. Fails if no dialog appears within `timeout` ms.
   * @param {import('@playwright/test').Page} page
   * @param {() => Promise<void>} action
   * @returns {Promise<string>}
   */
  static async captureDialogMessage(page, action, timeout = 10000) {
    let handler;
    const message = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`No dialog appeared within ${timeout}ms`)), timeout);
      handler = async (dialog) => {
        clearTimeout(timer);
        resolve(dialog.message());
        await dialog.accept();
      };
      page.once('dialog', handler);
    });

    try {
      await action();
      return await message;
    } finally {
      page.off('dialog', handler);
    }
  }
}

module.exports = { CommonUtil };
