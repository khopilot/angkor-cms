/**
 * Token Press Site Deployer Plugin
 *
 * Manages the complete site lifecycle:
 * - Site creation + configuration
 * - Cloudflare Pages deployment
 * - Custom domain management
 * - Deployment status tracking
 * - Site listing and management
 */

import type { ResolvedPlugin } from "emdash";
import { definePlugin } from "emdash";

import type { SiteDeployerOptions } from "./descriptor.js";
import type { Site, SiteConfig } from "./types.js";
import { PLANS } from "./types.js";

function isRecord(v: unknown): v is Record<string, unknown> {
	return typeof v === "object" && v !== null && !Array.isArray(v);
}

function uid(): string {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const DEFAULT_CONFIG: SiteConfig = {
	theme: { primary: "#2563eb", secondary: "#7c3aed", accent: "#f59e0b", font: "Inter", darkMode: false },
	sections: { hero: true, services: true, testimonials: true, team: true, faq: true, blog: true, contact: true, cta: true },
	hero: { style: "gradient", ctaText: "Get Started", ctaUrl: "/contact" },
	seo: { titleTemplate: "{title} — {siteName}", description: "" },
};

async function getEnvCredentials(options: SiteDeployerOptions): Promise<{ accountId?: string; cfApiToken?: string }> {
	let accountId = options.accountId;
	let cfApiToken = options.cfApiToken;
	if (!accountId || !cfApiToken) {
		try {
			const { env } = await import("cloudflare:workers");
			const e = env as Record<string, string>;
			accountId = accountId ?? e.CF_ACCOUNT_ID;
			cfApiToken = cfApiToken ?? e.CF_API_TOKEN;
		} catch { /* */ }
	}
	return { accountId, cfApiToken };
}

export function createPlugin(options: SiteDeployerOptions = {}): ResolvedPlugin {
	return definePlugin({
		id: "site-deployer",
		version: "0.2.0",
		capabilities: [],
		allowedHosts: ["api.cloudflare.com"],

		routes: {
			// ── List all sites ───────────────────────────────────────────
			sites: {
				handler: async (ctx) => {
					const sites = (await ctx.kv.get<Site[]>("sites:index")) ?? [];
					return { items: sites, plans: PLANS };
				},
			},

			// ── Create a new site ────────────────────────────────────────
			"sites/create": {
				handler: async (ctx) => {
					const input = isRecord(ctx.input) ? ctx.input : {};
					const name = typeof input.name === "string" ? input.name.trim() : "";
					const siteType = typeof input.site_type === "string" ? input.site_type : "business";

					if (!name) return { error: "Site name is required" };

					const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 58);
					const id = uid();

					// Check for duplicate slug
					const existing = (await ctx.kv.get<Site[]>("sites:index")) ?? [];
					if (existing.some((s) => s.slug === slug)) {
						return { error: `A site with slug "${slug}" already exists` };
					}

					const site: Site = {
						id,
						name,
						slug,
						ownerId: "",
						status: "creating",
						domain: null,
						subdomain: `${slug}.pages.dev`,
						config: { ...DEFAULT_CONFIG },
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						deployedAt: null,
						pagesProjectName: null,
					};

					// Save site record
					await ctx.kv.set(`sites:${id}`, site);
					existing.unshift({ ...site });
					await ctx.kv.set("sites:index", existing.slice(0, 100));

					// Try to create Cloudflare Pages project
					const { accountId, cfApiToken } = await getEnvCredentials(options);
					if (accountId && cfApiToken) {
						try {
							const projectName = `tp-${slug}`;
							const createRes = await fetch(
								`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`,
								{
									method: "POST",
									headers: { Authorization: `Bearer ${cfApiToken}`, "Content-Type": "application/json" },
									body: JSON.stringify({ name: projectName, production_branch: "main" }),
								},
							);

							if (createRes.ok) {
								site.pagesProjectName = projectName;
								site.subdomain = `${projectName}.pages.dev`;
								site.status = "active";
							} else {
								// Project might already exist
								site.pagesProjectName = projectName;
								site.status = "active";
							}
						} catch {
							site.status = "active";
						}
					} else {
						site.status = "active";
					}

					site.updatedAt = new Date().toISOString();
					await ctx.kv.set(`sites:${id}`, site);

					// Update index
					const updatedIndex = (await ctx.kv.get<Site[]>("sites:index")) ?? [];
					const idx = updatedIndex.findIndex((s) => s.id === id);
					if (idx >= 0) updatedIndex[idx] = site;
					await ctx.kv.set("sites:index", updatedIndex);

					return { success: true, site };
				},
			},

			// ── Get a single site ────────────────────────────────────────
			"sites/get": {
				handler: async (ctx) => {
					const input = isRecord(ctx.input) ? ctx.input : {};
					const id = typeof input.id === "string" ? input.id : "";
					if (!id) return { error: "Missing site id" };
					const site = await ctx.kv.get<Site>(`sites:${id}`);
					return site ?? { error: "Site not found" };
				},
			},

			// ── Update site config ───────────────────────────────────────
			"sites/update-config": {
				handler: async (ctx) => {
					const input = isRecord(ctx.input) ? ctx.input : {};
					const id = typeof input.id === "string" ? input.id : "";
					if (!id) return { error: "Missing site id" };

					const site = await ctx.kv.get<Site>(`sites:${id}`);
					if (!site) return { error: "Site not found" };

					// Deep merge config
					if (isRecord(input.config)) {
						const c = input.config;
						if (isRecord(c.theme)) Object.assign(site.config.theme, c.theme);
						if (isRecord(c.sections)) Object.assign(site.config.sections, c.sections);
						if (isRecord(c.hero)) Object.assign(site.config.hero, c.hero);
						if (isRecord(c.seo)) Object.assign(site.config.seo, c.seo);
					}

					// Update name/domain if provided
					if (typeof input.name === "string") site.name = input.name;
					if (typeof input.domain === "string") site.domain = input.domain;

					site.updatedAt = new Date().toISOString();
					await ctx.kv.set(`sites:${id}`, site);

					// Update index
					const index = (await ctx.kv.get<Site[]>("sites:index")) ?? [];
					const idx = index.findIndex((s) => s.id === id);
					if (idx >= 0) { index[idx] = site; await ctx.kv.set("sites:index", index); }

					return { success: true, site };
				},
			},

			// ── Delete a site ────────────────────────────────────────────
			"sites/delete": {
				handler: async (ctx) => {
					const input = isRecord(ctx.input) ? ctx.input : {};
					const id = typeof input.id === "string" ? input.id : "";
					if (!id) return { error: "Missing site id" };

					await ctx.kv.delete(`sites:${id}`);
					const index = (await ctx.kv.get<Site[]>("sites:index")) ?? [];
					await ctx.kv.set("sites:index", index.filter((s) => s.id !== id));

					return { success: true };
				},
			},

			// ── Set custom domain ────────────────────────────────────────
			"sites/set-domain": {
				handler: async (ctx) => {
					const input = isRecord(ctx.input) ? ctx.input : {};
					const id = typeof input.id === "string" ? input.id : "";
					const domain = typeof input.domain === "string" ? input.domain : "";

					if (!id || !domain) return { error: "Missing site id or domain" };

					const site = await ctx.kv.get<Site>(`sites:${id}`);
					if (!site) return { error: "Site not found" };

					site.domain = domain;
					site.updatedAt = new Date().toISOString();
					await ctx.kv.set(`sites:${id}`, site);

					// Try to create custom hostname via Cloudflare for SaaS
					const { accountId, cfApiToken } = await getEnvCredentials(options);
					let dnsInstructions = "";

					if (accountId && cfApiToken && options.baseDomain) {
						try {
							// Get zone ID for base domain
							const zoneRes = await fetch(
								`https://api.cloudflare.com/client/v4/zones?name=${options.baseDomain}`,
								{ headers: { Authorization: `Bearer ${cfApiToken}` } },
							);
							const zoneData = (await zoneRes.json()) as { result?: Array<{ id: string }> };
							const zoneId = zoneData.result?.[0]?.id;

							if (zoneId) {
								// Create custom hostname
								await fetch(
									`https://api.cloudflare.com/client/v4/zones/${zoneId}/custom_hostnames`,
									{
										method: "POST",
										headers: { Authorization: `Bearer ${cfApiToken}`, "Content-Type": "application/json" },
										body: JSON.stringify({
											hostname: domain,
											ssl: { method: "http", type: "dv", settings: { min_tls_version: "1.2" } },
										}),
									},
								);
								dnsInstructions = `Add a CNAME record: ${domain} → ${site.subdomain}`;
							}
						} catch {
							dnsInstructions = `Add a CNAME record: ${domain} → ${site.subdomain}`;
						}
					} else {
						dnsInstructions = `Add a CNAME record: ${domain} → ${site.subdomain}`;
					}

					return {
						success: true,
						domain,
						dnsInstructions,
						message: `Custom domain "${domain}" configured. ${dnsInstructions}`,
					};
				},
			},

			// ── Get deployment status ────────────────────────────────────
			status: {
				handler: async (ctx) => {
					const status = await ctx.kv.get("site:deploy:status");
					return status ?? { status: "not_deployed" };
				},
			},

			// ── Legacy config endpoints (keep for backward compat) ───────
			config: {
				handler: async (ctx) => {
					return (await ctx.kv.get("site:config")) ?? DEFAULT_CONFIG;
				},
			},

			"config/save": {
				handler: async (ctx) => {
					const input = isRecord(ctx.input) ? ctx.input : {};
					const current = (await ctx.kv.get<Record<string, unknown>>("site:config")) ?? {};
					const merged = { ...current, ...input };
					await ctx.kv.set("site:config", merged);
					return { success: true, config: merged };
				},
			},

			// ── Plans ────────────────────────────────────────────────────
			plans: {
				handler: async () => {
					return { plans: PLANS };
				},
			},
		},
	});
}

export default createPlugin;
