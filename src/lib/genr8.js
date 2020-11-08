import { promises as fs } from 'fs'
import showdown from 'showdown'

const genr8 = {
  /**
   * generate the site index
   * @param  {json} config
   */
  async siteIndex(config) {
    const posts = await this.readPosts(config.postsFolder)
    const json = await this.parseMarkdownFiles(posts, config.postsFolder)
    await this.writeSiteJson(config.siteIndex, await json)
      .catch(err => throw err)
  },

  /**
   * sort array by date
   * @param  {array}  array
   * @return {array} the sorted array
   */
  async sortByDate(array) {
    return array.sort((a, b) => {
      a = new Date(a.date)
      b = new Date(b.date)
      return (a < b )? 1 : a > b ? -1 : 0
    })
  },

  /**
   * get post files from the posts dir
   * @param  {string} path
   * @return {array}
   */
  async readPosts(path) {
    const files = await fs.readdir(path, { withFileTypes: true })
      .catch(err => throw err)
    return files
      // only return files...
      .filter(file => file.isFile())
      .map(file => file.name);
  },

  /**
   * turns markdown file data into a json object
   * @param  {array} fileArray - array of filenames
   * @param  {string} path - path to original files
   * @return {json}
   */
  parseMarkdownFiles(fileArray, path) {
    const converter = new showdown.Converter({ metadata: true })
    return Promise.all(
      fileArray.map(async file => {
        if (file.indexOf('.md') > -1) {
          const markdown = await fs.readFile(`${path}/${file}`, 'utf8')
            .catch(err => throw err)
          const html = await converter.makeHtml(await markdown)
          const { title, date, tags } = await converter.getMetadata()
          const slug = file.replace('.md', '')

          return {
            slug,
            title,
            date,
            tags,
            markdown,
            html
          }
        }
      })
    )
  },

  /**
   * create site date file
   * @param  {json} data
   * @param  {string} path - path to writable file
   */
  async writeSiteJson(path, data) {
    data = await this.sortByDate(data)
    data = JSON.stringify(data, null, 2) // make it pretty
    data = data.replace(/&quot;/g,'')
    await fs.writeFile(path, data)
      .catch(err => throw err)
  }
}
export default genr8