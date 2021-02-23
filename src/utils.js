import { splog } from '../package'

/**
 * Functions shared among pages...
 * Note: fetch is provided in the browser...
 */

export async function readSiteIndex(pathToIndex = splog.pathToIndex) {
  const data = await fetch(pathToIndex)
    .catch(err => { err })
  return await data.json()
}

export function sortBy(prop) {
  return (a, b) => {
    return (a[prop] > b[prop]) ? 1 : (a[prop] < b[prop]) ? -1 : 0
  }
}

export function sortByDate(asc = true) {
  return (a, b) => {
    a = new Date(a.meta.date)
    b = new Date(b.meta.date)
    if(asc) {
      return (a < b )? 1 : a > b ? -1 : 0
    } else {
      return (a > b) ? 1 : a < b ? -1 : 0
    }
  }
}

export function renderTags(tagString) {
  if(tagString) {
    return tagString.toLowerCase().split(',').map(tag => {
      return `<a href="#tags?t=${tag}">${tag}</a>`
    }).join(', ')
  }
}

export function getFirstImgSrc(htmlString) {
  const img = htmlString.match(/assets.*\.(gif|jpe?g|png)/);
  return img[0]
}