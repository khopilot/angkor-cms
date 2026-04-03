globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DFaPMFRf.mjs";
import { h as renderTemplate, m as maybeRenderHead } from "./sequence_DzjOVBrG.mjs";
import { r as renderComponent } from "./worker-entry_KOHBbzDu.mjs";
import "./adapt-sandbox-entry_DgOh8so3.mjs";
import "./index_lite_CWDp5SAU.mjs";
import "./index_DFnuKuIX.mjs";
import { a as getEmDashEntry } from "./query-CS_iSj34_lQDETB4f.mjs";
import { a as $$Base, b as $$PortableText } from "./Base_CV0pa2kI.mjs";
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/404");
  }
  let service = null;
  try {
    const result = await getEmDashEntry("services", slug);
    service = result.entry?.data;
  } catch {
  }
  if (!service) {
    return Astro2.redirect("/404");
  }
  const title = String(service.title || service.name || "Service");
  const description = String(service.description || service.excerpt || "");
  const icon = String(service.icon || "").slice(0, 2) || "⚡";
  const content = service.content;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": title, "description": description, "data-astro-cid-tcy35dad": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="page-hero" data-astro-cid-tcy35dad> <div class="page-hero-bg" data-astro-cid-tcy35dad></div> <div class="page-hero-inner" data-astro-cid-tcy35dad> <a href="/services" class="back-link" data-astro-cid-tcy35dad>&larr; All Services</a> <div class="hero-icon" data-astro-cid-tcy35dad>${icon}</div> <h1 class="page-hero-title" data-astro-cid-tcy35dad>${title}</h1> ${description && renderTemplate`<p class="page-hero-subtitle" data-astro-cid-tcy35dad>${description}</p>`} </div> </section> <section class="page-content" data-astro-cid-tcy35dad> <div class="page-inner" data-astro-cid-tcy35dad> ${content ? renderTemplate`<div class="prose" data-astro-cid-tcy35dad> ${renderComponent($$result2, "PortableText", $$PortableText, { "value": content, "data-astro-cid-tcy35dad": true })} </div>` : renderTemplate`<div class="prose" data-astro-cid-tcy35dad> <p data-astro-cid-tcy35dad>${description}</p> </div>`} <div class="page-footer" data-astro-cid-tcy35dad> <a href="/services" class="btn-secondary" data-astro-cid-tcy35dad>&larr; Back to Services</a> <a href="/contact" class="btn-primary" data-astro-cid-tcy35dad>Get in Touch</a> </div> </div> </section> ` })}`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/services/[slug].astro", void 0);
const $$file = "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/services/[slug].astro";
const $$url = "/services/[slug]";
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
