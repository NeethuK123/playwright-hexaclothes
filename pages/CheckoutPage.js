const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

/**
 * @typedef {{ firstName: string, lastName: string, email: string, address: string,
 *   city: string, postalCode: string, country: string }} ShippingDetails
 * @typedef {{ cardNumber: string, cardholderName: string, expiry: string, cvc: string }} PaymentDetails
 */

class CheckoutPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.pageTitle = page.getByRole('heading', { name: 'Checkout', level: 1 });
    this.orderSummary = page.getByRole('heading', { name: 'Order Summary' }).locator('..');
    this.shippingSection = page.getByRole('heading', { name: 'Shipping Information' }).locator('..');
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
  }

  async verifyPageLoaded() {
    await this.expectOnPath('/checkout');
    await expect(this.pageTitle).toBeVisible();
    await expect(this.orderSummary).toBeVisible();
  }

  orderLine(label) {
    return this.orderSummary.locator('div').filter({ has: this.page.getByText(label, { exact: true }) });
  }

  async verifyOrderLine(name, price) {
    await expect(this.orderLine(name)).toContainText(price);
  }

  async verifyOrderTotal(total) {
    await expect(this.orderLine('Total')).toContainText(total);
  }

  /** @param {ShippingDetails} details */
  async fillShipping(details) {
    await this.page.getByPlaceholder('First Name').fill(details.firstName);
    await this.page.getByPlaceholder('Last Name').fill(details.lastName);
    await this.page.getByPlaceholder('Email Address').fill(details.email);
    await this.page.getByPlaceholder('Address', { exact: true }).fill(details.address);
    await this.page.getByPlaceholder('City').fill(details.city);
    await this.page.getByPlaceholder('Postal Code').fill(details.postalCode);
    await this.shippingSection.locator('select').selectOption(details.country);
  }

  /** @param {PaymentDetails} details */
  async fillPayment(details) {
    await this.page.getByPlaceholder('Card Number').fill(details.cardNumber);
    await this.page.getByPlaceholder('Cardholder Name').fill(details.cardholderName);
    await this.page.getByPlaceholder('MM/YY').fill(details.expiry);
    await this.page.getByPlaceholder('CVC').fill(details.cvc);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}

module.exports = { CheckoutPage };
