import config from './config.js'
import { elements } from './dom.js'
import { state } from './state.js'
import { renderAboutPage, renderArchive, renderFilteredPosts, renderNotFoundPage, renderPosts, renderSinglePost, toggleLoadMoreButton } from './ui.js'

const ROUTES = {
  HOME: '',
  POST: '#post',
  ABOUT: '#about',
  TAG: '#tag',
  ARCHIVE: '#archive',
  SEARCH: '#search'
}

const getRouteParams = () => {
  const [route, query] = location.hash.split('?')
  const params = new URLSearchParams(query)
  return { route, params }
}

const normalize = str => String(str || '').toLowerCase()

const filterPostsByTag = (posts, tag) =>
  posts.filter(post =>
    post.meta.tags?.some(t => normalize(t) === normalize(tag))
  )

const routeHandlers = {
  [ROUTES.HOME]: ({ params }) => {
    state.displayedPosts = config.maxPosts
    renderPosts(state.posts, state.displayedPosts) // paginated
    // Only show load-more if there are more posts to load
    if (state.displayedPosts < state.posts.length) {
      toggleLoadMoreButton(true)
    }
  },

  [ROUTES.POST]: ({ params }) => {
    const slug = params.get('s')
    if (slug) renderSinglePost(slug)
  },

  [ROUTES.ABOUT]: () => {
    renderAboutPage()
  },

  [ROUTES.TAG]: ({ params }) => {
    const tag = params.get('t')
    if (tag) {
      const filtered = filterPostsByTag(state.posts, tag)
      renderPosts(filtered, filtered.length)
    }
  },

  [ROUTES.ARCHIVE]: () => {
    renderArchive(state.posts)
  },

  [ROUTES.SEARCH]: ({ params }) => {
    const query = params.get('q')
    if (query) {
      state.searchTerm = query.toLowerCase()
      // Update the search input to reflect the URL query
      if (elements.searchInput) {
        elements.searchInput.value = query
      }
      renderFilteredPosts()
    } else {
      // No query parameter, show all posts
      state.searchTerm = ''
      renderPosts(state.posts, state.posts.length)
    }
  },

  default: ({ params }) => {
    renderNotFoundPage()
  }
}

export function handleRouting () {
  const { route, params } = getRouteParams()
  state.searchTerm = '' // Clear search term on route change

  // Hide load-more button by default for all routes
  toggleLoadMoreButton()

  const handler = routeHandlers[route] || routeHandlers.default
  handler({ params })
}

export function handleSearch (e) {
  const normalizeInput = input => input.toLowerCase()
  state.searchTerm = normalizeInput(e.target.value)

  // Update URL to reflect search (optional - for better UX)
  if (state.searchTerm) {
    history.replaceState(null, '', `#search?q=${encodeURIComponent(e.target.value)}`)
  } else {
    history.replaceState(null, '', '#')
  }

  renderFilteredPosts()
}

export function handleLoadMore () {
  state.displayedPosts += config.maxPosts
  renderPosts(state.posts, state.displayedPosts)
}

export function toggleMenu () {
  const toggleDisplay = el =>
    (el.style.display = el.style.display === 'block' ? 'none' : 'block')

  toggleDisplay(elements.menuLinks)
}
