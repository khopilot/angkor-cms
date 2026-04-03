globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DFaPMFRf.mjs";
import { m as maybeRenderHead, g as addAttribute, h as renderTemplate, P as unescapeHTML } from "./sequence_DzjOVBrG.mjs";
import { r as renderComponent } from "./worker-entry_KOHBbzDu.mjs";
import "./adapt-sandbox-entry_DgOh8so3.mjs";
import "./index_lite_CWDp5SAU.mjs";
import "./index_DFnuKuIX.mjs";
import { g as getEmDashCollection } from "./query-CS_iSj34_lQDETB4f.mjs";
import { a as $$Base } from "./Base_CV0pa2kI.mjs";
import { $ as $$PostCard } from "./PostCard_BUeVoMfE.mjs";
import { g as getReadingTime } from "./reading-time_C6lD7JQO.mjs";
const site = { "name": "My Website", "tagline": "Built with Token Press" };
const theme = { "primary": "#2563eb", "secondary": "#7c3aed", "accent": "#f59e0b", "background": "#ffffff", "surface": "#f8fafc", "text": "#111827", "textMuted": "#6b7280", "font": { "heading": "Inter, system-ui, sans-serif", "body": "Inter, system-ui, sans-serif" }, "borderRadius": "1rem" };
const hero = { "ctaText": "Get Started", "ctaUrl": "/contact", "secondaryCtaText": "Learn More", "secondaryCtaUrl": "/about" };
const sections = { "hero": true, "services": true, "caseStudies": true, "testimonials": true, "team": true, "faq": true, "pricing": false, "stats": false, "contact": true, "blog": true, "cta": true };
const rawConfig = {
  site,
  theme,
  hero,
  sections
};
const config = rawConfig;
function getThemeCSS() {
  const t = config.theme;
  return `
		:root {
			--tp-primary: ${t.primary};
			--tp-secondary: ${t.secondary};
			--tp-accent: ${t.accent};
			--tp-bg: ${t.background};
			--tp-surface: ${t.surface};
			--tp-text: ${t.text};
			--tp-text-muted: ${t.textMuted};
			--tp-font-heading: ${t.font.heading};
			--tp-font-body: ${t.font.body};
			--tp-radius: ${t.borderRadius};
		}
	`;
}
function isSectionEnabled(name) {
  return config.sections[name] !== false;
}
const $$HeroSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$HeroSection;
  const {
    title,
    subtitle,
    ctaText = "Get Started",
    ctaUrl = "/contact",
    secondaryCtaText,
    secondaryCtaUrl
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="hero" data-astro-cid-7nmnspah> <div class="hero-bg" data-astro-cid-7nmnspah></div> <div class="hero-inner" data-astro-cid-7nmnspah> <h1 class="hero-title" data-astro-cid-7nmnspah>${title}</h1> ${subtitle && renderTemplate`<p class="hero-subtitle" data-astro-cid-7nmnspah>${subtitle}</p>`} <div class="hero-actions" data-astro-cid-7nmnspah> <a${addAttribute(ctaUrl, "href")} class="btn-primary" data-astro-cid-7nmnspah>${ctaText}</a> ${secondaryCtaText && renderTemplate`<a${addAttribute(secondaryCtaUrl ?? "#", "href")} class="btn-secondary" data-astro-cid-7nmnspah>${secondaryCtaText}</a>`} </div> </div> </section>`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/components/sections/HeroSection.astro", void 0);
const $$ServicesGrid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ServicesGrid;
  const { services, title = "Our Services", subtitle = "What we offer" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="services-section" data-astro-cid-md26pu45> <div class="services-inner" data-astro-cid-md26pu45> <div class="services-header" data-astro-cid-md26pu45> <h2 class="services-title" data-astro-cid-md26pu45>${title}</h2> ${subtitle && renderTemplate`<p class="services-subtitle" data-astro-cid-md26pu45>${subtitle}</p>`} </div> <div class="services-grid" data-astro-cid-md26pu45> ${services.map((s) => {
    const icon = String(s.data.icon || "").slice(0, 2) || "⚡";
    const name = String(s.data.title || s.data.name || "Service");
    const desc = String(s.data.description || s.data.excerpt || "");
    return renderTemplate`<div class="service-card" data-astro-cid-md26pu45> <div class="service-icon-wrap" data-astro-cid-md26pu45> <span class="service-icon" data-astro-cid-md26pu45>${icon}</span> </div> <h3 class="service-name" data-astro-cid-md26pu45>${name}</h3> <p class="service-desc" data-astro-cid-md26pu45>${desc}</p> </div>`;
  })} </div> </div> </section>`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/components/sections/ServicesGrid.astro", void 0);
const $$TestimonialsSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$TestimonialsSection;
  const { testimonials, title = "What Our Clients Say" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="testimonials-section" data-astro-cid-wgrcrutd> <div class="testimonials-inner" data-astro-cid-wgrcrutd> <h2 class="testimonials-title" data-astro-cid-wgrcrutd>${title}</h2> <div class="testimonials-grid" data-astro-cid-wgrcrutd> ${testimonials.map((t) => {
    const quote = String(t.data.quote || t.data.content || t.data.text || t.data.body || "");
    const name = String(t.data.name || t.data.author_name || t.data.author || "Anonymous");
    const role = String(t.data.role || t.data.author_role || t.data.position || "");
    const company = t.data.company || t.data.author_company;
    const roleDisplay = company ? `${role} at ${String(company)}` : role;
    const initial = name.charAt(0).toUpperCase();
    return renderTemplate`<div class="testimonial-card" data-astro-cid-wgrcrutd> <span class="testimonial-quote-mark" data-astro-cid-wgrcrutd>&ldquo;</span> <p class="testimonial-text" data-astro-cid-wgrcrutd>${quote}</p> <div class="testimonial-author" data-astro-cid-wgrcrutd> <div class="testimonial-avatar" data-astro-cid-wgrcrutd>${initial}</div> <div class="testimonial-meta" data-astro-cid-wgrcrutd> <span class="testimonial-name" data-astro-cid-wgrcrutd>${name}</span> ${roleDisplay && renderTemplate`<span class="testimonial-role" data-astro-cid-wgrcrutd>${roleDisplay}</span>`} </div> </div> </div>`;
  })} </div> </div> </section>`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/components/sections/TestimonialsSection.astro", void 0);
const $$TeamGrid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$TeamGrid;
  const { members, title = "Meet Our Team" } = Astro2.props;
  const cols = members.length >= 4 ? 4 : 3;
  return renderTemplate`${maybeRenderHead()}<section class="team-section" data-astro-cid-7zptrbdc> <div class="team-inner" data-astro-cid-7zptrbdc> <h2 class="team-title" data-astro-cid-7zptrbdc>${title}</h2> <div class="team-grid"${addAttribute(cols, "data-cols")} data-astro-cid-7zptrbdc> ${members.map((m) => {
    const name = String(m.data.name || m.data.title || "Team Member");
    const role = String(m.data.role || m.data.position || m.data.job_title || "");
    const bio = String(m.data.bio || m.data.description || m.data.excerpt || "");
    const initial = name.charAt(0).toUpperCase();
    return renderTemplate`<div class="team-card" data-astro-cid-7zptrbdc> <div class="team-avatar" data-astro-cid-7zptrbdc>${initial}</div> <h3 class="team-name" data-astro-cid-7zptrbdc>${name}</h3> ${role && renderTemplate`<p class="team-role" data-astro-cid-7zptrbdc>${role}</p>`} ${bio && renderTemplate`<p class="team-bio" data-astro-cid-7zptrbdc>${bio}</p>`} </div>`;
  })} </div> </div> </section>`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/components/sections/TeamGrid.astro", void 0);
const $$CaseStudiesGrid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$CaseStudiesGrid;
  const { studies, title = "Case Studies" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="cases-section" data-astro-cid-efcxzxlg> <div class="cases-inner" data-astro-cid-efcxzxlg> <h2 class="cases-title" data-astro-cid-efcxzxlg>${title}</h2> <div class="cases-grid" data-astro-cid-efcxzxlg> ${studies.map((s) => {
    const client = String(s.data.client || s.data.client_name || s.data.company || "");
    const studyTitle = String(s.data.title || s.data.name || "Case Study");
    const desc = String(s.data.description || s.data.excerpt || s.data.summary || "");
    const results = String(s.data.results || s.data.outcome || "");
    return renderTemplate`<div class="case-card" data-astro-cid-efcxzxlg> ${client && renderTemplate`<span class="case-client" data-astro-cid-efcxzxlg>${client}</span>`} <h3 class="case-title" data-astro-cid-efcxzxlg>${studyTitle}</h3> ${desc && renderTemplate`<p class="case-desc" data-astro-cid-efcxzxlg>${desc}</p>`} ${results && renderTemplate`<div class="case-results" data-astro-cid-efcxzxlg> <span class="case-results-label" data-astro-cid-efcxzxlg>Results</span> <span class="case-results-text" data-astro-cid-efcxzxlg>${results}</span> </div>`} </div>`;
  })} </div> </div> </section>`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/components/sections/CaseStudiesGrid.astro", void 0);
const $$CTASection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$CTASection;
  const {
    title = "Ready to Get Started?",
    subtitle = "Let us help you bring your ideas to life.",
    ctaText = "Contact Us",
    ctaUrl = "/contact"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="cta-section" data-astro-cid-coyjnsii> <div class="cta-glow" data-astro-cid-coyjnsii></div> <div class="cta-inner" data-astro-cid-coyjnsii> <h2 class="cta-title" data-astro-cid-coyjnsii>${title}</h2> ${subtitle && renderTemplate`<p class="cta-subtitle" data-astro-cid-coyjnsii>${subtitle}</p>`} <a${addAttribute(ctaUrl, "href")} class="cta-button" data-astro-cid-coyjnsii>${ctaText}</a> </div> </section>`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/components/sections/CTASection.astro", void 0);
const $$RecentPostsSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$RecentPostsSection;
  const { posts, title = "Latest Posts" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="recent-posts-section" data-astro-cid-gn5u6ba7> <div class="recent-posts-inner" data-astro-cid-gn5u6ba7> <div class="recent-posts-header" data-astro-cid-gn5u6ba7> <h2 class="recent-posts-title" data-astro-cid-gn5u6ba7>${title}</h2> <a href="/posts" class="recent-posts-link" data-astro-cid-gn5u6ba7>View all &rarr;</a> </div> <div class="recent-posts-grid" data-astro-cid-gn5u6ba7> ${posts.map((post) => renderTemplate`${renderComponent($$result, "PostCard", $$PostCard, { "title": String(post.data.title ?? "Untitled"), "excerpt": post.data.excerpt, "featuredImage": post.data.featured_image, "href": `/posts/${post.id}`, "date": post.data.publishedAt ?? void 0, "readingTime": getReadingTime(post.data.content), "data-astro-cid-gn5u6ba7": true })}`)} </div> </div> </section>`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/components/sections/RecentPostsSection.astro", void 0);
const $$FAQSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$FAQSection;
  const { faqs, title = "Frequently Asked Questions" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="faq-section" data-astro-cid-h4zmggu3> <div class="faq-inner" data-astro-cid-h4zmggu3> <h2 class="faq-title" data-astro-cid-h4zmggu3>${title}</h2> <div class="faq-list" data-astro-cid-h4zmggu3> ${faqs.map((faq) => {
    const question = String(faq.data.question || faq.data.title || "");
    const answer = String(faq.data.answer || faq.data.content || faq.data.body || "");
    return renderTemplate`<details class="faq-item" data-astro-cid-h4zmggu3> <summary class="faq-question" data-astro-cid-h4zmggu3> <span class="faq-question-text" data-astro-cid-h4zmggu3>${question}</span> <span class="faq-toggle" aria-hidden="true" data-astro-cid-h4zmggu3></span> </summary> <div class="faq-answer" data-astro-cid-h4zmggu3> <p data-astro-cid-h4zmggu3>${answer}</p> </div> </details>`;
  })} </div> </div> </section>`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/components/sections/FAQSection.astro", void 0);
const $$ContactSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ContactSection;
  const {
    title = "Get in Touch",
    subtitle = "We would love to hear from you. Reach out and let us know how we can help.",
    email,
    phone,
    address
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="contact-section" data-astro-cid-joh4gybl> <div class="contact-inner" data-astro-cid-joh4gybl> <div class="contact-info" data-astro-cid-joh4gybl> <h2 class="contact-title" data-astro-cid-joh4gybl>${title}</h2> ${subtitle && renderTemplate`<p class="contact-subtitle" data-astro-cid-joh4gybl>${subtitle}</p>`} <div class="contact-details" data-astro-cid-joh4gybl> ${email && renderTemplate`<a${addAttribute(`mailto:${email}`, "href")} class="contact-item" data-astro-cid-joh4gybl> <span class="contact-icon" aria-hidden="true" data-astro-cid-joh4gybl>\\u2709</span> <span data-astro-cid-joh4gybl>${email}</span> </a>`} ${phone && renderTemplate`<a${addAttribute(`tel:${phone}`, "href")} class="contact-item" data-astro-cid-joh4gybl> <span class="contact-icon" aria-hidden="true" data-astro-cid-joh4gybl>\\u260E</span> <span data-astro-cid-joh4gybl>${phone}</span> </a>`} ${address && renderTemplate`<div class="contact-item" data-astro-cid-joh4gybl> <span class="contact-icon" aria-hidden="true" data-astro-cid-joh4gybl>\\uD83D\\uDCCD</span> <span data-astro-cid-joh4gybl>${address}</span> </div>`} </div> </div> <div class="contact-form-wrap" data-astro-cid-joh4gybl> <form class="contact-form" action="#" method="POST" data-astro-cid-joh4gybl> <div class="form-group" data-astro-cid-joh4gybl> <label class="form-label" for="contact-name" data-astro-cid-joh4gybl>Name</label> <input class="form-input" type="text" id="contact-name" name="name" placeholder="Your name" data-astro-cid-joh4gybl> </div> <div class="form-group" data-astro-cid-joh4gybl> <label class="form-label" for="contact-email" data-astro-cid-joh4gybl>Email</label> <input class="form-input" type="email" id="contact-email" name="email" placeholder="you@example.com" data-astro-cid-joh4gybl> </div> <div class="form-group" data-astro-cid-joh4gybl> <label class="form-label" for="contact-message" data-astro-cid-joh4gybl>Message</label> <textarea class="form-input form-textarea" id="contact-message" name="message" rows="5" placeholder="How can we help?" data-astro-cid-joh4gybl></textarea> </div> <button type="submit" class="form-submit" data-astro-cid-joh4gybl>Send Message</button> </form> </div> </div> </section>`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/components/sections/ContactSection.astro", void 0);
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  async function loadCollection(name) {
    try {
      const result = await getEmDashCollection(name);
      return result.entries;
    } catch {
      return [];
    }
  }
  const services = isSectionEnabled("services") ? await loadCollection("services") : [];
  const team = isSectionEnabled("team") ? await loadCollection("team") : [];
  const testimonials = isSectionEnabled("testimonials") ? await loadCollection("testimonials") : [];
  const caseStudies = isSectionEnabled("caseStudies") ? await loadCollection("case_studies") : [];
  const faqs = isSectionEnabled("faq") ? await loadCollection("faq") : [];
  const { entries: rawPosts, cacheHint } = await getEmDashCollection("posts");
  Astro2.cache.set(cacheHint);
  const posts = rawPosts;
  const sortedPosts = posts.toSorted((a, b) => {
    const dateA = a.data.publishedAt?.getTime?.() ?? 0;
    const dateB = b.data.publishedAt?.getTime?.() ?? 0;
    return dateB - dateA;
  });
  const hasContent = services.length > 0 || team.length > 0 || testimonials.length > 0 || caseStudies.length > 0;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": config.site.name, "description": config.site.tagline, "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate` <style is:global>${unescapeHTML(getThemeCSS())}</style> ${isSectionEnabled("hero") && renderTemplate`${renderComponent($$result2, "HeroSection", $$HeroSection, { "title": config.site.name, "subtitle": config.site.tagline, "ctaText": config.hero.ctaText, "ctaUrl": config.hero.ctaUrl, "secondaryCtaText": config.hero.secondaryCtaText, "secondaryCtaUrl": config.hero.secondaryCtaUrl, "data-astro-cid-j7pv25f6": true })}`}${services.length > 0 && renderTemplate`${renderComponent($$result2, "ServicesGrid", $$ServicesGrid, { "services": services, "data-astro-cid-j7pv25f6": true })}`}${caseStudies.length > 0 && renderTemplate`${renderComponent($$result2, "CaseStudiesGrid", $$CaseStudiesGrid, { "studies": caseStudies, "data-astro-cid-j7pv25f6": true })}`}${testimonials.length > 0 && renderTemplate`${renderComponent($$result2, "TestimonialsSection", $$TestimonialsSection, { "testimonials": testimonials, "data-astro-cid-j7pv25f6": true })}`}${team.length > 0 && renderTemplate`${renderComponent($$result2, "TeamGrid", $$TeamGrid, { "members": team, "data-astro-cid-j7pv25f6": true })}`}${faqs.length > 0 && renderTemplate`${renderComponent($$result2, "FAQSection", $$FAQSection, { "faqs": faqs, "data-astro-cid-j7pv25f6": true })}`}${isSectionEnabled("blog") && sortedPosts.length > 0 && renderTemplate`${renderComponent($$result2, "RecentPostsSection", $$RecentPostsSection, { "posts": sortedPosts.slice(0, 3), "data-astro-cid-j7pv25f6": true })}`}${isSectionEnabled("contact") && renderTemplate`${renderComponent($$result2, "ContactSection", $$ContactSection, { "data-astro-cid-j7pv25f6": true })}`}${isSectionEnabled("cta") && renderTemplate`${renderComponent($$result2, "CTASection", $$CTASection, { "data-astro-cid-j7pv25f6": true })}`}${!hasContent && sortedPosts.length === 0 && renderTemplate`${maybeRenderHead()}<section class="empty" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>Welcome to ${config.site.name}</h2> <p data-astro-cid-j7pv25f6>Your website is ready. Open the AI Assistant to start building.</p> <a href="/_emdash/admin" class="empty-btn" data-astro-cid-j7pv25f6>Open Admin</a> </section>`}` })}`;
}, "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/index.astro", void 0);
const $$file = "/Users/niko/Documents/github/angkor-cms/templates/token-press-starter/src/pages/index.astro";
const $$url = "";
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
