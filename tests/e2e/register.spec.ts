import { test } from '../fixtures/base.fixture';
import { testData, uniqueEmail } from '../../utils/testData.util';

test('Registration page should load successfully', async ({ registrationPage }) => {
  await registrationPage.open();
  await registrationPage.verifyPageLoaded();
});

test('User should navigate from Registration page to Sign In page', async ({ registrationPage, signInPage }) => {
  await registrationPage.open();
  await registrationPage.goToSignInPage();
  await signInPage.verifyPageLoaded();
});

test('User should be able to register', async ({ registrationPage }) => {
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
