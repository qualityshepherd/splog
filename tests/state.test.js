import test from 'tape'
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
  resetState
} from '../src/state.js'

// readSiteIndex uses fetch, which requires a browser and full url
const pathToIndex = `${process.env.TEST_ENV}/tests/fake.index.json`

test('readSiteIndex should return parsed JSON', async t => {
  const data = await readSiteIndex(pathToIndex)

  t.ok(data.length > 0)
  t.ok(data[0].meta.title)
})

test('readSiteIndex should exclude future-dated posts', async t => {
  const data = await readSiteIndex(pathToIndex)
  const datesTodayOrOlder = date => new Date(date) <= new Date()

  t.ok(data.every(post => datesTodayOrOlder(post.meta?.date)))
})

const posts = [
  { meta: { date: '2023-01-01', title: 'A' } },
  { meta: { date: '2024-01-01', title: 'B' } },
  { meta: { date: '2022-01-01', title: 'C' } }
]
const extractDates = posts => posts.map(p => p.meta.date)

test('sortByDate should sort posts descending by default', async t => {
  const sortedDates = extractDates(sortByDate(posts))

  t.deepEqual(sortedDates, ['2024-01-01', '2023-01-01', '2022-01-01'])
})

test('sortByDate should sort posts ascending if desc is false', async t => {
  const sortedDates = extractDates(sortByDate(posts, false))

  t.deepEqual(sortedDates, ['2022-01-01', '2023-01-01', '2024-01-01'])
})

test('sortByDate should not mutate input', async t => {
  const clone = JSON.stringify(posts)
  sortByDate(posts)

  t.equal(JSON.stringify(posts), clone)
})

test('getState should return a copy of state', async t => {
  resetState() // fresh start...
  const state1 = getState()
  const state2 = getState()

  t.deepEqual(state1, state2)
})

test('setPosts should update posts and return new posts array', async t => {
  resetState()
  const testPosts = [{ meta: { title: 'Test' } }]
  setPosts(testPosts)
  const retrievedPosts = getPosts()

  t.deepEqual(retrievedPosts, testPosts)
})

test('setDisplayedPosts should update displayed post count', async t => {
  resetState()

  setDisplayedPosts(10)
  t.equal(getDisplayedPosts(), 10)

  setDisplayedPosts(25)
  t.equal(getDisplayedPosts(), 25)
})

test('setSearchTerm should update search term', async t => {
  resetState()

  setSearchTerm('javascript')
  t.equal(getSearchTerm(), 'javascript')

  setSearchTerm('')
  t.equal(getSearchTerm(), '')
})

test('incrementDisplayedPosts should increase displayed posts count', async t => {
  resetState()
  setDisplayedPosts(5)

  incrementDisplayedPosts(3)
  t.equal(getDisplayedPosts(), 8)

  incrementDisplayedPosts() // should use default increment
  t.ok(getDisplayedPosts() > 8, 'should increment by default amount')
})

test('updateState should update multiple properties at once', async t => {
  resetState()
  const testPosts = [{ meta: { title: 'Test' } }]

  updateState({
    posts: testPosts,
    displayedPosts: 15,
    searchTerm: 'test query'
  })

  const state = getState()
  t.deepEqual(state.posts, testPosts)
  t.equal(state.displayedPosts, 15)
  t.equal(state.searchTerm, 'test query')
})

test('state updates should be immutable', async t => {
  resetState()
  const initialState = getState()

  setPosts([{ meta: { title: 'New Post' } }])
  setDisplayedPosts(20)
  setSearchTerm('search')

  // original state reference should not have changed
  t.notDeepEqual(getState(), initialState)
  t.equal(initialState.posts.length, 0, 'initial state should be empty')
})

test('resetState should restore initial state', async t => {
  setPosts([{ meta: { title: 'Test' } }])
  setDisplayedPosts(99)
  setSearchTerm('modified')

  const resetResult = resetState()
  const currentState = getState()

  t.equal(currentState.posts.length, 0)
  t.equal(currentState.searchTerm, '')
  t.ok(currentState.displayedPosts > 0, 'should have default displayedPosts')
  t.deepEqual(resetResult, currentState, 'resetState should return new state')
})

test('state getters should return copies to prevent mutation', async t => {
  resetState()
  const testPosts = [
    { meta: { title: 'Post 1' } },
    { meta: { title: 'Post 2' } }
  ]

  setPosts(testPosts)

  const posts1 = getPosts()
  const posts2 = getPosts()

  // Modify the returned array
  posts1.push({ meta: { title: 'Hacked Post' } })

  // Original posts should be unchanged
  t.equal(getPosts().length, 2, 'original posts should be unchanged')
  t.equal(posts2.length, 2, 'other references should be unchanged')
})

test('state should handle edge cases gracefully', async t => {
  resetState()

  // test with null/empty values
  setPosts([])
  t.equal(getPosts().length, 0)

  setDisplayedPosts(0)
  t.equal(getDisplayedPosts(), 0)

  setSearchTerm('')
  t.equal(getSearchTerm(), '')

  // test with negative increment
  setDisplayedPosts(10)
  incrementDisplayedPosts(-5)
  t.equal(getDisplayedPosts(), 5)
})
