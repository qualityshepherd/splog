import { Selector as $, t, ClientFunction } from 'testcafe'

const basePage = {
  baseUrl: 'http://lvh.me:4242/',

  // common selectors among views...
  postTitles: $('.post-title'),
  posts: $('.post'),
  morePostsBtn: $('#more-posts'),

  /**
   * wrapper for navigateTo so we can use relative urls and append them to baseUrl
   * @param  {string} relativeUrl
   */
  async goto (relativeUrl = '') {
    await t.navigateTo(`${this.baseUrl}${this.url}${relativeUrl}`)
  },

  /**
   * wrapper for getting url
   */
  async getUrl () {
    return await ClientFunction(() => {
      return document.location.href;
    })();
  }
}
export default basePage