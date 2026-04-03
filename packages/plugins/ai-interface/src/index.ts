/**
 * Token Press AI Interface Plugin
 *
 * Provides a native AI chat interface in the CMS admin.
 * The server acts as a proxy for the Anthropic API key — streaming
 * Claude's response to the browser. The agentic loop (tool execution)
 * runs entirely on the client side, where it has direct access to
 * CMS REST API endpoints with the user's session cookies.
 *
 * Also provides:
 * - Conversation persistence via KV storage
 * - Web browsing proxy (server-side fetch to avoid CORS)
 */

import type { ResolvedPlugin } from "emdash";
import { definePlugin } from "emdash";

import type { AIInterfaceOptions } from "./descriptor.js";
import { CMS_TOOLS } from "./tools.js";

const ANTHROPIC_VERSION = "2023-06-01";

/** Auto-detect provider from API key format */
function resolveProvider(apiKey: string): { baseUrl: string; model: string } {
	if (apiKey.startsWith("sk-api-")) {
		// MiniMax — Anthropic-compatible API
		return { baseUrl: "https://api.minimax.io/anthropic/v1/messages", model: "MiniMax-M2.7" };
	}
	// Default: Anthropic
	return { baseUrl: "https://api.anthropic.com/v1/messages", model: "claude-sonnet-4-6" };
}

const SYSTEM_PROMPT = `You are Token Press AI — you help users BUILD beautiful, professional websites through conversation.

Every action you take changes the LIVE WEBSITE. The homepage has PRE-DESIGNED visual components that automatically render when you create the right collections.

VISUAL SECTIONS — COLLECTIONS THAT AUTO-RENDER:
The homepage and dedicated pages detect these collections and render them with professional design:

1. "services" → Beautiful service cards with icons (homepage grid + /services page)
   FIELDS: title (string), description (text), icon (string — emoji like ⚡🎯💡🔧📊🛡️)

2. "team" → Team member cards with avatars (homepage grid + /team page)
   FIELDS: name (string), role (string), bio (text)

3. "testimonials" → Testimonial quotes with author info (homepage section)
   FIELDS: quote (text), author_name (string), author_role (string), author_company (string)

4. "case_studies" → Case study cards with results badges (homepage section)
   FIELDS: title (string), client (string), description (text), results (string)

5. "faq" → Accordion FAQ section (homepage)
   FIELDS: question (string), answer (text)

6. "pricing" → Pricing tier cards (homepage)
   FIELDS: name (string), price (string), features (text — one per line), cta_text (string), cta_url (string), featured (boolean)

7. "posts" → Blog post cards (homepage + /posts page — already exists)

AVAILABLE PAGES (auto-generated from collections):
- / → Homepage with all sections
- /services → All services grid
- /services/{slug} → Individual service detail
- /team → All team members
- /posts → All blog posts
- /posts/{slug} → Individual post
- /contact → Contact page
- /pages/{slug} → CMS pages

SITE BUILDING WORKFLOW:
1. settings_update → site title + tagline (shown in hero banner)
2. Create collections with EXACT field names above
3. Create + PUBLISH content items (status: "published" + content_publish)
4. menu_create "primary" → menu_add_item for each page (type: "custom", customUrl: "/services")
5. Tell user to click "View website" — professional site with gradient hero, designed cards, CTAs

CRITICAL RULES:
1. Use EXACT field slugs above — they must match for visual components to render
2. ALWAYS publish (status: "published" + content_publish)
3. Check schema_get_collection before creating content
4. content_create data param: {title: "...", description: "..."}
5. Icons: use emoji ⚡ 🎯 💡 🔧 📊 🛡️ 🚀 💼 🌐 📱
6. Act immediately — no confirmation needed (except deletions)
7. Respond in user's language
8. Menu items: type "custom", customUrl "/path"
9. web_browse URLs the user shares before building
10. When building a COMPLETE site, create ALL collections at once, then ALL content, then menu`;

