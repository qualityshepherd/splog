import { readSiteIndex } from '../utils'
import { blogTemplate } from '../templates'

// single blog post...
const post = {
  async render (params) {
    const index = await readSiteIndex()
    const post = index.find(post => {
      return post.meta.slug === params.get('s')
    })

    return blogTemplate(post)
  }
}
export default post
