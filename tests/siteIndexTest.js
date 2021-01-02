import genr8 from '../src/lib/genr8'

describe('siteIndex', () => {
  test('should call writeSiteJson', async () => {
    const writeSiteJson = jest.spyOn(genr8, 'writeSiteJson')
    await genr8.siteIndex('./siteIndex.json', './posts')

    expect(writeSiteJson).toHaveBeenCalled()
  })

  test('should error with invalid path', async () => {
    const badConfig = {
      postsFolder: './nodata',
      siteIndex: './nodata/nosite.json'
    }

    await expect(genr8.siteIndex(badConfig)).rejects.toThrowError()
  })
})