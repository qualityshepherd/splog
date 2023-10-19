import { readSiteIndex, renderTags, sortByDate } from '../utils'

const tags = {
  async render (params) {
    const t = params.get('t')
    const index = await readSiteIndex()
    const sorted = await index.sort(sortByDate())
    const found = await sorted.filter(({ meta }) => {
      return meta.tags.toLowerCase().indexOf(t.toLowerCase()) > -1
    })

    const posts = found.map(post => {
      return `
        <div class="post">
          <a href="#post?s=${post.meta.slug}"><h2 class="post-title">${post.meta.title}</h2></a>
          <div class="date">${post.meta.date}</div>
          <div>${post.html}</div>
          <span class="tags">${renderTags(post.meta.tags)}</span>
        </div>
      `
    }).join('\n')

    const noResults = `
      <h2>No Results Found</h2>
    `
    return (posts.length > 0) ? posts : noResults
  }
}
export default tags
