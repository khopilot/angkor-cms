globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as renderComponent, s as spreadAttributes } from "./worker-entry_KOHBbzDu.mjs";
import "./adapt-sandbox-entry_DgOh8so3.mjs";
import "./index_lite_CWDp5SAU.mjs";
import "./index_DFnuKuIX.mjs";
import { a as getEmDashEntry } from "./query-CS_iSj34_lQDETB4f.mjs";
import { a as $$Base, b as $$PortableText } from "./Base_CV0pa2kI.mjs";
import { c as createComponent } from "./astro-component_DFaPMFRf.mjs";
import { h as renderTemplate, m as maybeRenderHead } from "./sequence_DzjOVBrG.mjs";
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/404");
  }
  const { entry: page2, cacheHint } = await getEmDashEntry("pages", slug);
  if (!page2) {
    return Astro2.redirect("/404");
  }
  Astro2.cache.set(cacheHint);
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": page2.data.title, "content": { collection: "pages", id: page2.data.id, slug }, "data-astro-cid-sdneth7u": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="page-article" data-astro-cid-sdneth7u> <header class="page-header" data-astro-cid-sdneth7u> <h1 class="page-title"${spreadAttributes(page2.edit.title)} data-astro-cid-sdneth7u>${page2.data.title}</h1> </header> <div class="page-content" data-astro-cid-sdneth7u> ${renderComponent($$result2, "PortableText", $$PortableText, { "value": page2.data.content, "data-astro-cid-sdneth7u": true })} </div> </article> ` })}`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/pages/[slug].astro", void 0);
const $$file = "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/pages/[slug].astro";
const $$url = "/pages/[slug]";
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
