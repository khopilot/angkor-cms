globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DFaPMFRf.mjs";
import { h as renderTemplate, m as maybeRenderHead, g as addAttribute } from "./sequence_DzjOVBrG.mjs";
import { r as renderComponent } from "./worker-entry_KOHBbzDu.mjs";
import { a as $$Base } from "./Base_CV0pa2kI.mjs";
const $$Contact = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Contact;
  let settings = { title: "Contact Us" };
  try {
    const res = await fetch(new URL("/_emdash/api/settings", Astro2.url.origin), {
      headers: { Cookie: Astro2.request.headers.get("cookie") ?? "" }
    });
    if (res.ok) {
      const data = await res.json();
      settings = data.data ?? settings;
    }
  } catch {
  }
  const siteName = String(settings.title || "Our Company");
  const email = String(settings.email || settings.contactEmail || "");
  const phone = String(settings.phone || settings.contactPhone || "");
  const address = String(settings.address || settings.location || "");
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Contact Us", "description": `Get in touch with ${siteName}.`, "data-astro-cid-uw5kdbxl": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="page-hero" data-astro-cid-uw5kdbxl> <div class="page-hero-bg" data-astro-cid-uw5kdbxl></div> <div class="page-hero-inner" data-astro-cid-uw5kdbxl> <h1 class="page-hero-title" data-astro-cid-uw5kdbxl>Get in Touch</h1> <p class="page-hero-subtitle" data-astro-cid-uw5kdbxl>We'd love to hear from you</p> </div> </section> <section class="page-content" data-astro-cid-uw5kdbxl> <div class="page-inner" data-astro-cid-uw5kdbxl> <div class="contact-grid" data-astro-cid-uw5kdbxl> <!-- Contact info --> <div class="contact-info" data-astro-cid-uw5kdbxl> <h2 class="info-title" data-astro-cid-uw5kdbxl>Contact Information</h2> <p class="info-desc" data-astro-cid-uw5kdbxl>
Reach out and we'll get back to you as soon as possible.
</p> <div class="info-items" data-astro-cid-uw5kdbxl> ${email && renderTemplate`<div class="info-item" data-astro-cid-uw5kdbxl> <div class="info-icon" data-astro-cid-uw5kdbxl> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-uw5kdbxl> <rect x="2" y="4" width="20" height="16" rx="2" data-astro-cid-uw5kdbxl></rect> <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" data-astro-cid-uw5kdbxl></path> </svg> </div> <div data-astro-cid-uw5kdbxl> <p class="info-label" data-astro-cid-uw5kdbxl>Email</p> <a${addAttribute(`mailto:${email}`, "href")} class="info-value" data-astro-cid-uw5kdbxl>${email}</a> </div> </div>`} ${phone && renderTemplate`<div class="info-item" data-astro-cid-uw5kdbxl> <div class="info-icon" data-astro-cid-uw5kdbxl> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-uw5kdbxl> <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" data-astro-cid-uw5kdbxl></path> </svg> </div> <div data-astro-cid-uw5kdbxl> <p class="info-label" data-astro-cid-uw5kdbxl>Phone</p> <a${addAttribute(`tel:${phone}`, "href")} class="info-value" data-astro-cid-uw5kdbxl>${phone}</a> </div> </div>`} ${address && renderTemplate`<div class="info-item" data-astro-cid-uw5kdbxl> <div class="info-icon" data-astro-cid-uw5kdbxl> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-uw5kdbxl> <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" data-astro-cid-uw5kdbxl></path> <circle cx="12" cy="10" r="3" data-astro-cid-uw5kdbxl></circle> </svg> </div> <div data-astro-cid-uw5kdbxl> <p class="info-label" data-astro-cid-uw5kdbxl>Address</p> <p class="info-value" data-astro-cid-uw5kdbxl>${address}</p> </div> </div>`} ${!email && !phone && !address && renderTemplate`<p class="info-fallback" data-astro-cid-uw5kdbxl>
Contact details can be configured in the CMS settings.
</p>`} </div> </div> <!-- Contact form (visual placeholder) --> <div class="contact-form-wrapper" data-astro-cid-uw5kdbxl> <form class="contact-form" onsubmit="return false;" data-astro-cid-uw5kdbxl> <div class="form-group" data-astro-cid-uw5kdbxl> <label for="name" class="form-label" data-astro-cid-uw5kdbxl>Name</label> <input type="text" id="name" name="name" class="form-input" placeholder="Your name" data-astro-cid-uw5kdbxl> </div> <div class="form-group" data-astro-cid-uw5kdbxl> <label for="email" class="form-label" data-astro-cid-uw5kdbxl>Email</label> <input type="email" id="email" name="email" class="form-input" placeholder="you@example.com" data-astro-cid-uw5kdbxl> </div> <div class="form-group" data-astro-cid-uw5kdbxl> <label for="subject" class="form-label" data-astro-cid-uw5kdbxl>Subject</label> <input type="text" id="subject" name="subject" class="form-input" placeholder="How can we help?" data-astro-cid-uw5kdbxl> </div> <div class="form-group" data-astro-cid-uw5kdbxl> <label for="message" class="form-label" data-astro-cid-uw5kdbxl>Message</label> <textarea id="message" name="message" class="form-input form-textarea" rows="5" placeholder="Tell us more about your project..." data-astro-cid-uw5kdbxl></textarea> </div> <button type="submit" class="form-submit" disabled data-astro-cid-uw5kdbxl>
Send Message
</button> <p class="form-note" data-astro-cid-uw5kdbxl>
Form submissions are not yet active. Please use the contact
							details provided.
</p> </form> </div> </div> </div> </section> ` })}`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/contact.astro", void 0);
const $$file = "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/contact.astro";
const $$url = "/contact";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
