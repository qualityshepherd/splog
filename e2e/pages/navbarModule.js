import { Selector as $, t } from 'testcafe'
import basePage from './basePage'

const navbar = {
  blogLink: $('a').withText('Blog'),
  aboutLink: $('a').withText('About'),
  searchInput: $('#search'),
  noResultsMsg: $('#no-results'),

  async searchFor (text) {
    await t
      .typeText(this.searchInput, text)
      .pressKey('enter')
  }
}
export default { ...basePage, ...navbar }
