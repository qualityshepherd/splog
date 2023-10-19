import { readSiteIndex, renderTags } from '../utils'

// single blog post...
const post = {
  async render (params) {
    const index = await readSiteIndex()
    const post = index.find(post => {
      return post.meta.slug === params.get('s')
    })

    return `
        <div class="post">
          <a href="#post?s=${post.meta.slug}"><h2 class="post-title">${post.meta.title}</h2></a>
          <div class="date">${post.meta.date}</div>
          <div>${post.html}</div>
          <span class="tags">${renderTags(post.meta.tags)}</span>
        </div>
      `
  }
}
export default post
