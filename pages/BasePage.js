const { expect } = require('@playwright/test');

/**
 * Shared navigation and assertions available on every page.
 *
 * The site is a single-page app hosted on Netlify without SPA redirects, so deep
 * links such as `/cart` return 404. Navigation must therefore start at `/` and
 * continue through the app's own links. A full reload also empties the cart,
 * which is held in memory only.
 */
class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.loginNavButton = page.locator('nav a[href="/login"] button');
    this.logoutButton = page.locator('nav').getByRole('button', { name: 'Logout' });
    this.profileLink = page.locator('nav a[href="/profile"]');
    this.cartNavLink = page.locator('nav a[href="/cart"]');
    this.allProductsLink = page.getByRole('link', { name: 'All Products', exact: true });
    this.toasts = page.getByRole('alert');
  }

  async openHome() {
    await this.page.goto('/');
  }

  async goToSignIn() {
    await this.loginNavButton.click();
  }

  async goToAllProducts() {
    await this.allProductsLink.click();
  }

  async goToCart() {
    await this.cartNavLink.click();
  }

  async logout() {
    await this.logoutButton.click();
  }

  async expectOnPath(path) {
    await expect(this.page).toHaveURL((url) => url.pathname === path);
  }

  async expectSignedIn() {
    await expect(this.logoutButton).toBeVisible();
    await expect(this.profileLink).toBeVisible();
    await expect(this.loginNavButton).toBeHidden();
  }

  async expectSignedOut() {
    await expect(this.loginNavButton).toBeVisible();
    await expect(this.logoutButton).toBeHidden();
  }

  async expectToast(message) {
    await expect(this.toasts.filter({ hasText: message }).first()).toBeVisible();
  }
}

module.exports = { BasePage };
