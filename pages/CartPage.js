const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class CartPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.cartTitle = page.getByRole('heading', { name: 'My Shopping Cart' });
    this.summary = page.getByRole('heading', { name: 'Cart Summary' }).locator('..');
    this.proceedToCheckoutButton = page.getByRole('button', { name: 'Proceed to Checkout' });
  }

  /** Opens the cart through the nav icon; a page reload would empty the cart. */
  async open() {
    await this.goToCart();
    await this.verifyPageLoaded();
  }

  async verifyPageLoaded() {
    await this.expectOnPath('/cart');
    await expect(this.cartTitle).toBeVisible();
    await expect(this.summary).toBeVisible();
  }

  /** The innermost block holding both the item name and its Remove button. */
  cartItem(name) {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByRole('heading', { name, exact: true }) })
      .filter({ has: this.page.getByRole('button', { name: 'Remove' }) })
      .last();
  }

  quantity(name) {
    return this.cartItem(name).locator('span');
  }

  async verifyItem(name, price, quantity = 1) {
    const item = this.cartItem(name);
    await expect(item).toBeVisible();
    await expect(item).toContainText(`Price: ${price}`);
    await expect(this.quantity(name)).toHaveText(String(quantity));
  }

  async verifyItemNotInCart(name) {
    await expect(this.page.getByRole('heading', { name, exact: true })).toHaveCount(0);
  }

  async increaseQuantity(name) {
    await this.cartItem(name).locator('span + button').click();
  }

  async decreaseQuantity(name) {
    await this.cartItem(name).locator('button:has(+ span)').click();
  }

  async removeItem(name) {
    await this.cartItem(name).getByRole('button', { name: 'Remove' }).click();
  }

  async verifySummary(totalItems, totalPrice) {
    const totalItemsValue = this.summary.locator('div', { hasText: 'Total Items:' }).locator('span').last();
    const totalPriceValue = this.summary.locator('div', { hasText: 'Total Price:' }).locator('span').last();
    await expect(totalItemsValue).toHaveText(String(totalItems));
    await expect(totalPriceValue).toHaveText(totalPrice);
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }
}

module.exports = { CartPage };
