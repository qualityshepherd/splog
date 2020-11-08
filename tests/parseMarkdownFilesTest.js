import genr8 from '../src/lib/genr8'

const files = [
  'post1.md',
  'post2.md'
]

describe('parseMarkdownFiles', () => {
  test('should return json', async () => {
    const output = await genr8.parseMarkdownFiles(files, './tests/posts')

    expect(typeof(output)).toBe('object')
    expect(Array.isArray(output)).toBeTruthy()
  })

  test('should error with invalid path', async () => {
    await expect(genr8.parseMarkdownFiles(['lies.md', 'damn lies.md'], './invalid/path')).rejects.toThrowError()
  })
})