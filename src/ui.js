import { getPosts, getDisplayedPosts, getSearchTerm } from './state.js'
import { elements } from './dom.js'
import {
  postsTemplate,
  singlePostTemplate,
  notFoundTemplate,
  aboutPageTemplate,
  archiveTemplate
} from './templates.js'

export const getLimitedPosts = (posts, limit) => posts.slice(0, limit)

export const renderTags = (tags, hash = '#tag') =>
  Array.isArray(tags)
    ? tags
      .map(tag => {
        const safeTag = encodeURIComponent(tag.toLowerCase())
        return `<a href="${hash}?t=${safeTag}" class="tag" role="button" aria-label="Filter by tag: ${tag}">${tag}</a>`
      })
      .join(' ')
    : ''

export const postMatchesSearch = (post, searchTerm) => {
  if (!searchTerm) return true

  const terms = searchTerm.toLowerCase().split(' ').filter(Boolean)

  return terms.every(term =>
    (post.meta.title || '').toLowerCase().includes(term) ||
    (post.markdown || '').toLowerCase().includes(term) ||
    (post.meta.tags || []).some(tag => tag.toLowerCase().includes(term))
  )
}

// Updated to accept posts and limit as parameters instead of using global state
export function renderPosts (posts, limit = null) {
  const displayLimit = limit ?? getDisplayedPosts()
  const limited = getLimitedPosts(posts, displayLimit)
  elements.main.innerHTML = limited.map(postsTemplate).join('')
  toggleLoadMoreButton(displayLimit < posts.length)
}

export function renderSinglePost (slug) {
  const posts = getPosts()
  const post = posts.find(p => p.meta.slug === slug)
  elements.main.innerHTML = post ? singlePostTemplate(post) : notFoundTemplate()
}

export function renderAboutPage () {
  elements.main.innerHTML = aboutPageTemplate()
}

export function renderArchive (posts) {
  elements.main.innerHTML = posts.map(archiveTemplate).join('')
}

export function renderNotFoundPage () {
  elements.main.innerHTML = notFoundTemplate()
}

export function renderFilteredPosts () {
  const posts = getPosts()
  const searchTerm = getSearchTerm()
  const displayedCount = getDisplayedPosts()

  const filtered = posts.filter(post =>
    postMatchesSearch(post, searchTerm)
  )

  renderPosts(filtered, filtered.length)
  toggleLoadMoreButton(filtered.length > displayedCount)
}

export function toggleLoadMoreButton (shouldShow = false) {
  if (!elements.loadMore) return
  elements.loadMore.classList.toggle('show', shouldShow)
}
