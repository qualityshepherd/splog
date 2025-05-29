import blog from './views/blog.js'
import post from './views/post.js'
import about from './views/about.js'
import tags from './views/tags.js'
import search from './views/search.js'
import error from './views/error.js'
import archive from './views/archive.js'

/**
 * To add pages:
 * 1. import your page/view/whatever
 * 2. add the hash and page to the routes object
 * 3. profit
 */
const routes = {
  '#blog': blog,
  '#post': post,
  '#about': about,
  '#tags': tags,
  '#search': search,
  '#error': error,
  '#archive': archive
}

/**
 * grab the hash, call the route and stuff it into the dom!
 */
const router = async () => {
  const { hash, params } = await getHash()
  document.querySelector('main').innerHTML = await routes[hash].render(params)
  setActiveNav(hash)
}

/**
 * set the active nav element if it exists
 * @param  {string} hash
 */
const setActiveNav = async (hash) => {
  const nav = document.querySelector(`[href="${hash}"]`)
  if (nav) {
    document.querySelector('.active').classList.remove('active')
    nav.classList.add('active')
  }
}

/**
 * grabs the hash and handles defaults/errors
 * @return {obj}
 */
const getHash = async () => {
  let [hash, params] = await location.hash.split('?')
  params = new URLSearchParams(params) // need this semi!

  if (hash === '' || hash === '/') {
    hash = '#blog'
  }

  if (!routes[hash]) {
    hash = '#error'
  }
  return { hash, params }
}

// and we're listening...
window.addEventListener('hashchange', router)
window.addEventListener('load', router)
window.addEventListener('keyup', e => {
  if (e.keyCode === 27) {
    toggleHamburger() // eslint-disable-line
  }
})
