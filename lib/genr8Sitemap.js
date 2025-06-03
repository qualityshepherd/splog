import { removeFuturePosts } from '../src/state.js'
import { promises as fs } from 'fs'
import config from '../src/config.js' // ← use config.js, not package.json

;(async () => {
  try {
    const raw = await fs.readFile(config.pathToIndex, 'utf8')
    const posts = JSON.parse(raw)
    const publishedPosts = removeFuturePosts(posts)

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    for (const post of publishedPosts) {
      if (!post.meta?.slug) continue // skip if missing required slug
      sitemap += '  <url>\n'
      sitemap += `    <loc>${config.url}/#post?s=${post.meta.slug}</loc>\n`
      sitemap += '  </url>\n'
    }

    sitemap += '</urlset>\n'

    await fs.mkdir(config.pathToRssFolder, { recursive: true })
    await fs.writeFile(`${config.pathToRssFolder}/sitemap.xml`, sitemap, 'utf8')
  } catch (err) {
    console.error('❌ Failed to generate sitemap:', err)
  }
})()
