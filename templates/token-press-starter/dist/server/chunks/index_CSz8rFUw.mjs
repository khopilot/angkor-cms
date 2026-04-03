globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DFaPMFRf.mjs";
import { h as renderTemplate, m as maybeRenderHead, g as addAttribute, F as Fragment } from "./sequence_DzjOVBrG.mjs";
import { r as renderComponent } from "./worker-entry_KOHBbzDu.mjs";
import { j as getEntryTerms } from "./adapt-sandbox-entry_DgOh8so3.mjs";
import "./index_lite_CWDp5SAU.mjs";
import "./index_DFnuKuIX.mjs";
import { g as getEmDashCollection } from "./query-CS_iSj34_lQDETB4f.mjs";
import { a as $$Base } from "./Base_CV0pa2kI.mjs";
import { g as getReadingTime } from "./reading-time_C6lD7JQO.mjs";
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const { entries: posts, cacheHint } = await getEmDashCollection("posts");
  Astro2.cache.set(cacheHint);
  const sortedPosts = posts.toSorted((a, b) => {
    const dateA = a.data.publishedAt?.getTime() ?? 0;
    const dateB = b.data.publishedAt?.getTime() ?? 0;
    return dateB - dateA;
  });
  const postsWithTags = await Promise.all(
    sortedPosts.map(async (post) => {
      const tags = await getEntryTerms("posts", post.data.id, "tag");
      const bylines = post.data.bylines ?? [];
      return { post, tags, bylines };
    })
  );
  const formatDate = (date) => date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "All Posts", "description": "Browse all blog posts", "data-astro-cid-fjqfnjxi": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="posts-page" data-astro-cid-fjqfnjxi> <header class="page-header" data-astro-cid-fjqfnjxi> <h1 class="page-title" data-astro-cid-fjqfnjxi>All Posts</h1> <p class="page-description" data-astro-cid-fjqfnjxi> ${posts.length} ${posts.length === 1 ? "article" : "articles"} </p> </header> ${sortedPosts.length === 0 ? renderTemplate`<p class="empty" data-astro-cid-fjqfnjxi>No posts yet.</p>` : renderTemplate`<div class="posts-list" data-astro-cid-fjqfnjxi> ${postsWithTags.map(({ post, tags, bylines }) => renderTemplate`<article class="post-item" data-astro-cid-fjqfnjxi> <a${addAttribute(`/posts/${post.id}`, "href")} class="post-link" data-astro-cid-fjqfnjxi> <div class="post-meta" data-astro-cid-fjqfnjxi> ${bylines.length > 0 && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-fjqfnjxi": true }, { "default": async ($$result3) => renderTemplate` <div class="post-bylines" data-astro-cid-fjqfnjxi> ${bylines.slice(0, 2).map((credit, index) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "data-astro-cid-fjqfnjxi": true }, { "default": async ($$result4) => renderTemplate`${index > 0 && renderTemplate`<span class="byline-sep" data-astro-cid-fjqfnjxi>,</span>`}<span class="post-byline" data-astro-cid-fjqfnjxi> ${credit.byline.avatarMediaId && renderTemplate`<img${addAttribute(`/_emdash/api/media/file/${credit.byline.avatarMediaId}`, "src")}${addAttribute(credit.byline.displayName, "alt")} class="post-byline-avatar" data-astro-cid-fjqfnjxi>`} <span class="post-byline-name" data-astro-cid-fjqfnjxi> ${credit.byline.displayName} </span> </span> ` })}`)} ${bylines.length > 2 && renderTemplate`<span class="byline-more" data-astro-cid-fjqfnjxi>+${bylines.length - 2}</span>`} </div> <span class="meta-dot" data-astro-cid-fjqfnjxi></span> ` })}`} ${post.data.publishedAt && renderTemplate`<time data-astro-cid-fjqfnjxi>${formatDate(post.data.publishedAt)}</time>`} ${post.data.publishedAt && renderTemplate`<span class="meta-dot" data-astro-cid-fjqfnjxi></span>`} <span data-astro-cid-fjqfnjxi>${getReadingTime(post.data.content)} min read</span> </div> <h2 class="post-title" data-astro-cid-fjqfnjxi>${post.data.title}</h2> ${post.data.excerpt && renderTemplate`<p class="post-excerpt" data-astro-cid-fjqfnjxi>${post.data.excerpt}</p>`} </a> ${tags.length > 0 && renderTemplate`<div class="post-tags" data-astro-cid-fjqfnjxi> ${tags.slice(0, 3).map((t) => renderTemplate`<a${addAttribute(`/tag/${t.slug}`, "href")} class="post-tag" data-astro-cid-fjqfnjxi> ${t.label} </a>`)} </div>`} </article>`)} </div>`} </div> ` })}`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/posts/index.astro", void 0);
const $$file = "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/posts/index.astro";
const $$url = "/posts";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
