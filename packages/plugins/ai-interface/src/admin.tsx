/**
 * Token Press AI Interface — Admin Chat Panel
 *
 * Full-page AI chat interface. The agentic loop runs entirely on the client:
 * 1. Send messages to /chat (proxy to Anthropic API)
 * 2. If Claude returns tool_use, execute via CMS REST API endpoints
 * 3. Send tool results back, loop until end_turn
 *
 * This avoids Cloudflare Workers' self-fetch restriction.
 */

import { ArrowUp, CircleNotch, Sparkle, CheckCircle, WarningCircle, Trash, ArrowClockwise } from "@phosphor-icons/react";
import type { PluginAdminExports } from "emdash";
import { apiFetch } from "emdash/plugin-utils";
import * as React from "react";

const CHAT_URL = "/_emdash/api/plugins/ai-interface/chat";

// ── Types ────────────────────────────────────────────────────────────────────

interface UserMessage {
	role: "user";
	content: string;
}

interface AssistantMessage {
	role: "assistant";
	text: string;
	toolEvents: ToolEvent[];
	streaming: boolean;
}

interface ErrorMessage {
	role: "error";
	message: string;
}

type ChatMessage = UserMessage | AssistantMessage | ErrorMessage;

interface ToolEvent {
	type: "executing" | "success" | "error";
	name: string;
	error?: string;
}

/** Anthropic content block accumulated from SSE */
interface ContentBlock {
	type: string;
	id?: string;
	name?: string;
	text?: string;
	input?: Record<string, unknown>;
}

// ── CMS Tool Executor (client-side) ─────────────────────────────────────────

