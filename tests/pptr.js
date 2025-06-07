import puppeteer from 'puppeteer'

export function pptr (testFn) {
  return async t => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
      slowMo: 0
    })

    const page = await browser.newPage()

    // Query the actual window size using window.outerWidth/outerHeight
    const windowSize = await page.evaluate(() => ({ width: window.outerWidth, height: window.outerHeight }))
    await page.setViewport({ width: windowSize.width, height: windowSize.height })
    page.setDefaultTimeout(10000)

    // Enhance `t` with custom helpers
    t.page = page
    t.goto = url => page.goto(url)
    t.getText = sel => page.$eval(sel, el => el.textContent)
    t.exists = sel => page.$(sel).then(el => !!el)
    t.count = sel => page.$$eval(sel, els => els.length)
    t.click = sel => page.click(sel)
    t.wait = ms => new Promise(resolve => setTimeout(resolve, ms))
    t.url = () => page.url()
    t.type = (sel, text) => page.type(sel, text)
    t.waitFor = sel => page.waitForSelector(sel)
    t.press = key => page.keyboard.press(key)
    t.hasClass = (sel, className) => page.$eval(sel, (el, cls) => el.classList.contains(cls), className)

    try {
      await testFn(t)
    } catch (err) {
      await page.screenshot({ path: `tests/error-${Date.now()}.png`, fullPage: true })
      const html = await page.content()
      console.error('Error HTML snapshot:\n', html.slice(0, 1000)) // prevent flooding
      t.fail(err)
    } finally {
      await browser.close()
    }
  }
}
