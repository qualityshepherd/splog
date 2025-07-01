import config from './config.js'

const initialState = {
  posts: [],
  displayedPosts: config.maxPosts,
  searchTerm: ''
}

// state container
let currentState = { ...initialState }

export const getState = () => ({ ...currentState })
export const getPosts = () => [...currentState.posts]
export const getDisplayedPosts = () => currentState.displayedPosts
export const getSearchTerm = () => currentState.searchTerm

export const updateState = (updates) => {
  currentState = { ...currentState, ...updates }
  return getState()
}

export const setPosts = (posts) => updateState({ posts: [...posts] })
export const setDisplayedPosts = (count) => updateState({ displayedPosts: count })
export const setSearchTerm = (term) => updateState({ searchTerm: term })
export const incrementDisplayedPosts = (increment = config.maxPosts) =>
  updateState({ displayedPosts: currentState.displayedPosts + increment })

export const resetState = () => {
  currentState = { ...initialState }
  return getState()
}

// utility functions
export async function readSiteIndex (pathToIndex) {
  try {
    const res = await fetch(pathToIndex)
    validateResponse(res)

    const index = await res.json()

    return sortByDate(
      removeFuturePosts(index)
    )
  } catch (err) {
    console.error('❌ Failed to load index.json:', err)
    return []
  }
}

export function removeFuturePosts (posts) {
  const now = new Date()
  return posts.filter(post => parseDate(post.meta.date) <= now)
}

export function sortByDate (posts, desc = true) {
  return [...posts].sort((a, b) => {
    const dateA = parseDate(a.meta.date)
    const dateB = parseDate(b.meta.date)
    return desc ? dateB - dateA : dateA - dateB
  })
}

export function sortBy (prop) {
  return (a, b) =>
    a[prop] > b[prop]
      ? 1
      : a[prop] < b[prop]
        ? -1
        : 0
}

function parseDate (str) {
  return new Date(str.replace(/-/g, '/'))
}

function validateResponse (res) {
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} - ${res.statusText}`)
  }
}
