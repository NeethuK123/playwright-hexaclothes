const testData = require('../tests/data/testData.json');

/** @typedef {{ name: string, price: number }} Product */

/** Returns an email address that has not been used before, so registration can run repeatedly. */
function uniqueEmail(prefix, domain) {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return `${prefix}.${suffix}@${domain}`;
}

/** Formats a number the way the site shows prices, e.g. 42.98 -> "$42.98". */
function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

/**
 * Sums the given products, counting each one `quantities[name]` times (default 1).
 * @param {Product[]} products
 * @param {Record<string, number>} [quantities]
 */
function cartTotal(products, quantities = {}) {
  const total = products.reduce((sum, p) => sum + p.price * (quantities[p.name] ?? 1), 0);
  return formatPrice(total);
}

function addedToCartMessage(productName) {
  return `${productName} ${testData.messages.addedToCartSuffix}`;
}

/**
 * The existing account's credentials, read from .env (USER_EMAIL / USER_PASSWORD)
 * so they are never committed. Returns null when they are not set.
 * @returns {{ email: string, password: string } | null}
 */
function existingUser() {
  const { USER_EMAIL: email, USER_PASSWORD: password } = process.env;
  return email && password ? { email, password } : null;
}

module.exports = { testData, uniqueEmail, formatPrice, cartTotal, addedToCartMessage, existingUser };
