/**
 * Token Press Site Deployer Plugin
 *
 * Routes:
 * - POST /config    — Save/update site configuration
 * - GET  /config    — Get current site configuration
 * - POST /deploy    — Trigger deployment to Cloudflare Pages
 * - GET  /status    — Get deployment status
 * - POST /domain    — Configure custom domain
 */

import type { ResolvedPlugin } from "emdash";
import { definePlugin } from "emdash";

import type { SiteDeployerOptions } from "./descriptor.js";

/** Default site config template */
const DEFAULT_CONFIG = {
	site: { name: "My Website", tagline: "Built with Token Press", locale: "en", url: "" },
	theme: {
		primary: "#2563eb",
		secondary: "#7c3aed",
		accent: "#f59e0b",
		background: "#ffffff",
		surface: "#f8fafc",
		text: "#111827",
		textMuted: "#6b7280",
		font: { heading: "Inter, system-ui, sans-serif", body: "Inter, system-ui, sans-serif" },
		borderRadius: "1rem",
		darkMode: false,
	},
	hero: {
		style: "gradient",
		gradient: { from: "#0f172a", via: "#1e3a8a", to: "#312e81" },
		ctaText: "Get Started",
		ctaUrl: "/contact",
		secondaryCtaText: "Learn More",
		secondaryCtaUrl: "/about",
	},
	sections: {
		hero: true,
		services: true,
		caseStudies: true,
		testimonials: true,
		team: true,
		faq: true,
		pricing: false,
		stats: false,
		contact: true,
		blog: true,
		cta: true,
	},
	nav: { style: "solid", menuName: "primary" },
	footer: { showWidgets: true, copyright: "© {year} {siteName}. All rights reserved.", showPoweredBy: true },
	seo: { titleTemplate: "{title} — {siteName}", defaultDescription: "", ogImage: "" },
};

function isRecord(v: unknown): v is Record<string, unknown> {
	return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep merge two objects */
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
	const result = { ...target };
	for (const key of Object.keys(source)) {
		if (isRecord(source[key]) && isRecord(target[key])) {
			result[key] = deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
		} else {
			result[key] = source[key];
		}
	}
	return result;
}

export function createPlugin(options: SiteDeployerOptions = {}): ResolvedPlugin {
	return definePlugin({
		id: "site-deployer",
		version: "0.1.0",
		capabilities: [],
		allowedHosts: ["api.cloudflare.com"],

		routes: {
			// ── Get site config ──────────────────────────────────────────
			config: {
				handler: async (ctx) => {
					const stored = await ctx.kv.get<Record<string, unknown>>("site:config");
					return stored ?? DEFAULT_CONFIG;
				},
			},

			// ── Save/update site config ──────────────────────────────────
			"config/save": {
				handler: async (ctx) => {
					const input = isRecord(ctx.input) ? ctx.input : {};
					const current = (await ctx.kv.get<Record<string, unknown>>("site:config")) ?? { ...DEFAULT_CONFIG };
					const merged = deepMerge(current, input);
					await ctx.kv.set("site:config", merged);
					return { success: true, config: merged };
				},
			},

			// ── Deploy to Cloudflare Pages ──────────────────────────────
			deploy: {
				handler: async (ctx) => {
					// Get credentials from env
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

					if (!accountId || !cfApiToken) {
						return {
							error: "Missing Cloudflare credentials. Set CF_ACCOUNT_ID and CF_API_TOKEN as wrangler secrets.",
						};
					}

					const siteConfig = (await ctx.kv.get<Record<string, unknown>>("site:config")) ?? DEFAULT_CONFIG;
					const siteName = isRecord(siteConfig.site) ? String((siteConfig.site as Record<string, unknown>).name ?? "my-site") : "my-site";
					const projectName = siteName.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 58);

					// Store deployment status
					await ctx.kv.set("site:deploy:status", {
						status: "deploying",
						projectName,
						startedAt: new Date().toISOString(),
					});

					try {
						// Step 1: Ensure Pages project exists
						const projectUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`;
						const checkProject = await fetch(projectUrl, {
							headers: { Authorization: `Bearer ${cfApiToken}` },
						});

						if (!checkProject.ok) {
							// Create the project
							const createRes = await fetch(
								`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`,
								{
									method: "POST",
									headers: {
										Authorization: `Bearer ${cfApiToken}`,
										"Content-Type": "application/json",
									},
									body: JSON.stringify({
										name: projectName,
										production_branch: "main",
									}),
								},
							);
							if (!createRes.ok) {
								const err = await createRes.text();
								throw new Error(`Failed to create Pages project: ${err}`);
							}
						}

						// Step 2: Create deployment with Direct Upload
						// For now, we store the config and return the project URL
						// Full file upload will be implemented when we have the build pipeline
						const deployUrl = `https://${projectName}.pages.dev`;

						await ctx.kv.set("site:deploy:status", {
							status: "ready",
							projectName,
							url: deployUrl,
							deployedAt: new Date().toISOString(),
							config: siteConfig,
						});

						return {
							success: true,
							projectName,
							url: deployUrl,
							message: `Pages project "${projectName}" is ready. Full deployment pipeline coming soon.`,
						};
					} catch (err) {
						const msg = err instanceof Error ? err.message : String(err);
						await ctx.kv.set("site:deploy:status", {
							status: "error",
							error: msg,
							failedAt: new Date().toISOString(),
						});
						return { error: msg };
					}
				},
			},

			// ── Get deployment status ────────────────────────────────────
			status: {
				handler: async (ctx) => {
					const status = await ctx.kv.get("site:deploy:status");
					return status ?? { status: "not_deployed" };
				},
			},

			// ── Configure custom domain ──────────────────────────────────
			"domain/set": {
				handler: async (ctx) => {
					const input = isRecord(ctx.input) ? ctx.input : {};
					const domain = typeof input.domain === "string" ? input.domain : "";

					if (!domain) return { error: "Missing domain" };

					// Store domain config
					await ctx.kv.set("site:domain", {
						domain,
						status: "pending",
						configuredAt: new Date().toISOString(),
					});

					return {
						success: true,
						domain,
						message: `Domain "${domain}" configured. DNS setup instructions will be provided.`,
					};
				},
			},
		},
	});
}

export default createPlugin;
