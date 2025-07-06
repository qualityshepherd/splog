# AvaPup - E2E Testing With AVA & Puppeteer

I really like writing unit tests with [AVA](https://avajs.dev/) and the simplicity of [Puppeteer](https://pptr.dev/)... so why not bring them together? Puppeteer is a great tool, though its syntax can be a bit clunky. AvaPup fixes that and allows you to change it to suit your liking or the needs of your team.

## AvaPup allows you to:

* **Use a consistent test runner** for both unit and E2E tests, leveraging AVA across your entire test suite.
* **Run E2E tests** with AVA and Puppeteer.
* **Create your own Domain-Specific Language (DSL)** for tests, making them highly expressive and focused on application behavior.
* **Create _readable_ tests** that are easy to understand at a glance.
    * **The "Speakable Test" Litmus Test:** A good test reads like you're telling someone how to use the application. You'd likely say, "search for X," rather than "click the menu; click search; click in that box; type text..." AvaPup helps you write tests that match this natural language.
* **Wrap multi-step actions into helper functions** (e.g., `t.searchFor('query')`). This encapsulates complex user flows, making tests concise and resilient to UI changes.
* **Avoid wrapping one-liners:** If a Puppeteer action is a single, clear step (e.g., `t.click($.someButton)`), it's probably not worth wrapping. Use direct Puppeteer actions and locators for clarity without unnecessary abstraction.
* **Tailor Puppeteer's behavior** via `avapup.js` and define app-specific locators, wrappers, and functions in `helpers.js`.
* **Control the bloat:** Add only the utilities and abstractions your project needs.
* **Capture screenshots of failed tests** automatically, providing immediate visual context for debugging.
* **Run E2E tests _headed_ and in _SLOMO_** for effective debugging (AVA is otherwise incredibly fast!).

## Setup

* Install dependencies:
    ```bash
    npm install --save-dev ava puppeteer
    # or
    yarn add --dev ava puppeteer
    ```
* Keep `avapup.js` and `helpers.js` in your E2E test directory (e.g., `tests/e2e/`).
* Edit both files to customize them for your project's needs.

## Usage in Tests

Import `avapup` (aliased as `ap` for brevity) and the `$` for locators from `./avapup.js` in your test files.

```javascript
// tests/e2e/my-feature.test.js
import test from 'ava'
import { avapup as ap, $ } from './avapup.js' // adjust path as needed

test('should perform a search and display results', ap(async t => {
  // navigate to the baseUrl (defined in helpers.js)
  await t.goto('') // examples: t.goto(''), t.goto('#archive'), t.goto('/some/path')

  // wrap multi-step actions into functions
  await t.searchFor('my search query')

  // avoid wrapping one-liners; use direct Puppeteer actions and locators
  await t.click($.menuButton)
  t.true(await t.exists('h2'), 'should find an h2 element after some action') // Corrected '22' to 'h2'

  // assertions using high-level getters and locators
  t.true(await t.getPostCount() > 0, 'should display posts after search')
  t.false(await t.isNotFoundMessageDisplayed(), 'should not display not-found message')
}))
