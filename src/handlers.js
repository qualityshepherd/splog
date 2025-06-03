import config from './config.js'
import { state } from './state.js'
import { elements, renderFilteredPosts, renderPosts, renderSinglePost } from './ui.js'

export function handleRouting () {
  const [route, query] = location.hash.split('?')
  const params = new URLSearchParams(query)

  if (route === '#post') {
    const slug = params.get('s')
    if (slug) return renderSinglePost(slug)
  }

  if (route === '#tag') {
    const tag = params.get('t')
    if (tag) {
      const filtered = state.posts.filter(post =>
        post.meta.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
      )
      return renderPosts(filtered)
    }
  }
  // default: home view
  renderPosts(state.posts.slice(0, state.displayedPosts))
}

export function handleSearch (e) {
  state.searchTerm = e.target.value.toLowerCase()
  renderFilteredPosts()
}

export function handleLoadMore () {
  state.displayedPosts += config.maxPosts
  const visiblePosts = state.posts.slice(0, state.displayedPosts)
  renderPosts(visiblePosts)
  if (state.displayedPosts >= state.posts.length) {
    elements.loadMore?.remove() // or hide instead of removing
  }
}

/* eslint-disable no-unused-vars */
export function toggleMenu (e) {
  if (elements.menuLinks.style.display === 'block') { // is visible
    elements.menuLinks.style.display = 'none'
  } else {
    elements.menuLinks.style.display = 'block'
  }
}
