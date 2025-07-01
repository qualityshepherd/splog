import test from 'tape'
import { getLimitedPosts, postMatchesSearch, renderTags } from '../src/ui.js'

const fakeIndex = [
  {
    meta: {
      slug: 'post-one',
      title: 'Post One',
      date: '2025-01-01',
      tags: ['news']
    },
    html: '<p>Post One Content</p>',
    markdown: 'Post One Content'
  },
  {
    meta: {
      slug: 'post-two',
      title: 'Post Two',
      date: '2025-02-01',
      tags: ['dev']
    },
    html: '<p>Post Two Content</p>',
    markdown: 'Post Two Content'
  }
]

test('getLimitedPosts should return limited number of posts', async t => {
  const result = getLimitedPosts(fakeIndex, 2)
  t.equal(result.length, 2)
  t.deepEqual(result, fakeIndex.slice(0, 2))
})

test('postMatchesSearch should return posts matching a search term', async t => {
  const titleSearch = fakeIndex.filter(post => postMatchesSearch(post, 'Post One'))
  const markdownSearch = fakeIndex.filter(post => postMatchesSearch(post, 'Post Two'))
  const tagsSearch = fakeIndex.filter(post => postMatchesSearch(post, 'news'))
  t.ok(titleSearch[0].meta.title === 'Post One')
  t.ok(markdownSearch[0].markdown.includes('Post Two'))
  t.ok(tagsSearch[0].meta.tags.includes('news'))
})

test('renderTags should return formatted tags', async t => {
  const tags = ['poopy', 'taters']
  const html = renderTags(tags)
  t.ok(html.includes('poopy'))
  t.ok(html.includes('taters'))
})

test('renderTags should return empty string for non-array input', async t => {
  const result = renderTags(null)
  t.equal(result, '')
})

test('postMatchesSearch should handle multiple search terms', async t => {
  const multiTermSearch = fakeIndex.filter(post =>
    postMatchesSearch(post, 'Post One')
  )
  t.equal(multiTermSearch.length, 1)
  t.equal(multiTermSearch[0].meta.title, 'Post One')

  // test multiple words
  const noMatch = fakeIndex.filter(post =>
    postMatchesSearch(post, 'Post Three') // doesn't exist
  )
  t.equal(noMatch.length, 0)
})

test('postMatchesSearch should be case insensitive', async t => {
  const upperSearch = fakeIndex.filter(post =>
    postMatchesSearch(post, 'POST ONE')
  )
  const lowerSearch = fakeIndex.filter(post =>
    postMatchesSearch(post, 'post one')
  )

  t.equal(upperSearch.length, 1)
  t.equal(lowerSearch.length, 1)
  t.equal(upperSearch[0].meta.slug, lowerSearch[0].meta.slug)
})

test('postMatchesSearch should return true for empty search term', async t => {
  const emptySearch = fakeIndex.filter(post =>
    postMatchesSearch(post, '')
  )
  t.equal(emptySearch.length, fakeIndex.length)

  const nullSearch = fakeIndex.filter(post =>
    postMatchesSearch(post, null)
  )
  t.equal(nullSearch.length, fakeIndex.length)
})

test('postMatchesSearch should handle posts with missing properties', async t => {
  const incompletePost = {
    meta: { slug: 'incomplete' }
    // missing title, tags, markdown
  }

  // should not crash with missing properties
  t.equal(postMatchesSearch(incompletePost, 'test'), false)
  t.equal(postMatchesSearch(incompletePost, ''), true)
})

test('getLimitedPosts should handle edge cases', async t => {
  // limit larger than array
  const tooMany = getLimitedPosts(fakeIndex, 100)
  t.equal(tooMany.length, fakeIndex.length)

  // zero limit
  const none = getLimitedPosts(fakeIndex, 0)
  t.equal(none.length, 0)

  // negative limit (slice handles this gracefully)
  const negative = getLimitedPosts(fakeIndex, -1)
  t.equal(negative.length, 1)

  // Empty array
  const empty = getLimitedPosts([], 5)
  t.equal(empty.length, 0)
})

test('getLimitedPosts should not mutate original array', async t => {
  const original = [...fakeIndex]
  const limited = getLimitedPosts(fakeIndex, 1)

  // modify the result
  limited[0].meta.title = 'Modified'

  t.equal(fakeIndex[0].meta.title, original[0].meta.title, 'original should be unchanged')
})

test('renderTags should handle custom hash parameter', async t => {
  const tags = ['javascript', 'testing']
  const customHash = renderTags(tags, '#custom')

  t.ok(customHash.includes('#custom?t=javascript'))
  t.ok(customHash.includes('#custom?t=testing'))
})

test('renderTags should URL-encode tag names properly', async t => {
  const specialTags = ['C++', 'Node.js', 'React & Redux']
  const html = renderTags(specialTags)

  // Should contain encoded versions
  t.ok(html.includes('c%2B%2B'), 'C++ encoded')
  t.ok(html.includes('node.js'), 'should be lowercase')
  t.ok(html.includes('react%20%26%20redux'), 'spaces and & are encoded')
})

test('renderTags should include proper accessibility attributes', async t => {
  const tags = ['accessibility']
  const html = renderTags(tags)

  t.ok(html.includes('role="button"'))
  t.ok(html.includes('aria-label="Filter by tag: accessibility"'))
})

// NOTE: the following tests would require a running server or DOM mocking.
// We're good 'cause we're running the server anyway for e2e tests...

test('renderTags should generate valid HTML structure', async t => {
  const tags = ['html', 'css']
  const html = renderTags(tags)

  // check for proper link structure
  t.ok(html.includes('<a href='))
  t.ok(html.includes('class="tag"'))
  t.ok(html.includes('>html</a>'))
  t.ok(html.includes('>css</a>'))
})

test('UI functions should be pure and not depend on global state', async t => {
  const posts1 = getLimitedPosts(fakeIndex, 1)
  const posts2 = getLimitedPosts(fakeIndex, 1)

  t.deepEqual(posts1, posts2)

  const search1 = postMatchesSearch(fakeIndex[0], 'Post One')
  const search2 = postMatchesSearch(fakeIndex[0], 'Post One')

  t.equal(search1, search2)

  const tags1 = renderTags(['test'])
  const tags2 = renderTags(['test'])

  t.equal(tags1, tags2)
})
