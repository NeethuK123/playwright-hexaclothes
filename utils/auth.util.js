const { test } = require('@playwright/test');
const { testData, uniqueEmail } = require('./testData.util');

/** @typedef {{ email: string, name: string, password: string }} UserCredentials */

/** Reusable registration and sign-in flows used as preconditions by other tests. */
class AuthUtil {
  /**
   * @param {import('../pages/RegistrationPage').RegistrationPage} registrationPage
   * @param {import('../pages/SignInPage').SignInPage} signInPage
   */
  constructor(registrationPage, signInPage) {
    this.registrationPage = registrationPage;
    this.signInPage = signInPage;
  }

  /**
   * Builds a new user from the JSON test data with a unique email.
   * @returns {UserCredentials}
   */
  static buildNewUser() {
    const { emailPrefix, emailDomain, name, password } = testData.users.newUser;
    return { email: uniqueEmail(emailPrefix, emailDomain), name, password };
  }

  /** @returns {Promise<UserCredentials>} */
  async registerNewUser(user = AuthUtil.buildNewUser()) {
    await test.step(`Register new user ${user.email}`, async () => {
      await this.registrationPage.open();
      await this.registrationPage.register({ ...user, confirmPassword: user.password });
      await this.registrationPage.expectOnPath('/');
    });
    return user;
  }

  /** Signs in from the current page via the nav Login button, without reloading the app. */
  async signIn(user) {
    await test.step(`Sign in as ${user.email}`, async () => {
      await this.signInPage.goToSignIn();
      await this.signInPage.verifyPageLoaded();
      await this.signInPage.signIn(user.email, user.password);
      await this.signInPage.expectSignedIn();
    });
  }

  /** @returns {Promise<UserCredentials>} */
  async registerAndSignIn() {
    const user = await this.registerNewUser();
    await this.signIn(user);
    return user;
  }
}

module.exports = { AuthUtil };
