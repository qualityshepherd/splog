import aboutPage from '../pages/aboutPage'

fixture`About Page`
  .beforeEach(async t => { // beforeAll hack
    await aboutPage.goto()
  })

test('should render correctly', async t => {
  await t.expect(aboutPage.title.visible).ok()
})

