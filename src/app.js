import { readSiteIndex, setPosts, setDisplayedPosts } from './state.js'
import { elements } from './dom.js'
import { handleLoadMore, handleRouting, handleSearch, toggleMenu } from './handlers.js'
import config from './config.js'

function setEventListeners () {
  elements.menu.addEventListener('click', toggleMenu)
  elements.searchInput.addEventListener('input', handleSearch)
  elements.loadMore?.addEventListener('click', handleLoadMore)
  window.addEventListener('hashchange', handleRouting)

  // prevents form submission on Enter key
  elements.searchForm?.addEventListener('submit', (e) => {
    e.preventDefault()
    // search is already handled by the input event listener
  })
}

// initialize app
;(async () => {
  const index = await readSiteIndex(config.pathToIndex)
  setPosts(index)
  setDisplayedPosts(config.maxPosts)
  setEventListeners()
  handleRouting()
})()