async function executeCmsTool(
	toolName: string,
	toolInput: Record<string, unknown>,
): Promise<unknown> {
	const get = (url: string) => apiFetch(url);
	const post = (url: string, body?: unknown) =>
		apiFetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: body ? JSON.stringify(body) : undefined,
		});
	const put = (url: string, body: unknown) =>
		apiFetch(url, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
	const patch = (url: string, body: unknown) =>
		apiFetch(url, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
	const del = (url: string) => apiFetch(url, { method: "DELETE" });

	let response: Response;

	switch (toolName) {
		// ── Content ──────────────────────────────────────────────────────
		case "content_list": {
			const { collection, status, limit, locale } = toolInput;
			const params = new URLSearchParams();
			if (status) params.set("status", String(status));
			if (limit) params.set("limit", String(limit));
			if (locale) params.set("locale", String(locale));
			const qs = params.toString();
			response = await get(`/_emdash/api/content/${collection}${qs ? `?${qs}` : ""}`);
			break;
		}
		case "content_get": {
			const { collection, id } = toolInput;
			response = await get(`/_emdash/api/content/${collection}/${id}`);
			break;
		}
		case "content_create": {
			const { collection, data, slug, status, locale, translationOf } = toolInput;
			response = await post(`/_emdash/api/content/${collection}`, {
				data,
				slug,
				status,
				locale,
				translationOf,
			});
			break;
		}
		case "content_update": {
			const { collection, id, data, slug } = toolInput;
			response = await patch(`/_emdash/api/content/${collection}/${id}`, {
				data,
				slug,
			});
			break;
		}
		case "content_publish": {
			const { collection, id } = toolInput;
			response = await post(`/_emdash/api/content/${collection}/${id}/publish`);
			break;
		}
		case "content_unpublish": {
			const { collection, id } = toolInput;
			response = await post(`/_emdash/api/content/${collection}/${id}/unpublish`);
			break;
		}
		case "content_delete": {
			const { collection, id } = toolInput;
			response = await del(`/_emdash/api/content/${collection}/${id}`);
			break;
		}
		case "content_restore": {
			const { collection, id } = toolInput;
			response = await post(`/_emdash/api/content/${collection}/${id}/restore`);
			break;
		}
		case "content_permanent_delete": {
			const { collection, id } = toolInput;
			response = await del(`/_emdash/api/content/${collection}/${id}/permanent`);
			break;
		}
		case "content_duplicate": {
			const { collection, id } = toolInput;
			response = await post(`/_emdash/api/content/${collection}/${id}/duplicate`);
			break;
		}
		case "content_schedule": {
			const { collection, id, scheduledAt } = toolInput;
			response = await post(`/_emdash/api/content/${collection}/${id}/schedule`, { scheduledAt });
			break;
		}
		case "content_compare": {
			const { collection, id } = toolInput;
			response = await get(`/_emdash/api/content/${collection}/${id}/compare`);
			break;
		}
		case "content_discard_draft": {
			const { collection, id } = toolInput;
			response = await post(`/_emdash/api/content/${collection}/${id}/discard-draft`);
			break;
		}
		case "content_list_trashed": {
			const { collection, limit } = toolInput;
			const params = new URLSearchParams();
			if (limit) params.set("limit", String(limit));
			const qs = params.toString();
			response = await get(`/_emdash/api/content/${collection}/trash${qs ? `?${qs}` : ""}`);
			break;
		}
		case "content_translations": {
			const { collection, id } = toolInput;
			response = await get(`/_emdash/api/content/${collection}/${id}/translations`);
			break;
		}
		case "content_set_terms": {
			const { collection, id, taxonomy, terms } = toolInput;
			response = await post(`/_emdash/api/content/${collection}/${id}/terms/${taxonomy}`, { terms });
			break;
		}

		// ── Schema ──────────────────────────────────────────────────────
		case "schema_list_collections": {
			response = await get("/_emdash/api/schema");
			break;
		}
		case "schema_get_collection": {
			const { collection } = toolInput;
			response = await get(`/_emdash/api/schema/collections/${collection}`);
			break;
		}
		case "schema_create_collection": {
			const { slug, label, labelSingular, description, supports } = toolInput;
			response = await post("/_emdash/api/schema/collections", {
				slug, label, labelSingular, description, supports,
			});
			break;
		}
		case "schema_create_field": {
			const { collection, slug, label, type, required, searchable } = toolInput;
			response = await post(`/_emdash/api/schema/collections/${collection}/fields`, {
				slug, label, type, required, searchable,
			});
			break;
		}
		case "schema_delete_collection": {
			const { slug, force } = toolInput;
			const params = force ? "?force=true" : "";
			response = await del(`/_emdash/api/schema/collections/${slug}${params}`);
			break;
		}
		case "schema_delete_field": {
			const { collection, fieldSlug } = toolInput;
			response = await del(`/_emdash/api/schema/collections/${collection}/fields/${fieldSlug}`);
			break;
		}

		// ── Media ────────────────────────────────────────────────────────
		case "media_list": {
			const { mimeType, limit } = toolInput;
			const params = new URLSearchParams();
			if (mimeType) params.set("mimeType", String(mimeType));
			if (limit) params.set("limit", String(limit));
			const qs = params.toString();
			response = await get(`/_emdash/api/media${qs ? `?${qs}` : ""}`);
			break;
		}
		case "media_get": {
			const { id } = toolInput;
			response = await get(`/_emdash/api/media/${id}`);
			break;
		}
		case "media_update": {
			const { id, alt, caption } = toolInput;
			response = await put(`/_emdash/api/media/${id}`, { alt, caption });
			break;
		}
		case "media_delete": {
			const { id } = toolInput;
			response = await del(`/_emdash/api/media/${id}`);
			break;
		}

		// ── Search ───────────────────────────────────────────────────────
		case "search": {
			const { query, limit } = toolInput;
			const params = new URLSearchParams({ q: String(query) });
			if (limit) params.set("limit", String(limit));
			response = await get(`/_emdash/api/search?${params.toString()}`);
			break;
		}

		// ── Taxonomy ─────────────────────────────────────────────────────
		case "taxonomy_list": {
			response = await get("/_emdash/api/taxonomies");
			break;
		}
		case "taxonomy_get": {
			const { taxonomy } = toolInput;
			response = await get(`/_emdash/api/taxonomies/${taxonomy}`);
			break;
		}
		case "taxonomy_create_term": {
			const { taxonomy, name, slug, description } = toolInput;
			response = await post(`/_emdash/api/taxonomies/${taxonomy}/terms`, { name, slug, description });
			break;
		}
		case "taxonomy_update_term": {
			const { taxonomy, termSlug, name, description } = toolInput;
			response = await put(`/_emdash/api/taxonomies/${taxonomy}/terms/${termSlug}`, { name, description });
			break;
		}
		case "taxonomy_delete_term": {
			const { taxonomy, termSlug } = toolInput;
			response = await del(`/_emdash/api/taxonomies/${taxonomy}/terms/${termSlug}`);
			break;
		}

		// ── Menus ────────────────────────────────────────────────────────
		case "menu_list": {
			response = await get("/_emdash/api/menus");
			break;
		}
		case "menu_get": {
			const { menu } = toolInput;
			response = await get(`/_emdash/api/menus/${menu}`);
			break;
		}
		case "menu_create": {
			const { name, label } = toolInput;
			response = await post("/_emdash/api/menus", { name, label });
			break;
		}
		case "menu_add_item": {
			const { menu, label, url, parentId } = toolInput;
			response = await post(`/_emdash/api/menus/${menu}/items`, { label, url, parentId });
			break;
		}
		case "menu_delete": {
			const { menu } = toolInput;
			response = await del(`/_emdash/api/menus/${menu}`);
			break;
		}

		// ── Revisions ────────────────────────────────────────────────────
		case "revision_list": {
			const { collection, id } = toolInput;
			response = await get(`/_emdash/api/content/${collection}/${id}/revisions`);
			break;
		}
		case "revision_restore": {
			const { revisionId } = toolInput;
			response = await post(`/_emdash/api/revisions/${revisionId}/restore`);
			break;
		}

		// ── Settings ─────────────────────────────────────────────────────
		case "settings_get": {
			response = await get("/_emdash/api/settings");
			break;
		}
		case "settings_update": {
			response = await post("/_emdash/api/settings", toolInput);
			break;
		}

		// ── Redirects ────────────────────────────────────────────────────
		case "redirect_list": {
			response = await get("/_emdash/api/redirects");
			break;
		}
		case "redirect_create": {
			const { source, destination, type, enabled } = toolInput;
			response = await post("/_emdash/api/redirects", { source, destination, type, enabled });
			break;
		}
		case "redirect_delete": {
			const { id } = toolInput;
			response = await del(`/_emdash/api/redirects/${id}`);
			break;
		}

		// ── Comments ─────────────────────────────────────────────────────
		case "comment_list": {
			const { status, limit } = toolInput;
			const params = new URLSearchParams();
			if (status) params.set("status", String(status));
			if (limit) params.set("limit", String(limit));
			const qs = params.toString();
			response = await get(`/_emdash/api/admin/comments${qs ? `?${qs}` : ""}`);
			break;
		}
		case "comment_moderate": {
			const { id, status } = toolInput;
			response = await put(`/_emdash/api/admin/comments/${id}/status`, { status });
			break;
		}

		// ── Bylines ──────────────────────────────────────────────────────
		case "byline_list": {
			response = await get("/_emdash/api/admin/bylines");
			break;
		}
		case "byline_create": {
			const { slug, displayName, bio, url } = toolInput;
			response = await post("/_emdash/api/admin/bylines", { slug, displayName, bio, url });
			break;
		}

		default:
			return { error: `Unknown tool: ${toolName}` };
	}

	if (!response.ok) {
		const text = await response.text().catch(() => response.statusText);
		try {
			return { error: `API ${response.status}`, details: JSON.parse(text) };
		} catch {
			return { error: `API ${response.status}: ${text}` };
		}
	}
	return response.json();
}

// ── Anthropic SSE Parser ────────────────────────────────────────────────────

/** Parse an Anthropic streaming response, calling back on events */
async function parseAnthropicStream(
	response: Response,
	onText: (text: string) => void,
	onToolStart: (name: string) => void,
): Promise<{ stopReason: string | null; blocks: ContentBlock[] }> {
	const reader = response.body!.getReader();
	const dec = new TextDecoder();
	let buffer = "";
	let stopReason: string | null = null;
	const blocks: ContentBlock[] = [];
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
					const block = event.content_block as ContentBlock;
					blocks[currentIdx] = { type: block.type, id: block.id, name: block.name };
					inputBuffers[currentIdx] = "";
					if (block.type === "tool_use" && block.name) {
						onToolStart(block.name);
					}
					break;
				}
				case "content_block_delta": {
					const delta = event.delta as { type: string; text?: string; partial_json?: string };
					if (delta.type === "text_delta" && delta.text) {
						onText(delta.text);
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
				case "error": {
					const err = event.error as { message?: string };
					throw new Error(err?.message ?? "Anthropic API error");
				}
			}
		}
	}

	return { stopReason, blocks };
}

