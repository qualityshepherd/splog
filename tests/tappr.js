import puppeteer from 'puppeteer'

const getEnvOptions = () => ({
  headless: String(process.env.HEADLESS ?? 'true').toLowerCase() === 'true',
  slowMo: Number(process.env.SLOMO ?? 0)
})

const createBrowser = async () => {
  const { headless, slowMo } = getEnvOptions()

  const browser = await puppeteer.launch({
    headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo
  })

  return browser
}

const createTestContext = async (t, browser) => {
  const page = await browser.newPage()

  const windowSize = await page.evaluate(() => ({
    width: window.outerWidth,
    height: window.outerHeight
  }))
  await page.setViewport({ width: windowSize.width, height: windowSize.height })

  page.setDefaultTimeout(10000)

  Object.assign(t, {
    page,
    browser,

    // Navigation
    goto: url => page.goto(url),
    url: () => page.url(),
    wait: ms => new Promise(resolve => setTimeout(resolve, ms)),
    waitFor: sel => page.waitForSelector(sel),
    waitAndClick: async (sel, opts) => {
      await page.waitForSelector(sel, opts)
      await page.click(sel)
    },

    // DOM Utilities
    exists: sel => page.$(sel).then(el => !!el),
    count: sel => page.$$eval(sel, els => els.length),
    getText: sel => page.$eval(sel, el => el.textContent),
    hasClass: (sel, cls) => page.$eval(sel, (el, c) => el.classList.contains(c), cls),

    // Interactions
    click: sel => page.click(sel),
    clickNth: (sel, idx) => page.$$eval(sel, (els, i) => { els[i]?.click() }, idx),
    type: (sel, text) => page.type(sel, text),
    press: key => page.keyboard.press(key),
    eval: fn => page.evaluate(fn),

    // Networking
    getResponse: (actionFn, matcher = () => true) =>
      Promise.all([page.waitForResponse(matcher), actionFn()])
  })

  return page
}

const runWithContext = async (testFn, t) => {
  const browser = await createBrowser()
  const page = await createTestContext(t, browser)

  try {
    await testFn(t)
  } catch (err) {
    await page.screenshot({ path: `tests/error-${Date.now()}.png`, fullPage: true })
    const html = await page.content()
    console.error('Error HTML snapshot:\n', html.slice(0, 1000))
    t.fail(err)
  } finally {
    await browser.close()
  }
}

export function tappr(testFn) {
  return async t => {
    await runWithContext(testFn, t)
  }
}
