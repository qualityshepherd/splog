import genr8Index from '../src/lib/genr8Index'

describe('siteIndex', () => {
  test('should call writeSiteJson', async () => {
    const writeSiteJson = jest.spyOn(genr8Index, 'writeSiteJson')
    await genr8Index.siteIndex('./siteIndex.json', './posts')

    expect(writeSiteJson).toHaveBeenCalled()
  })

  test('should error with invalid path', async () => {
    const badConfig = {
      postsFolder: './nodata',
      siteIndex: './nodata/nosite.json'
    }

    await expect(genr8Index.siteIndex(badConfig)).rejects.toThrowError()
  })
})