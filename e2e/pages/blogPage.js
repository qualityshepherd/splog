import { Selector as $, t } from 'testcafe'
import basePage from './basePage'
import navbar from './navbarModule'

const blogPage = {
  navbar, // import shared modules...
  url: '#blog',
}
export default { ...basePage, ...blogPage }