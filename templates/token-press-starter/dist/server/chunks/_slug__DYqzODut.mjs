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
  const term = slug ? await getTerm("tag", slug) : null;
  if (!term) {
    return Astro2.redirect("/404");
  }
  const { entries: posts } = await getEmDashCollection("posts", {
    where: { tag: term.slug },
    orderBy: { published_at: "desc" }
  });
  const filteredPosts = await Promise.all(
    posts.map(async (post) => {
      const tags = await getEntryTerms("posts", post.data.id, "tag");
      return { post, tags };
    })
  );
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": `Posts tagged "${term.label}"`, "description": `All posts tagged with ${term.label}`, "data-astro-cid-qy2hbvfh": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="archive-section" data-astro-cid-qy2hbvfh> <header class="archive-header" data-astro-cid-qy2hbvfh> <span class="archive-label" data-astro-cid-qy2hbvfh>Tag</span> <h1 class="archive-title" data-astro-cid-qy2hbvfh>${term.label}</h1> <p class="archive-count" data-astro-cid-qy2hbvfh> ${filteredPosts.length} ${filteredPosts.length === 1 ? "post" : "posts"} </p> </header> ${filteredPosts.length === 0 ? renderTemplate`<p class="no-posts" data-astro-cid-qy2hbvfh>No posts with this tag yet.</p>` : renderTemplate`<div class="posts-grid" data-astro-cid-qy2hbvfh> ${filteredPosts.map(({ post, tags }) => renderTemplate`${renderComponent($$result2, "PostCard", $$PostCard, { "title": post.data.title, "excerpt": post.data.excerpt, "featuredImage": post.data.featured_image, "href": `/posts/${post.id}`, "date": post.data.publishedAt ?? void 0, "readingTime": getReadingTime(post.data.content), "tags": tags.map((t) => ({ slug: t.slug, label: t.label })), "data-astro-cid-qy2hbvfh": true })}`)} </div>`} </section> ` })}`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/tag/[slug].astro", void 0);
const $$file = "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/tag/[slug].astro";
const $$url = "/tag/[slug]";
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
