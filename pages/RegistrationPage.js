const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/**
 * @typedef {{ email: string, name: string, password: string, confirmPassword: string }} RegistrationDetails
 */

class RegistrationPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.nameInput = page.locator('#name');
    this.passwordInput = page.locator('#password');
    this.confirmPasswordInput = page.locator('#confirmPassword');
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.loginHereLink = page.getByRole('link', { name: 'Login here' });
  }

  async open() {
    await this.openHome();
    await this.goToSignIn();
    await this.page.getByRole('link', { name: 'Register here' }).click();
    await this.verifyPageLoaded();
  }

  async verifyPageLoaded() {
    await this.expectOnPath('/register');
    await expect(this.emailInput).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.registerButton).toBeVisible();
  }

  /** @param {RegistrationDetails} details */
  async fillForm(details) {
    await this.emailInput.fill(details.email);
    await this.nameInput.fill(details.name);
    await this.passwordInput.fill(details.password);
    await this.confirmPasswordInput.fill(details.confirmPassword);
  }

  async submit() {
    await this.registerButton.click();
  }

  /** @param {RegistrationDetails} details */
  async register(details) {
    await this.fillForm(details);
    await this.submit();
  }

  async goToSignInPage() {
    await this.loginHereLink.click();
  }
}

module.exports = { RegistrationPage };
