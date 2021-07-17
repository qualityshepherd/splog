[![Codeship Status for qualityshepherd/splog](https://app.codeship.com/projects/91e3f554-3176-4d80-9448-b1070f88cca8/status?branch=master)](https://app.codeship.com/projects/417522)

# SPLOG
_a simple, single page blog that features:_

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

## Testing
> run test with [Testcafe](https://testcafe.io/)
1. build it: `npm start`
1. start server: `npm run server`
1. run all tests: `npm test`
1. run all tests headless: `npm run headless`
1. run an individual test: `npm run testcafe chrome e2e/tests/blogTest.js`

## Podcast RSS
> a script that builds an apple/spotify compatible rss xml file that you can submit to all the aggregators
1. open `lib/podRss.js` and edit the `pod` information to match your podcast
2. `npm run pod` or `npm start` to build the xml file `podRss.xml`
3. submit the link to the file (eg. `https://mydomain.com/podRss.xml`) to aggregatrors (eg. Spotify)

## Demo
My blog is running on splog! https://qualityshepherd.com