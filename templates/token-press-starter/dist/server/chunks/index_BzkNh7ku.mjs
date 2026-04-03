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
  let members = [];
  try {
    const result = await getEmDashCollection("team");
    members = result.entries;
  } catch {
  }
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Our Team", "description": "Meet the people behind our work.", "data-astro-cid-zgstinyo": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="page-hero" data-astro-cid-zgstinyo> <div class="page-hero-bg" data-astro-cid-zgstinyo></div> <div class="page-hero-inner" data-astro-cid-zgstinyo> <h1 class="page-hero-title" data-astro-cid-zgstinyo>Our Team</h1> <p class="page-hero-subtitle" data-astro-cid-zgstinyo>Meet the people behind our work</p> </div> </section> <section class="page-content" data-astro-cid-zgstinyo> <div class="page-inner" data-astro-cid-zgstinyo> ${members.length === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-zgstinyo> <p data-astro-cid-zgstinyo>No team members have been added yet.</p> <a href="/_emdash/admin" class="btn" data-astro-cid-zgstinyo>Open Admin</a> </div>` : renderTemplate`<div class="team-grid" data-astro-cid-zgstinyo> ${members.map((m) => {
    const name = String(m.data.name || m.data.title || "");
    const role = String(m.data.role || m.data.position || "");
    const bio = String(m.data.bio || "");
    const avatarMediaId = m.data.avatarMediaId;
    const initial = name.charAt(0) || "?";
    return renderTemplate`<div class="team-card" data-astro-cid-zgstinyo> ${avatarMediaId ? renderTemplate`<img${addAttribute(`/_emdash/api/media/file/${avatarMediaId}`, "src")}${addAttribute(name, "alt")} class="team-photo" data-astro-cid-zgstinyo>` : renderTemplate`<div class="team-avatar" data-astro-cid-zgstinyo>${initial}</div>`} <h3 class="team-name" data-astro-cid-zgstinyo>${name}</h3> ${role && renderTemplate`<p class="team-role" data-astro-cid-zgstinyo>${role}</p>`} ${bio && renderTemplate`<p class="team-bio" data-astro-cid-zgstinyo> ${bio.length > 160 ? bio.slice(0, 160) + "..." : bio} </p>`} </div>`;
  })} </div>`} </div> </section> ` })}`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/team/index.astro", void 0);
const $$file = "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/team/index.astro";
const $$url = "/team";
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
