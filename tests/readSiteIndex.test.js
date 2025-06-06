import test from 'tape'
import { readSiteIndex } from '../src/state.js'

// readSiteIndex uses fetch, which requires a browser and legit url
const pathToIndex = 'http://localhost:4242/tests/fake.index.json'

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
