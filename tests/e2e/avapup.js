import puppeteer from 'puppeteer'
import spa, { locators } from './spa.page.js'

const getEnvOptions = () => ({
  headless: String(process.env.HEADLESS ?? 'true').toLowerCase() === 'true',
  slowMo: Number(process.env.SLOMO ?? 0)
})

const createBrowser = async () => {
  const { headless, slowMo } = getEnvOptions()

  return puppeteer.launch({
    headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo
  })
}

const createTestContext = async (t, browser) => {
  const page = await browser.newPage()

  const windowSize = await page.evaluate(() => ({
    width: window.outerWidth,
    height: window.outerHeight
  }))
  await page.setViewport({ width: windowSize.width, height: windowSize.height })

  page.setDefaultTimeout(10000)

  const helpers = spa(t)

  // attach helpers directly to `t`
  Object.assign(t, {
    page,
    browser,
    ...helpers,

    // navigation
    url: () => page.url(),
    wait: ms => new Promise(resolve => setTimeout(resolve, ms)),
    waitFor: sel => page.waitForSelector(sel),
    waitAndClick: async (sel, opts) => {
      await page.waitForSelector(sel, opts)
      await page.click(sel)
    },

    // dom utilities
    exists: sel => page.$(sel).then(el => !!el),
    count: sel => page.$$eval(sel, els => els.length),
    getText: sel => page.$eval(sel, el => el.textContent),
    hasClass: (sel, cls) => page.$eval(sel, (el, c) => el.classList.contains(c), cls),

    // interactions
    click: sel => page.click(sel),
    clickNth: (sel, idx) => page.$$eval(sel, (els, i) => { els[i]?.click() }, idx),
    type: (sel, text) => page.type(sel, text),
    press: async key => {
      await page.keyboard.press(key)
      await page.waitForNavigation() // can blow up nav otherwise
    },
    eval: fn => page.evaluate(fn),

    // networking
    getResponse: (actionFn, matcher = () => true) =>
      Promise.all([page.waitForResponse(matcher), actionFn()])
  })

  return page
}

export function ap (testFn) {
  return async t => {
    const browser = await createBrowser()
    const page = await createTestContext(t, browser)

    try {
      await testFn(t)
    } catch (err) {
      await page.screenshot({ path: `tests/screenshots/error-${Date.now()}.png`, fullPage: true })
      const html = await page.content()
      console.error('Error HTML snapshot:\n', html.slice(0, 1000))
      t.fail(err.message || String(err))
      throw err
    } finally {
      await browser.close()
    }
  }
}

// export locators as $ for direct import in test files
export { locators as $ }
