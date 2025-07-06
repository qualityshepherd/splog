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

## Testing
Tests use [AVA](https://github.com/avajs/ava) as a test runner for both unit and e2e tests. E2E tests use my own _clever-ish?_ bastardization of AVA and [Puppeteer](https://www.npmjs.com/package/puppeteer) that I call ([AvaPup](https://github.com/qualityshepherd/splog/blob/main/tests/e2e/avapup.js)). It works remarkably well, actually...

- `npm test` to run all tests
- `npm debug` to run e2e tests _headed_ and slow them down via SLOMO
- passing tests are also a requirement to deploy to github pages

``` bash
✔ unit › ui › getLimitedPosts should return limited number of posts
✔ unit › ui › getLimitedPosts should handle edge cases
✔ unit › ui › postMatchesSearch should return posts with matching title
✔ unit › ui › postMatchesSearch should return posts with matching markdown
✔ unit › ui › postMatchesSearch should return posts with matching tag
✔ unit › ui › postMatchesSearch should handle multiple search terms
✔ unit › ui › postMatchesSearch should be case insensitive
✔ unit › ui › postMatchesSearch should return true for empty search term
✔ unit › ui › postMatchesSearch should handle posts with missing properties
✔ unit › ui › renderTags should return formatted tags
✔ unit › ui › renderTags should return empty string for non-array input
✔ unit › ui › renderTags should handle custom hash parameter
✔ unit › ui › renderTags should URL-encode tag names properly
✔ unit › ui › renderTags should include proper accessibility attributes
✔ unit › ui › renderTags should generate valid HTML structure
✔ unit › ui › UI functions should be pure and not depend on global state
✔ unit › state › sortByDate should sort posts descending by default
✔ unit › state › sortByDate should sort posts ascending if desc is false
✔ unit › state › sortByDate should not mutate input
✔ unit › state › getState should return a copy of state
✔ unit › state › setPosts should update posts and return new posts array
✔ unit › state › setDisplayedPosts should update displayed post count
✔ unit › state › setSearchTerm should update search term
✔ unit › state › incrementDisplayedPosts should increase displayed posts count
✔ unit › state › updateState should update multiple properties at once
✔ unit › state › state updates should be immutable
✔ unit › state › removeFuturePosts should filter out future posts
✔ unit › state › resetState should restore initial state
✔ unit › state › state getters should return copies to prevent mutation
✔ unit › state › state should handle edge cases gracefully
✔ unit › state › readSiteIndex should return parsed JSON
✔ unit › state › readSiteIndex should exclude future-dated posts
✔ e2e › e2e › should access archive posts via url (2.3s)
✔ e2e › e2e › should display all posts (2.3s)
✔ e2e › e2e › should be responsive; handle different viewports (2.3s)
✔ e2e › e2e › should filter posts by tag (2.3s)
✔ e2e › e2e › should load more posts (2.3s)
✔ e2e › e2e › should display a single post (2.3s)
✔ e2e › e2e › should use menu to navigate to about page (2.3s)
✔ e2e › e2e › should search for post (2.4s)
✔ e2e › e2e › should display not-found message when no search results found (2.7s)

41 tests passed
```
