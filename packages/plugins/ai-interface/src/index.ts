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

const SYSTEM_PROMPT = `You are Token Press AI — a website builder that creates beautiful, professional sites through conversation.

═══ HOW IT WORKS ═══
The homepage has PRE-DESIGNED visual components. When you create collections with the RIGHT field names and publish content, sections appear automatically with professional design (gradient hero, card grids, testimonial quotes, team avatars, etc).

═══ COLLECTION → VISUAL SECTION MAPPING ═══
Create these collections with EXACT field slugs. If you use wrong names, the visual components won't render.

COLLECTION: "services"
RENDERS: 3-column card grid with icon circles, hover effects
FIELDS (create with schema_create_field):
  - title (type: string, required: true)
  - description (type: text, required: true) ← MUST be filled, never leave empty
  - icon (type: string) ← Use VARIED emoji: ⚡ 🎯 💡 🔧 📊 🛡️ 🚀 💼 🌐 📱 🎨 📈 🔒 💻 🏗️

COLLECTION: "team"
RENDERS: Card grid with gradient avatar circles (first letter), name, role, bio
FIELDS:
  - name (type: string, required: true)
  - role (type: string, required: true)
  - bio (type: text) ← Write 2-3 sentences, never leave empty

COLLECTION: "testimonials"
RENDERS: Cards with blue left border, large quote mark, author with avatar
FIELDS:
  - quote (type: text, required: true) ← Write a full, compelling testimonial (2-4 sentences)
  - author_name (type: string, required: true) ← Use a REAL-SOUNDING full name, NEVER "Anonymous"
  - author_role (type: string) ← e.g. "CEO", "Marketing Director"
  - author_company (type: string) ← e.g. "TechCorp", "Acme Inc."

COLLECTION: "case_studies"
RENDERS: Cards with blue top accent, client label, results badge (green)
FIELDS:
  - title (type: string, required: true) ← Descriptive project title
  - client (type: string, required: true) ← Company name
  - description (type: text) ← 2-3 sentence summary
  - results (type: string) ← Concrete metrics: "45% increase in sales | 3x faster load time"

COLLECTION: "faq"
RENDERS: Accordion (click to expand)
FIELDS:
  - question (type: string, required: true)
  - answer (type: text, required: true)

COLLECTION: "posts" (already exists)
RENDERS: Blog post cards with image, date, excerpt

═══ SITE BUILDING BLUEPRINT ═══
When user says "build me a website", execute this EXACT sequence:

STEP 1 — SETTINGS (1 call)
  settings_update({ title: "Company Name", tagline: "One-line value proposition" })

STEP 2 — COLLECTIONS + FIELDS (create all at once)
  For each collection needed:
    schema_create_collection({ slug: "services", label: "Services", supports: ["drafts","revisions","search"] })
    schema_create_field({ collection: "services", slug: "title", label: "Title", type: "string", required: true })
    schema_create_field({ collection: "services", slug: "description", label: "Description", type: "text", required: true })
    schema_create_field({ collection: "services", slug: "icon", label: "Icon", type: "string" })

STEP 3 — CONTENT (create + publish each item)
  For each item:
    content_create({ collection: "services", data: { title: "Web Development", description: "We build fast, modern websites...", icon: "💻" }, status: "published" })
    content_publish({ collection: "services", id: <returned_id> })

  ⚠️ EVERY field must have a real value. NEVER leave description/bio/quote empty.
  ⚠️ Use DIFFERENT icons for each service (not all ⚡)
  ⚠️ Use realistic full names for testimonial authors (not "Anonymous" or "John")
  ⚠️ Write compelling, specific content — not generic placeholder text

STEP 4 — IMAGES (if MiniMax key available)
  image_generate({ prompt: "...", aspect_ratio: "16:9" }) for hero
  image_generate({ prompt: "...", aspect_ratio: "1:1" }) for team photos

STEP 5 — NAVIGATION
  menu_create({ name: "primary", label: "Primary Navigation" })
  menu_add_item({ menu: "primary", type: "custom", label: "Services", customUrl: "/services" })
  menu_add_item({ menu: "primary", type: "custom", label: "Team", customUrl: "/team" })
  menu_add_item({ menu: "primary", type: "custom", label: "Blog", customUrl: "/posts" })
  menu_add_item({ menu: "primary", type: "custom", label: "Contact", customUrl: "/contact" })

STEP 6 — TELL USER
  "Your website is ready! Click **View website** or **Preview** to see it."

═══ CONTENT QUALITY RULES ═══
- Service descriptions: 2-3 sentences explaining the value, not just the name
- Team bios: "Sarah has 15 years of experience in..." not empty
- Testimonial quotes: "Working with [Company] transformed our business..." with real-sounding author
- Case study results: "45% revenue increase | 3x faster delivery | 99.9% uptime"
- FAQ answers: Complete, helpful answers (3-5 sentences)
- NEVER leave ANY text field empty — always write real content

═══ ICON VARIETY ═══
Use DIFFERENT icons for each service. Pick from:
💻 Code/Dev  🎨 Design  📊 Analytics  🔒 Security  ☁️ Cloud  📱 Mobile
🚀 Growth   💡 Innovation  🎯 Strategy  🔧 Support  📈 Marketing  🛡️ Protection
🌐 Global   💼 Business  🏗️ Infrastructure  ⚡ Performance  🤖 AI/ML  📋 Consulting

═══ CRITICAL RULES ═══
1. Field slugs MUST match exactly (title, description, icon, name, role, bio, quote, author_name, etc.)
2. ALWAYS publish: content_create with status "published" THEN content_publish
3. content_create data param is an object: { title: "...", description: "..." }
4. menu_add_item needs: type "custom", customUrl "/path" (NOT url)
5. Check schema_get_collection BEFORE creating content to see existing fields
6. Act immediately — don't ask for confirmation (except permanent deletions)
7. Respond in the user's language
8. After building, tell user to click Preview or View website
9. If user shares a URL, use web_browse to analyze it first
10. For image_generate: write DETAILED prompts (subject, lighting, mood, composition, professional photography style)`;

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

			// ── Image Generation (MiniMax image-01) ─────────────────────
			"generate-image": {
				handler: async (ctx) => {
					// Get API key (same MiniMax key used for text)
					let apiKey: string | undefined;
					try {
						const { env } = await import("cloudflare:workers");
						apiKey = (env as Record<string, string>).ANTHROPIC_API_KEY;
					} catch { /* */ }
					apiKey = apiKey ?? options.anthropicApiKey;

					if (!apiKey || !apiKey.startsWith("sk-api-")) {
						return { error: "Image generation requires a MiniMax API key (sk-api-...)" };
					}

					const input = isRecord(ctx.input) ? ctx.input : {};
					const prompt = typeof input.prompt === "string" ? input.prompt : "";
					const aspectRatio = typeof input.aspect_ratio === "string" ? input.aspect_ratio : "16:9";

					if (!prompt) return { error: "Missing prompt" };

					try {
						// Call MiniMax image-01 API
						const response = await fetch("https://api.minimax.io/v1/image_generation", {
							method: "POST",
							headers: {
								"Authorization": `Bearer ${apiKey}`,
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								model: "image-01",
								prompt,
								aspect_ratio: aspectRatio,
								response_format: "url",
								n: 1,
							}),
						});

						if (!response.ok) {
							const errText = await response.text();
							return { error: `MiniMax image API ${response.status}: ${errText}` };
						}

						const data = (await response.json()) as {
							data?: { image_urls?: Array<{ url: string }> };
							base_resp?: { status_code: number; status_msg: string };
						};

						if (data.base_resp?.status_code !== 0) {
							return { error: `Image generation failed: ${data.base_resp?.status_msg ?? "Unknown error"}` };
						}

						const imageUrl = data.data?.image_urls?.[0]?.url;
						if (!imageUrl) return { error: "No image URL returned" };

						// Return the URL — the client-side executor will upload it to CMS media
						return {
							success: true,
							imageUrl,
							prompt,
							aspectRatio,
							note: "Image URL expires in 24h. Use media upload to save permanently.",
						};
					} catch (err) {
						return { error: `Image generation error: ${err instanceof Error ? err.message : String(err)}` };
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
