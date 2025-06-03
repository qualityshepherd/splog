import config from './config.js'

export const state = {
  posts: [],
  displayedPosts: config.maxPosts,
  searchTerm: ''
}

export async function readSiteIndex (pathToIndex) {
  try {
    const res = await fetch(pathToIndex)
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`)
    const index = await res.json()
    return removeFuturePosts(index).sort(sortByDate())
  } catch (err) {
    console.error('❌ Failed to load index.json:', err)
    return []
  }
}

export function removeFuturePosts (posts) {
  return posts.filter(post => new Date(post.meta.date) <= new Date())
}

export function sortBy (prop) {
  return (a, b) => {
    return (a[prop] > b[prop]) ? 1 : (a[prop] < b[prop]) ? -1 : 0
  }
}

export function sortByDate (desc = true) {
  return (a, b) => {
    a = new Date(a.meta.date.replace(/-/g, '/')) // because safari is trash
    b = new Date(b.meta.date.replace(/-/g, '/'))
    if (desc) {
      return (a > b) ? 1 : a < b ? -1 : 0
    } else {
      return (a < b) ? 1 : a > b ? -1 : 0
    }
  }
}
