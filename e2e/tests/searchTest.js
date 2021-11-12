import blogPage from '../pages/blogPage'

fixture`Search`
  .beforeEach(async t => { // beforeAll hack
    await blogPage.goto()
  })

test('should return results', async t => {
  await blogPage.navbar.searchFor('butthole')

  await t
    .expect(blogPage.posts.visible).ok()
    .expect(await blogPage.getUrl()).contains('#search?q=butthole')
})

test('should return message when no results found', async t => {
  await blogPage.navbar.searchFor('sdfsdfsdf')

  await t
    .expect(blogPage.navbar.noResultsMsg.visible).ok()
})
