import test from 'ava'
import { getLimitedPosts, postMatchesSearch, renderTags } from '../src/ui.js'

// we use a factory function to ensure a fresh state
function fakeIndex () {
  return [
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
}

test('getLimitedPosts should return limited number of posts', t => {
  const posts = fakeIndex()
  const result = getLimitedPosts(posts, 2)

  t.is(result.length, 2)
  t.deepEqual(result, posts.slice(0, 2))
})

test('getLimitedPosts should handle edge cases', t => {
  const posts = fakeIndex()

  const tooMany = getLimitedPosts(posts, 100)
  t.is(tooMany.length, posts.length)

  const none = getLimitedPosts(posts, 0)
  t.is(none.length, 0)

  const negative = getLimitedPosts(posts, -1)
  t.is(negative.length, 1)

  const empty = getLimitedPosts([], 5)
  t.is(empty.length, 0)
})

test('postMatchesSearch should return posts with matching title', t => {
  const posts = fakeIndex()
  const titleSearch = posts.filter(post => postMatchesSearch(post, 'Post One'))

  t.is(titleSearch[0].meta.title, 'Post One')
})

test('postMatchesSearch should return posts with matching markdown', t => {
  const posts = fakeIndex()
  const markdownSearch = posts.filter(post => postMatchesSearch(post, 'Post Two'))

  t.true(markdownSearch[0].markdown.includes('Post Two'))
})

test('postMatchesSearch should return posts with matching tag', t => {
  const posts = fakeIndex()
  const tagsSearch = posts.filter(post => postMatchesSearch(post, 'news'))

  t.true(tagsSearch[0].meta.tags.includes('news'))
})

test('postMatchesSearch should handle multiple search terms', t => {
  const posts = fakeIndex()

  const multiTermSearch = posts.filter(post =>
    postMatchesSearch(post, 'Post One')
  )
  t.is(multiTermSearch.length, 1)
  t.is(multiTermSearch[0].meta.title, 'Post One')

  const noMatch = posts.filter(post =>
    postMatchesSearch(post, 'Post Three')
  )
  t.is(noMatch.length, 0)
})

test('postMatchesSearch should be case insensitive', t => {
  const posts = fakeIndex()

  const upperSearch = posts.filter(post =>
    postMatchesSearch(post, 'POST ONE')
  )
  const lowerSearch = posts.filter(post =>
    postMatchesSearch(post, 'post one')
  )

  t.is(upperSearch.length, 1)
  t.is(lowerSearch.length, 1)
  t.is(upperSearch[0].meta.slug, lowerSearch[0].meta.slug)
})

test('postMatchesSearch should return true for empty search term', t => {
  const posts = fakeIndex()

  const emptySearch = posts.filter(post =>
    postMatchesSearch(post, '')
  )
  t.is(emptySearch.length, posts.length)

  const nullSearch = posts.filter(post =>
    postMatchesSearch(post, null)
  )
  t.is(nullSearch.length, posts.length)
})

test('postMatchesSearch should handle posts with missing properties', t => {
  const incompletePost = {
    meta: { slug: 'incomplete' }
    // missing title, tags, markdown
  }

  t.false(postMatchesSearch(incompletePost, 'test'))
  t.true(postMatchesSearch(incompletePost, ''))
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

test('renderTags should handle custom hash parameter', t => {
  const tags = ['javascript', 'testing']
  const customHash = renderTags(tags, '#custom')

  t.true(customHash.includes('#custom?t=javascript'))
  t.true(customHash.includes('#custom?t=testing'))
})

test('renderTags should URL-encode tag names properly', t => {
  const specialTags = ['C++', 'Node.js', 'React & Redux']
  const html = renderTags(specialTags)

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

  t.true(html.includes('<a href='))
  t.true(html.includes('class="tag"'))
  t.true(html.includes('>html</a>'))
  t.true(html.includes('>css</a>'))
})

test('UI functions should be pure and not depend on global state', t => {
  const posts1 = getLimitedPosts(fakeIndex(), 1)
  const posts2 = getLimitedPosts(fakeIndex(), 1)

  t.deepEqual(posts1, posts2)

  const post = fakeIndex()[0]
  const search1 = postMatchesSearch(post, 'Post One')
  const search2 = postMatchesSearch(post, 'Post One')

  t.is(search1, search2)

  const tags1 = renderTags(['test'])
  const tags2 = renderTags(['test'])

  t.is(tags1, tags2)
})
