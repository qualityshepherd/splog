import { readSiteIndex, removeFuturePosts } from '../utils'

const archive = {
  async render (params) {
    const index = await readSiteIndex()
    const publishedPosts = removeFuturePosts(index)

    const posts = publishedPosts.map(post => {
      return `
      <p>
        <a href="#post?s=${post.meta.slug}"><span class="archive">${post.meta.title}</span></a>
        <span class="date">${post.meta.date}</span>
      </p>
      `
    }).join('\n')

    const noResults = `
      <h2>No Results Found</h2>
    `
    return (posts.length > 0) ? posts : noResults
  }
}
export default archive
