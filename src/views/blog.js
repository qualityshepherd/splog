import { readSiteIndex, sortByDate } from '../utils'
import { blogTemplate } from '../templates'

const blog = {
  async render (params) {
    const numPosts = params.get('numPosts') ? Number(params.get('numPosts')) + 1 : 1
    const index = await readSiteIndex()
    const sorted = await index.sort(sortByDate())

    let posts = sorted.slice(0, numPosts).map(post => {
      return blogTemplate(post)
    }).join('\n')

    const morePostsBtn = `
      <div class="container center">
        <a href="#blog?numPosts=${numPosts}"><button id="more-posts">More posts...</button></a>
      </div>
      `
    // only show button if there are more to load
    if (numPosts < sorted.length) posts += morePostsBtn
    return posts
  }
}
export default blog
