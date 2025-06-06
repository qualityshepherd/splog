import test from 'tape'
import { sortByDate } from '../src/state.js'

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
