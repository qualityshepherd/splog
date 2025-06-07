import test from 'tape'
import { pptr } from './pptr.js'

const home = `${process.env.TEST_ENV}` || 'https://splog.brine.dev'

test('should display initial post', pptr(async t => {
  await t.goto(home)

  t.ok(await t.count('.post-title') > 0)
}))

test('should load more posts', pptr(async t => {
  await t.goto(home)
  const initialPostCount = await t.count('.post-title')
  await t.click('#load-more')

  t.ok(await t.count('.post-title') > initialPostCount)
}))

test('should use menu to navigate to about page', pptr(async t => {
  await t.goto(home)
  await t.click('#menu')
  await t.click('a[href="#about"]')

  t.ok(t.url().includes('#about'))
}))

test('should search for post', pptr(async t => {
  await t.goto(home)
  await t.click('#menu')
  await t.type('#search', 'human')

  t.ok(await t.count('.post-title') > 0)
}))
