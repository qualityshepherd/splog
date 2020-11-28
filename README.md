[![Codeship Status for qualityshepherd/splog](https://app.codeship.com/projects/91e3f554-3176-4d80-9448-b1070f88cca8/status?branch=master)](https://app.codeship.com/projects/417522)

# SPLOG
_a simple, single page blog that features:_

- Markdown support for posts (with YAML metadata)
- simple `#hash` routing
- index searching
- vanilla js!
- a post indexer: `src/lib/genr8.js` (ie. no DB)
- _load more-style_ pagination
- rss builder

## Customizing
- edit index.html (but leave `#main`)
- add/edit views/pages in `src/views` to render html (injected into `#main`)
- adjust add news views to `src/router.js`
- add posts written in Markdown (must have .md ext) to `/posts`
- run `npm start` to publish new posts (creates new index and webpack in `/dist`) and builds rss.xml

## Setup
> assumes Node and Git...
1. clone: `git clone git@github.com:qualityshepherd/splog.git`
1. `cd splog`
1. install dependencies: `npm i`
1. build index and pack it: `npm start`
1. run web server (if needed): `npm run server` - http://lvh.me:4242/

## Demo
My blog is running on splog! https://qualityshepherd.com