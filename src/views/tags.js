import { readSiteIndex, sortByDate } from '../utils'
import { blogTemplate } from '../templates'

const tags = {
  async render (params) {
    const t = params.get('t')
    const index = await readSiteIndex()
    const sorted = await index.sort(sortByDate())
    const found = await sorted.filter(({ meta }) => {
      return meta.tags.toLowerCase().indexOf(t.toLowerCase()) > -1
    })

    const posts = found.map(post => {
      return blogTemplate(post)
    }).join('\n')

    const noResults = `
      <h2>No Results Found</h2>
    `
    return (posts.length > 0) ? posts : noResults
  }
}
export default tags
