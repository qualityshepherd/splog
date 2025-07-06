import test from 'ava'
import {
  readSiteIndex,
  sortByDate,
  getState,
  getPosts,
  getDisplayedPosts,
  getSearchTerm,
  setPosts,
  setDisplayedPosts,
  setSearchTerm,
  incrementDisplayedPosts,
  updateState,
  removeFuturePosts,
  resetState
} from '../../src/state.js'

const baseUrl = process.env.TEST_ENV || 'http://localhost:4242'
const pathToIndex = `${baseUrl}/tests/unit/fake.index.json`

test('readSiteIndex should return parsed JSON', async t => {
  const data = await readSiteIndex(pathToIndex)

  t.true(data.length > 0)
  t.truthy(data[0].meta.title)
})

test('readSiteIndex should exclude future-dated posts', async t => {
  const data = await readSiteIndex(pathToIndex)
  const datesTodayOrOlder = date => new Date(date) <= new Date()

  t.true(data.every(post => datesTodayOrOlder(post.meta?.date)))
})

const posts = [
  { meta: { date: '2023-01-01', title: 'A' } },
  { meta: { date: '2024-01-01', title: 'B' } },
  { meta: { date: '2022-01-01', title: 'C' } }
]
const extractDates = posts => posts.map(p => p.meta.date)

test('sortByDate should sort posts descending by default', t => {
  const sortedDates = extractDates(sortByDate(posts))

  t.deepEqual(sortedDates, ['2024-01-01', '2023-01-01', '2022-01-01'])
})

test('sortByDate should sort posts ascending if desc is false', t => {
  const sortedDates = extractDates(sortByDate(posts, false))

  t.deepEqual(sortedDates, ['2022-01-01', '2023-01-01', '2024-01-01'])
})

test('sortByDate should not mutate input', t => {
  const clone = JSON.stringify(posts)
  sortByDate(posts)

  t.is(JSON.stringify(posts), clone)
})

test('getState should return a copy of state', t => {
  resetState()
  const state1 = getState()
  const state2 = getState()

  t.deepEqual(state1, state2)
})

test('setPosts should update posts and return new posts array', t => {
  resetState()
  const testPosts = [{ meta: { title: 'Test' } }]
  setPosts(testPosts)
  const retrievedPosts = getPosts()

  t.deepEqual(retrievedPosts, testPosts)
})

test('setDisplayedPosts should update displayed post count', t => {
  resetState()
  setDisplayedPosts(10)

  t.is(getDisplayedPosts(), 10)

  setDisplayedPosts(25)

  t.is(getDisplayedPosts(), 25)
})

test('setSearchTerm should update search term', t => {
  resetState()
  setSearchTerm('javascript')

  t.is(getSearchTerm(), 'javascript')

  setSearchTerm('')

  t.is(getSearchTerm(), '')
})

test('incrementDisplayedPosts should increase displayed posts count', t => {
  resetState()
  setDisplayedPosts(5)
  incrementDisplayedPosts(3)

  t.is(getDisplayedPosts(), 8)

  incrementDisplayedPosts() // default increment

  t.true(getDisplayedPosts() > 8)
})

test('updateState should update multiple properties at once', t => {
  resetState()
  const testPosts = [{ meta: { title: 'Test' } }]
  updateState({
    posts: testPosts,
    displayedPosts: 15,
    searchTerm: 'test query'
  })
  const state = getState()

  t.deepEqual(state.posts, testPosts)
  t.is(state.displayedPosts, 15)
  t.is(state.searchTerm, 'test query')
})

test('state updates should be immutable', t => {
  resetState()
  const initialState = getState()
  setPosts([{ meta: { title: 'New Post' } }])
  setDisplayedPosts(20)
  setSearchTerm('search')

  t.notDeepEqual(getState(), initialState)
  t.is(initialState.posts.length, 0)
})

test('removeFuturePosts should filter out future posts', t => {
  const fakePosts = [
    { meta: { date: '2050-01-01', title: 'Future Post' } },
    { meta: { date: '2020-01-01', title: 'Past Post' } }
  ]
  const filteredPosts = removeFuturePosts(fakePosts)

  t.is(filteredPosts.length, 1)
})

test('resetState should restore initial state', t => {
  setPosts([{ meta: { title: 'Test' } }])
  setDisplayedPosts(99)
  setSearchTerm('modified')
  const resetResult = resetState()
  const currentState = getState()

  t.is(currentState.posts.length, 0)
  t.is(currentState.searchTerm, '')
  t.true(currentState.displayedPosts > 0)
  t.deepEqual(resetResult, currentState)
})

test('state getters should return copies to prevent mutation', t => {
  resetState()
  const testPosts = [
    { meta: { title: 'Post 1' } },
    { meta: { title: 'Post 2' } }
  ]
  setPosts(testPosts)
  const posts1 = getPosts()
  const posts2 = getPosts()
  posts1.push({ meta: { title: 'Hacked Post' } })

  t.is(getPosts().length, 2)
  t.is(posts2.length, 2)
})

test('state should handle edge cases gracefully', t => {
  resetState()
  setPosts([])
  t.is(getPosts().length, 0)

  setDisplayedPosts(0)
  t.is(getDisplayedPosts(), 0)

  setSearchTerm('')
  t.is(getSearchTerm(), '')

  setDisplayedPosts(10)
  incrementDisplayedPosts(-5)
  t.is(getDisplayedPosts(), 5)
})
