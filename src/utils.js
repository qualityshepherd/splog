import config from '../package'

/**
 * Functions shared among pages...
 * Note: fetch is provided in the browser...
 */

export function removeFuturePosts (posts) {
  return posts.filter(post => new Date(post.meta.date) <= new Date())
}

export async function readSiteIndex (pathToIndex = config.splog.pathToIndex) {
  const data = await fetch(pathToIndex)
    .catch(err => { console.log(err) })
  const index = await data.json()
  return index.sort(sortByDate()) // index is sorted ASC by default...
}

export function sortBy (prop) {
  return (a, b) => {
    return (a[prop] > b[prop]) ? 1 : (a[prop] < b[prop]) ? -1 : 0
  }
}

export function sortByDate (asc = true) {
  return (a, b) => {
    a = new Date(a.meta.date.replace(/-/g, '/')) // because safari is trash
    b = new Date(b.meta.date.replace(/-/g, '/'))
    if (asc) {
      return (a < b) ? 1 : a > b ? -1 : 0
    } else {
      return (a > b) ? 1 : a < b ? -1 : 0
    }
  }
}

export function renderTags (tagString, hash = '#tags') {
  if (tagString) {
    return tagString.toLowerCase().split(/,\s?/).map(tag => {
      return `<a href="${hash}?t=${tag}" role="button" aria-label="${tag}-tag">${tag}</a>`
    }).join(', ')
  }
}

export async function getJsonData (path) {
  const data = await fetch(path)
  return await data.json()
}
