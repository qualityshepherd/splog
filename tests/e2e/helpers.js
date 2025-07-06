/**
 * helpers for e2e tests to simplify and improve readability
 */

const baseUrl = process.env.TEST_ENV || 'http://localhost:4242'

const locators = {
  menuButton: '#menu',
  searchInput: '#search',
  postTitle: '.post-title',
  notFoundMessage: '.not-found',
  siteTitleLink: '#site-title-link',
  aboutLink: 'a[href="#about"]',
  archiveLink: 'a[href="#archive"]',
  tagLink: '.tag',
  singlePostLink: '.post-title',
  loadMoreButton: '#load-more'
}

export { locators }

/**
 * Factory function that creates and returns an object of high-level E2E helper methods.
 * These methods close over the 't' (AVA test context) object passed to this factory,
 * allowing them to be called without explicitly passing 't' to each method.
 * @param {object} t The AVA test context object.
 * @returns {object} An object containing high-level E2E actions and getters.
 */
export default (t) => ({
  // Set homeUrl in t.context so the helpers can use it
  baseUrl,

  async goto (relativePath = '') {
    await t.page.goto(`${this.baseUrl}/${relativePath}`)
  },

  async gotoUrl (url) {
    await t.goto(url)
  },

  async searchFor (query) {
    await t.click(locators.menuButton)
    await t.type(locators.searchInput, query)
    await t.page.keyboard.press('Enter')
    await t.page.waitForNavigation()
  }
})
