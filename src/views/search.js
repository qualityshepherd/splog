import { readSiteIndex, sortByDate, renderTags } from '../utils'

const search = {
  async render(params) {
    const q = params.get('q')
    const index = await readSiteIndex('./siteindex.json')
    const sorted = await index.sort(sortByDate())
    const found = sorted.filter(({title, tags, html}) => {
      return title.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
             tags.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
             html.toLowerCase().indexOf(q.toLowerCase()) > -1
    })

    let posts = found.map(post => {
      return `
        <div class="post">
          <a href="#post?s=${post.slug}"><h2 class="post-title">${post.title}</h2></a>
          <div class="date">${post.date}</div>
          <div>${post.html}</div>
          <span class="tags">${renderTags(post.tags)}</span>
        </div>
        `
    }).join('\n')

    const noResults = `
      <h2 id="no-results">No Results Found</h2>
    `
    return (posts.length > 0) ? posts : noResults
  }
}
export default search