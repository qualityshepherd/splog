import blogPage from '../pages/blogPage'
import postPage from '../pages/postPage'

fixture`Blog Page`
  .beforeEach(async t => { // beforeAll hack
    await blogPage.goto()
  })

test('should display n posts per page', async t => {
  await t.expect(blogPage.posts.count).eql(1)
})

test('should display more posts', async t => {
  await t
    .click(blogPage.morePostsBtn)
    .expect(blogPage.posts.count).eql(2)
})
