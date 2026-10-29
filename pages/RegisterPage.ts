import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  readonly emailInput;
  readonly nameInput;
  readonly passwordInput;
  readonly confirmPasswordInput;
  readonly registerButton;
  readonly loginHereLink;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.nameInput = page.locator('#name');
    this.passwordInput = page.locator('#password');
    this.confirmPasswordInput = page.locator('#confirmPassword');
    this.registerButton = page.locator('button[type="submit"]');
    this.loginHereLink = page.locator('a[href="/login"]', { hasText: 'Login here' });
  }

  async open() {
    await this.goto('/');
    await this.page.locator('a[href="/register"] button').click();
    await this.page.locator('a[href="/register"]').click();
  }

  async register(user: {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
  }) {
    await this.fill(this.emailInput, user.email);
    await this.fill(this.nameInput, user.name);
    await this.fill(this.passwordInput, user.password);
    await this.fill(this.confirmPasswordInput, user.confirmPassword);
    await this.click(this.registerButton);
  }

  async verifyRegisterPageLoaded() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
  }

  async goToLogin() {
    await this.click(this.loginHereLink);
  }
}
