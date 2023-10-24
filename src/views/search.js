import { readSiteIndex, sortByDate, renderTags } from '../utils'

const search = {
  async render (params) {
    const q = params.get('q').toLowerCase()
    const index = await readSiteIndex()
    const sorted = await index.sort(sortByDate())
    const found = await sorted.filter(({ meta, html }) => {
      return meta.title.toLowerCase().indexOf(q) > -1 ||
             meta.tags.toLowerCase().indexOf(q) > -1 ||
             html.toLowerCase().indexOf(q) > -1
    })

    const posts = found.map(post => {
      return `
        <article class="post border">
          <a href="#post?s=${post.meta.slug}"><h2 class="post-title">${post.meta.title}</h2></a>
          <div class="date">${post.meta.date}</div>
          <div>${post.html}</div>
          <span class="tags">${renderTags(post.meta.tags, '#tags')}</span>
        </article>
        `
    }).join('\n')

    const noResults = `
      <h2 id="no-results">No Results Found...</h2>
    `
    return (posts.length > 0) ? posts : noResults
  }
}
export default search
