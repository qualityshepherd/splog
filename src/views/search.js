import { readSiteIndex, removeFuturePosts, renderTags } from '../utils'

const search = {
  async render (params) {
    const q = params.get('q').toLowerCase()
    const index = await readSiteIndex()
    const publishedPosts = removeFuturePosts(index)
    const found = await publishedPosts.filter(({ meta, html }) => {
      return meta.title.toLowerCase().indexOf(q) > -1 ||
             meta.tags.toLowerCase().indexOf(q) > -1 ||
             html.toLowerCase().indexOf(q) > -1
    })

    const posts = found.map(post => {
      return `
        <article class="post">
          <a href="#post?s=${post.meta.slug}"><h2 class="post-title">${post.meta.title} - ${post.meta.date}</h2></a>
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