// ── Quick Actions ─────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
	{ label: "Write a blog post", prompt: "Write and create a blog post about the latest trends in our industry. Make it engaging and informative." },
	{ label: "Show site structure", prompt: "List all collections with their fields so I can understand the site schema." },
	{ label: "Generate a full site", prompt: "Help me set up a complete site structure: create the collections, fields, categories, and a navigation menu for a professional services website." },
	{ label: "Create a new collection", prompt: "Create a new content collection for team members with fields for name, role, bio, photo, and social links." },
	{ label: "Check site settings", prompt: "Show me the current site settings and list all menus." },
	{ label: "Manage content", prompt: "List all content across all collections with their status (draft/published)." },
];

// ── Tool Event Badge ──────────────────────────────────────────────────────────

function ToolBadge({ event }: { event: ToolEvent }) {
	const toolLabel = event.name.replace(/_/g, " ");

	if (event.type === "executing") {
		return (
			<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs dark:bg-blue-900/30 dark:text-blue-300">
				<CircleNotch className="h-3 w-3 animate-spin" />
				{toolLabel}
			</span>
		);
	}
	if (event.type === "success") {
		return (
			<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs dark:bg-green-900/30 dark:text-green-400">
				<CheckCircle className="h-3 w-3" />
				{toolLabel}
			</span>
		);
	}
	return (
		<span
			title={event.error}
			className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs dark:bg-red-900/30 dark:text-red-400"
		>
			<WarningCircle className="h-3 w-3" />
			{toolLabel}
		</span>
	);
}

