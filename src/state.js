import { readFile } from 'fs/promises'
import config from './config.js'

export const state = {
  posts: [],
  displayedPosts: config.maxPosts,
  searchTerm: ''
}

export async function readSiteIndex (pathToIndex) {
  try {
    const data = await readFile(pathToIndex, 'utf-8')
    const index = JSON.parse(data)

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

// fix Safari date parsing (replaces dashes with slashes).
function parseDate (str) {
  return new Date(str.replace(/-/g, '/'))
}
