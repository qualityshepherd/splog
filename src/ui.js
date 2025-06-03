import { state } from './state.js'

export const elements = {
  main: document.querySelector('main'),
  menu: document.querySelector('#menu'),
  menuLinks: document.querySelector('nav #links'),
  searchInput: document.querySelector('#search'),
  loadMore: document.querySelector('#loadMore')
}

export function renderPosts (posts) {
  const limited = posts.slice(0, state.displayedPosts)

  elements.main.innerHTML = limited.map(post => `
    <div class="post">
      <a href="#post?s=${post.meta.slug}" role="button" aria-label="post-title">
        <h2 class="post-title">${post.meta.title}</h2>
      </a>
      <div class="date">${post.meta.date}</div>
      <div>${post.html}</div>
      <div class="tags">${renderTags(post.meta.tags)}</div>
    </div>
  `).join('')

  // Show or hide the "Load More" button
  if (state.displayedPosts < state.posts.length) {
    elements.loadMore.classList.remove('hidden')
  } else {
    elements.loadMore.classList.add('hidden')
  }
}

export function renderSinglePost (slug) {
  const post = state.posts.find(p => p.meta.slug === slug)
  if (!post) {
    elements.main.innerHTML = '<p>Post not found.</p>'
    return
  }

  elements.main.innerHTML = `
    <article class="post">
      <h2>${post.meta.title}</h2>
      <div class="date">${post.meta.date}</div>
      <div class="tags">${renderTags(post.meta.tags)}</div>
      <div class="post-content">${post.html}</div>
    </article>
  `
}

/**
 * Filters posts based on the current search term and renders the filtered results.
 */
export function renderFilteredPosts () {
  const filteredPosts = state.posts.filter(post =>
    postMatchesSearch(post, state.searchTerm)
  )
  renderPosts(filteredPosts)
  elements.loadMore.style.display =
    filteredPosts.length > state.displayedPosts ? 'block' : 'none'
}

export function renderTags (tagArray, hash = '#tag') {
  if (!Array.isArray(tagArray)) return ''

  return tagArray.map(tag => {
    const safeTag = encodeURIComponent(tag.toLowerCase())
    return `<a href="${hash}?t=${safeTag}" class="tag" role="button" aria-label="Filter by tag: ${tag}">${tag}</a>`
  }).join(' ')
}

/**
 * Checks if a post matches the search term.
 */
export function postMatchesSearch (post, searchTerm) {
  if (!searchTerm) return true
  const searchTerms = searchTerm.toLowerCase().split(' ').filter(Boolean)

  return searchTerms.every(term => {
    return (
      (post.meta.title || '').toLowerCase().includes(term) ||
       (post.markdown || '').toLowerCase().includes(term) ||
       (post.meta.tags || []).some(tag => tag.toLowerCase().includes(term))
    )
  })
}
