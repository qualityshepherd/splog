import { readSiteIndex, sortByDate } from '../utils'
import { blogTemplate } from '../templates'

const search = {
  async render (params) {
    const q = params.get('q')
    const index = await readSiteIndex()
    const sorted = await index.sort(sortByDate())
    const found = await sorted.filter(({ meta, html }) => {
      return meta.title.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
             meta.tags.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
             html.toLowerCase().indexOf(q.toLowerCase()) > -1
    })

    const posts = found.map(post => {
      return blogTemplate(post)
    }).join('\n')

    const noResults = `
      <h2 id="no-results">No Results Found</h2>
    `
    return (posts.length > 0) ? posts : noResults
  }
}
export default search
