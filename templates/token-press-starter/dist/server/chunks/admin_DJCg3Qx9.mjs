globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DFaPMFRf.mjs";
import { q as renderHead, h as renderTemplate } from "./sequence_DzjOVBrG.mjs";
import { r as renderComponent } from "./worker-entry_KOHBbzDu.mjs";
const prerender = false;
const $$Admin = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Admin;
  return renderTemplate`<html lang="en" data-astro-cid-yv6xseov> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%92%AB%3C/text%3E%3C/svg%3E"><title>Token Press Admin</title>${renderHead()}</head> <body data-astro-cid-yv6xseov> <div id="admin-root" class="min-h-screen" data-astro-cid-yv6xseov> <div id="emdash-boot-loader" data-astro-cid-yv6xseov>  <div class="loader-inner" data-astro-cid-yv6xseov> <div class="spinner" data-astro-cid-yv6xseov></div> <p data-astro-cid-yv6xseov>Loading Token Press...</p> </div> </div> ${renderComponent($$result, "AdminWrapper", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-yv6xseov": true, "client:component-path": "emdash/routes/PluginRegistry", "client:component-export": "default" })} </div> </body></html>`;
}, "/Users/niko/Documents/github/angkor-cms/packages/core/src/astro/routes/admin.astro", void 0);
const $$file = "/Users/niko/Documents/github/angkor-cms/packages/core/src/astro/routes/admin.astro";
const $$url = void 0;
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
