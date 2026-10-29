import { test } from '../fixtures/base.fixture';
import { cartTotal, formatPrice, testData } from '../../utils/testData.util';

test.beforeEach(async ({ authUtil, productPage, cartPage }) => {
  await authUtil.registerAndSignIn();
  await productPage.goToAllProducts();
  for (const product of testData.cart.products) {
    await productPage.addToCart(product.name);
  }
  await cartPage.open();
});

test('Cart page should load successfully', async ({ cartPage }) => {
  await cartPage.verifyPageLoaded();
});

test('User should see cart items on cart page', async ({ cartPage }) => {
  for (const product of testData.cart.products) {
    await cartPage.verifyItem(product.name, formatPrice(product.price));
  }
});

test('User should see correct cart summary', async ({ cartPage }) => {
  await cartPage.verifySummary(
    testData.cart.products.length,
    cartTotal(testData.cart.products)
  );
});