// ── Message Bubble ────────────────────────────────────────────────────────────

/** Render basic markdown: **bold**, `code`, ```blocks```, links, lists, headings */
function renderMarkdown(text: string): React.ReactNode {
	const lines = text.split("\n");
	const elements: React.ReactNode[] = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i]!;

		// Code blocks
		if (line.startsWith("```")) {
			const codeLines: string[] = [];
			i++;
			while (i < lines.length && !lines[i]!.startsWith("```")) {
				codeLines.push(lines[i]!);
				i++;
			}
			i++; // skip closing ```
			elements.push(
				<pre key={elements.length} className="bg-black/5 dark:bg-white/5 rounded-lg p-3 text-xs font-mono overflow-x-auto my-2">
					<code>{codeLines.join("\n")}</code>
				</pre>,
			);
			continue;
		}

		// Headings
		const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
		if (headingMatch) {
			const level = headingMatch[1]!.length;
			const content = headingMatch[2]!;
			const Tag = `h${level + 1}` as "h2" | "h3" | "h4";
			elements.push(
				<Tag key={elements.length} className={`font-semibold mt-3 mb-1 ${level === 1 ? "text-base" : "text-sm"}`}>
					{formatInline(content)}
				</Tag>,
			);
			i++;
			continue;
		}

		// List items
		if (line.match(/^[-*]\s/)) {
			const listItems: string[] = [];
			while (i < lines.length && lines[i]!.match(/^[-*]\s/)) {
				listItems.push(lines[i]!.replace(/^[-*]\s/, ""));
				i++;
			}
			elements.push(
				<ul key={elements.length} className="list-disc list-inside space-y-0.5 my-1">
					{listItems.map((item, j) => (
						<li key={j}>{formatInline(item)}</li>
					))}
				</ul>,
			);
			continue;
		}

		// Numbered list
		if (line.match(/^\d+\.\s/)) {
			const listItems: string[] = [];
			while (i < lines.length && lines[i]!.match(/^\d+\.\s/)) {
				listItems.push(lines[i]!.replace(/^\d+\.\s/, ""));
				i++;
			}
			elements.push(
				<ol key={elements.length} className="list-decimal list-inside space-y-0.5 my-1">
					{listItems.map((item, j) => (
						<li key={j}>{formatInline(item)}</li>
					))}
				</ol>,
			);
			continue;
		}

		// Empty line = paragraph break
		if (!line.trim()) {
			elements.push(<div key={elements.length} className="h-2" />);
			i++;
			continue;
		}

		// Regular paragraph
		elements.push(
			<p key={elements.length} className="my-0.5">{formatInline(line)}</p>,
		);
		i++;
	}

	return elements;
}

