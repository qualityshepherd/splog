import { removeFuturePosts, sortByDate } from '../src/state.js'
import { promises as fs } from 'fs'
import config from '../src/config.js'

;(async () => {
  try {
    const raw = await fs.readFile(config.pathToIndex, 'utf8')
    const allPosts = JSON.parse(raw)
    const sorted = sortByDate(allPosts)
    const posts = removeFuturePosts(sorted)

    let feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${config.title}</title>
  <link>${config.url}</link>
  <description>${config.description}</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${config.url}/assets/rss/blog.xml" rel="self" type="application/rss+xml" />`

    for (const post of posts) {
      if (!post.meta?.date || !post.meta?.title || !post.meta?.slug) continue
      const safeHtml = post.html
        .replace(/<input[^>]*>/g, '✓') // replace checkbox with a symbol
        .replace(/src="(?!https?:\/\/)/g, `src="${config.url}/`)
        .replace(/]]>/g, ']]&gt;') // escape CDATA close

      feed += `
  <item>
    <title>${post.meta.title}</title>
    <link>${config.url}/#post?s=${post.meta.slug}</link>
    <guid>${config.url}/#post?s=${post.meta.slug}</guid>
    <pubDate>${new Date(post.meta.date).toUTCString()}</pubDate>
    <description><![CDATA[${safeHtml}]]></description>
  </item>`
    }

    feed += '\n</channel>\n</rss>'

    await fs.mkdir(config.pathToRssFolder, { recursive: true })
    await fs.writeFile(`${config.pathToRssFolder}/blog.xml`, feed, 'utf8')
  } catch (err) {
    console.error('❌ Failed to generate RSS feed:', err)
  }
})()
