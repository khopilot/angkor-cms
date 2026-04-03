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

const SYSTEM_PROMPT = `You are Token Press AI, the native AI assistant built into this CMS (powered by Angkor AI).

You manage this site directly using the tools available to you. You can:
- Create, edit, publish, schedule, and delete content in any collection
- Manage draft/publish workflows (schedule, discard drafts, compare revisions)
- Manage media files (list, view, update metadata, delete)
- Create and modify content collections (types) and their fields
- Build navigation menus with items and ordering
- Manage categories, tags, and other taxonomies (CRUD terms, assign to content)
- Configure site settings (title, tagline, etc.)
- Create URL redirects
- Moderate user comments (approve, spam, trash)
- Manage author bylines
- View and restore content revisions
- Handle trash and content recovery
- Manage multilingual translations

Always act immediately without asking for confirmation (except for permanent deletions).
When creating content, the 'data' parameter must contain field values as an object (e.g. {title: "...", content: "..."}).
Always use schema_get_collection first to check what fields a collection expects before creating content.
Respond in the same language the user writes in.
Be concise in your confirmations — just confirm what was done and provide links when relevant.`;

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
