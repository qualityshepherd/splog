import config from '../../config'
import { readSiteIndex, sortByDate, renderTags } from '../utils'

const blog = {
  async render(params) {
    const numPosts = params.get('numPosts') ? Number(params.get('numPosts')) + config.maxPosts : config.maxPosts
    const index = await readSiteIndex(config)
    const sorted = await index.sort(sortByDate())

    let posts = sorted.slice(0, numPosts).map(post => {
      return `
        <div class="post">
          <a href="#post?s=${post.slug}"><h2 class="post-title">${post.title}</h2></a>
          <div class="date">${post.date}</div>
          <div>${post.html}</div>
          <span class="tags">${renderTags(post.tags)}</span>
        </div>
        <hr>
        `
    }).join('\n')

    const loadMoreBtn = `
      <div class="container center">
        <a href="#blog?numPosts=${numPosts}"><button id="load-more">Load more...</button></a>
      </div>
      `
    // only show button if there are more to load
    if(numPosts < sorted.length) posts += loadMoreBtn
    return posts
  }
}
export default blog