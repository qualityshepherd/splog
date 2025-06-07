import { state } from './state.js'
import { elements } from './dom.js'
import { postsTemplate, singlePostTemplate, notFoundTemplate, aboutPageTemplate, archiveTemplate } from './templates.js'

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

export function renderPosts (postsToRender, limit) {
  const limited = getLimitedPosts(postsToRender, limit)
  elements.main.innerHTML = limited.map(postsTemplate).join('')
  toggleLoadMoreButton(limit < postsToRender.length)
}

export function renderSinglePost (slug) {
  const post = state.posts.find(p => p.meta.slug === slug)
  elements.main.innerHTML = post ? singlePostTemplate(post) : notFoundTemplate()
}

export function renderAboutPage () {
  elements.main.innerHTML = aboutPageTemplate()
}

export function renderArchive (posts) {
  elements.main.innerHTML = posts.map(archiveTemplate).join('')
}

export function renderFilteredPosts () {
  const filtered = state.posts.filter(post =>
    postMatchesSearch(post, state.searchTerm)
  )
  renderPosts(filtered, filtered.length) // no pagination
}

export function renderNotFoundPage () {
  elements.main.innerHTML = notFoundTemplate()
}

export function toggleLoadMoreButton (shouldShow = false) {
  if (!elements.loadMore) return
  elements.loadMore.classList.toggle('show', shouldShow)
}
