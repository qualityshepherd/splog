import genr8Index from '../src/lib/genr8Index'

describe('readPosts', () => {
  test('should return an array of post filenames', async () => {
    const posts = await genr8Index.readPosts('./tests/posts')

    await expect(typeof(posts)).toBe('object')
    await expect(posts.length).toBe(2)
  })

  test('should error for invalid path', async () => {
    await expect(genr8Index.readPosts('./invalid/path')).rejects.toThrowError()
  })
})