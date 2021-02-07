import genr8Index from '../src/lib/genr8Index'

const files = [
  'post1.md',
  'post2.md'
]

describe('parseMarkdownFiles', () => {
  test('should return json', async () => {
    const output = await genr8Index.parseMarkdownFiles(files, './tests/posts')

    expect(typeof(output)).toBe('object')
    expect(Array.isArray(output)).toBeTruthy()
  })

  test('should error with invalid path', async () => {
    await expect(genr8Index.parseMarkdownFiles(['lies.md', 'damn lies.md'], './invalid/path')).rejects.toThrowError()
  })
})