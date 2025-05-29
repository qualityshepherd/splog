/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _package__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);


const maxPosts = _package__WEBPACK_IMPORTED_MODULE_1__.splog.maxPosts

const blog = {
  async render (params) {
    const numPosts = params.get('numPosts') ? Number(params.get('numPosts')) + maxPosts : maxPosts
    const index = await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.readSiteIndex)()
    const publishedPosts = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.removeFuturePosts)(index) // don't display posts with future date
    const canonicalLink = `<link rel="canonical" href="${_package__WEBPACK_IMPORTED_MODULE_1__.splog.url}">` // seo

    let posts = publishedPosts.slice(0, numPosts).map(post => {
      // Split content at <break> tag
      const [preview, fullContent] = post.html.split('<break>');

      return `
        <div class="post">
          <a href="#post?s=${post.meta.slug}" aria-label="post-title"><h2 class="post-title">${post.meta.title}</h2></a>
          <div class="date">${post.meta.date}</div>
          <div>
            ${preview}
            ${fullContent ? `
              <div class="post-break">
                <a href="#post?s=${post.meta.slug}" class="read-more">Read more...</a>
              </div>
            ` : ''}
          </div>
          <span class="tags">${(0,_utils__WEBPACK_IMPORTED_MODULE_0__.renderTags)(post.meta.tags)}</span>
        </div>
      `
    }).join('\n')

    const morePostsBtn = `
      <div class="container center">
        <a href="#blog?numPosts=${numPosts}" aria-label="more-posts"><button id="more-posts">More posts...</button></a>
      </div>
      `
    // only show button if there are more to load
    if (numPosts < publishedPosts.length) posts += morePostsBtn
    posts += canonicalLink // for seo
    return posts
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (blog);


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getJsonData: () => (/* binding */ getJsonData),
/* harmony export */   readSiteIndex: () => (/* binding */ readSiteIndex),
/* harmony export */   removeFuturePosts: () => (/* binding */ removeFuturePosts),
/* harmony export */   renderTags: () => (/* binding */ renderTags),
/* harmony export */   sortBy: () => (/* binding */ sortBy),
/* harmony export */   sortByDate: () => (/* binding */ sortByDate)
/* harmony export */ });
/* harmony import */ var _package__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);


/**
 * Functions shared among pages...
 * Note: fetch is provided in the browser...
 */

function removeFuturePosts (posts) {
  return posts.filter(post => new Date(post.meta.date) <= new Date())
}

async function readSiteIndex (pathToIndex = _package__WEBPACK_IMPORTED_MODULE_0__.splog.pathToIndex) {
  const data = await fetch(pathToIndex)
    .catch(err => { console.log(err) })
  const index = await data.json()
  return index.sort(sortByDate())
}

function sortBy (prop) {
  return (a, b) => {
    return (a[prop] > b[prop]) ? 1 : (a[prop] < b[prop]) ? -1 : 0
  }
}

