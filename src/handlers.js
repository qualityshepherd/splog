import config from './config.js'
import { state } from './state.js'
import { elements, renderAboutPage, renderArchive, renderFilteredPosts, renderPosts, renderSinglePost, toggleLoadMoreButton } from './ui.js'

const ROUTES = {
  HOME: '',
  POST: '#post',
  ABOUT: '#about',
  TAG: '#tag',
  ARCHIVE: '#archive'
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

const getVisiblePosts = (posts, limit) => posts.slice(0, limit)

// Core router logic (pure routing -> effect)
const routeHandlers = {
  [ROUTES.POST]: ({ params }) => {
    const slug = params.get('s')
    if (slug) renderSinglePost(slug)
  },

  [ROUTES.ABOUT]: () => {
    renderAboutPage()
    toggleLoadMoreButton(false)
  },

  [ROUTES.TAG]: ({ params }) => {
    const tag = params.get('t')
    if (tag) {
      const filtered = filterPostsByTag(state.posts, tag)
      renderPosts(filtered)
    }
  },

  [ROUTES.ARCHIVE]: () => {
    renderArchive(state.posts)
    toggleLoadMoreButton(false)
  },

  default: () => {
    const postsToShow = getVisiblePosts(state.posts, state.displayedPosts)
    renderPosts(postsToShow)
  }
}

export function handleRouting () {
  const { route, params } = getRouteParams();
  (routeHandlers[route] || routeHandlers.default)({ params })
}

export function handleSearch (e) {
  const normalizeInput = input => input.toLowerCase()
  state.searchTerm = normalizeInput(e.target.value)
  renderFilteredPosts()
}

export function handleLoadMore () {
  state.displayedPosts += config.maxPosts

  renderPosts(state.posts) // Let renderPosts slice internally

  const allPostsShown = state.displayedPosts >= state.posts.length
  if (allPostsShown) elements.loadMore?.remove()
}

export function toggleMenu () {
  const toggleDisplay = el =>
    (el.style.display = el.style.display === 'block' ? 'none' : 'block')

  toggleDisplay(elements.menuLinks)
}
