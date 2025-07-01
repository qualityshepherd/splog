import config from './config.js'
import { elements } from './dom.js'
import {
  getPosts,
  getDisplayedPosts,
  setDisplayedPosts,
  setSearchTerm,
  incrementDisplayedPosts
} from './state.js'
import {
  renderAboutPage,
  renderArchive,
  renderFilteredPosts,
  renderNotFoundPage,
  renderPosts,
  renderSinglePost,
  toggleLoadMoreButton
} from './ui.js'

// to add routes, add the route here and the handler to routeHandlers
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
    setDisplayedPosts(config.maxPosts)
    const posts = getPosts()
    const displayedCount = getDisplayedPosts()

    renderPosts(posts, displayedCount)
    toggleLoadMoreButton(displayedCount < posts.length)
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
      const posts = getPosts()
      const filtered = filterPostsByTag(posts, tag)
      renderPosts(filtered, filtered.length)
    }
  },

  [ROUTES.ARCHIVE]: () => {
    renderArchive(getPosts())
  },

  [ROUTES.SEARCH]: ({ params }) => {
    const query = params.get('q')
    if (query) {
      setSearchTerm(query.toLowerCase())

      // update the search input to reflect the URL query
      if (elements.searchInput) {
        elements.searchInput.value = query
      }
      renderFilteredPosts()
    } else {
      // no query parameter, show all posts
      setSearchTerm('')
      const posts = getPosts()
      renderPosts(posts, posts.length)
    }
  },

  default: ({ params }) => {
    renderNotFoundPage()
  }
}

export function handleRouting () {
  const { route, params } = getRouteParams()
  setSearchTerm('')

  // hide load-more button by default for all routes
  toggleLoadMoreButton(false)

  const handler = routeHandlers[route] || routeHandlers.default
  handler({ params })
}

export function handleSearch (e) {
  const searchValue = e.target.value.toLowerCase()
  setSearchTerm(searchValue)

  // update URL to reflect search (optional - for better UX)
  if (searchValue) {
    history.replaceState(null, '', `#search?q=${encodeURIComponent(e.target.value)}`)
  } else {
    history.replaceState(null, '', '#')
  }

  renderFilteredPosts()
}

export function handleLoadMore () {
  incrementDisplayedPosts()
  const posts = getPosts()
  const displayedCount = getDisplayedPosts()
  renderPosts(posts, displayedCount)
}

export function toggleMenu () {
  const toggleDisplay = el =>
    (el.style.display = el.style.display === 'block' ? 'none' : 'block')

  toggleDisplay(elements.menuLinks)
}
