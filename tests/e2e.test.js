import test from 'ava'
import { avapup } from './avapup.js'

const home = process.env.TEST_ENV || 'https://splog.brine.dev'

test('should display at least one post', avapup(async t => {
  await t.goto(home)

  t.true(await t.count('.post-title') > 0)
}))

test('should load more posts', avapup(async t => {
  await t.goto(home)
  const initialPostCount = await t.count('.post-title')
  await t.click('#load-more')

  t.false(await t.hasClass('#load-more', 'show'))
  t.true(await t.count('.post-title') > initialPostCount)
}))

test('should use menu to navigate to about page', avapup(async t => {
  await t.goto(home)
  await t.click('#menu')
  await t.click('a[href="#about"]')
  const url = await t.url()

  t.true(url.includes('#about'))
  t.true(await t.exists('h2'))
}))

test('should search for post', avapup(async t => {
  await t.goto(home)
  await t.click('#menu')
  await t.type('#search', 'human')

  t.true(await t.count('.post-title') > 0)
}))

test('should display archive posts', avapup(async t => {
  await t.goto(home)
  await t.click('#menu')
  await t.click('a[href="#archive"]')
  await t.waitFor('.archive')

  t.true(await t.count('.archive') > 0)
}))

test('should filter posts by tag', avapup(async t => {
  await t.goto(home)
  await t.click('.tag')

  t.true(await t.url().includes('#tag'))
  t.true(await t.exists('.tags'))
}))
