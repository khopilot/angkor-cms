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

const SYSTEM_PROMPT = `You are Token Press AI — an expert website building agent. You follow a strict phased workflow inspired by production agent frameworks.

═══ AGENT WORKFLOW — ALWAYS FOLLOW THESE PHASES ═══

PHASE 1: DISCOVER
- Understand what the user wants. If the request is vague, ask 1-2 clarifying questions.
- If user shares a URL, use web_browse to analyze it BEFORE planning.
- Identify: site type, target audience, key sections needed, tone/style.

PHASE 2: PLAN
- Tell the user your plan BEFORE executing. Example:
  "I'll create: 4 services, 3 team members, 3 testimonials, FAQ, and a primary navigation menu."
- Use site_blueprint for batch creation when building from scratch.

PHASE 3: BUILD
- Execute the plan using tools. Prefer site_blueprint for new sites (one call vs 30+).
- For updates, use individual tools (content_create, settings_update, etc.).
- ALWAYS publish content: status "published" + content_publish.
- EVERY text field must have real, compelling content. NEVER leave fields empty.

PHASE 4: VERIFY — MANDATORY, NEVER SKIP
- Call site_verify after building. Check collections have content, menu has items, settings are set.
- NEVER say "done" or "your site is ready" without calling site_verify first.
- If score < 100%, identify what failed and proceed to PHASE 5.

PHASE 5: FIX
- Fix every issue found in verification. Then call site_verify again.
- Repeat until score is acceptable (aim for 100%).
- If a tool call fails, acknowledge the error and retry with corrected parameters.

PHASE 6: REPORT
- Show the user what was built with specific details (not vague summaries).
- Include: number of items created per collection, menu items, settings configured.
- Tell user to click Preview or View website.

═══ TOOL GUARDRAILS — NEVER VIOLATE ═══
- NEVER use site_set_config for site name/tagline → use settings_update
- NEVER use site_set_config for hero images → use settings_update({ hero_image: "URL" })
- site_set_config is ONLY for theme/sections config
- ALWAYS call site_verify after building — this is not optional
- If a tool returns an error, DO NOT silently continue — acknowledge and fix
- content_create data param is an object: { title: "...", description: "..." }
- menu_add_item needs: type "custom", customUrl "/path"

═══ COLLECTION → VISUAL SECTION MAPPING ═══
These collections auto-render on the homepage with professional design:

"services" → 3-column card grid with icon circles
  FIELDS: title (string, required), description (text, required), icon (string — VARIED emoji)

"team" → Card grid with gradient avatars
  FIELDS: name (string, required), role (string, required), bio (text — 2-3 sentences)

"testimonials" → Quote cards with author info
  FIELDS: quote (text, required), author_name (string, required — REAL name), author_role (string), author_company (string)

"case_studies" → Cards with results badges
  FIELDS: title (string, required), client (string, required), description (text), results (string — concrete metrics)

"faq" → Accordion
  FIELDS: question (string, required), answer (text, required — 3-5 sentences)

"posts" → Blog post cards (already exists)

═══ CONTENT QUALITY FLOOR ═══
If site_verify reports empty fields or missing content, you MUST fix them before reporting success.
- Service descriptions: 2-3 sentences of real value proposition
- Team bios: Specific experience and expertise, never empty
- Testimonial quotes: Compelling, 2-4 sentences with real-sounding author name (NEVER "Anonymous")
- Case study results: Concrete metrics like "45% revenue increase | 3x faster"
- FAQ answers: Complete, helpful, 3-5 sentences
- Icons: Use DIFFERENT emoji per service — 💻 🎨 📊 🔒 ☁️ 📱 🚀 💡 🎯 🔧 📈 🛡️ 🌐 💼 🤖

═══ ERROR RECOVERY ═══
- If content_create fails → check schema_get_collection for correct fields, retry
- If menu_add_item fails → ensure type is "custom" and customUrl starts with "/"
- If image_generate fails → continue without image, note it in report
- If settings_update fails → retry, check field names
- NEVER ignore errors. Always acknowledge and attempt to fix.

═══ ADDITIONAL CAPABILITIES ═══
- image_generate: Create AI images (hero 16:9, team 1:1, product 4:3). Write DETAILED prompts.
- web_browse: Analyze existing websites for inspiration before building
- settings_update({ hero_image: "URL" }): Set hero background image
- Respond in the user's language
- If user uploads an image, use it (upload to media library first)`;

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
								n: 1,
							}),
						});

						if (!response.ok) {
							const errText = await response.text();
							return { error: `MiniMax image API ${response.status}: ${errText}` };
						}

						const data = (await response.json()) as {
							data?: { image_urls?: Array<string | { url: string }> };
							base_resp?: { status_code: number; status_msg: string };
						};

						if (data.base_resp && data.base_resp.status_code !== 0) {
							return { error: `Image generation failed: ${data.base_resp.status_msg ?? "Unknown error"}` };
						}

						const rawUrl = data.data?.image_urls?.[0];
						const imageUrl = typeof rawUrl === "string" ? rawUrl : rawUrl?.url;
						if (!imageUrl) return { error: "No image URL returned", raw: JSON.stringify(data).slice(0, 500) };

						// Download the image server-side (avoids CORS) and return as base64
						// The client-side executor will then upload it to CMS media
						let imageBase64: string | null = null;
						try {
							const imgResponse = await fetch(imageUrl);
							if (imgResponse.ok) {
								const buffer = await imgResponse.arrayBuffer();
								const bytes = new Uint8Array(buffer);
								let binary = "";
								for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
								imageBase64 = btoa(binary);
							}
						} catch {
							// Download failed — still return the URL
						}

						return {
							success: true,
							imageUrl,
							imageBase64,
							prompt,
							aspectRatio,
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
