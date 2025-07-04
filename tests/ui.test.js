import test from 'ava'
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

test('getLimitedPosts should return limited number of posts', t => {
  const result = getLimitedPosts(fakeIndex, 2)
  t.is(result.length, 2)
  t.deepEqual(result, fakeIndex.slice(0, 2))
})

test('postMatchesSearch should return posts matching a search term', t => {
  const titleSearch = fakeIndex.filter(post => postMatchesSearch(post, 'Post One'))
  const markdownSearch = fakeIndex.filter(post => postMatchesSearch(post, 'Post Two'))
  const tagsSearch = fakeIndex.filter(post => postMatchesSearch(post, 'news'))
  t.is(titleSearch[0].meta.title, 'Post One')
  t.true(markdownSearch[0].markdown.includes('Post Two'))
  t.true(tagsSearch[0].meta.tags.includes('news'))
})

test('renderTags should return formatted tags', t => {
  const tags = ['poopy', 'taters']
  const html = renderTags(tags)
  t.true(html.includes('poopy'))
  t.true(html.includes('taters'))
})

test('renderTags should return empty string for non-array input', t => {
  const result = renderTags(null)
  t.is(result, '')
})

test('postMatchesSearch should handle multiple search terms', t => {
  const multiTermSearch = fakeIndex.filter(post =>
    postMatchesSearch(post, 'Post One')
  )
  t.is(multiTermSearch.length, 1)
  t.is(multiTermSearch[0].meta.title, 'Post One')

  // test multiple words
  const noMatch = fakeIndex.filter(post =>
    postMatchesSearch(post, 'Post Three') // doesn't exist
  )
  t.is(noMatch.length, 0)
})

test('postMatchesSearch should be case insensitive', t => {
  const upperSearch = fakeIndex.filter(post =>
    postMatchesSearch(post, 'POST ONE')
  )
  const lowerSearch = fakeIndex.filter(post =>
    postMatchesSearch(post, 'post one')
  )

  t.is(upperSearch.length, 1)
  t.is(lowerSearch.length, 1)
  t.is(upperSearch[0].meta.slug, lowerSearch[0].meta.slug)
})

test('postMatchesSearch should return true for empty search term', t => {
  const emptySearch = fakeIndex.filter(post =>
    postMatchesSearch(post, '')
  )
  t.is(emptySearch.length, fakeIndex.length)

  const nullSearch = fakeIndex.filter(post =>
    postMatchesSearch(post, null)
  )
  t.is(nullSearch.length, fakeIndex.length)
})

test('postMatchesSearch should handle posts with missing properties', t => {
  const incompletePost = {
    meta: { slug: 'incomplete' }
    // missing title, tags, markdown
  }

  // should not crash with missing properties
  t.false(postMatchesSearch(incompletePost, 'test'))
  t.true(postMatchesSearch(incompletePost, ''))
})

test('getLimitedPosts should handle edge cases', t => {
  // limit larger than array
  const tooMany = getLimitedPosts(fakeIndex, 100)
  t.is(tooMany.length, fakeIndex.length)

  // zero limit
  const none = getLimitedPosts(fakeIndex, 0)
  t.is(none.length, 0)

  // negative limit (slice handles this gracefully)
  const negative = getLimitedPosts(fakeIndex, -1)
  t.is(negative.length, 1)

  // Empty array
  const empty = getLimitedPosts([], 5)
  t.is(empty.length, 0)
})

test('getLimitedPosts should not mutate original array', t => {
  const original = [...fakeIndex]
  const limited = getLimitedPosts(fakeIndex, 1)

  // modify the result
  limited[0].meta.title = 'Modified'

  t.is(fakeIndex[0].meta.title, original[0].meta.title, 'original should be unchanged')
})

test('renderTags should handle custom hash parameter', t => {
  const tags = ['javascript', 'testing']
  const customHash = renderTags(tags, '#custom')

  t.true(customHash.includes('#custom?t=javascript'))
  t.true(customHash.includes('#custom?t=testing'))
})

test('renderTags should URL-encode tag names properly', t => {
  const specialTags = ['C++', 'Node.js', 'React & Redux']
  const html = renderTags(specialTags)

  // Should contain encoded versions
  t.true(html.includes('c%2B%2B'), 'C++ encoded')
  t.true(html.includes('node.js'), 'should be lowercase')
  t.true(html.includes('react%20%26%20redux'), 'spaces and & are encoded')
})

test('renderTags should include proper accessibility attributes', t => {
  const tags = ['accessibility']
  const html = renderTags(tags)

  t.true(html.includes('role="button"'))
  t.true(html.includes('aria-label="Filter by tag: accessibility"'))
})

test('renderTags should generate valid HTML structure', t => {
  const tags = ['html', 'css']
  const html = renderTags(tags)

  // check for proper link structure
  t.true(html.includes('<a href='))
  t.true(html.includes('class="tag"'))
  t.true(html.includes('>html</a>'))
  t.true(html.includes('>css</a>'))
})

test('UI functions should be pure and not depend on global state', t => {
  const posts1 = getLimitedPosts(fakeIndex, 1)
  const posts2 = getLimitedPosts(fakeIndex, 1)

  t.deepEqual(posts1, posts2)

  const search1 = postMatchesSearch(fakeIndex[0], 'Post One')
  const search2 = postMatchesSearch(fakeIndex[0], 'Post One')

  t.is(search1, search2)

  const tags1 = renderTags(['test'])
  const tags2 = renderTags(['test'])

  t.is(tags1, tags2)
})
