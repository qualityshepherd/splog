import { promises as fs } from 'fs'
import config from '../../config'

(async () => {
  const index = await fs.readFile(config.siteIndex, {encoding: "utf8"})
    .catch(err => throw err)
  const posts = JSON.parse(index)

  let feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>SPLOG</title>
  <link>https://github.com/qualityshepherd/splog</link>
  <description>A simple, single page blog app written in vanilla js...</description>
  <language>en-us</language>`

  posts.forEach(post => {
    feed += `
  <item>
    <title>${post.title}</title>
    <link>https://spl.og/#post?s${post.slug}</link>
    <description>${post.title.substring(0,42)}</description>
  </item>`
  })

  feed += `</channel></rss>`

  await fs.writeFile('./rss.xml', feed, {encoding: "utf8"})
    .catch(err => throw err)
})()