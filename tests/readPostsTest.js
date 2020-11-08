import genr8 from '../src/lib/genr8'

describe('readPosts', () => {
  test('should return an array of post filenames', async () => {
    const posts = await genr8.readPosts('./tests/posts')

    await expect(typeof(posts)).toBe('object')
    await expect(posts.length).toBe(2)
  })

  test('should error for invalid path', async () => {
    await expect(genr8.readPosts('./invalid/path')).rejects.toThrowError()
  })
})