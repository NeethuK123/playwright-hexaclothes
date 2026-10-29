const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class SignInPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('form').getByRole('button', { name: 'Login' });
    this.registerHereLink = page.getByRole('link', { name: 'Register here' });
  }

  async open() {
    await this.openHome();
    await this.goToSignIn();
    await this.verifyPageLoaded();
  }

  async verifyPageLoaded() {
    await this.expectOnPath('/login');
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async signIn(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async goToRegistrationPage() {
    await this.registerHereLink.click();
  }
}

module.exports = { SignInPage };
