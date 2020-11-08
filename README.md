[![Codeship Status for qualityshepherd/splog](https://app.codeship.com/projects/91e3f554-3176-4d80-9448-b1070f88cca8/status?branch=master)](https://app.codeship.com/projects/417522)

# SPLOG
_a simple, single page blog that features:_

- posts written in Markdown (with YAML metadata) (`/posts`)
- includes simple `#hash` routing
- includes index searching
- is written in vanilla js
- a post indexer (`src/lib/genr8.js`)

## Customizing
- edit index.html (but leave `#main` and `script`s)
- add/edit pages in `src/pages` to render html (injected into `#main`)
- adjust `src/index.js` to match pages/routing
- add posts written in Markdown (must have .md ext) in `/posts`
- run `npm start` to publish new posts

## Setup
> assumes Node and Git...
1. clone: `git clone git@github.com:qualityshepherd/splog.git`
1. install dependencies: `npm i`
1. build index and pack it: `npm start`
1. run web server (if needed): `npm run server`
goto:
http://lvh.me:4242/

## Demo
My personal site is running on splog: https://qualityshepherd.com