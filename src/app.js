import { readSiteIndex, state } from './state.js'
import { elements } from './dom.js'
import { handleLoadMore, handleRouting, handleSearch, toggleMenu } from './handlers.js'
import config from './config.js'

// event listeners
elements.menu.addEventListener('click', toggleMenu)
elements.searchInput.addEventListener('input', handleSearch)
elements.loadMore?.addEventListener('click', handleLoadMore)
window.addEventListener('hashchange', handleRouting)

;(async () => {
  const index = await readSiteIndex(config.pathToIndex)
  state.posts = index
  state.displayedPosts = config.maxPosts
  handleRouting()
})()
