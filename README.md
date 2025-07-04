[![Deploy to Pages](https://github.com/qualityshepherd/splog/actions/workflows/deploy2pages.yml/badge.svg)](https://github.com/qualityshepherd/splog/actions/workflows/deploy2pages.yml)

# SPLOG v2

A simple, single-page blog written in functional, vanilla JS that supports Markdown, RSS, podcasts, and deploys to GitHub Pages.

[DEMO](https://splog.brine.dev)

## Features
- Static site (no server needed)
- Hash-based routing
- Write posts in Markdown
- Index generation + Markdown to HTML via [marked](https://github.com/markedjs/marked)
- Functional, vanilla JavaScript (no frameworks)
- RSS feeds for blog, podcast, and sitemap
- Easy deployment to GitHub Pages

## Install
1. `git clone git@github.com:qualityshepherd/splog.git`
1. `cd splog`
1. `npm ci`           # install dependencies
1. `npm run server`   # (optional) local dev server

## Testing
Tests use [AVA](https://github.com/avajs/ava) as a test runner. E2E tests use my own _clever-ish?_ bastardization of AVA and [Puppeteer](https://www.npmjs.com/package/puppeteer) that I call ([AvaPup](https://github.com/qualityshepherd/splog/blob/main/tests/avapup.js)). It works remarkably well, actually...

- `npm test` to run all tests
- `npm debug` to run e2e tests _headed_ and slow them down via SLOMO
- passing tests are also a requirement to deploy to github pages

## Setup
- edit `config.js` to customize your blog settings
- add Markdown-formatted posts to the `/posts` folder
- each post should include frontmatter (meta) like `title`, `date`, and `tags`
- run the index generator to rebuild `index.json` from your posts
- (optional) `npm run server` to preview your blog locally

## Adding Pages
1. add a new route to `ROUTES` in `handlers.js`
1. modify `routeHandlers()` to handle your new route:
1. add templates to `templates.js`
1. link to the page in `index.html`
