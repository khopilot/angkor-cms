/**
 * Token Press AI Interface Plugin
 *
 * Provides a native AI chat interface in the CMS admin.
 * The server acts as a proxy for the Anthropic API key — streaming
 * Claude's response to the browser. The agentic loop (tool execution)
 * runs entirely on the client side, where it has direct access to
 * CMS REST API endpoints with the user's session cookies.
 *
 * This avoids Cloudflare Workers' self-fetch restriction (error 1042).
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
- Create URL redirects, moderate comments, manage bylines and revisions

CRITICAL RULES:
1. ALWAYS create content with status "published" — drafts are INVISIBLE on the website
2. After content_create, ALWAYS call content_publish to make it live on the site
3. Before creating content, call schema_get_collection to check available fields
4. When building a site from scratch: collections → fields → menus → content (in that order)
5. When creating a collection, immediately add fields (minimum: title as string, body as portableText)
6. Act immediately without asking for confirmation (except permanent deletions)
7. Respond in the same language the user writes in
8. After making changes, tell the user to refresh their website to see the changes
9. The 'data' parameter in content_create must be an object: {title: "...", body: "..."}
10. For rich text fields (portableText), pass a plain string — it converts automatically`;

export function createPlugin(options: AIInterfaceOptions = {}): ResolvedPlugin {
	return definePlugin({
		id: "ai-interface",
		version: "0.1.0",
		capabilities: [],
		allowedHosts: ["api.anthropic.com"],

		admin: {
			entry: "@angkor-cms/plugin-ai-interface/admin",
			pages: [{ path: "/chat", label: "AI Assistant", icon: "sparkle" }],
			widgets: [],
		},

		routes: {
			chat: {
				handler: async (ctx) => {
					// Resolve API key
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

					// Proxy to Anthropic API with streaming
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
							{
								status: 502,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// Stream Anthropic's SSE response directly to the browser
					return new Response(anthropicResponse.body, {
						headers: {
							"Content-Type": "text/event-stream",
							"Cache-Control": "no-cache",
							"X-Accel-Buffering": "no",
						},
					});
				},
			},
		},
	});
}

export default createPlugin;