/** Narrow unknown to a record */
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createPlugin(options: AIInterfaceOptions = {}): ResolvedPlugin {
	return definePlugin({
		id: "ai-interface",
		version: "0.2.0",
		capabilities: [],
		allowedHosts: ["api.anthropic.com", "api.minimax.io"],

		admin: {
			entry: "@angkor-cms/plugin-ai-interface/admin",
			pages: [{ path: "/chat", label: "AI Assistant", icon: "sparkle" }],
			widgets: [],
		},

		routes: {
			// ── Anthropic proxy ──────────────────────────────────────────
			chat: {
				handler: async (ctx) => {
					let apiKey = options.anthropicApiKey;
					if (!apiKey) {
						try {
							const { env } = await import("cloudflare:workers");
							apiKey = (env as Record<string, string>).ANTHROPIC_API_KEY;
						} catch {
							// Not in Workers
						}
					}

					if (!apiKey) {
						return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), {
							status: 500,
							headers: { "Content-Type": "application/json" },
						});
					}

					const input = ctx.input as {
						messages?: Array<{ role: string; content: unknown }>;
						pageContext?: { type: string; collection?: string; contentId?: string; menuName?: string; taxonomy?: string; slug?: string; settingsPage?: string; isNew?: boolean; isEditing?: boolean };
					} | null;
					const messages = Array.isArray(input?.messages) ? input.messages : [];

					if (messages.length === 0) {
						return new Response(JSON.stringify({ error: "No messages provided" }), {
							status: 400,
							headers: { "Content-Type": "application/json" },
						});
					}

					// Build context-aware system prompt
					let systemPrompt = SYSTEM_PROMPT;
					const pc = input?.pageContext;
					if (pc) {
						let ctx_prompt = "";
						switch (pc.type) {
							case "content":
								if (pc.isEditing) ctx_prompt = `\n\nCONTEXT: The user is editing content item "${pc.contentId}" in the "${pc.collection}" collection. Prioritize: improving text, translating, SEO, publishing. Use content_get to read current content before suggesting changes.`;
								else if (pc.isNew) ctx_prompt = `\n\nCONTEXT: The user is creating a new "${pc.collection}" item. Use schema_get_collection to check fields, then help fill them with great content.`;
								else ctx_prompt = `\n\nCONTEXT: The user is browsing the "${pc.collection}" collection. They may want to create, edit, or manage items.`;
								break;
							case "menu":
								ctx_prompt = pc.menuName
									? `\n\nCONTEXT: The user is editing the "${pc.menuName}" menu. Use menu_get to see current items, then help add/remove/reorder.`
									: `\n\nCONTEXT: The user is managing menus. Use menu_list to see existing menus.`;
								break;
							case "taxonomy":
								ctx_prompt = `\n\nCONTEXT: The user is managing the "${pc.taxonomy}" taxonomy. Help add, edit, or organize terms.`;
								break;
							case "settings":
								ctx_prompt = `\n\nCONTEXT: The user is in site settings (${pc.settingsPage || "general"}). Use settings_get to see current values, then help configure.`;
								break;
							case "content-types":
								ctx_prompt = pc.slug
									? `\n\nCONTEXT: The user is editing the "${pc.slug}" content type. Use schema_get_collection to see current schema.`
									: `\n\nCONTEXT: The user is managing content types. Use schema_list_collections to see what exists.`;
								break;
							case "media": ctx_prompt = "\n\nCONTEXT: The user is in the media library. Help manage files — list, update metadata, or identify unused media."; break;
							case "comments": ctx_prompt = "\n\nCONTEXT: The user is managing comments. Use comment_list to show pending ones."; break;
							case "sections": ctx_prompt = "\n\nCONTEXT: The user is managing page sections. Help create reusable blocks (heroes, grids, CTAs)."; break;
							case "widgets": ctx_prompt = "\n\nCONTEXT: The user is managing widget areas. Help set up sidebar, footer, or other zones."; break;
							case "redirects": ctx_prompt = "\n\nCONTEXT: The user is managing URL redirects. Help create or edit redirect rules."; break;
							case "users": ctx_prompt = "\n\nCONTEXT: The user is managing site users."; break;
							case "dashboard": ctx_prompt = "\n\nCONTEXT: The user is on the dashboard — overview mode. They may want to start building or check site status."; break;
						}
						systemPrompt += ctx_prompt;
					}

					const provider = resolveProvider(apiKey);
					const model = options.model ?? provider.model;
					const maxTokens = options.maxTokens ?? 4096;

					const anthropicResponse = await fetch(provider.baseUrl, {
						method: "POST",
						headers: {
							"x-api-key": apiKey,
							"anthropic-version": ANTHROPIC_VERSION,
							"content-type": "application/json",
						},
						body: JSON.stringify({
							model,
							max_tokens: maxTokens,
							system: systemPrompt,
							tools: CMS_TOOLS,
							messages,
							stream: true,
						}),
					});

					if (!anthropicResponse.ok || !anthropicResponse.body) {
						const errText = await anthropicResponse.text().catch(() => "Unknown error");
						return new Response(
							JSON.stringify({ error: `Anthropic API ${anthropicResponse.status}: ${errText}` }),
							{ status: 502, headers: { "Content-Type": "application/json" } },
						);
					}

					return new Response(anthropicResponse.body, {
						headers: {
							"Content-Type": "text/event-stream",
							"Cache-Control": "no-cache",
							"X-Accel-Buffering": "no",
						},
					});
				},
			},

			// ── Web browsing proxy ───────────────────────────────────────
			browse: {
				handler: async (ctx) => {
					const input = isRecord(ctx.input) ? ctx.input : {};
					const url = typeof input.url === "string" ? input.url : "";

					if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
						return { error: "Invalid URL — must start with http:// or https://" };
					}

					try {
						const response = await fetch(url, {
							headers: { "User-Agent": "TokenPress-AI/1.0 (website builder bot)" },
							redirect: "follow",
						});

						const html = await response.text();

						// Extract title
						const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
						const title = titleMatch?.[1]?.trim() ?? "";

						// Extract meta description
						const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i);
						const description = descMatch?.[1]?.trim() ?? "";

						// Strip HTML to plain text
						const text = html
							.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
							.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
							.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "[NAV]")
							.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "[HEADER]")
							.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "[FOOTER]")
							.replace(/<[^>]+>/g, " ")
							.replace(/\s+/g, " ")
							.trim()
							.slice(0, 10000);

						return { title, description, url, statusCode: response.status, content: text };
					} catch (err) {
						return { error: `Failed to fetch: ${err instanceof Error ? err.message : String(err)}` };
					}
				},
			},

			// ── Conversation persistence ─────────────────────────────────
			conversations: {
				handler: async (ctx) => {
					const list = (await ctx.kv.get<Array<{ id: string; title: string; updatedAt: string }>>(
						"conversations:index",
					)) ?? [];
					return list;
				},
			},

			"conversations/save": {
				handler: async (ctx) => {
					const input = isRecord(ctx.input) ? ctx.input : {};
					const id = typeof input.id === "string" ? input.id : "";
					const title = typeof input.title === "string" ? input.title : "Untitled";
					const messages = Array.isArray(input.messages) ? input.messages : [];

					if (!id) return { error: "Missing conversation id" };

					const now = new Date().toISOString();
					await ctx.kv.set(`conversations:${id}`, { title, messages, updatedAt: now });

					// Update index
					const list = (await ctx.kv.get<Array<{ id: string; title: string; updatedAt: string }>>(
						"conversations:index",
					)) ?? [];
					const existing = list.findIndex((c) => c.id === id);
					const meta = { id, title, updatedAt: now };
					if (existing >= 0) list[existing] = meta;
					else list.unshift(meta);
					await ctx.kv.set("conversations:index", list.slice(0, 50));

					return { success: true };
				},
			},

			"conversations/load": {
				handler: async (ctx) => {
					const input = isRecord(ctx.input) ? ctx.input : {};
					const id = typeof input.id === "string" ? input.id : "";
					if (!id) return { error: "Missing conversation id" };
					return (await ctx.kv.get(`conversations:${id}`)) ?? { error: "Not found" };
				},
			},

			"conversations/delete": {
				handler: async (ctx) => {
					const input = isRecord(ctx.input) ? ctx.input : {};
					const id = typeof input.id === "string" ? input.id : "";
					if (!id) return { error: "Missing conversation id" };
					await ctx.kv.delete(`conversations:${id}`);
					const list = (await ctx.kv.get<Array<{ id: string; title: string; updatedAt: string }>>(
						"conversations:index",
					)) ?? [];
					await ctx.kv.set(
						"conversations:index",
						list.filter((c) => c.id !== id),
					);
					return { success: true };
				},
			},
		},
	});
}

export default createPlugin;