function sortByDate (asc = true) {
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

function renderTags (tagString, hash = '#tags') {
  if (tagString) {
    return tagString.toLowerCase().split(/,\s?/).map(tag => {
      return `<a href="${hash}?t=${tag}" aria-label="${tag}-tag">${tag}</a>`
    }).join(', ')
  }
}

async function getJsonData (path) {
  const data = await fetch(path)
  return await data.json()
}


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"name":"brine","description":"Welcome to my world...","version":"1.0.0","author":"brine","license":"MIT","main":"index.html","splog":{"title":"World of Brine","description":"Playing worlds and podcasting...","url":"https://brine.dev","pathToIndex":"./src/data/siteIndex.json","pathToPostsFolder":"./assets/posts","pathToRssFolder":"./assets/rss","maxPosts":"12"},"standard":{"globals":["location"]},"scripts":{"pretty":"standard --fix","pack":"webpack","purge":"curl -X POST \\"https://api.cloudflare.com/client/v4/zones/$BRINE_TOKEN/purge_cache\\" -H \\"Authorization: Bearer $BEARER\\" -H \\"Content-Type: application/json\\" --data \'{\\"purge_everything\\":true}\'","build:index":"./node_modules/.bin/babel-node src/lib/genr8Index.js","rss:blog":"./node_modules/.bin/babel-node src/lib/genr8Blog.js","rss:sitemap":"./node_modules/.bin/babel-node src/lib/genr8Sitemap.js","start":"npm run build:index && npm run rss:blog && npm run rss:sitemap && npm run pack","server":"http-server -p 4242","restart":"npm start; npm run server"},"dependencies":{"@babel/plugin-transform-object-rest-spread":"^7.22.15","http-server":"^14.1.1","showdown":"^2.1.0","standard":"^17.1.0","webpack":"^5.2.0","webpack-cli":"^5.1.4"},"devDependencies":{"@babel/core":"^7.11.4","@babel/node":"^7.10.5","@babel/plugin-proposal-object-rest-spread":"^7.11.0","@babel/plugin-proposal-throw-expressions":"^7.10.4","@babel/plugin-transform-runtime":"^7.11.5","@babel/preset-env":"^7.11.0","sitemap-webpack-plugin":"^1.1.1"}}');

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _package__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);



// single blog post...
const post = {
  async render (params) {
    const index = await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.readSiteIndex)()
    const post = index.find(post => {
      return post.meta.slug === params.get('s')
    })

    return `
        <link rel="canonical" href="${_package__WEBPACK_IMPORTED_MODULE_1__.splog.url}/#post">
        <div class="post">
          <a href="#post?s=${post.meta.slug}" aria-label="post-title"><h2 class="post-title">${post.meta.title}</h2></a>
          <div class="date">${post.meta.date}</div>
          <div>${post.html}</div>
          <span class="tags">${(0,_utils__WEBPACK_IMPORTED_MODULE_0__.renderTags)(post.meta.tags)}</span>
        </div>
      `
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (post);


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const about = {
  render () {
    return `
      <h2>About</h2>

      <div class="center">
        I'm a blabby nerd that lives in the desert.
        <div class="social">
          <a href='&#109;a&#105;l&#116;o&#58;m%65%4&#48;b&#114;&#105;n%65&#46;%64e&#118;' title="email"><img src="assets/images/social/email.png" alt="email"></a>
          <a href="https://casadeocio.itch.io/" title="games on itch"><img src="assets/images/social/itch-io.png" alt="my publications on itch"></a>
          <a href="https://podcasts.apple.com/au/podcast/play-worlds-podcast/id1722152993" title="Play Worlds Podcast"><img src="assets/images/social/podcast.png" alt="Play Worlds Podcast"></a>
          <a href="https://www.youtube.com/channel/UCy0_3iGguFBabUOdQ2o_ZUQ" title="youtube"><img src="assets/images/social/youtube.png" alt="youtube"></a>
          <a href="/assets/rss/blog.xml"><img src="assets/images/social/rss.png" title="blog rss" alt="blog rss"></a>
        </div>
      </div>
    `
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (about);


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);


const tags = {
  async render (params) {
    const t = params.get('t')
    const index = await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.readSiteIndex)()
    const publishedPosts = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.removeFuturePosts)(index)
    const found = await publishedPosts.filter(({ meta }) => {
      return meta.tags.toLowerCase().indexOf(t.toLowerCase()) > -1
    })

    const posts = found.map(post => {
      return `
        <div class="post">
          <a href="#post?s=${post.meta.slug}"><h2 class="post-title">${post.meta.title}</h2></a>
          <div class="date">${post.meta.date}</div>
          <div>${post.html}</div>
          <span class="tags">${(0,_utils__WEBPACK_IMPORTED_MODULE_0__.renderTags)(post.meta.tags)}</span>
        </div>
      `
    }).join('\n')

    const noResults = `
      <h2>No Results Found</h2>
    `
    return (posts.length > 0) ? posts : noResults
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tags);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);


const search = {
  async render (params) {
    const q = params.get('q').toLowerCase()
    const index = await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.readSiteIndex)()
    const publishedPosts = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.removeFuturePosts)(index)
    const found = await publishedPosts.filter(({ meta, html }) => {
      return meta.title.toLowerCase().indexOf(q) > -1 ||
             meta.tags.toLowerCase().indexOf(q) > -1 ||
             html.toLowerCase().indexOf(q) > -1
    })

    const posts = found.map(post => {
      return `
        <article class="post">
          <a href="#post?s=${post.meta.slug}"><h2 class="post-title">${post.meta.title} - ${post.meta.date}</h2></a>
        </article>
        `
    }).join('\n')

    const noResults = `
      <h2 id="no-results">No Results Found...</h2>
    `
    return (posts.length > 0) ? posts : noResults
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (search);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const error = {
  render () {
    return `
      <h2>404 Not Found...</h2>
    `
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (error);


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);


const archive = {
  async render (params) {
    const index = await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.readSiteIndex)()
    const publishedPosts = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.removeFuturePosts)(index)

    const posts = publishedPosts.map(post => {
      return `
      <p>
        <a href="#post?s=${post.meta.slug}"><span class="archive">${post.meta.title}</span></a>
        <span class="date">${post.meta.date}</span>
      </p>
      `
    }).join('\n')

    const noResults = `
      <h2>No Results Found</h2>
    `
    return (posts.length > 0) ? posts : noResults
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (archive);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _views_blog_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _views_post_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _views_about_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony import */ var _views_tags_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);
/* harmony import */ var _views_search_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7);
/* harmony import */ var _views_error_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8);
/* harmony import */ var _views_archive_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9);








/**
 * To add pages:
 * 1. import your page/view/whatever
 * 2. add the hash and page to the routes object
 * 3. profit
 */
const routes = {
  '#blog': _views_blog_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  '#post': _views_post_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  '#about': _views_about_js__WEBPACK_IMPORTED_MODULE_2__["default"],
  '#tags': _views_tags_js__WEBPACK_IMPORTED_MODULE_3__["default"],
  '#search': _views_search_js__WEBPACK_IMPORTED_MODULE_4__["default"],
  '#error': _views_error_js__WEBPACK_IMPORTED_MODULE_5__["default"],
  '#archive': _views_archive_js__WEBPACK_IMPORTED_MODULE_6__["default"]
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

/******/ })()
;
//# sourceMappingURL=main.js.map