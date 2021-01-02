import { readSiteIndex, renderTags } from '../utils'

// single blog post...
const post = {
  async render(params) {
    const index = await readSiteIndex('./siteindex.json')
    const post = index.find(post => {
      return post.slug === params.get('s')
    })

    return `
      <div class="post">
        <a href="#post?s=${post.slug}"><h2 class="post-title">${post.title}</h2></a>
        <div class="date">${post.date}</div>
        <div>${post.html}</div>
        <span class="tags">${renderTags(post.tags)}</span>
      </div>
      `
  }
}
export default post