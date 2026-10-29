const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class ProductPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.pageTitle = page.getByRole('heading', { name: 'All Products', level: 1 });
    this.addToCartButtons = page.getByRole('button', { name: 'Add to Cart' });
  }

  async open() {
    await this.openHome();
    await this.goToAllProducts();
    await this.verifyPageLoaded();
  }

  async verifyPageLoaded() {
    await this.expectOnPath('/all');
    await expect(this.pageTitle).toBeVisible();
    await expect(this.addToCartButtons.first()).toBeVisible();
  }

  /** The innermost block holding both the product name and its Add to Cart button. */
  productCard(name) {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByRole('heading', { name, exact: true }) })
      .filter({ has: this.page.getByRole('button', { name: 'Add to Cart' }) })
      .last();
  }

  async verifyProductListed(name, price) {
    const card = this.productCard(name);
    await expect(card).toBeVisible();
    await expect(card).toContainText(price);
  }

  async addToCart(name) {
    await this.productCard(name).getByRole('button', { name: 'Add to Cart' }).click();
  }
}

module.exports = { ProductPage };
