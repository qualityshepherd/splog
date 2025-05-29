import { readSiteIndex, removeFuturePosts, renderTags } from '../utils'
import config from '../../package'
const maxPosts = config.splog.maxPosts

const blog = {
  async render (params) {
    const numPosts = params.get('numPosts') ? Number(params.get('numPosts')) + maxPosts : maxPosts
    const index = await readSiteIndex()
    const publishedPosts = removeFuturePosts(index) // don't display posts with future date
    const canonicalLink = `<link rel="canonical" href="${config.splog.url}">` // seo

    let posts = publishedPosts.slice(0, numPosts).map(post => {
      // Split content at <break> tag
      const [preview, fullContent] = post.html.split('<break>');

      return `
        <div class="post">
          <a href="#post?s=${post.meta.slug}" aria-label="post-title"><h2 class="post-title">${post.meta.title}</h2></a>
          <div class="date">${post.meta.date}</div>
          <div>
            ${preview}
            ${fullContent ? `
              <div class="post-break">
                <a href="#post?s=${post.meta.slug}" class="read-more">Read more...</a>
              </div>
            ` : ''}
          </div>
          <span class="tags">${renderTags(post.meta.tags)}</span>
        </div>
      `
    }).join('\n')

    const morePostsBtn = `
      <div class="container center">
        <a href="#blog?numPosts=${numPosts}" aria-label="more-posts"><button id="more-posts">More posts...</button></a>
      </div>
      `
    // only show button if there are more to load
    if (numPosts < publishedPosts.length) posts += morePostsBtn
    posts += canonicalLink // for seo
    return posts
  }
}
export default blog
