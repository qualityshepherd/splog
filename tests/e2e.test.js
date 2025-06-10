import test from 'tape'
import { tappr } from './tappr.js'

const home = `${process.env.TEST_ENV}` || 'https://splog.brine.dev'

test('should display at least one post', tappr(async t => {
  await t.goto(home)

  t.ok(await t.count('.post-title') > 0)
}))

test('should load more posts', tappr(async t => {
  await t.goto(home)
  const initialPostCount = await t.count('.post-title')
  await t.click('#load-more')

  t.notOk(await t.hasClass('#load-more', 'show'))
  t.ok(await t.count('.post-title') > initialPostCount)
}))

test('should use menu to navigate to about page', tappr(async t => {
  await t.goto(home)
  await t.click('#menu')
  await t.click('a[href="#about"]')

  t.ok(await t.url().includes('#about'))
  t.ok(await t.exists('h2'))
}))

test('should search for post', tappr(async t => {
  await t.goto(home)
  await t.click('#menu')
  await t.type('#search', 'human')

  t.ok(await t.count('.post-title') > 0)
}))

test('should display archive posts', tappr(async t => {
  await t.goto(home)
  await t.click('#menu')
  await t.click('a[href="#archive"]')
  await t.waitFor('.archive')

  t.ok(await t.count('.archive') > 0)
}))

test('should filter posts by tag', tappr(async t => {
  await t.goto(home)
  await t.click('.tag')

  t.ok(await t.url().includes('#tag'))
  t.ok(await t.exists('.tags'))
}))
