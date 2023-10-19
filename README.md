[![Deploy static content to Pages](https://github.com/qualityshepherd/splog/actions/workflows/deploy2pages.yml/badge.svg)](https://github.com/qualityshepherd/splog/actions/workflows/deploy2pages.yml)

# SPLOG
_a simple, static, single page blog that features:_

**DEMO**: https://qualityshepherd.github.io/splog/

- Markdown support for posts (with YAML metadata)
- simple `#hash` routing
- index searching
- vanilla js!
- a post indexer: `src/lib/genr8.js` (ie. no DB)
- _load more-style_ pagination
- blog rss builder
- podcast rss builder
- blog posts starting with `draft_` are skipped (not added to index)

## Setup
> assumes Node and Git...
1. clone: `git clone git@github.com:qualityshepherd/splog.git`
1. `cd splog`
1. install dependencies: `npm i`
1. add your [markdown](https://guides.github.com/features/mastering-markdown/) posts to `/posts` folder
1. edit the package.json `splog` section with your details
1. `npm start` to build index, rss and pack it
1. run web server (if needed): `npm run server` - http://lvh.me:4242/

## Updating
> when you add posts or make changes
1. run `npm start`
1. you may need to clear your browser cache to see changes

## Customizing
- edit `package.json` `splog` section to change:
  - `pathToIndex` - splog's flatfile db
  - `pathToPostsFolder` - where you keep your .md posts
  - `maxPosts` - the number of posts to display per "page"
- edit index.html (but leave `#main`)
- add/edit views/pages in `src/views` to render html (injected into `#main`)
- adjust add news views to `src/router.js`
- add posts written in Markdown (must have .md ext) to `/posts`
- run `npm start` to publish new posts (creates new index and webpack in `/dist`) and builds rss.xml

## Podcast RSS
> a script that builds an apple/spotify compatible rss xml file that you can submit to all the aggregators
1. open `lib/podRss.js` and edit the `pod` information to match your podcast
2. `npm run pod` or `npm start` to build the xml file `podRss.xml`
3. submit the link to the file (eg. `https://mydomain.com/podRss.xml`) to aggregatrors (eg. Spotify)
