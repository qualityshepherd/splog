import test from 'tape'
import { getLimitedPosts, postMatchesSearch, renderTags } from '../src/ui.js'

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
