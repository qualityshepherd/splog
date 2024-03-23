import { removeFuturePosts, sortByDate } from '../utils'
import { promises as fs } from 'fs'
import config from '../../package'

(async () => {
  const index = await fs.readFile(config.splog.pathToIndex, { encoding: 'utf8' })
    .catch(err => console.log(err))
  const posts = JSON.parse(index)
  const publishedPosts = removeFuturePosts(posts) // don't display posts with future date

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  publishedPosts.forEach(post => {
    sitemap += `
  <url>
    <loc>${config.splog.url}/#post?s=${post.meta.slug}</loc>
  </url>`
  })

  sitemap += '\n</urlset>'

  await fs.writeFile(`${config.splog.pathToRssFolder}/sitemap.xml`, sitemap, { encoding: 'utf8' })
    .catch(err => console.log(err))
})()
