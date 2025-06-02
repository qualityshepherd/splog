import { removeFuturePosts } from '../state.js'
import { promises as fs } from 'fs'
import config from '../config.js'

// Podcast metadata (edit this for your show)
const pod = {
  title: config.title,
  link: config.url,
  description: config.description,
  image: `${config.url}/assets/images/catface.png`,
  author: 'brine',
  explicit: 'true',
  email: 'junk@example.com',
  podRss: `${config.url}/assets/rss/pod.xml`
}

/**
 * Generate a valid podcast RSS feed from posts tagged with "podcast"
 */
;(async () => {
  try {
    const raw = await fs.readFile(config.pathToIndex, 'utf8')
    const posts = removeFuturePosts(JSON.parse(raw))

    // Filter posts with "podcast" tag
    const podcasts = posts.filter(({ meta }) =>
      Array.isArray(meta.tags) &&
      meta.tags.some(tag => tag.toLowerCase() === 'podcast')
    )

    const audioRegExp = /<audio.*?src="(.*?)"/

    let feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${pod.title}</title>
  <link>${pod.link}</link>
  <description>${pod.description}</description>
  <language>en-us</language>
  <itunes:image href="${pod.image}" />
  <image>
    <url>${pod.image}</url>
    <title>${pod.title}</title>
    <link>${pod.link}</link>
  </image>
  <itunes:author>${pod.author}</itunes:author>
  <itunes:explicit>${pod.explicit}</itunes:explicit>
  <itunes:category text="Leisure" />
  <itunes:owner>
    <itunes:email>${pod.email}</itunes:email>
  </itunes:owner>
  <atom:link href="${pod.podRss}" rel="self" type="application/rss+xml" />`

    for (const podcast of podcasts) {
      const audioMatch = podcast.html.match(audioRegExp)
      if (!audioMatch?.[1]) {
        console.warn(`Skipping post "${podcast.meta.title}" — no <audio> found.`)
        continue
      }

      const audioUrl = `${config.url}/${audioMatch[1]}`
      const description = podcast.meta.description || ''

      feed += `
  <item>
    <title>${podcast.meta.title}</title>
    <link>${config.url}/#post?s=${podcast.meta.slug}</link>
    <guid isPermaLink="true">${config.url}/#post?s=${podcast.meta.slug}</guid>
    <description>${description}</description>
    <enclosure url="${audioUrl}" type="audio/mpeg" length="0" />
    <pubDate>${new Date(podcast.meta.date).toUTCString()}</pubDate>
    <itunes:image href="${getImage(podcast)}" />
  </item>`
    }

    feed += '\n</channel>\n</rss>'

    await fs.mkdir(config.pathToRssFolder, { recursive: true })
    await fs.writeFile(`${config.pathToRssFolder}/pod.xml`, feed, 'utf8')
    console.log('✅ Podcast RSS written to pod.xml')
  } catch (err) {
    console.error('❌ Failed to generate podcast RSS:', err)
  }
})()

/**
 * Return podcast image from meta or fallback
 */
function getImage (podobj) {
  return podobj.meta.image
    ? podobj.meta.image
    : `${config.url}/assets/images/default.svg`
}
