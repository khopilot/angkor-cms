globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DFaPMFRf.mjs";
import { h as renderTemplate, m as maybeRenderHead } from "./sequence_DzjOVBrG.mjs";
import { r as renderComponent } from "./worker-entry_KOHBbzDu.mjs";
import { f as getTerm, j as getEntryTerms } from "./adapt-sandbox-entry_DgOh8so3.mjs";
import "./index_lite_CWDp5SAU.mjs";
import "./index_DFnuKuIX.mjs";
import { g as getEmDashCollection } from "./query-CS_iSj34_lQDETB4f.mjs";
import { a as $$Base } from "./Base_CV0pa2kI.mjs";
import { $ as $$PostCard } from "./PostCard_BUeVoMfE.mjs";
import { g as getReadingTime } from "./reading-time_C6lD7JQO.mjs";
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const term = slug ? await getTerm("category", slug) : null;
  if (!term) {
    return Astro2.redirect("/404");
  }
  const { entries: posts } = await getEmDashCollection("posts", {
    where: { category: term.slug },
    orderBy: { published_at: "desc" }
  });
  const filteredPosts = await Promise.all(
    posts.map(async (post) => {
      const tags = await getEntryTerms("posts", post.data.id, "tag");
      return { post, tags };
    })
  );
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": `${term.label} posts`, "description": `All posts in ${term.label}`, "data-astro-cid-xvtl5w7w": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="archive-section" data-astro-cid-xvtl5w7w> <header class="archive-header" data-astro-cid-xvtl5w7w> <span class="archive-label" data-astro-cid-xvtl5w7w>Category</span> <h1 class="archive-title" data-astro-cid-xvtl5w7w>${term.label}</h1> <p class="archive-count" data-astro-cid-xvtl5w7w> ${filteredPosts.length} ${filteredPosts.length === 1 ? "post" : "posts"} </p> </header> ${filteredPosts.length === 0 ? renderTemplate`<p class="no-posts" data-astro-cid-xvtl5w7w>No posts in this category yet.</p>` : renderTemplate`<div class="posts-grid" data-astro-cid-xvtl5w7w> ${filteredPosts.map(({ post, tags }) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "title": post.data.title, "excerpt": post.data.excerpt, "featuredImage": post.data.featured_image, "href": `/posts/${post.id}`, "date": post.data.publishedAt ?? void 0, "readingTime": getReadingTime(post.data.content), "tags": tags.map((t) => ({ slug: t.slug, label: t.label })), "data-astro-cid-xvtl5w7w": true })}`)} </div>`} </section> ` })}`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/category/[slug].astro", void 0);
const $$file = "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/category/[slug].astro";
const $$url = "/category/[slug]";
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
