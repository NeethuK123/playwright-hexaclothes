import { test } from '../fixtures/base.fixture';

test('Sign-in page should load successfully', async ({ signInPage }) => {
  await signInPage.open();
  await signInPage.verifyPageLoaded();
});

test('User should navigate from Sign In page to Registration page', async ({ signInPage, registrationPage }) => {
  await signInPage.open();
  await signInPage.goToRegistrationPage();
  await registrationPage.verifyPageLoaded();
});

test('User should be able to sign in', async ({ authUtil, signInPage }) => {
  const user = await authUtil.registerNewUser();

  await signInPage.open();
  await signInPage.signIn(user.email, user.password);
  await signInPage.expectSignedIn();
});
