import { renderTags } from './ui.js'

export const postsTemplate = post => `
  <div class="post">
    <a href="#post?s=${post.meta.slug}" role="button" aria-label="post-title">
      <h2 class="post-title">${post.meta.title}</h2>
    </a>
    <div class="date">${post.meta.date}</div>
    <div>${post.html}</div>
    <div class="tags">${renderTags(post.meta.tags)}</div>
  </div>
`

export const singlePostTemplate = post => `
  <article class="post">
    <h2>${post.meta.title}</h2>
    <div class="date">${post.meta.date}</div>
    <div class="post-content">${post.html}</div>
    <div class="tags">${renderTags(post.meta.tags)}</div>
  </article>
`

export const notFoundTemplate = () => '<p>Post not found.</p>'

export const aboutPageTemplate = () => `
  <h2>SPLOG2</h2>
  <div class="center">
    A simple, single page, blog written in vanilla js that supports markdown, rss, podcasts and deploys to github pages (github.io).
  </div>
`

export const archiveTemplate = post => `
  <p>
    <a href="#post?s=${post.meta.slug}"><span class="archive">${post.meta.title}</span></a>
    <span class="date">${post.meta.date}</span>
  </p>
`
