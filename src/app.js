import { readSiteIndex, state } from './state.js'
import { elements, renderPosts } from './ui.js'
import { handleLoadMore, handleRouting, handleSearch, toggleMenu } from './handlers.js'
import config from './config.js'

elements.menu.addEventListener('click', toggleMenu)
elements.searchInput.addEventListener('input', handleSearch)
window.addEventListener('hashchange', handleRouting)
window.addEventListener('DOMContentLoaded', handleRouting)
elements.loadMore?.addEventListener('click', handleLoadMore)

// initial render
;(async () => {
  const index = await readSiteIndex(config.pathToIndex)
  state.posts = index
  renderPosts(state.posts.slice(0, state.displayedPosts))
})()
