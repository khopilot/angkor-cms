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
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  let services = [];
  try {
    const result = await getEmDashCollection("services");
    services = result.entries;
  } catch {
  }
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Our Services", "description": "Explore the full range of services we offer.", "data-astro-cid-52q5xhqt": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="page-hero" data-astro-cid-52q5xhqt> <div class="page-hero-bg" data-astro-cid-52q5xhqt></div> <div class="page-hero-inner" data-astro-cid-52q5xhqt> <h1 class="page-hero-title" data-astro-cid-52q5xhqt>Our Services</h1> <p class="page-hero-subtitle" data-astro-cid-52q5xhqt>Explore the full range of services we offer</p> </div> </section> <section class="page-content" data-astro-cid-52q5xhqt> <div class="page-inner" data-astro-cid-52q5xhqt> ${services.length === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-52q5xhqt> <p data-astro-cid-52q5xhqt>No services have been added yet.</p> <a href="/_emdash/admin" class="btn" data-astro-cid-52q5xhqt>Open Admin</a> </div>` : renderTemplate`<div class="services-grid" data-astro-cid-52q5xhqt> ${services.map((s) => renderTemplate`<a${addAttribute(`/services/${s.id}`, "href")} class="service-card" data-astro-cid-52q5xhqt> <div class="service-icon" data-astro-cid-52q5xhqt> ${String(s.data.icon || "").slice(0, 2) || "⚡"} </div> <h3 class="service-name" data-astro-cid-52q5xhqt> ${String(s.data.title || s.data.name || "Untitled")} </h3> <p class="service-desc" data-astro-cid-52q5xhqt> ${String(s.data.description || s.data.excerpt || "")} </p> <span class="service-link" data-astro-cid-52q5xhqt>Learn more &rarr;</span> </a>`)} </div>`} </div> </section> ` })}`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/services/index.astro", void 0);
const $$file = "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/services/index.astro";
const $$url = "/services";
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
