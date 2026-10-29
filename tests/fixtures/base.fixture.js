const base = require('@playwright/test');
const { RegistrationPage } = require('../../pages/RegistrationPage');
const { SignInPage } = require('../../pages/SignInPage');
const { ProductPage } = require('../../pages/ProductPage');
const { CartPage } = require('../../pages/CartPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');
const { AuthUtil } = require('../../utils/auth.util');
const { ScreenshotUtil } = require('../../utils/screenshot.util');

const test = base.test.extend({
  registrationPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },

  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  authUtil: async ({ registrationPage, signInPage }, use) => {
    await use(new AuthUtil(registrationPage, signInPage));
  },

  // Runs for every test without being requested: after the test body finishes,
  // saves a screenshot into the passed/ or failed/ folder.
  screenshotOnFinish: [
    async ({ page }, use, testInfo) => {
      await use();
      await ScreenshotUtil.capture(page, testInfo);
    },
    { auto: true }
  ]
});

module.exports = { test, expect: base.expect };
