// We use getters so DOM access is lazy — the actual query happens only when you
// access the property. This helps in tests where document might not be defined
// (e.g., in Node), because just importing this object doesn’t trigger DOM access.
export const elements = {
  get main () { return document.querySelector('main') },
  get menu () { return document.querySelector('#menu') },
  get menuLinks () { return document.querySelector('nav #links') },
  get searchInput () { return document.querySelector('#search') },
  get loadMore () { return document.querySelector('#load-more') }
}
