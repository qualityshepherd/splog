import postPage from '../pages/postPage'

fixture`Blog Page`
  .beforeEach(async t => { // beforeAll hack
    await postPage.goto('?s=post1')
  })

test('should display post links on own page', async t => {
  await t
    .expect(postPage.posts.count).eql(1)
    .expect(postPage.postTitles.visible).ok()
    .expect(await postPage.getUrl()).contains('#post?s=')
})
