import { removeFuturePosts, sortByDate } from '../utils'
import { promises as fs } from 'fs'
import config from '../../package' // config is in package.json

(async () => {
  const index = await fs.readFile(config.splog.pathToIndex, { encoding: 'utf8' })
    .catch(err => console.log(err))
  const posts = JSON.parse(index)
  const publishedPosts = removeFuturePosts(posts) // don't display posts with future date

  let feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${config.splog.title}</title>
  <link>${config.splog.url}</link>
  <description>${config.splog.description}</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${config.splog.url}/assets/rss/blog.xml" rel="self" type="application/rss+xml" />`

  publishedPosts.forEach(post => {
    feed += `
  <item>
    <pubDate>${new Date(post.meta.date).toUTCString()}</pubDate>
    <title>${post.meta.title}</title>
    <link>${config.splog.url}/#post?s=${post.meta.slug}</link>
    <guid>${config.splog.url}/#post?s=${post.meta.slug}</guid>
    <description><![CDATA[${post.html}]]></description>
  </item>`
  })

  feed += '\n</channel>\n</rss>'

  await fs.writeFile(`${config.splog.pathToRssFolder}/blog.xml`, feed, { encoding: 'utf8' })
    .catch(err => console.log(err))
})()
