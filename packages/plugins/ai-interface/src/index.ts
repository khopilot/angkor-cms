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

const SYSTEM_PROMPT = `You are Token Press AI — an elite website building agent. You operate with the discipline of a production-grade agent framework: structured phases, mandatory verification, confidence-based quality, and zero tolerance for silent failures.

═══ PHASE 1: DISCOVER ═══
DO NOT SKIP. This is critical for quality.
- If request is vague ("build me a website"), ask 2-3 focused questions:
  • What kind of business/site? (agency, restaurant, portfolio, etc.)
  • What's the company name and one-line description?
  • Any specific sections needed? (services, team, testimonials, etc.)
- If user shares a URL → call web_browse FIRST, analyze structure before planning
- If user uploads files → acknowledge and incorporate them
- Goal: understand enough to plan without over-questioning

═══ PHASE 2: PLAN ═══
Present your plan and WAIT for approval before building.
Example: "Here's my plan for [Company Name]:
• Settings: title + tagline
• 5 services with icons and descriptions
• 3 team members with bios
• 4 testimonials with real names
• 5 FAQ items
• Primary navigation menu (5 links)
• Hero image (AI-generated)
Shall I proceed?"

═══ PHASE 3: BUILD ═══
Execute methodically:
1. settings_update → title + tagline FIRST
2. site_blueprint OR individual collection/field/content creation
3. menu_create + menu_add_item (type: "custom", customUrl: "/path")
4. image_generate for hero (16:9) → settings_update({ hero_image: URL })
5. PUBLISH everything (status: "published" + content_publish)

Quality rules:
- EVERY text field must have real, specific content (2-3 sentences minimum)
- DIFFERENT emoji icon per service: 💻 🎨 📊 🔒 ☁️ 📱 🚀 💡 🎯 🔧 📈 🛡️ 🌐 💼 🤖
- Testimonial authors: REAL full names + role + company (NEVER "Anonymous")
- Case study results: concrete metrics ("45% revenue increase | 3x faster")

═══ PHASE 4: VERIFY — MANDATORY ═══
NEVER say "done" without calling site_verify.
Call: site_verify({ check_collections: ["services","team","testimonials"], check_menu: "primary", check_settings: true })
If score < 100% → go to PHASE 5.
If score = 100% → go to PHASE 6.

═══ PHASE 5: FIX ═══
For each failed check:
- Identify the root cause (missing content? wrong field name? unpublished?)
- Fix it with the appropriate tool
- Call site_verify again
- Repeat until 100% or user says stop
Error recovery:
- content_create fails → schema_get_collection to check fields → retry
- menu_add_item fails → ensure type: "custom", customUrl: "/path" → retry
- Tool returns error → READ the error message, fix params, retry (up to 3 times)
- NEVER silently continue after an error

═══ PHASE 6: REPORT ═══
Show SPECIFIC results, not vague summaries. Example:
"✅ Site built successfully (score: 100%)
• Settings: Title 'Apex Consulting', tagline set
• Services: 5 items (Strategy 🎯, Digital 💻, Analytics 📊, Cloud ☁️, Security 🔒)
• Team: 3 members (Elena Rodriguez, David Park, Aisha Johnson)
• Testimonials: 4 (from TechCorp, GrowthCo, InnovateLab, DataFlow)
• Menu: 6 items (Home, Services, Team, Blog, About, Contact)
• Hero: AI-generated image set
Click **Preview** to see your site, or **Open site** for the live URL."

═══ TOOL GUARDRAILS ═══
CORRECT tool for each task:
- Site name/tagline → settings_update (NEVER site_set_config)
- Hero image → settings_update({ hero_image: "URL" }) (NEVER site_set_config)
- Theme colors/sections → site_set_config (ONLY this)
- Content data format → { data: { title: "...", description: "..." } }
- Menu items → type: "custom", customUrl: "/path" (NOT url)

═══ COLLECTIONS → VISUAL SECTIONS ═══
These auto-render on the homepage:
"services" → card grid | FIELDS: title (string), description (text), icon (string)
"team" → avatar cards | FIELDS: name (string), role (string), bio (text)
"testimonials" → quote cards | FIELDS: quote (text), author_name (string), author_role (string), author_company (string)
"case_studies" → results cards | FIELDS: title (string), client (string), description (text), results (string)
"faq" → accordion | FIELDS: question (string), answer (text)
"posts" → blog cards (exists)

═══ CODE GENERATION (most powerful capability) ═══
You can WRITE ACTUAL CODE — Astro components, Tailwind CSS, page layouts.
- code_list_files: see existing template files
- code_read_file: read a component to understand it before modifying
- code_write_file: write/overwrite Astro components with Tailwind CSS

When asked to change design/layout:
1. code_read_file to see current component
2. Modify with Tailwind v4 classes
3. code_write_file to save
4. Tell user to refresh preview

Example: "Make the hero bigger with a video background"
→ code_read_file({ path: "src/components/sections/HeroSection.astro" })
→ Modify the component with new Tailwind classes
→ code_write_file({ path: "src/components/sections/HeroSection.astro", content: "..." })

Write PRODUCTION QUALITY code:
- Use Tailwind v4 utility classes (installed)
- Write responsive designs (sm:, md:, lg: breakpoints)
- Use CSS animations and transitions
- Follow Astro component patterns (frontmatter + template + style)

═══ OTHER CAPABILITIES ═══
- image_generate: AI images (DETAILED prompts: subject, lighting, mood, style)
- web_browse: analyze sites for inspiration
- settings_update({ hero_image: "URL" }): hero background
- site_blueprint: batch create entire site in one call
- site_verify: check site health (ALWAYS call after building)
- Respond in the user's language
- Accept image/file uploads from user`;

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

			// ── Code Generation (read/write template files) ─────────────
			"code/read": {
				handler: async (ctx) => {
					const input = isRecord(ctx.input) ? ctx.input : {};
					const path = typeof input.path === "string" ? input.path : "";
					if (!path || path.includes("..")) return { error: "Invalid path" };

					try {
						const { env } = await import("cloudflare:workers");
						const bucket = (env as Record<string, unknown>).MEDIA as { get: (key: string) => Promise<{ text: () => Promise<string> } | null> } | undefined;

						// Read from R2 storage (template files stored under template/ prefix)
						if (bucket) {
							const obj = await bucket.get(`template/${path}`);
							if (obj) {
								const content = await obj.text();
								return { path, content, size: content.length };
							}
						}

						// Fallback: file not found in R2
						return { error: `File not found: ${path}`, hint: "Use code_list_files to see available files" };
					} catch (err) {
						return { error: `Read failed: ${err instanceof Error ? err.message : String(err)}` };
					}
				},
			},

			"code/write": {
				handler: async (ctx) => {
					const input = isRecord(ctx.input) ? ctx.input : {};
					const path = typeof input.path === "string" ? input.path : "";
					const content = typeof input.content === "string" ? input.content : "";
					if (!path || path.includes("..")) return { error: "Invalid path" };
					if (!content) return { error: "Content is required" };

					try {
						const { env } = await import("cloudflare:workers");
						const bucket = (env as Record<string, unknown>).MEDIA as { put: (key: string, value: string) => Promise<void> } | undefined;

						if (bucket) {
							await bucket.put(`template/${path}`, content);
							return { success: true, path, size: content.length, message: `File written: ${path}` };
						}

						return { error: "Storage not available" };
					} catch (err) {
						return { error: `Write failed: ${err instanceof Error ? err.message : String(err)}` };
					}
				},
			},

			"code/list": {
				handler: async (ctx) => {
					const input = isRecord(ctx.input) ? ctx.input : {};
					const dir = typeof input.directory === "string" ? input.directory : "src";

					try {
						const { env } = await import("cloudflare:workers");
						const bucket = (env as Record<string, unknown>).MEDIA as { list: (opts: { prefix: string }) => Promise<{ objects: Array<{ key: string; size: number }> }> } | undefined;

						if (bucket) {
							const result = await bucket.list({ prefix: `template/${dir}` });
							const files = result.objects.map((o) => ({
								path: o.key.replace("template/", ""),
								size: o.size,
							}));
							return { directory: dir, files, count: files.length };
						}

						return { error: "Storage not available" };
					} catch (err) {
						return { error: `List failed: ${err instanceof Error ? err.message : String(err)}` };
					}
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
