import { readSiteIndex, renderTags, sortByDate } from '../utils'

const blog = {
  async render (params) {
    const numPosts = params.get('numPosts') ? Number(params.get('numPosts')) + 1 : 1
    const index = await readSiteIndex()
    const sorted = await index.sort(sortByDate())

    let posts = sorted.slice(0, numPosts).map(post => {
      return `
        <div class="post">
          <a href="#post?s=${post.meta.slug}" role="button" aria-label="post-title"><h2 class="post-title">${post.meta.title}</h2></a>
          <div class="date">${post.meta.date}</div>
          <div>${post.html}</div>
          <span class="tags">${renderTags(post.meta.tags)}</span>
        </div>
      `
    }).join('\n')

    const morePostsBtn = `
      <div class="container center">
        <a href="#blog?numPosts=${numPosts}"><button id="more-posts">More posts...</button></a>
      </div>
      `
    // only show button if there are more to load
    if (numPosts < sorted.length) posts += morePostsBtn
    return posts
  }
}
export default blog
