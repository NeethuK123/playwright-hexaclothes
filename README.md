# Hexaclothes – Playwright automation

End-to-end tests for https://hexaclothes.netlify.app, written in JavaScript with Playwright, using the Page Object Model and Allure reporting.

## Prerequisites

Install these once on your machine:

| Tool | Version | Why | Check with |
| --- | --- | --- | --- |
| [Node.js](https://nodejs.org) | 18 or newer | Runs Playwright and the tests | `node -v` |
| [Java](https://adoptium.net) | 17 or newer | Needed by the Allure report tool (`allure-commandline`) | `java -version` |

> After installing Node.js or Java, **close and reopen your terminal** so it picks up the new PATH.

## Setup (first time only)

Open a terminal (PowerShell, Command Prompt or the VS Code terminal) in the project folder and run:

```powershell
# 1. Install the project dependencies (Playwright, Allure, dotenv)
npm install

# 2. Download the Chromium browser used by Playwright
npx playwright install chromium

# 3. Create the .env file that holds the site URL
copy .env.example .env          # PowerShell / Command Prompt
# cp .env.example .env          # Git Bash / macOS / Linux
```

Then open `.env` and fill in the values:

```
BASE_URL=https://hexaclothes.netlify.app

# Existing account used by the "existing user can sign in" test
USER_EMAIL=your.email@example.com
USER_PASSWORD=your-password
```

The account credentials live in `.env`, not in the JSON test data, because `.env` is git-ignored and so they are never committed. If `USER_EMAIL` or `USER_PASSWORD` is missing, that one test is skipped and all the others still run.

## Running the tests

### Quickest way: run the tests and open the Allure report

```powershell
npm run test:allure
```

This deletes old results, runs all tests, builds the Allure report and opens it in your browser. The report is served from the terminal; press **Ctrl+C** to stop it.

### All commands

| Command | What it does |
| --- | --- |
| `npm test` | Deletes old results and runs all tests in headless mode (no browser window) |
| `npm run test:headed` | Same, but shows the browser so you can watch the tests |
| `npm run test:ui` | Opens Playwright's UI mode to pick, run and step through tests |
| `npm run test:allure` | Runs the tests, then builds and opens the Allure report |
| `npm run allure:generate` | Builds the Allure report from the last run (`allure-results/` → `allure-report/`) |
| `npm run allure:open` | Opens the built Allure report in the browser |
| `npm run clean` | Deletes all previous results and reports |
| `npx playwright show-report` | Opens Playwright's own HTML report |

### Running some of the tests

```powershell
# One feature group: Registration, Sign In, Products, Cart or Checkout
npx playwright test -g "Cart"

# A single test, by part of its name
npx playwright test -g "removing a product"

# With the browser visible
npx playwright test -g "Checkout" --headed
```

## Viewing the results

| Output | Where |
| --- | --- |
| Allure report (status, steps, screenshots, video, trace) | `npm run allure:open` |
| Screenshots of passed tests | `results/screenshots/passed/` |
| Screenshots of failed tests | `results/screenshots/failed/` |
| Videos and traces per test | `test-results/<test name>/` |
| Playwright HTML report | `npx playwright show-report` |

In the Allure report, open a test to see its steps and attachments:
- **Screenshot**: the page at the end of the test
- **Video**: a recording of the whole test (`.webm`)
- **Trace**: download it, then open it at https://trace.playwright.dev or with `npx playwright show-trace <file>.zip` to step through every action

> Don't double-click `allure-report/index.html`. Opened as a plain file, the report stays stuck on "Loading…". Always use `npm run allure:open`.

## Project structure

```
pages/                      Page objects
  BasePage.js               Shared nav (Login/Logout, All Products, Cart), toasts, URL checks
  RegistrationPage.js
  SignInPage.js
  ProductPage.js
  CartPage.js
  CheckoutPage.js
tests/
  e2e/hexaclothes.spec.js   The one spec file; uses every page object
  fixtures/base.fixture.js  Provides page objects and AuthUtil; auto-captures screenshots
  data/testData.json        All test data (users, products, prices, messages, checkout details)
utils/
  auth.util.js              Reusable register / sign-in flows
  screenshot.util.js        Saves screenshots to results/screenshots/{passed,failed}/
  testData.util.js          Loads the JSON; unique emails, price formatting, cart totals
  common.util.js            Captures browser dialog (alert) messages
playwright.config.js        Base URL from .env, reporters (list, HTML, Allure), video/trace/screenshot settings
.env.example                Template for .env
```

## Critical functionalities covered

1. **Registration**: successful registration, password-mismatch validation, switching between the Register and Login pages
2. **Sign In**: sign in with an existing account, sign in as a newly registered user, sign out
3. **Products**: catalogue names and prices, Add to Cart confirmation
4. **Cart**: items and summary, changing quantity, removing an item
5. **Checkout**: order summary matches the cart, placing an order

## Test data

All test data is in `tests/data/testData.json`; the test code contains none. To test different products, prices or checkout details, edit that file. Each registration test creates a new email (`hexa.user.<timestamp>@test.com`), so the tests can run any number of times.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `BASE_URL is not set` | Create `.env` from `.env.example` (see Setup step 3) |
| `Executable doesn't exist ... chrome-headless-shell` | Run `npx playwright install chromium` |
| `java is not recognized` / Allure fails to start | Install Java 17+, then open a new terminal |
| Allure report shows "Loading…" | Open it with `npm run allure:open`, not by double-clicking the file |

## Notes about the site

- Deep links like `/cart` return 404 because Netlify has no SPA redirects set up. Tests therefore start at `/` and navigate by clicking.
- The cart is kept in memory only, so reloading the page empties it.
- Login accepts any email and password, so there is no "invalid login" test: the site never rejects a login.

Run the tests

┌────────────────────────────────────────────────┬───────────────────────────────┐
│                 What you want                  │            Command            │
├────────────────────────────────────────────────┼───────────────────────────────┤
│ Run all tests                                  │ npm test                      │
├────────────────────────────────────────────────┼───────────────────────────────┤
│ Run all tests and open the Allure report       │ npm run test:allure           │
├────────────────────────────────────────────────┼───────────────────────────────┤
│ Watch the browser while tests run              │ npm run test:headed           │
├────────────────────────────────────────────────┼───────────────────────────────┤
│ Pick and step through tests in Playwright's UI │ npm run test:ui               │
├────────────────────────────────────────────────┼───────────────────────────────┤
│ Run only one group, e.g. Cart                  │ npx playwright test -g "Cart" │
└────────────────────────────────────────────────┴───────────────────────────────┘