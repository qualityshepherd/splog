import { promises as fs } from 'fs'

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
  const index = await fs.readFile('./siteIndex.json', {encoding: "utf8"})
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

  podcasts.forEach(pod => {
    feed += `
  <item>
    <title>${pod.title}</title>
    <link>https://brine.dev/#post?s${pod.slug}</link>
    <description>${pod.description}</description>
    <enclosure url="https://brine.dev/${pod.html.match(audioRegExp)[1]}" type="audio/mpeg" length="1024"></enclosure>
    <pubDate>${new Date(pod.date).toUTCString()}</pubDate>
    <guid>https://brine.dev/#post?s${pod.slug}</guid>
 </item>`
  })

  feed += `\n</channel>\n</rss>`

  await fs.writeFile('./podRss.xml', feed, {encoding: "utf8"})
    .catch(err => throw err)
})()