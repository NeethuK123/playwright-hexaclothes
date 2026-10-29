const allure = require('allure-js-commons');
const { test, expect } = require('../fixtures/base.fixture');
const { CommonUtil } = require('../../utils/common.util');
const { addedToCartMessage, cartTotal, existingUser, formatPrice, testData, uniqueEmail } = require('../../utils/testData.util');

const [firstProduct, secondProduct] = testData.cart.products;

/**
 * Precondition for cart and checkout tests: a signed-in user with the JSON cart products in the cart.
 * @param {import('../../utils/auth.util').AuthUtil} authUtil
 * @param {import('../../pages/ProductPage').ProductPage} productPage
 * @param {import('../../pages/CartPage').CartPage} cartPage
 */
async function signInAndFillCart(authUtil, productPage, cartPage) {
  await authUtil.registerAndSignIn();
  await productPage.goToAllProducts();
  await productPage.verifyPageLoaded();
  for (const product of testData.cart.products) {
    await productPage.addToCart(product.name);
    await productPage.expectToast(addedToCartMessage(product.name));
  }
  await cartPage.open();
}

test.describe('Registration', () => {
  test.beforeEach(async () => {
    await allure.feature('Registration');
    await allure.severity('critical');
  });

  test('new user can register and is returned to the home page', async ({ registrationPage }) => {
    const { emailPrefix, emailDomain, name, password } = testData.users.newUser;

    await registrationPage.open();
    await registrationPage.register({
      email: uniqueEmail(emailPrefix, emailDomain),
      name,
      password,
      confirmPassword: password
    });

    await registrationPage.expectOnPath('/');
    await registrationPage.expectSignedOut();
  });

  test('registration is blocked when passwords do not match', async ({ registrationPage, page }) => {
    const { emailPrefix, emailDomain, name, password, confirmPassword } = testData.users.passwordMismatchUser;

    await registrationPage.open();
    await registrationPage.fillForm({ email: uniqueEmail(emailPrefix, emailDomain), name, password, confirmPassword });
    const message = await CommonUtil.captureDialogMessage(page, () => registrationPage.submit());

    expect(message).toBe(testData.messages.passwordMismatch);
    await registrationPage.verifyPageLoaded();
  });

  test('user can switch between Registration and Sign In pages', async ({ registrationPage, signInPage }) => {
    await registrationPage.open();
    await registrationPage.goToSignInPage();
    await signInPage.verifyPageLoaded();

    await signInPage.goToRegistrationPage();
    await registrationPage.verifyPageLoaded();
  });
});

test.describe('Sign In', () => {
  test.beforeEach(async () => {
    await allure.feature('Sign In');
    await allure.severity('blocker');
  });

  test('registered user can sign in', async ({ authUtil, signInPage }) => {
    const user = await authUtil.registerNewUser();

    await signInPage.goToSignIn();
    await signInPage.verifyPageLoaded();
    await signInPage.signIn(user.email, user.password);

    await signInPage.expectOnPath('/');
    await signInPage.expectSignedIn();
  });

  test('existing user can sign in with their account', async ({ signInPage }) => {
    const user = existingUser();
    test.skip(!user, 'Set USER_EMAIL and USER_PASSWORD in .env to run this test');

    await signInPage.open();
    await signInPage.signIn(user.email, user.password);

    await signInPage.expectOnPath('/');
    await signInPage.expectSignedIn();
  });

  test('signed-in user can sign out', async ({ authUtil, signInPage }) => {
    await authUtil.registerAndSignIn();

    await signInPage.logout();

    await signInPage.expectSignedOut();
  });
});

test.describe('Products', () => {
  test.beforeEach(async ({ productPage }) => {
    await allure.feature('Products');
    await allure.severity('critical');
    await productPage.open();
  });

  test('All Products page lists products with their prices', async ({ productPage }) => {
    for (const product of testData.catalog) {
      await productPage.verifyProductListed(product.name, formatPrice(product.price));
    }
  });

  test('adding a product to the cart shows a confirmation', async ({ productPage }) => {
    await productPage.addToCart(firstProduct.name);

    await productPage.expectToast(addedToCartMessage(firstProduct.name));
  });
});

test.describe('Cart', () => {
  test.beforeEach(async ({ authUtil, productPage, cartPage }) => {
    await allure.feature('Cart');
    await allure.severity('critical');

    await signInAndFillCart(authUtil, productPage, cartPage);
  });

  test('added products appear in the cart with the correct summary', async ({ cartPage }) => {
    for (const product of testData.cart.products) {
      await cartPage.verifyItem(product.name, formatPrice(product.price));
    }
    await cartPage.verifySummary(testData.cart.products.length, cartTotal(testData.cart.products));
  });

  test('changing quantity updates the cart summary', async ({ cartPage }) => {
    const products = testData.cart.products;

    await cartPage.increaseQuantity(firstProduct.name);
    await cartPage.verifyItem(firstProduct.name, formatPrice(firstProduct.price), 2);
    await cartPage.verifySummary(products.length + 1, cartTotal(products, { [firstProduct.name]: 2 }));

    await cartPage.decreaseQuantity(firstProduct.name);
    await cartPage.verifyItem(firstProduct.name, formatPrice(firstProduct.price), 1);
    await cartPage.verifySummary(products.length, cartTotal(products));
  });

  test('removing a product updates the cart summary', async ({ cartPage }) => {
    await cartPage.removeItem(secondProduct.name);

    await cartPage.verifyItemNotInCart(secondProduct.name);
    await cartPage.verifyItem(firstProduct.name, formatPrice(firstProduct.price));
    await cartPage.verifySummary(1, cartTotal([firstProduct]));
  });
});

test.describe('Checkout', () => {
  test.beforeEach(async ({ authUtil, productPage, cartPage }) => {
    await allure.feature('Checkout');
    await allure.severity('blocker');

    await signInAndFillCart(authUtil, productPage, cartPage);
    await cartPage.proceedToCheckout();
  });

  test('order summary matches the cart contents', async ({ checkoutPage }) => {
    await checkoutPage.verifyPageLoaded();
    for (const product of testData.cart.products) {
      await checkoutPage.verifyOrderLine(product.name, formatPrice(product.price));
    }
    await checkoutPage.verifyOrderTotal(cartTotal(testData.cart.products));
  });

  test('user can place an order with shipping and payment details', async ({ checkoutPage }) => {
    await checkoutPage.verifyPageLoaded();
    await checkoutPage.fillShipping(testData.checkout.shipping);
    await checkoutPage.fillPayment(testData.checkout.payment);
    await checkoutPage.placeOrder();

    await checkoutPage.expectOnPath('/');
    await checkoutPage.expectSignedIn();
  });
});