/** Format inline markdown: **bold**, *italic*, `code`, [links](url) */
function formatInline(text: string): React.ReactNode {
	const parts: React.ReactNode[] = [];
	let remaining = text;
	let key = 0;

	while (remaining) {
		// Code
		const codeMatch = remaining.match(/^(.*?)`([^`]+)`/);
		if (codeMatch) {
			if (codeMatch[1]) parts.push(formatInlineSimple(codeMatch[1], key++));
			parts.push(
				<code key={key++} className="bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded text-xs font-mono">
					{codeMatch[2]}
				</code>,
			);
			remaining = remaining.slice(codeMatch[0].length);
			continue;
		}

		// Bold
		const boldMatch = remaining.match(/^(.*?)\*\*([^*]+)\*\*/);
		if (boldMatch) {
			if (boldMatch[1]) parts.push(formatInlineSimple(boldMatch[1], key++));
			parts.push(<strong key={key++}>{boldMatch[2]}</strong>);
			remaining = remaining.slice(boldMatch[0].length);
			continue;
		}

		// No more matches — push remaining
		parts.push(formatInlineSimple(remaining, key++));
		break;
	}

	return parts.length === 1 ? parts[0] : parts;
}

function formatInlineSimple(text: string, key: number): React.ReactNode {
	return <React.Fragment key={key}>{text}</React.Fragment>;
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
	if (msg.role === "user") {
		return (
			<div className="flex justify-end">
				<div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-blue-600 text-white px-4 py-2.5 text-sm whitespace-pre-wrap">
					{msg.content}
				</div>
			</div>
		);
	}

	if (msg.role === "error") {
		return (
			<div className="flex justify-start">
				<div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-red-200 bg-red-50 text-red-700 px-4 py-2.5 text-sm dark:border-red-800 dark:bg-red-950 dark:text-red-300">
					{msg.message}
				</div>
			</div>
		);
	}

	return (
		<div className="flex justify-start gap-2.5">
			<div className="flex-shrink-0 mt-1 h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
				<Sparkle className="h-4 w-4 text-white" weight="fill" />
			</div>
			<div className="flex-1 min-w-0 space-y-2">
				{msg.toolEvents.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{msg.toolEvents.map((ev, i) => (
							<ToolBadge key={i} event={ev} />
						))}
					</div>
				)}
				{(msg.text || msg.streaming) && (
					<div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm">
						{msg.text ? renderMarkdown(msg.text) : null}
						{msg.streaming && !msg.text && (
							<span className="inline-flex gap-0.5">
								{[0, 1, 2].map((i) => (
									<span
										key={i}
										className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
										style={{ animationDelay: `${i * 0.15}s` }}
									/>
								))}
							</span>
						)}
						{msg.streaming && msg.text && (
							<span className="ml-0.5 inline-block h-4 w-0.5 bg-current animate-pulse" />
						)}
					</div>
				)}
			</div>
		</div>
	);
}

// ── Main Chat Page ────────────────────────────────────────────────────────────

function ChatPage() {
	const [messages, setMessages] = React.useState<ChatMessage[]>([]);
	const [input, setInput] = React.useState("");
	const [isStreaming, setIsStreaming] = React.useState(false);
	const bottomRef = React.useRef<HTMLDivElement>(null);
	const textareaRef = React.useRef<HTMLTextAreaElement>(null);
	const abortRef = React.useRef<AbortController | null>(null);

	React.useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(e.target.value);
		e.target.style.height = "auto";
		e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
	};

	/** Update the last assistant message in the messages array */
	const updateLastAssistant = (
		updater: (msg: AssistantMessage) => AssistantMessage,
	) => {
		setMessages((prev) => {
			const next = [...prev];
			const last = next[next.length - 1];
			if (last?.role === "assistant") {
				next[next.length - 1] = updater(last);
			}
			return next;
		});
	};

	const send = async (text: string) => {
		const trimmed = text.trim();
		if (!trimmed || isStreaming) return;

		setInput("");
		if (textareaRef.current) textareaRef.current.style.height = "auto";

		const userMsg: UserMessage = { role: "user", content: trimmed };
		const assistantMsg: AssistantMessage = { role: "assistant", text: "", toolEvents: [], streaming: true };
		setMessages((prev) => [...prev, userMsg, assistantMsg]);
		setIsStreaming(true);

		const abort = new AbortController();
		abortRef.current = abort;

		try {
			// Build conversation for API (user/assistant messages only)
			const apiMessages: Array<{ role: string; content: unknown }> = [];
			for (const m of messages) {
				if (m.role === "user") apiMessages.push({ role: "user", content: m.content });
				else if (m.role === "assistant") apiMessages.push({ role: "assistant", content: m.text });
			}
			apiMessages.push({ role: "user", content: trimmed });

			await runAgenticLoop(apiMessages, abort.signal);
		} catch (err) {
			if ((err as { name?: string }).name !== "AbortError") {
				const msg = err instanceof Error ? err.message : String(err);
				setMessages((prev) => {
					const next = [...prev];
					const last = next[next.length - 1];
					if (last?.role === "assistant" && !last.text) {
						next[next.length - 1] = { role: "error", message: msg };
					} else {
						next.push({ role: "error", message: msg });
					}
					return next;
				});
			}
		} finally {
			updateLastAssistant((m) => ({ ...m, streaming: false }));
			setIsStreaming(false);
			abortRef.current = null;
		}
	};

	/**
	 * Client-side agentic loop:
	 * 1. Call /chat (proxy to Anthropic)
	 * 2. Parse SSE stream
	 * 3. If tool_use → execute locally → add results → call /chat again
	 * 4. Loop until end_turn
	 */
	async function runAgenticLoop(
		conversation: Array<{ role: string; content: unknown }>,
		signal: AbortSignal,
	) {
		const conv = [...conversation];

		for (let turn = 0; turn < 20; turn++) {
			if (signal.aborted) break;

			// Call proxy endpoint
			const response = await apiFetch(CHAT_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: conv }),
				signal,
			});

			if (!response.ok || !response.body) {
				const errBody = await response.text().catch(() => "");
				let errMsg = `Server error: ${response.status}`;
				try {
					const parsed = JSON.parse(errBody) as { error?: string };
					if (parsed.error) errMsg = parsed.error;
				} catch {
					// use default
				}
				throw new Error(errMsg);
			}

			// Parse Anthropic SSE stream
			const { stopReason, blocks } = await parseAnthropicStream(
				response,
				// onText
				(text) => {
					updateLastAssistant((m) => ({ ...m, text: m.text + text }));
				},
				// onToolStart
				(name) => {
					updateLastAssistant((m) => ({
						...m,
						toolEvents: [...m.toolEvents, { type: "executing", name }],
					}));
				},
			);

			// Build assistant content for conversation
			const assistantContent = blocks.map((b) => {
				if (b.type === "text") return { type: "text", text: b.text ?? "" };
				if (b.type === "tool_use") return { type: "tool_use", id: b.id, name: b.name, input: b.input ?? {} };
				return b;
			});
			conv.push({ role: "assistant", content: assistantContent });

			if (stopReason !== "tool_use") break;

			// Execute tools locally
			const toolResults: Array<{ type: "tool_result"; tool_use_id: string; content: string }> = [];

			for (const block of blocks) {
				if (block.type !== "tool_use" || !block.id || !block.name) continue;
				if (signal.aborted) break;

				try {
					const result = await executeCmsTool(block.name, block.input ?? {});
					toolResults.push({
						type: "tool_result",
						tool_use_id: block.id,
						content: JSON.stringify(result),
					});
					// Update tool event to success
					updateLastAssistant((m) => ({
						...m,
						toolEvents: m.toolEvents.map((ev) =>
							ev.name === block.name && ev.type === "executing"
								? { ...ev, type: "success" as const }
								: ev,
						),
					}));
				} catch (err) {
					const errMsg = err instanceof Error ? err.message : String(err);
					toolResults.push({
						type: "tool_result",
						tool_use_id: block.id,
						content: JSON.stringify({ error: errMsg }),
					});
					updateLastAssistant((m) => ({
						...m,
						toolEvents: m.toolEvents.map((ev) =>
							ev.name === block.name && ev.type === "executing"
								? { ...ev, type: "error" as const, error: errMsg }
								: ev,
						),
					}));
				}
			}

			conv.push({ role: "user", content: toolResults });
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			void send(input);
		}
	};

	const clearConversation = () => {
		if (!isStreaming) {
			setMessages([]);
		}
	};

	return (
		<div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
			{/* Header */}
			<div className="flex items-center justify-between pb-4 border-b">
				<div className="flex items-center gap-3">
					<div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
						<Sparkle className="h-5 w-5 text-white" weight="fill" />
					</div>
					<div>
						<h1 className="text-xl font-semibold">Token Press AI</h1>
						<p className="text-sm text-muted-foreground">Manage your entire site with AI</p>
					</div>
				</div>
				{messages.length > 0 && (
					<button
						onClick={clearConversation}
						disabled={isStreaming}
						className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
						title="New conversation"
					>
						<ArrowClockwise className="h-3.5 w-3.5" />
						New chat
					</button>
				)}
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto py-6 space-y-5 min-h-0">
				{messages.length === 0 && (
					<div className="flex flex-col items-center justify-center h-full gap-8 text-center px-4">
						<div className="space-y-3">
							<div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
								<Sparkle className="h-7 w-7 text-white" weight="fill" />
							</div>
							<div>
								<h2 className="text-2xl font-bold">How can I help?</h2>
								<p className="text-muted-foreground mt-1 max-w-md">
									I can create content, set up your site structure, manage menus, moderate comments, configure settings — anything your CMS can do.
								</p>
							</div>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-2xl">
							{QUICK_ACTIONS.map((action) => (
								<button
									key={action.label}
									onClick={() => void send(action.prompt)}
									disabled={isStreaming}
									className="text-left px-4 py-3 rounded-xl border hover:bg-muted hover:border-blue-200 dark:hover:border-blue-800 transition-all text-sm disabled:opacity-50 group"
								>
									<span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
										{action.label}
									</span>
								</button>
							))}
						</div>
					</div>
				)}

				{messages.map((msg, i) => (
					<MessageBubble key={i} msg={msg} />
				))}
				<div ref={bottomRef} />
			</div>

			{/* Input */}
			<div className="pt-4 border-t">
				<div className="flex items-end gap-2 rounded-2xl border bg-background p-2 focus-within:ring-2 focus-within:ring-blue-500/30">
					<textarea
						ref={textareaRef}
						value={input}
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
						placeholder="Ask Token Press AI to manage your site..."
						rows={1}
						disabled={isStreaming}
						className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50 max-h-40"
					/>
					{isStreaming ? (
						<button
							onClick={() => abortRef.current?.abort()}
							className="flex-shrink-0 h-8 w-8 rounded-xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
							title="Stop"
						>
							<span className="h-3 w-3 rounded-sm bg-white" />
						</button>
					) : (
						<button
							onClick={() => void send(input)}
							disabled={!input.trim()}
							className="flex-shrink-0 h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
							title="Send"
						>
							<ArrowUp className="h-4 w-4" weight="bold" />
						</button>
					)}
				</div>
				<p className="text-center text-xs text-muted-foreground mt-2">
					Powered by Claude &middot; Token Press by Angkor AI
				</p>
			</div>
		</div>
	);
}

// ── Exports ───────────────────────────────────────────────────────────────────

export const widgets: PluginAdminExports["widgets"] = {};

export const pages: PluginAdminExports["pages"] = {
	"/chat": ChatPage,
};
