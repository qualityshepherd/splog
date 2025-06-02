import { promises as fs } from 'fs'
import { marked } from 'marked'
import config from '../config.js'
import { sortByDate } from '../state.js'

const genr8Index = {
  async siteIndex (pathToSiteIndex, pathToPostsFolder) {
    const posts = await this.readPosts(pathToPostsFolder)
    const json = await this.parseMarkdownFiles(posts, pathToPostsFolder)
    await this.writeSiteJson(pathToSiteIndex, json)
  },

  async readPosts (path) {
    const files = await fs.readdir(path, { withFileTypes: true })
    return files
      .filter(file => file.isFile())
      .map(file => file.name)
  },

  parseFrontmatter (content) {
    const match = content.trim().match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!match) return null

    const [, frontmatter, markdown] = match
    const metadata = {}

    frontmatter.split('\n').forEach(line => {
      const [key, ...values] = line.split(':')
      if (key && values.length) {
        const value = values.join(':').trim()
        if (key === 'tags') {
          metadata[key] = value.split(',').map(tag => tag.trim())
        } else {
          metadata[key] = value
        }
      }
    })

    return { metadata, content: markdown.trim() }
  },

  async parseMarkdownFiles (fileArray, path) {
    return Promise.all(
      fileArray
        .filter(file => file.endsWith('.md') && !file.startsWith('draft'))
        .map(async file => {
          const raw = await fs.readFile(`${path}/${file}`, 'utf8')
          const parsed = this.parseFrontmatter(raw)

          if (!parsed) {
            console.warn(`Skipping ${file}: missing or invalid frontmatter.`)
            return null
          }

          const { metadata, content } = parsed
          metadata.slug = file.replace('.md', '')
          const html = marked(content)

          return {
            meta: metadata,
            markdown: content,
            html
          }
        })
    ).then(results => results.filter(Boolean)) // filter out nulls
  },

  async writeSiteJson (path, data) {
    const sorted = data.sort(sortByDate())
    const json = JSON.stringify(sorted, null, 2).replace(/&quot;/g, '')
    await fs.writeFile(path, json, 'utf8')
  }
}

export default genr8Index

;(async () => {
  try {
    await genr8Index.siteIndex(config.pathToIndex, config.pathToPostsFolder)
  } catch (err) {
    console.error('❌ Failed to generate site index:', err)
  }
})()
