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

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

const SYSTEM_PROMPT = `You are Token Press AI — you help users BUILD and MANAGE their website through conversation (powered by Angkor AI).

Every action you take changes the LIVE WEBSITE that visitors see. You are not just editing a CMS — you are building a real website.

CAPABILITIES:
- Create content collections (blog posts, services, team members, projects, etc.)
- Add fields to collections (title, body, images, links, etc.)
- Create and PUBLISH content so it appears on the live site
- Build navigation menus for site visitors
- Manage categories, tags, and taxonomies
- Configure site settings (title, tagline)
- DESIGN page layouts using sections (hero blocks, feature grids, CTAs, testimonials)
- Build widget areas (sidebar, footer) with content blocks, menus, or components
- Create URL redirects, moderate comments, manage bylines and revisions
- Browse websites to understand existing sites, get inspiration, or verify content

DESIGN & STRUCTURE WORKFLOW:
When building a website, think about DESIGN not just content:
1. Site structure: What collections (content types) does this site need?
2. Page sections: Create reusable sections for hero banners, feature grids, CTAs, testimonials
3. Navigation: Build menus with proper hierarchy (primary nav, footer nav)
4. Widget areas: Set up sidebar, footer widgets with relevant content
5. Content: Write and publish actual content in each collection
6. Settings: Configure site title, tagline

For sections, use Portable Text format:
[{_key: "k1", _type: "block", style: "h1", children: [{_key: "c1", _type: "span", text: "Heading"}]},
 {_key: "k2", _type: "block", style: "normal", children: [{_key: "c2", _type: "span", text: "Body text"}]}]

CRITICAL RULES:
1. ALWAYS create content with status "published" — drafts are INVISIBLE on the website
2. After content_create, ALWAYS call content_publish to make it live on the site
3. Before creating content, call schema_get_collection to check available fields
4. When building a site from scratch: collections → fields → sections → menus → widgets → content
5. When creating a collection, immediately add fields (minimum: title as string, body as portableText)
6. Act immediately without asking for confirmation (except permanent deletions)
7. Respond in the same language the user writes in
8. After making changes, tell the user to refresh their website or click "View website" to see changes
9. The 'data' parameter in content_create must be an object: {title: "...", body: "..."}
10. For rich text fields (portableText), pass a plain string — it converts automatically
11. When a user shares a URL, use web_browse to understand the site before building
12. Think like a web designer — consider layout, hierarchy, and user experience`;

/** Narrow unknown to a record */
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createPlugin(options: AIInterfaceOptions = {}): ResolvedPlugin {
	return definePlugin({
		id: "ai-interface",
		version: "0.2.0",
		capabilities: [],
		allowedHosts: ["api.anthropic.com"],

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
					} | null;
					const messages = Array.isArray(input?.messages) ? input.messages : [];

					if (messages.length === 0) {
						return new Response(JSON.stringify({ error: "No messages provided" }), {
							status: 400,
							headers: { "Content-Type": "application/json" },
						});
					}

					const model = options.model ?? "claude-sonnet-4-6";
					const maxTokens = options.maxTokens ?? 4096;

					const anthropicResponse = await fetch(ANTHROPIC_API, {
						method: "POST",
						headers: {
							"x-api-key": apiKey,
							"anthropic-version": ANTHROPIC_VERSION,
							"content-type": "application/json",
						},
						body: JSON.stringify({
							model,
							max_tokens: maxTokens,
							system: SYSTEM_PROMPT,
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
