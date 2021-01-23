/**
 * Functions shared among pages...
 * Note: fetch is provided in the browser...
 */

export async function readSiteIndex(pathToSiteIndex) {
  const data = await fetch(pathToSiteIndex)
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
    a = new Date(a.date)
    b = new Date(b.date)
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