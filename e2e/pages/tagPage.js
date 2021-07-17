import { Selector as $, t } from 'testcafe'
import basePage from './basePage'

const tagPage = {
  url: '#tags',
}
export default { ...basePage, ...tagPage }