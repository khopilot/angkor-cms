globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DFaPMFRf.mjs";
import { h as renderTemplate, m as maybeRenderHead, g as addAttribute } from "./sequence_DzjOVBrG.mjs";
import { r as renderComponent } from "./worker-entry_KOHBbzDu.mjs";
import "./adapt-sandbox-entry_DgOh8so3.mjs";
import "./index_lite_CWDp5SAU.mjs";
import "./index_DFnuKuIX.mjs";
import { g as getEmDashCollection } from "./query-CS_iSj34_lQDETB4f.mjs";
import { a as $$Base } from "./Base_CV0pa2kI.mjs";
import { $ as $$PostCard } from "./PostCard_BUeVoMfE.mjs";
import { e as extractText, g as getReadingTime } from "./reading-time_C6lD7JQO.mjs";
const prerender = false;
const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Search;
  const query = Astro2.url.searchParams.get("q")?.trim() || "";
  const { entries: allPosts } = await getEmDashCollection("posts");
  function matchesQuery(post, q) {
    if (!q) return false;
    const lower = q.toLowerCase();
    const title = (post.data.title || "").toLowerCase();
    const excerpt = (post.data.excerpt || "").toLowerCase();
    const content = extractText(post.data.content).toLowerCase();
    return title.includes(lower) || excerpt.includes(lower) || content.includes(lower);
  }
  const results = query ? allPosts.filter((p) => matchesQuery(p, query)) : [];
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": query ? `Search: ${query}` : "Search", "description": "Search blog posts", "data-astro-cid-ipsxrsrh": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="search-page" data-astro-cid-ipsxrsrh> <h1 class="search-title" data-astro-cid-ipsxrsrh>Search</h1> <form method="get" action="/search" class="search-form" data-astro-cid-ipsxrsrh> <input type="search" name="q"${addAttribute(query, "value")} placeholder="Search posts..." class="search-input" autofocus data-astro-cid-ipsxrsrh> <button type="submit" class="search-button" data-astro-cid-ipsxrsrh>Search</button> </form> ${query && renderTemplate`<p class="search-summary" data-astro-cid-ipsxrsrh> ${results.length === 0 ? `No results for "${query}"` : `${results.length} result${results.length === 1 ? "" : "s"} for "${query}"`} </p>`} ${results.length > 0 && renderTemplate`<div class="search-results" data-astro-cid-ipsxrsrh> ${results.map((post) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "title": post.data.title, "excerpt": post.data.excerpt, "featuredImage": post.data.featured_image, "href": `/posts/${post.id}`, "date": post.data.publishedAt ?? void 0, "readingTime": getReadingTime(post.data.content), "data-astro-cid-ipsxrsrh": true })}`)} </div>`} ${!query && renderTemplate`<p class="search-hint" data-astro-cid-ipsxrsrh>Enter a search term to find posts.</p>`} </section> ` })}`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/search.astro", void 0);
const $$file = "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/search.astro";
const $$url = "/search";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Search,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
