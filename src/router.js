import blog from './views/blog.js'
import post from './views/post.js'
import about from './views/about.js'
import error from './views/error.js'
import search from './views/search.js'
import tags from './views/tags.js'

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
  '#error': error,
  '#search': search,
  '#tags': tags
}

/**
 * grab the hash, call the route and stuff it into the dom!
 */
const router = async () => {
  const {hash, params} = await getHash()
  document.querySelector('#main').innerHTML = await routes[hash].render(params)
}

/**
 * grabs the hash and handles defaults/errors
 * @return {obj}
 */
const getHash = async () => {
  let [hash, params] = await location.hash.split('?')
  params = new URLSearchParams(params); // need this semi!

  (hash === '' || hash === '/') ? hash = '#blog' : hash; // need this semi too!
  (!routes[hash]) ? hash = '#error' : hash // handle 404s
  return {hash, params}
}

// and we're listening...
window.addEventListener('hashchange', router)
window.addEventListener('load', router)