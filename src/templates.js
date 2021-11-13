import { renderTags } from './utils'

export function blogTemplate (post) {
  return `
  <div class="post">
    <a href="#post?s=${post.meta.slug}"><h2 class="post-title">${post.meta.title}</h2></a>
    <div class="date">${post.meta.date}</div>
    <div>${post.html}</div>
    <span class="tags">${renderTags(post.meta.tags)}</span>
  </div>
  `
}
