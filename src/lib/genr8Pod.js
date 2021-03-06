import { promises as fs } from 'fs'
import config from '../../package'

// change these to match your pod...
const pod = {
  title: 'Splog Podcast',
  link: 'https://github.com/qualityshepherd/splog',
  description: 'A simple, single page blog app written in vanilla js...',
  imageUrl: 'http://lvh.me:4242/assets/images/ipsum.jpg',
  author: 'Splog',
  explicit: 'no',
  email: 'me@test.com',
  podUrl: 'http://lvh.me:4242/blogRss.xml'
};

/**
 * create a podcast rss xml file
 */
(async () => {
  const index = await fs.readFile(config.splog.pathToIndex, {encoding: "utf8"})
    .catch(err => throw err)
  const posts = JSON.parse(index)
  const podcasts = posts.filter(({meta}) => {
    return meta.tags.toLowerCase().indexOf('podcast') > -1
  })
  // pull the audio tag from posts...
  const audioRegExp = /<audio.*?src="(.*?)"/;

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
  <itunes:author>${pod.author}</itunes:author>
  <itunes:explicit>${pod.explicit}</itunes:explicit>
  <itunes:category text="Leisure" />
  <itunes:owner>
    <itunes:email>${pod.email}</itunes:email>
  </itunes:owner>
  <atom:link href="${pod.podUrl}" rel="self" type="application/rss+xml" />`

  // from posts
  podcasts.forEach(podcast => {
    feed += `
  <item>
    <title>${podcast.meta.title}</title>
    <link>https://brine.dev/#post?s${podcast.meta.slug}</link>
    <description>${podcast.meta.description}</description>
    <enclosure url="https://brine.dev/${podcast.html.match(audioRegExp)[1]}" type="audio/mpeg" length="1024"></enclosure>
    <pubDate>${new Date(podcast.meta.date).toUTCString()}</pubDate>
    <guid>https://brine.dev/#post?s${podcast.meta.slug}</guid>
 </item>`
  })

  feed += `\n</channel>\n</rss>`

  await fs.writeFile('./rss/pod.xml', feed, {encoding: "utf8"})
    .catch(err => throw err)
})()