import { Selector as $, t } from 'testcafe'
import basePage from './basePage'
import navbar from './navbarModule'

const splog = {
  navbar, // import shared modules...
  url: '#about',

  title: $('h2').withText('About'),
}
export default { ...basePage, ...splog }