# SPLOG v2

A simple, single-page blog written in vanilla JS that supports Markdown, RSS, podcasts, and deploys to GitHub Pages.

[DEMO](https://splog.brine.dev)

## Features
- Static site (no server needed)
- Hash-based routing
- Write posts in Markdown
- Index generation + Markdown to HTML via [marked](https://github.com/markedjs/marked)
- Vanilla JavaScript (no frameworks)
- RSS feeds for blog, podcast, and sitemap
- Easy deployment to GitHub Pages

## Install
1. `git clone git@github.com:qualityshepherd/splog.git`
1. `cd splog`
1. `npm install`       # install dependencies
1. `npm run server`    # (optional) local dev server

## Setup
- edit `config.js` to customize your blog settings
- add Markdown-formatted posts to the `/posts` folder
- each post should include frontmatter (meta) like `title`, `date`, and `tags`
- run the index generator to rebuild `index.json` from your posts
- (optional) `npm run server` to preview your blog locally

## Adding Pages
1. in `handlers.js`, add a new route to `ROUTES`
1. add a function to render your page content
1. modify `handleRouting()` to handle your new route:
1. link to the page in `index.html`
