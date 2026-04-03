/**
 * Angkor AI Interface Plugin
 *
 * Provides a native AI chat interface in the CMS admin.
 * Users manage their site in natural language — Claude calls CMS tools
 * via the MCP endpoint to execute actions.
 */

import type { ResolvedPlugin } from "emdash";
import { definePlugin } from "emdash";

import type { AIInterfaceOptions } from "./descriptor.js";
import { CMS_TOOLS } from "./tools.js";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

const SYSTEM_PROMPT = `You are Angkor AI, the native AI assistant built into this CMS.

You manage this site directly using the tools available to you. You can:
- Create, edit, publish, and delete content in any collection
- Create new content collections and add custom fields
- Manage navigation menus and taxonomy terms
- Search across all content
- Generate a complete site from a brief description

Always act immediately without asking for confirmation (except for permanent deletions).
When the user asks you to create content, create it right away and report what you did.
Respond in the same language the user writes in.
Be concise in your confirmations — just confirm what was done and provide links when relevant.`;

/** Format a value as an SSE data line */
function sse(data: unknown): Uint8Array {
	return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
}

/** Proxy a tool call to the MCP endpoint */
async function callMcpTool(
	toolName: string,
	toolInput: unknown,
	origin: string,
	cookie: string,
): Promise<unknown> {
	const response = await fetch(`${origin}/_emdash/api/mcp`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-EmDash-Request": "1",
			Cookie: cookie,
		},
		body: JSON.stringify({
			jsonrpc: "2.0",
			id: 1,
			method: "tools/call",
			params: { name: toolName, arguments: toolInput },
		}),
	});

	if (!response.ok) {
		throw new Error(`MCP proxy error: ${response.status}`);
	}

	const data = (await response.json()) as {
		result?: { content?: Array<{ text?: string }> };
		error?: { message?: string };
	};

	if (data.error) {
		throw new Error(data.error.message ?? "MCP tool error");
	}

	const text = data.result?.content?.[0]?.text;
	if (text) {
		try {
			return JSON.parse(text);
		} catch {
			return text;
		}
	}
	return data.result ?? {};
}

/** Anthropic content block (partial — only fields we need) */
interface AnthropicBlock {
	type: string;
	id?: string;
	name?: string;
	input?: unknown;
	text?: string;
}

