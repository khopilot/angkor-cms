globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as renderComponent, s as spreadAttributes } from "./worker-entry_KOHBbzDu.mjs";
import { j as getEntryTerms } from "./adapt-sandbox-entry_DgOh8so3.mjs";
import "./index_lite_CWDp5SAU.mjs";
import "./index_DFnuKuIX.mjs";
import { a as getEmDashEntry, g as getEmDashCollection } from "./query-CS_iSj34_lQDETB4f.mjs";
import { a as $$Base, r as renderScript, $ as $$EmDashImage, b as $$PortableText, c as $$Comments, d as $$CommentForm, e as $$WidgetArea } from "./Base_CV0pa2kI.mjs";
import { $ as $$PostCard } from "./PostCard_BUeVoMfE.mjs";
import { g as getReadingTime } from "./reading-time_C6lD7JQO.mjs";
import { c as createComponent } from "./astro-component_DFaPMFRf.mjs";
import { h as renderTemplate, m as maybeRenderHead, g as addAttribute, F as Fragment } from "./sequence_DzjOVBrG.mjs";
const TRAILING_SLASH_RE = /\/$/;
const ABSOLUTE_URL_RE = /^https?:\/\//i;
function getSeoMeta(content, options = {}) {
  const { siteTitle, siteUrl, path, defaultOgImage } = options;
  const separator = options.titleSeparator || " | ";
  const seo = content.seo ?? content.data.seo ?? {
    title: null,
    description: null,
    image: null,
    canonical: null,
    noIndex: false
  };
  const pageTitle = seo.title || (typeof content.data.title === "string" ? content.data.title : null) || "";
  const fullTitle = siteTitle && pageTitle ? `${pageTitle}${separator}${siteTitle}` : pageTitle;
  const description = seo.description || (typeof content.data.excerpt === "string" ? content.data.excerpt : null) || null;
  const ogImage = seo.image ? buildMediaUrl(seo.image, siteUrl) : defaultOgImage ?? null;
  let canonical = null;
  if (seo.canonical) if (siteUrl && !seo.canonical.startsWith("/") && !ABSOLUTE_URL_RE.test(seo.canonical)) canonical = `${siteUrl.replace(TRAILING_SLASH_RE, "")}/${seo.canonical}`;
  else canonical = seo.canonical;
  else if (siteUrl && path) {
    const safePath = path.startsWith("/") ? path : `/${path}`;
    canonical = `${siteUrl.replace(TRAILING_SLASH_RE, "")}${safePath}`;
  }
  const robots = seo.noIndex ? "noindex, nofollow" : null;
  return {
    title: fullTitle,
    description,
    ogTitle: pageTitle || fullTitle,
    ogDescription: description,
    ogImage,
    canonical,
    robots
  };
}
function buildMediaUrl(imageRef, siteUrl) {
  if (ABSOLUTE_URL_RE.test(imageRef)) return imageRef;
  const mediaPath = `/_emdash/api/media/file/${imageRef}`;
  if (siteUrl) return `${siteUrl.replace(TRAILING_SLASH_RE, "")}${mediaPath}`;
  return mediaPath;
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/404");
  }
  const { entry: post, cacheHint } = await getEmDashEntry("posts", slug);
  if (!post) {
    return Astro2.redirect("/404");
  }
  Astro2.cache.set(cacheHint);
  function getImageUrl(img) {
    if (!img || typeof img !== "object") return void 0;
    const image = img;
    if (typeof image.src === "string" && image.src) {
      return image.src.startsWith("http") ? image.src : `${Astro2.url.origin}${image.src}`;
    }
    const meta = image.meta;
    const storageKey = (typeof meta?.storageKey === "string" ? meta.storageKey : void 0) || (typeof image.id === "string" ? image.id : void 0);
    if (storageKey) {
      return `${Astro2.url.origin}/_emdash/api/media/file/${storageKey}`;
    }
    return void 0;
  }
  const featuredImageUrl = getImageUrl(post.data.featured_image);
  const seo = getSeoMeta(post, {
    siteTitle: "My Blog",
    siteUrl: Astro2.url.origin,
    path: `/posts/${slug}`,
    defaultOgImage: featuredImageUrl
  });
  const tags = await getEntryTerms("posts", post.data.id, "tag");
  const bylines = post.data.bylines ?? [];
  const readingTime = getReadingTime(post.data.content);
  const { entries: recentPosts } = await getEmDashCollection("posts", {
    orderBy: { published_at: "desc" },
    limit: 4
  });
  const otherPosts = recentPosts.filter((p) => p.id !== post.id).slice(0, 3);
  const otherPostsWithTags = await Promise.all(
    otherPosts.map(async (p) => {
      const postTags = await getEntryTerms("posts", p.data.id, "tag");
      const postBylines = p.data.bylines ?? [];
      return { post: p, tags: postTags, bylines: postBylines };
    })
  );
  const publishDate = post.data.publishedAt?.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }) ?? null;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": seo.title, "description": seo.description, "image": seo.ogImage, "canonical": seo.canonical, "robots": seo.robots, "type": "article", "publishedTime": post.data.publishedAt?.toISOString() ?? null, "modifiedTime": post.data.updatedAt.toISOString(), "content": { collection: "posts", id: post.data.id, slug }, "data-astro-cid-gysqo7gh": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="article" data-astro-cid-gysqo7gh>  ${post.data.featured_image && renderTemplate`<div class="article-hero"${spreadAttributes(post.edit.featured_image)} data-astro-cid-gysqo7gh> ${renderComponent($$result2, "Image", $$EmDashImage, { "image": post.data.featured_image, "data-astro-cid-gysqo7gh": true })} </div>`}  <div class="article-grid" data-astro-cid-gysqo7gh>  <aside class="article-meta-col" data-astro-cid-gysqo7gh> <div class="meta-sticky" data-astro-cid-gysqo7gh> ${bylines.length > 0 && renderTemplate`<div class="meta-block byline-block" data-astro-cid-gysqo7gh> <span class="meta-label" data-astro-cid-gysqo7gh> ${bylines.length === 1 ? "Author" : "Authors"} </span> <div class="bylines" data-astro-cid-gysqo7gh> ${bylines.map((credit) => renderTemplate`<div class="byline" data-astro-cid-gysqo7gh> ${credit.byline.avatarMediaId && renderTemplate`<img${addAttribute(`/_emdash/api/media/file/${credit.byline.avatarMediaId}`, "src")}${addAttribute(credit.byline.displayName, "alt")} class="byline-avatar" data-astro-cid-gysqo7gh>`} <div class="byline-info" data-astro-cid-gysqo7gh> <span class="byline-name" data-astro-cid-gysqo7gh> ${credit.byline.displayName} </span> ${credit.roleLabel && renderTemplate`<span class="byline-role" data-astro-cid-gysqo7gh>${credit.roleLabel}</span>`} </div> </div>`)} </div> </div>`} ${publishDate && renderTemplate`<div class="meta-block" data-astro-cid-gysqo7gh> <span class="meta-label" data-astro-cid-gysqo7gh>Published</span> <time class="meta-value" data-astro-cid-gysqo7gh>${publishDate}</time> </div>`} <div class="meta-block" data-astro-cid-gysqo7gh> <span class="meta-label" data-astro-cid-gysqo7gh>Reading time</span> <span class="meta-value" data-astro-cid-gysqo7gh>${readingTime} min</span> </div> ${tags.length > 0 && renderTemplate`<div class="meta-block" data-astro-cid-gysqo7gh> <span class="meta-label" data-astro-cid-gysqo7gh>Tags</span> <div class="meta-tags" data-astro-cid-gysqo7gh> ${tags.map((t) => renderTemplate`<a${addAttribute(`/tag/${t.slug}`, "href")} class="meta-tag" data-astro-cid-gysqo7gh> ${t.label} </a>`)} </div> </div>`} </div> </aside>  <div class="article-main" data-astro-cid-gysqo7gh> <header class="article-header" data-astro-cid-gysqo7gh> <div class="article-meta" data-astro-cid-gysqo7gh> ${bylines.length > 0 && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-gysqo7gh": true }, { "default": async ($$result3) => renderTemplate` <span class="article-meta-byline" data-astro-cid-gysqo7gh> ${bylines.map((credit, i) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "data-astro-cid-gysqo7gh": true }, { "default": async ($$result4) => renderTemplate`${i > 0 && ", "}${credit.byline.displayName}` })}`)} </span> <span class="meta-dot" data-astro-cid-gysqo7gh></span> ` })}`} ${publishDate && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-gysqo7gh": true }, { "default": async ($$result3) => renderTemplate` <time data-astro-cid-gysqo7gh>${publishDate}</time> <span class="meta-dot" data-astro-cid-gysqo7gh></span> ` })}`} <span data-astro-cid-gysqo7gh>${readingTime} min read</span> </div> <h1 class="article-title"${spreadAttributes(post.edit.title)} data-astro-cid-gysqo7gh>${post.data.title}</h1> ${post.data.excerpt && renderTemplate`<p class="article-excerpt" data-astro-cid-gysqo7gh>${post.data.excerpt}</p>`} </header> <div class="article-content" data-astro-cid-gysqo7gh> ${renderComponent($$result2, "PortableText", $$PortableText, { "value": post.data.content, "data-astro-cid-gysqo7gh": true })} </div> <div class="article-comments" data-astro-cid-gysqo7gh> ${renderComponent($$result2, "Comments", $$Comments, { "collection": "posts", "contentId": post.data.id, "threaded": true, "data-astro-cid-gysqo7gh": true })} ${renderComponent($$result2, "CommentForm", $$CommentForm, { "collection": "posts", "contentId": post.data.id, "data-astro-cid-gysqo7gh": true })} </div> </div>  <aside class="article-sidebar" data-astro-cid-gysqo7gh> <div class="sidebar-sticky" data-astro-cid-gysqo7gh> <nav class="toc" aria-label="Table of contents" data-astro-cid-gysqo7gh> <h4 class="toc-title" data-astro-cid-gysqo7gh>On this page</h4> <div class="toc-content" id="toc-content" data-astro-cid-gysqo7gh> <!-- Populated by JS --> </div> </nav> <div class="sidebar-widgets" data-astro-cid-gysqo7gh> ${renderComponent($$result2, "WidgetArea", $$WidgetArea, { "name": "sidebar", "data-astro-cid-gysqo7gh": true })} </div> </div> </aside> </div> </article> ${otherPostsWithTags.length > 0 && renderTemplate`<section class="more-posts" data-astro-cid-gysqo7gh> <div class="more-inner" data-astro-cid-gysqo7gh> <h2 class="more-title" data-astro-cid-gysqo7gh>Continue reading</h2> <div class="more-grid" data-astro-cid-gysqo7gh> ${otherPostsWithTags.map(
    ({ post: p, tags: postTags, bylines: postBylines }) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "title": p.data.title, "excerpt": p.data.excerpt, "featuredImage": p.data.featured_image, "href": `/posts/${p.id}`, "date": p.data.publishedAt ?? void 0, "readingTime": getReadingTime(p.data.content), "tags": postTags.map((t) => ({ slug: t.slug, label: t.label })), "bylines": postBylines, "data-astro-cid-gysqo7gh": true })}`
  )} </div> </div> </section>`}${renderScript($$result2, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/posts/[slug].astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/posts/[slug].astro", void 0);
const $$file = "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/posts/[slug].astro";
const $$url = "/posts/[slug]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
