import { removeFuturePosts } from '../utils'
import { promises as fs } from 'fs'
import config from '../../package'

// change these to match your pod...
const pod = {
  title: config.splog.title,
  link: config.splog.url,
  description: config.splog.description,
  image: `${config.splog.url}/assets/images/bbo_square_2000.png`,
  author: 'brine',
  explicit: 'yes',
  email: 'intern@bullsbackoffice.com',
  podRss: `${config.splog.url}/assets/rss/pod.xml`
}; // required ;

/**
 * create a podcast rss xml file
 */
(async () => {
  const index = await fs.readFile(config.splog.pathToIndex, { encoding: 'utf8' })
    .catch(err => console.log(err))
  const posts = JSON.parse(index)
  const publishedPods = removeFuturePosts(posts) // don't display posts with future date
  // filter out posts that are NOT tagged as podcast
  const podcasts = publishedPods.filter(({ meta }) => { // eslint-disable-line
    if (meta.tags) {
      return meta.tags.toLowerCase().indexOf('podcast') > -1
    }
  })

  // pull the audio tag from posts...
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

  podcasts.forEach(podcast => {
    feed += `
  <item>
    <title>${podcast.meta.title}</title>
    <link>${config.splog.url}/#post?s${podcast.meta.slug}</link>
    <description>${podcast.meta.description}</description>
    <enclosure url="${config.splog.url}/${podcast.html.match(audioRegExp)[1]}" type="audio/mpeg" length="1024"></enclosure>
    <pubDate>${new Date(podcast.meta.date).toUTCString()}</pubDate>
    <guid>${config.splog.url}/#post?s${podcast.meta.slug}</guid>
    <image href="${getImage(podcast)}" />
    <itunes:image href="${getImage(podcast)}" />
 </item>`
  })

  feed += '\n</channel>\n</rss>'

  await fs.writeFile(`${config.splog.pathToRssFolder}/pod.xml`, feed, { encoding: 'utf8' })
    .catch(err => console.log(err))
})()

/**
 * set image if exists or use default
 * @param  {obj}
 * @return {string} - image url
 */
function getImage (podobj) {
  // if the image is set in the meta data
  return podobj.meta.image ? podobj.meta.image : `${config.splog.url}/assets/images/default.svg`
}
