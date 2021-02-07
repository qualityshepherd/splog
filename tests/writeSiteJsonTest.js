import { promises as fs } from 'fs'
import genr8Index from '../src/lib/genr8Index'

const data = [
  {
    "markdown": "# This is also a test\n\n_laytah..._",
    "html": "<h1 id=\"thisisalsoatest\">This is also a test</h1>\n<p><em>laytah…</em></p>"
  },
  {
    "markdown": "# This is also a test\n\n_laytah..._",
    "html": "<h1 id=\"thisisalsoatest\">This is also a test</h1>\n<p><em>laytah…</em></p>"
  }
]
const siteIndex = './siteindex.json'

describe('writeSiteJson', () => {
  test('should call fs.writeFile', async () => {
    const writeFile = jest.spyOn(fs, 'writeFile')
    await genr8Index.writeSiteJson(siteIndex, data)

    expect(writeFile).toHaveBeenCalled()
  })

  test('should error with invalid path', async () => {
    await expect(genr8Index.writeSiteJson('./invalid/path')).rejects.toThrowError()
  })
})