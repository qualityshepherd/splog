import { Selector as $, t } from 'testcafe'
import basePage from './basePage'

const postPage = {
  url: '#post',
}
export default { ...basePage, ...postPage }