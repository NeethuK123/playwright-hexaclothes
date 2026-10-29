import { test } from '../fixtures/base.fixture';
import { addedToCartMessage, formatPrice, testData } from '../../utils/testData.util';

test('Product page should load successfully', async ({ productPage }) => {
  await productPage.open();
  await productPage.verifyPageLoaded();
});

test('User should see products with their prices on product page', async ({ productPage }) => {
  await productPage.open();
  for (const product of testData.catalog) {
    await productPage.verifyProductListed(product.name, formatPrice(product.price));
  }
});

test('User should add a product to cart from product page', async ({ productPage }) => {
  await productPage.open();
  const product = testData.cart.products[0];
  await productPage.addToCart(product.name);
  await productPage.expectToast(addedToCartMessage(product.name));
});
