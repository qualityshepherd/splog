import { promises as fs } from 'fs'
import showdown from 'showdown'
import config from '../../package'

const genr8Index = {
  /**
   * generate site index
   * @param  {[type]} pathToSiteIndex
   * @param  {[type]} pathToPostsFolder
   */
  async siteIndex (pathToSiteIndex, pathToPostsFolder) {
    const posts = await this.readPosts(pathToPostsFolder)
    const json = await this.parseMarkdownFiles(posts, pathToPostsFolder)
    await this.writeSiteJson(pathToSiteIndex, await json)
      .catch(err => console.log(err))
  },

  /**
   * sort array by date
   * @param  {array}  array
   * @return {array} the sorted array
   */
  async sortByDate (array) {
    return array.sort((a, b) => {
      a = new Date(a.date)
      b = new Date(b.date)
      return (a < b) ? 1 : a > b ? -1 : 0
    })
  },

  /**
   * get post files from the posts dir
   * @param  {string} path
   * @return {array}
   */
  async readPosts (path) {
    const files = await fs.readdir(path, { withFileTypes: true })
      .catch(err => console.log(err))
    return files
      // only return files...
      .filter(file => file.isFile())
      .map(file => file.name)
  },

  /**
   * turns markdown file data into a json object
   * @param  {array} fileArray - array of filenames
   * @param  {string} path - path to original files
   * @return {json}
   */
  parseMarkdownFiles (fileArray, path) {
    const converter = new showdown.Converter({ metadata: true, strikethrough: true, emoji: true, tables: true, tablesHeaderId: true, tasklists: true })
    return Promise.all(
      fileArray.filter(file => {
        // skip non .md files and files that start with 'draft'
        return file.indexOf('.md') > -1 && /^_draft_/.test(file) === false
      }).map(async file => {
        const markdown = await fs.readFile(`${path}/${file}`, 'utf8')
          .catch(err => console.log(err))
        const html = await converter.makeHtml(await markdown)
        const meta = await converter.getMetadata()
        meta.slug = file.replace('.md', '')

        return {
          meta,
          markdown,
          html
        }
      })
    )
  },

  /**
   * create site date file
   * @param  {json} data
   * @param  {string} path - path to writable file
   */
  async writeSiteJson (path, data) {
    data = await this.sortByDate(data)
    data = JSON.stringify(data, null, 2) // make it pretty
    data = data.replace(/&quot;/g, '')
    await fs.writeFile(path, data)
      .catch(err => console.log(err))
  }
}
export default genr8Index

genr8Index.siteIndex(config.splog.pathToIndex, config.splog.pathToPostsFolder)