/** Run the agentic loop — streaming events to `write`, returns when Claude is done */
async function runAgenticLoop(
	messages: Array<{ role: string; content: unknown }>,
	apiKey: string,
	model: string,
	maxTokens: number,
	origin: string,
	cookie: string,
	write: (data: unknown) => Promise<void>,
): Promise<void> {
	const conversation = [...messages];

	// Safety cap: prevent runaway loops
	for (let turn = 0; turn < 20; turn++) {
		const response = await fetch(ANTHROPIC_API, {
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
				messages: conversation,
				stream: true,
			}),
		});

		if (!response.ok || !response.body) {
			const errText = await response.text().catch(() => response.statusText);
			throw new Error(`Anthropic API ${response.status}: ${errText}`);
		}

		// Parse Anthropic SSE stream, collecting blocks
		const reader = response.body.getReader();
		const dec = new TextDecoder();
		let buffer = "";
		let stopReason: string | null = null;
		const blocks: AnthropicBlock[] = [];
		let currentIdx = -1;
		const inputBuffers: Record<number, string> = {};

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += dec.decode(value, { stream: true });
			const lines = buffer.split("\n");
			buffer = lines.pop() ?? "";

			for (const line of lines) {
				if (!line.startsWith("data: ")) continue;
				const chunk = line.slice(6);
				if (chunk === "[DONE]") continue;

				let event: Record<string, unknown>;
				try {
					event = JSON.parse(chunk) as Record<string, unknown>;
				} catch {
					continue;
				}

				switch (event.type) {
					case "content_block_start": {
						currentIdx++;
						const block = event.content_block as AnthropicBlock;
						blocks[currentIdx] = { type: block.type, id: block.id, name: block.name };
						inputBuffers[currentIdx] = "";
						if (block.type === "tool_use") {
							await write({ type: "tool_use", name: block.name });
						}
						break;
					}
					case "content_block_delta": {
						const delta = event.delta as { type: string; text?: string; partial_json?: string };
						if (delta.type === "text_delta" && delta.text) {
							await write({ type: "text", text: delta.text });
							const b = blocks[currentIdx];
							if (b) b.text = (b.text ?? "") + delta.text;
						} else if (delta.type === "input_json_delta" && delta.partial_json) {
							inputBuffers[currentIdx] = (inputBuffers[currentIdx] ?? "") + delta.partial_json;
						}
						break;
					}
					case "content_block_stop": {
						const b = blocks[currentIdx];
						if (b?.type === "tool_use") {
							try {
								b.input = JSON.parse(inputBuffers[currentIdx] ?? "{}");
							} catch {
								b.input = {};
							}
						}
						break;
					}
					case "message_delta": {
						const delta = event.delta as { stop_reason?: string };
						if (delta.stop_reason) stopReason = delta.stop_reason;
						break;
					}
				}
			}
		}

		// Add assistant turn to conversation
		const assistantContent = blocks.map((b) => {
			if (b.type === "text") return { type: "text", text: b.text ?? "" };
			if (b.type === "tool_use") return { type: "tool_use", id: b.id, name: b.name, input: b.input ?? {} };
			return b;
		});
		conversation.push({ role: "assistant", content: assistantContent });

		if (stopReason !== "tool_use") break;

		// Execute tools and collect results
		const toolResults: Array<{ type: "tool_result"; tool_use_id: string; content: string }> = [];

		for (const block of blocks) {
			if (block.type !== "tool_use" || !block.id || !block.name) continue;

			await write({ type: "tool_executing", name: block.name });

			try {
				const result = await callMcpTool(block.name, block.input, origin, cookie);
				await write({ type: "tool_result", name: block.name, success: true });
				toolResults.push({
					type: "tool_result",
					tool_use_id: block.id,
					content: JSON.stringify(result),
				});
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				await write({ type: "tool_result", name: block.name, success: false, error: msg });
				toolResults.push({
					type: "tool_result",
					tool_use_id: block.id,
					content: JSON.stringify({ error: msg }),
				});
			}
		}

		conversation.push({ role: "user", content: toolResults });
	}
}

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
					// Resolve API key: option > wrangler secret > env
					let apiKey = options.anthropicApiKey;
					if (!apiKey) {
						try {
							const { env } = await import("cloudflare:workers");
							apiKey = (env as Record<string, string>).ANTHROPIC_API_KEY;
						} catch {
							// Not in Cloudflare Workers — fall through
						}
					}

					if (!apiKey) {
						return new Response(
							`data: ${JSON.stringify({ type: "error", message: "ANTHROPIC_API_KEY is not configured. Add it as a wrangler secret." })}\n\ndata: ${JSON.stringify({ type: "done" })}\n\n`,
							{
								headers: {
									"Content-Type": "text/event-stream",
									"Cache-Control": "no-cache",
								},
							},
						);
					}

					// Parse request body
					const input = ctx.input as {
						messages?: Array<{ role: string; content: unknown }>;
					} | null;
					const messages = Array.isArray(input?.messages) ? input.messages : [];

					if (messages.length === 0) {
						return new Response(
							`data: ${JSON.stringify({ type: "error", message: "No messages provided" })}\n\ndata: ${JSON.stringify({ type: "done" })}\n\n`,
							{ status: 400, headers: { "Content-Type": "text/event-stream" } },
						);
					}

					// Extract request context for MCP proxy
					const requestUrl = new URL(ctx.request.url);
					const origin = requestUrl.origin;
					const cookie = ctx.request.headers.get("cookie") ?? "";

					const model = options.model ?? "claude-sonnet-4-6";
					const maxTokens = options.maxTokens ?? 4096;

					// Build SSE stream via TransformStream
					const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
					const writer = writable.getWriter();

					const write = async (data: unknown) => {
						await writer.write(sse(data));
					};

					// Run agentic loop in background (Cloudflare Workers compatible)
					void (async () => {
						try {
							await runAgenticLoop(messages, apiKey!, model, maxTokens, origin, cookie, write);
							await write({ type: "done" });
						} catch (err) {
							const msg = err instanceof Error ? err.message : String(err);
							await write({ type: "error", message: msg });
							await write({ type: "done" });
						} finally {
							await writer.close();
						}
					})();

					return new Response(readable, {
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
