globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DFaPMFRf.mjs";
import { m as maybeRenderHead, g as addAttribute, h as renderTemplate, F as Fragment } from "./sequence_DzjOVBrG.mjs";
import { r as renderComponent } from "./worker-entry_KOHBbzDu.mjs";
import { $ as $$EmDashImage } from "./Base_CV0pa2kI.mjs";
const $$PostCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PostCard;
  const {
    title,
    excerpt,
    featuredImage,
    href,
    date,
    readingTime,
    tags,
    bylines
  } = Astro2.props;
  const formattedDate = date ? date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }) : null;
  return renderTemplate`${maybeRenderHead()}<article class="post-card" data-astro-cid-iyiqi2so> <a${addAttribute(href, "href")} class="card-link" data-astro-cid-iyiqi2so> ${featuredImage ? renderTemplate`<div class="card-image" data-astro-cid-iyiqi2so> ${renderComponent($$result, "Image", $$EmDashImage, { "image": featuredImage, "data-astro-cid-iyiqi2so": true })} </div>` : renderTemplate`<div class="card-placeholder" data-astro-cid-iyiqi2so></div>`} <div class="card-body" data-astro-cid-iyiqi2so> <div class="card-meta" data-astro-cid-iyiqi2so> ${bylines && bylines.length > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-iyiqi2so": true }, { "default": ($$result2) => renderTemplate` <div class="card-bylines" data-astro-cid-iyiqi2so> ${bylines.slice(0, 1).map((credit) => renderTemplate`<span class="card-byline" data-astro-cid-iyiqi2so> ${credit.byline.avatarMediaId && renderTemplate`<img${addAttribute(`/_emdash/api/media/file/${credit.byline.avatarMediaId}`, "src")}${addAttribute(credit.byline.displayName, "alt")} class="card-byline-avatar" data-astro-cid-iyiqi2so>`} <span class="card-byline-name" data-astro-cid-iyiqi2so> ${credit.byline.displayName} </span> </span>`)} ${bylines.length > 1 && renderTemplate`<span class="byline-more"${addAttribute(bylines.slice(1).map((c) => c.byline.displayName).join(", "), "data-tooltip")}${addAttribute(bylines.slice(1).map((c) => c.byline.displayName).join(", "), "title")} tabindex="0" data-astro-cid-iyiqi2so>
+${bylines.length - 1} </span>`} </div> ${(formattedDate || readingTime) && renderTemplate`<span class="meta-dot" data-astro-cid-iyiqi2so></span>`}` })}`} ${formattedDate && renderTemplate`<time data-astro-cid-iyiqi2so>${formattedDate}</time>`} ${formattedDate && readingTime && renderTemplate`<span class="meta-dot" data-astro-cid-iyiqi2so></span>`} ${readingTime && renderTemplate`<span data-astro-cid-iyiqi2so>${readingTime} min</span>`} </div> <h2 class="card-title" data-astro-cid-iyiqi2so>${title}</h2> ${excerpt && renderTemplate`<p class="card-excerpt" data-astro-cid-iyiqi2so>${excerpt}</p>`} </div> </a> ${tags && tags.length > 0 && renderTemplate`<div class="card-tags" data-astro-cid-iyiqi2so> ${tags.slice(0, 2).map((tag) => renderTemplate`<a${addAttribute(`/tag/${tag.slug}`, "href")} class="card-tag" data-astro-cid-iyiqi2so> ${tag.label} </a>`)} </div>`} </article>`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/components/PostCard.astro", void 0);
export {
  $$PostCard as $
};
