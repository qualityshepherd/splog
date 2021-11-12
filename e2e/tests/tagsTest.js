import tagPage from '../pages/tagPage'

fixture`Tags`

test('should display posts with unique tag', async t => {
  await tagPage.goto('?t=test')

  await t.expect(tagPage.posts.count).eql(1)
})

test('should display posts that share tags', async t => {
  await tagPage.goto('?t=panic')

  await t.expect(tagPage.posts.count).gt(1)
})
