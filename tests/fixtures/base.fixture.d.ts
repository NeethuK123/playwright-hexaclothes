import { expect as playwrightExpect } from '@playwright/test';
import type {
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestType
} from '@playwright/test';

type RegistrationPageFixture = {
  open(): Promise<void>;
  verifyPageLoaded(): Promise<void>;
  goToSignInPage(): Promise<void>;
  register(details: {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
  }): Promise<void>;
  expectOnPath(path: string): Promise<void>;
  expectSignedOut(): Promise<void>;
};

type SignInPageFixture = {
  open(): Promise<void>;
  verifyPageLoaded(): Promise<void>;
  goToRegistrationPage(): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  expectOnPath(path: string): Promise<void>;
  expectSignedIn(): Promise<void>;
};

type ProductPageFixture = {
  open(): Promise<void>;
  goToAllProducts(): Promise<void>;
  verifyPageLoaded(): Promise<void>;
  verifyProductListed(name: string, price: string): Promise<void>;
  addToCart(name: string): Promise<void>;
  expectToast(message: string): Promise<void>;
};

type CartPageFixture = {
  open(): Promise<void>;
  verifyPageLoaded(): Promise<void>;
  verifyItem(name: string, price: string, quantity?: number): Promise<void>;
  verifySummary(totalItems: number, totalPrice: string): Promise<void>;
};

type AuthUtilFixture = {
  registerNewUser(): Promise<{
    email: string;
    name: string;
    password: string;
  }>;
  registerAndSignIn(): Promise<{
    email: string;
    name: string;
    password: string;
  }>;
};

type Fixtures = {
  registrationPage: RegistrationPageFixture;
  signInPage: SignInPageFixture;
  productPage: ProductPageFixture;
  cartPage: CartPageFixture;
  checkoutPage: object;
  authUtil: AuthUtilFixture;
};

export declare const test: TestType<
  PlaywrightTestArgs & PlaywrightTestOptions & Fixtures,
  PlaywrightWorkerArgs & PlaywrightWorkerOptions
>;
export declare const expect: typeof playwrightExpect;
