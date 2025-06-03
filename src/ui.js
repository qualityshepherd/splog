import { state } from './state.js'

const getLimitedPosts = (posts, limit) => posts.slice(0, limit)

const getFilteredPosts = (posts, searchTerm) =>
  posts.filter(post => postMatchesSearch(post, searchTerm))

const postsTemplate = post => `
  <div class="post">
    <a href="#post?s=${post.meta.slug}" role="button" aria-label="post-title">
      <h2 class="post-title">${post.meta.title}</h2>
    </a>
    <div class="date">${post.meta.date}</div>
    <div>${post.html}</div>
    <div class="tags">${renderTags(post.meta.tags)}</div>
  </div>
`

const singlePostTemplate = post => `
  <article class="post">
    <h2>${post.meta.title}</h2>
    <div class="date">${post.meta.date}</div>
    <div class="post-content">${post.html}</div>
    <div class="tags">${renderTags(post.meta.tags)}</div>
  </article>
`

const notFoundTemplate = () => '<p>Post not found.</p>'

export const aboutPageTemplate = () => `
  <h2>SPLOG2</h2>
  <div class="center">
  A simple, single page, blog written in vanilla js that supports markdown, rss, podcasts and deploys to github pages (github.io).
  </div>
`

export const renderTags = (tags, hash = '#tag') =>
  Array.isArray(tags)
    ? tags
      .map(tag => {
        // encode URI for safety
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

// DOM rendering (side effects)

export const elements = {
  main: document.querySelector('main'),
  menu: document.querySelector('#menu'),
  menuLinks: document.querySelector('nav #links'),
  searchInput: document.querySelector('#search'),
  loadMore: document.querySelector('#loadMore')
}

export function renderPosts (posts) {
  const limited = getLimitedPosts(posts, state.displayedPosts)
  elements.main.innerHTML = limited.map(postsTemplate).join('')
  toggleLoadMoreButton(state.displayedPosts < posts.length)
}

export function renderSinglePost (slug) {
  const post = state.posts.find(p => p.meta.slug === slug)
  elements.main.innerHTML = post ? singlePostTemplate(post) : notFoundTemplate()
}

export function renderAboutPage () {
  elements.main.innerHTML = aboutPageTemplate()
}

export function renderFilteredPosts () {
  const filtered = getFilteredPosts(state.posts, state.searchTerm)
  renderPosts(filtered)
  toggleLoadMoreButton(filtered.length > state.displayedPosts)
}

function toggleLoadMoreButton (shouldShow) {
  if (!elements.loadMore) return
  elements.loadMore.classList.toggle('hidden', !shouldShow)
}
