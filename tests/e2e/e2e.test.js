import test from 'ava'
import { ap, $ } from './avapup.js'

test('should display all posts', ap(async t => {
  await t.goto()

  t.true(await t.count($.postTitle) > 0)
}))

test('should load more posts', ap(async t => {
  await t.goto()
  const initialPostCount = await t.count($.postTitle)
  await t.click($.loadMoreButton)

  t.false(await t.hasClass($.loadMoreButton, 'show'))
  t.true(await t.count($.postTitle) > initialPostCount)
}))

test('should use menu to navigate to about page', ap(async t => {
  await t.goto()
  await t.click($.menuButton)
  await t.click($.aboutLink)
  const url = await t.url()

  t.true(url.includes('#about'))
  t.true(await t.exists('h2'))
}))

test('should search for post', ap(async t => {
  await t.goto()
  await t.searchFor('human')

  t.true(await t.count($.postTitle) > 0)
}))

test('should display not-found message when no search results found', ap(async t => {
  await t.goto()
  await t.searchFor('sdhfadkjhakfh')

  t.true(await t.exists($.notFoundMessage))
}))

test('should access archive posts via url', ap(async t => {
  // Use t.goto with the relative path/hash
  await t.goto('#archive')

  t.true(await t.count($.archiveLink) > 0)
}))

test('should filter posts by tag', ap(async t => {
  await t.goto()
  await t.waitAndClick($.tagLink)

  t.true(await t.url().includes('#tag'))
  t.true(await t.exists('.tags'))
}))

test('should display a single post', ap(async t => {
  await t.goto()
  await t.click($.singlePostLink)

  t.true(await t.url().includes('#post?s='))
  t.true(await t.count('.post') === 1)
}))

test('should be responsive; handle different viewports', ap(async t => {
  await t.goto()
  await t.page.setViewport({ height: 667, width: 375 }) // mobile

  t.true(await t.count($.postTitle) > 0)
  t.deepEqual(t.page.viewport(), { height: 667, width: 375 })
}))
