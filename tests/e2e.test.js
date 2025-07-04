import test from 'ava'
import { avapup } from './avapup.js'

const home = process.env.TEST_ENV || 'https://splog.brine.dev'

test('should display at least one post', avapup(async t => {
  await t.goto(home)
  const count = await t.count('.post-title')

  t.true(count > 0)
}))

test('should load more posts', avapup(async t => {
  await t.goto(home)
  const initialPostCount = await t.count('.post-title')
  await t.click('#load-more')
  const stillVisible = await t.hasClass('#load-more', 'show')
  const updatedPostCount = await t.count('.post-title')

  t.false(stillVisible)
  t.true(updatedPostCount > initialPostCount)
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
  const count = await t.count('.post-title')

  t.true(count > 0)
}))

test('should display archive posts', avapup(async t => {
  await t.goto(home)
  await t.click('#menu')
  await t.click('a[href="#archive"]')
  await t.waitFor('.archive')
  const count = await t.count('.archive')

  t.true(count > 0)
}))

test('should filter posts by tag', avapup(async t => {
  await t.goto(home)
  await t.click('.tag')
  const url = await t.url()
  const exists = await t.exists('.tags')

  t.true(url.includes('#tag'))
  t.true(exists)
}))
