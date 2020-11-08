import config from '../../config'
import { readSiteIndex, sortByDate, renderTags } from '../utils'

const tags = {
  async render(params) {
    const t = params.get('t')
    const index = await readSiteIndex(config)
    const sorted = await index.sort(sortByDate())
    const found = sorted.filter(({tags}) => {
      return tags.toLowerCase().indexOf(t.toLowerCase()) > -1
    })

    let posts = found.map(post => {
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

    const noResults = `
      <h2>No Results Found</h2>
    `
    return (posts.length > 0) ? posts : noResults
  }
}
export default tags