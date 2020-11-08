import genr8 from '../src/lib/genr8'

describe('sortByDate', () => {
  const dates = [
    {date: '2018-09-18'},
    {date: '2020-09-17'}
  ]

  test('should sort by date', async () => {
    const sorted = await genr8.sortByDate(dates)

    await expect(typeof(sorted)).toBe('object')
    await expect(sorted[0].date).toBe('2020-09-17')
  })
})