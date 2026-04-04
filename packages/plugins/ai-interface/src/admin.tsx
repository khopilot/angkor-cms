/**
 * Token Press AI — Admin Chat Panel
 *
 * Full-page AI chat interface with conversation history.
 * The agentic loop runs client-side: Anthropic proxy → parse SSE →
 * execute CMS tools locally → loop until done.
 */

import {
	ArrowUp,
	CircleNotch,
	Sparkle,
	CheckCircle,
	WarningCircle,
	ArrowClockwise,
	Globe,
	ArrowSquareOut,
	ChatCircle,
	Trash,
	Plus,
	CaretLeft,
	Image as ImageIcon,
	File as FileIcon,
	X,
} from "@phosphor-icons/react";
import type { PluginAdminExports } from "emdash";
import { apiFetch } from "emdash/plugin-utils";
import * as React from "react";

const CHAT_URL = "/_emdash/api/plugins/ai-interface/chat";
const API_BASE = "/_emdash/api/plugins/ai-interface";

// ── Types ────────────────────────────────────────────────────────────────────

interface UserMessage { role: "user"; content: string }
interface AssistantMessage { role: "assistant"; text: string; toolEvents: ToolEvent[]; streaming: boolean }
interface ErrorMessage { role: "error"; message: string }
type ChatMessage = UserMessage | AssistantMessage | ErrorMessage;

interface ToolEvent { type: "executing" | "success" | "error"; name: string; error?: string }

interface ContentBlock { type: string; id?: string; name?: string; text?: string; input?: Record<string, unknown> }

interface ConversationMeta { id: string; title: string; updatedAt: string }

// ── Unique ID generator ─────────────────────────────────────────────────────

function uid(): string {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ── CMS Tool Executor ───────────────────────────────────────────────────────

async function executeCmsTool(toolName: string, toolInput: Record<string, unknown>): Promise<unknown> {
	const get = (url: string) => apiFetch(url);
	const post = (url: string, body?: unknown) =>
		apiFetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
	const put = (url: string, body: unknown) =>
		apiFetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
	const patch = (url: string, body: unknown) =>
		apiFetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
	const del = (url: string) => apiFetch(url, { method: "DELETE" });

	let response: Response;

	switch (toolName) {
		case "content_list": { const { collection, status, limit, locale } = toolInput; const p = new URLSearchParams(); if (status) p.set("status", String(status)); if (limit) p.set("limit", String(limit)); if (locale) p.set("locale", String(locale)); const qs = p.toString(); response = await get(`/_emdash/api/content/${collection}${qs ? `?${qs}` : ""}`); break; }
		case "content_get": { const { collection, id } = toolInput; response = await get(`/_emdash/api/content/${collection}/${id}`); break; }
		case "content_create": { const { collection, data, slug, status, locale, translationOf } = toolInput; response = await post(`/_emdash/api/content/${collection}`, { data, slug, status, locale, translationOf }); break; }
		case "content_update": { const { collection, id, data, slug } = toolInput; response = await put(`/_emdash/api/content/${collection}/${id}`, { data, slug }); break; }
		case "content_publish": { const { collection, id } = toolInput; response = await post(`/_emdash/api/content/${collection}/${id}/publish`); break; }
		case "content_unpublish": { const { collection, id } = toolInput; response = await post(`/_emdash/api/content/${collection}/${id}/unpublish`); break; }
		case "content_delete": { const { collection, id } = toolInput; response = await del(`/_emdash/api/content/${collection}/${id}`); break; }
		case "content_restore": { const { collection, id } = toolInput; response = await post(`/_emdash/api/content/${collection}/${id}/restore`); break; }
		case "content_permanent_delete": { const { collection, id } = toolInput; response = await del(`/_emdash/api/content/${collection}/${id}/permanent`); break; }
		case "content_duplicate": { const { collection, id } = toolInput; response = await post(`/_emdash/api/content/${collection}/${id}/duplicate`); break; }
		case "content_schedule": { const { collection, id, scheduledAt } = toolInput; response = await post(`/_emdash/api/content/${collection}/${id}/schedule`, { scheduledAt }); break; }
		case "content_compare": { const { collection, id } = toolInput; response = await get(`/_emdash/api/content/${collection}/${id}/compare`); break; }
		case "content_discard_draft": { const { collection, id } = toolInput; response = await post(`/_emdash/api/content/${collection}/${id}/discard-draft`); break; }
		case "content_list_trashed": { const { collection, limit } = toolInput; const p = new URLSearchParams(); if (limit) p.set("limit", String(limit)); const qs = p.toString(); response = await get(`/_emdash/api/content/${collection}/trash${qs ? `?${qs}` : ""}`); break; }
		case "content_translations": { const { collection, id } = toolInput; response = await get(`/_emdash/api/content/${collection}/${id}/translations`); break; }
		case "content_set_terms": { const { collection, id, taxonomy, terms } = toolInput; response = await post(`/_emdash/api/content/${collection}/${id}/terms/${taxonomy}`, { terms }); break; }
		case "schema_list_collections": { response = await get("/_emdash/api/schema"); break; }
		case "schema_get_collection": { const { collection } = toolInput; response = await get(`/_emdash/api/schema/collections/${collection}`); break; }
		case "schema_create_collection": { const { slug, label, labelSingular, description, supports } = toolInput; response = await post("/_emdash/api/schema/collections", { slug, label, labelSingular, description, supports }); break; }
		case "schema_create_field": { const { collection, slug, label, type, required, searchable } = toolInput; response = await post(`/_emdash/api/schema/collections/${collection}/fields`, { slug, label, type, required, searchable }); break; }
		case "schema_delete_collection": { const { slug, force } = toolInput; response = await del(`/_emdash/api/schema/collections/${slug}${force ? "?force=true" : ""}`); break; }
		case "schema_delete_field": { const { collection, fieldSlug } = toolInput; response = await del(`/_emdash/api/schema/collections/${collection}/fields/${fieldSlug}`); break; }
		case "media_list": { const { mimeType, limit } = toolInput; const p = new URLSearchParams(); if (mimeType) p.set("mimeType", String(mimeType)); if (limit) p.set("limit", String(limit)); const qs = p.toString(); response = await get(`/_emdash/api/media${qs ? `?${qs}` : ""}`); break; }
		case "media_get": { const { id } = toolInput; response = await get(`/_emdash/api/media/${id}`); break; }
		case "media_update": { const { id, alt, caption } = toolInput; response = await put(`/_emdash/api/media/${id}`, { alt, caption }); break; }
		case "media_delete": { const { id } = toolInput; response = await del(`/_emdash/api/media/${id}`); break; }
		case "search": { const { query, limit } = toolInput; const p = new URLSearchParams({ q: String(query) }); if (limit) p.set("limit", String(limit)); response = await get(`/_emdash/api/search?${p.toString()}`); break; }
		case "taxonomy_list": { response = await get("/_emdash/api/taxonomies"); break; }
		case "taxonomy_get": { const { taxonomy } = toolInput; response = await get(`/_emdash/api/taxonomies/${taxonomy}`); break; }
		case "taxonomy_create_term": { const { taxonomy, name, slug, description } = toolInput; response = await post(`/_emdash/api/taxonomies/${taxonomy}/terms`, { name, slug, description }); break; }
		case "taxonomy_update_term": { const { taxonomy, termSlug, name, description } = toolInput; response = await put(`/_emdash/api/taxonomies/${taxonomy}/terms/${termSlug}`, { name, description }); break; }
		case "taxonomy_delete_term": { const { taxonomy, termSlug } = toolInput; response = await del(`/_emdash/api/taxonomies/${taxonomy}/terms/${termSlug}`); break; }
		case "menu_list": { response = await get("/_emdash/api/menus"); break; }
		case "menu_get": { const { menu } = toolInput; response = await get(`/_emdash/api/menus/${menu}`); break; }
		case "menu_create": { const { name, label } = toolInput; response = await post("/_emdash/api/menus", { name, label }); break; }
		case "menu_add_item": { const { menu, type, label, customUrl, referenceCollection, referenceId, parentId } = toolInput; response = await post(`/_emdash/api/menus/${menu}/items`, { type: type ?? "custom", label, customUrl, referenceCollection, referenceId, parentId }); break; }
		case "menu_delete": { const { menu } = toolInput; response = await del(`/_emdash/api/menus/${menu}`); break; }
		case "revision_list": { const { collection, id } = toolInput; response = await get(`/_emdash/api/content/${collection}/${id}/revisions`); break; }
		case "revision_restore": { const { revisionId } = toolInput; response = await post(`/_emdash/api/revisions/${revisionId}/restore`); break; }
		case "settings_get": { response = await get("/_emdash/api/settings"); break; }
		case "settings_update": { response = await post("/_emdash/api/settings", toolInput); break; }
		case "redirect_list": { response = await get("/_emdash/api/redirects"); break; }
		case "redirect_create": { const { source, destination, type, enabled } = toolInput; response = await post("/_emdash/api/redirects", { source, destination, type, enabled }); break; }
		case "redirect_delete": { const { id } = toolInput; response = await del(`/_emdash/api/redirects/${id}`); break; }
		case "comment_list": { const { status, limit } = toolInput; const p = new URLSearchParams(); if (status) p.set("status", String(status)); if (limit) p.set("limit", String(limit)); const qs = p.toString(); response = await get(`/_emdash/api/admin/comments${qs ? `?${qs}` : ""}`); break; }
		case "comment_moderate": { const { id, status } = toolInput; response = await put(`/_emdash/api/admin/comments/${id}/status`, { status }); break; }
		case "byline_list": { response = await get("/_emdash/api/admin/bylines"); break; }
		case "byline_create": { const { slug, displayName, bio, url } = toolInput; response = await post("/_emdash/api/admin/bylines", { slug, displayName, bio, url }); break; }
		case "section_list": { const { source, search } = toolInput; const p = new URLSearchParams(); if (source) p.set("source", String(source)); if (search) p.set("search", String(search)); const qs = p.toString(); response = await get(`/_emdash/api/sections${qs ? `?${qs}` : ""}`); break; }
		case "section_get": { const { slug } = toolInput; response = await get(`/_emdash/api/sections/${slug}`); break; }
		case "section_create": { const { slug, title, description, keywords, content } = toolInput; response = await post("/_emdash/api/sections", { slug, title, description, keywords, content }); break; }
		case "section_update": { const { slug, title, description, content } = toolInput; response = await put(`/_emdash/api/sections/${slug}`, { title, description, content }); break; }
		case "section_delete": { const { slug } = toolInput; response = await del(`/_emdash/api/sections/${slug}`); break; }
		case "widget_area_list": { response = await get("/_emdash/api/widget-areas"); break; }
		case "widget_area_create": { const { name, label, description } = toolInput; response = await post("/_emdash/api/widget-areas", { name, label, description }); break; }
		case "widget_area_delete": { const { name } = toolInput; response = await del(`/_emdash/api/widget-areas/${name}`); break; }
		case "widget_add": { const { area, type, title, content, menuName, componentId } = toolInput; response = await post(`/_emdash/api/widget-areas/${area}/widgets`, { type, title, content, menuName, componentId }); break; }
		case "widget_delete": { const { area, widgetId } = toolInput; response = await del(`/_emdash/api/widget-areas/${area}/widgets/${widgetId}`); break; }
		case "site_blueprint": {
			const { site_name, tagline, site_type, services: svcs, team: tm, testimonials: test, faqs: fqs, nav_links } = toolInput;
			const results: string[] = [];
			const errors: string[] = [];

			// Helper: create collection + fields + content
			async function ensureCollection(slug: string, label: string, fields: Array<{slug: string; label: string; type: string; required?: boolean}>, items: Array<Record<string, unknown>>) {
				// Check if collection exists
				const checkRes = await get(`/_emdash/api/schema/collections/${slug}`);
				if (!checkRes.ok) {
					// Create collection
					const createRes = await post("/_emdash/api/schema/collections", { slug, label, labelSingular: label.replace(/s$/, ""), supports: ["drafts", "revisions", "search"] });
					if (createRes.ok) results.push(`Created collection: ${label}`);
					else errors.push(`Failed to create ${slug}`);

					// Create fields
					for (const f of fields) {
						await post(`/_emdash/api/schema/collections/${slug}/fields`, f);
					}
					results.push(`Added ${fields.length} fields to ${slug}`);
				} else {
					results.push(`Collection ${slug} already exists`);
				}

				// Create content items
				let created = 0;
				for (const item of items) {
					const res = await post(`/_emdash/api/content/${slug}`, { data: item, status: "published" });
					if (res.ok) {
						const data = await res.json() as { data?: { item?: { id: string } } };
						const id = data.data?.item?.id;
						if (id) await post(`/_emdash/api/content/${slug}/${id}/publish`);
						created++;
					}
				}
				if (created > 0) results.push(`Published ${created} ${slug} items`);
			}

			try {
				// Step 1: Update settings
				await post("/_emdash/api/settings", { title: String(site_name), tagline: String(tagline || "") });
				results.push(`Site: ${site_name}`);

				// Step 2: Create services
				if (Array.isArray(svcs) && svcs.length > 0) {
					await ensureCollection("services", "Services", [
						{ slug: "title", label: "Title", type: "string", required: true },
						{ slug: "description", label: "Description", type: "text", required: true },
						{ slug: "icon", label: "Icon", type: "string" },
					], svcs as Record<string, unknown>[]);
				}

				// Step 3: Create team
				if (Array.isArray(tm) && tm.length > 0) {
					await ensureCollection("team", "Team", [
						{ slug: "name", label: "Name", type: "string", required: true },
						{ slug: "role", label: "Role", type: "string", required: true },
						{ slug: "bio", label: "Bio", type: "text" },
					], tm as Record<string, unknown>[]);
				}

				// Step 4: Create testimonials
				if (Array.isArray(test) && test.length > 0) {
					await ensureCollection("testimonials", "Testimonials", [
						{ slug: "quote", label: "Quote", type: "text", required: true },
						{ slug: "author_name", label: "Author Name", type: "string", required: true },
						{ slug: "author_role", label: "Author Role", type: "string" },
						{ slug: "author_company", label: "Company", type: "string" },
					], test as Record<string, unknown>[]);
				}

				// Step 5: Create FAQs
				if (Array.isArray(fqs) && fqs.length > 0) {
					await ensureCollection("faq", "FAQ", [
						{ slug: "question", label: "Question", type: "string", required: true },
						{ slug: "answer", label: "Answer", type: "text", required: true },
					], fqs as Record<string, unknown>[]);
				}

				// Step 6: Create navigation menu
				const links = Array.isArray(nav_links) ? nav_links as Array<{label: string; url: string}> : [
					{ label: "Services", url: "/services" },
					{ label: "Team", url: "/team" },
					{ label: "Blog", url: "/posts" },
					{ label: "Contact", url: "/contact" },
				];
				// Delete existing primary menu
				await del("/_emdash/api/menus/primary").catch(() => {});
				const menuRes = await post("/_emdash/api/menus", { name: "primary", label: "Primary Navigation" });
				if (menuRes.ok) {
					for (const link of links) {
						await post("/_emdash/api/menus/primary/items", { type: "custom", label: link.label, customUrl: link.url });
					}
					results.push(`Navigation: ${links.length} menu items`);
				}

				return { success: true, results, errors, message: `Website "${site_name}" created! ${results.length} steps completed.` };
			} catch (err) {
				return { success: false, results, errors: [...errors, String(err)], message: "Blueprint partially completed with errors." };
			}
		}
		case "image_generate": {
			// Step 1: Generate image via MiniMax (server downloads it as base64)
			const genRes = await apiFetch(`${API_BASE}/generate-image`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt: toolInput.prompt, aspect_ratio: toolInput.aspect_ratio }),
			});
			if (!genRes.ok) { response = genRes; break; }
			const genData = await genRes.json() as { data?: { imageBase64?: string; imageUrl?: string }; imageBase64?: string; imageUrl?: string };
			const base64 = genData.data?.imageBase64 ?? genData.imageBase64;
			const imgUrl = genData.data?.imageUrl ?? genData.imageUrl;

			if (!base64 && !imgUrl) return genData;

			// Step 2: Upload to CMS media library using base64 data
			if (base64) {
				try {
					const binaryStr = atob(base64);
					const bytes = new Uint8Array(binaryStr.length);
					for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
					const blob = new Blob([bytes], { type: "image/jpeg" });
					const filename = `ai-generated-${Date.now()}.jpg`;
					const formData = new FormData();
					formData.append("file", blob, filename);
					const uploadRes = await apiFetch("/_emdash/api/media", { method: "POST", body: formData });
					if (uploadRes.ok) {
						const uploadData = await uploadRes.json() as { data?: { item?: { id: string; url?: string } } };
						return {
							success: true,
							mediaId: uploadData.data?.item?.id,
							mediaUrl: uploadData.data?.item?.url,
							imageUrl: imgUrl,
							prompt: toolInput.prompt,
							uploaded: true,
						};
					}
				} catch { /* fallthrough */ }
			}

			// Fallback: return URL only
			return { success: true, imageUrl: imgUrl, prompt: toolInput.prompt, uploaded: false, note: "Image generated but upload failed. URL expires in 24h." };
		}
		case "web_browse": { const { url } = toolInput; response = await apiFetch(`${API_BASE}/browse`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) }); break; }
		case "site_get_config": { response = await get("/_emdash/api/plugins/site-deployer/config"); break; }
		case "site_set_config": { response = await post("/_emdash/api/plugins/site-deployer/config/save", toolInput); break; }
		case "site_deploy": { response = await post("/_emdash/api/plugins/site-deployer/deploy"); break; }
		case "site_status": { response = await get("/_emdash/api/plugins/site-deployer/status"); break; }
		case "site_set_domain": { const { domain } = toolInput; response = await post("/_emdash/api/plugins/site-deployer/domain/set", { domain }); break; }
		default: return { error: `Unknown tool: ${toolName}` };
	}

	if (!response.ok) {
		const text = await response.text().catch(() => response.statusText);
		try { return { error: `API ${response.status}`, details: JSON.parse(text) }; }
		catch { return { error: `API ${response.status}: ${text}` }; }
	}
	return response.json();
}

// ── Anthropic SSE Parser ────────────────────────────────────────────────────

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
			try { event = JSON.parse(chunk) as Record<string, unknown>; } catch { continue; }

			switch (event.type) {
				case "content_block_start": {
					currentIdx++;
					const block = event.content_block as ContentBlock;
					blocks[currentIdx] = { type: block.type, id: block.id, name: block.name };
					inputBuffers[currentIdx] = "";
					if (block.type === "tool_use" && block.name) onToolStart(block.name);
					break;
				}
				case "content_block_delta": {
					const delta = event.delta as { type: string; text?: string; partial_json?: string };
					if (delta.type === "text_delta" && delta.text) { onText(delta.text); const b = blocks[currentIdx]; if (b) b.text = (b.text ?? "") + delta.text; }
					else if (delta.type === "input_json_delta" && delta.partial_json) { inputBuffers[currentIdx] = (inputBuffers[currentIdx] ?? "") + delta.partial_json; }
					break;
				}
				case "content_block_stop": {
					const b = blocks[currentIdx];
					if (b?.type === "tool_use") { try { b.input = JSON.parse(inputBuffers[currentIdx] ?? "{}"); } catch { b.input = {}; } }
					break;
				}
				case "message_delta": { const delta = event.delta as { stop_reason?: string }; if (delta.stop_reason) stopReason = delta.stop_reason; break; }
				case "error": { const err = event.error as { message?: string }; throw new Error(err?.message ?? "Anthropic API error"); }
			}
		}
	}
	return { stopReason, blocks };
}

// ── Markdown Renderer ───────────────────────────────────────────────────────

function renderMarkdown(text: string): React.ReactNode {
	const lines = text.split("\n");
	const elements: React.ReactNode[] = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i]!;

		if (line.startsWith("```")) {
			const lang = line.slice(3).trim();
			const codeLines: string[] = [];
			i++;
			while (i < lines.length && !lines[i]!.startsWith("```")) { codeLines.push(lines[i]!); i++; }
			i++;
			elements.push(
				<div key={elements.length} className="my-3 rounded-lg overflow-hidden border border-border/50">
					{lang && <div className="px-3 py-1 text-[10px] font-mono text-muted-foreground bg-muted/50 border-b border-border/50">{lang}</div>}
					<pre className="bg-muted/30 p-3 text-xs font-mono overflow-x-auto"><code>{codeLines.join("\n")}</code></pre>
				</div>,
			);
			continue;
		}

		const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
		if (headingMatch) {
			const level = headingMatch[1]!.length;
			const Tag = `h${level + 1}` as "h2" | "h3" | "h4";
			elements.push(<Tag key={elements.length} className={`font-semibold mt-4 mb-1.5 ${level === 1 ? "text-base" : "text-sm"}`}>{fmtInline(headingMatch[2]!)}</Tag>);
			i++; continue;
		}

		if (line.match(/^[-*]\s/)) {
			const items: string[] = [];
			while (i < lines.length && lines[i]!.match(/^[-*]\s/)) { items.push(lines[i]!.replace(/^[-*]\s/, "")); i++; }
			elements.push(<ul key={elements.length} className="list-disc list-inside space-y-1 my-2 ml-1">{items.map((item, j) => <li key={j}>{fmtInline(item)}</li>)}</ul>);
			continue;
		}

		if (line.match(/^\d+\.\s/)) {
			const items: string[] = [];
			while (i < lines.length && lines[i]!.match(/^\d+\.\s/)) { items.push(lines[i]!.replace(/^\d+\.\s/, "")); i++; }
			elements.push(<ol key={elements.length} className="list-decimal list-inside space-y-1 my-2 ml-1">{items.map((item, j) => <li key={j}>{fmtInline(item)}</li>)}</ol>);
			continue;
		}

		if (line.startsWith("---") || line.startsWith("***")) { elements.push(<hr key={elements.length} className="my-3 border-border/50" />); i++; continue; }
		if (!line.trim()) { elements.push(<div key={elements.length} className="h-2" />); i++; continue; }
		elements.push(<p key={elements.length} className="my-1 leading-relaxed">{fmtInline(line)}</p>);
		i++;
	}
	return elements;
}

function fmtInline(text: string): React.ReactNode {
	const parts: React.ReactNode[] = [];
	let rest = text;
	let k = 0;
	while (rest) {
		const cm = rest.match(/^(.*?)`([^`]+)`/);
		if (cm) { if (cm[1]) parts.push(<React.Fragment key={k++}>{cm[1]}</React.Fragment>); parts.push(<code key={k++} className="bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono">{cm[2]}</code>); rest = rest.slice(cm[0].length); continue; }
		const bm = rest.match(/^(.*?)\*\*([^*]+)\*\*/);
		if (bm) { if (bm[1]) parts.push(<React.Fragment key={k++}>{bm[1]}</React.Fragment>); parts.push(<strong key={k++}>{bm[2]}</strong>); rest = rest.slice(bm[0].length); continue; }
		parts.push(<React.Fragment key={k++}>{rest}</React.Fragment>);
		break;
	}
	return parts.length === 1 ? parts[0] : parts;
}

// ── Page Context Detection ────────────────────────────────────────────────────

interface PageContext {
	type: string;
	collection?: string;
	contentId?: string;
	menuName?: string;
	taxonomy?: string;
	slug?: string;
	settingsPage?: string;
	isNew?: boolean;
	isEditing?: boolean;
}

/** Shared ref between usePageContext and ChatPage — avoids cross-component hacks */
const _chatContainerRef: React.RefObject<HTMLDivElement | null> = React.createRef();

function usePageContext(): PageContext | null {
	const [ctx, setCtx] = React.useState<PageContext | null>(null);

	React.useEffect(() => {
		function readContext() {
			const el = _chatContainerRef.current?.closest("[data-page-context]");
			if (el) {
				try {
					const parsed = JSON.parse(el.getAttribute("data-page-context")!) as PageContext;
					setCtx((prev) => prev?.type === parsed.type && prev?.collection === parsed.collection && prev?.contentId === parsed.contentId ? prev : parsed);
				} catch { /* */ }
			}
		}
		readContext();

		// Watch for attribute changes (page navigation updates the data attribute)
		const el = _chatContainerRef.current?.closest("[data-page-context]");
		if (!el) return;
		const observer = new MutationObserver(readContext);
		observer.observe(el, { attributes: true, attributeFilter: ["data-page-context"] });
		return () => observer.disconnect();
	}, []);

	return ctx;
}

// ── Quick Actions (context-aware) ─────────────────────────────────────────────

const ONBOARDING_ACTIONS = [
	{ label: "Business / Agency", prompt: "Build me a professional business website with services, team, testimonials, and case studies. Make it modern and impressive. Publish everything." },
	{ label: "Restaurant / Cafe", prompt: "Build me a restaurant website with our menu, opening hours, location, and customer reviews. Warm and inviting design. Publish everything." },
	{ label: "Portfolio / Freelancer", prompt: "Build me a portfolio website to showcase my work. Include projects, skills, about me, and contact sections. Clean minimal design. Publish everything." },
	{ label: "Blog / Media", prompt: "Build me a professional blog with categories, featured posts, and an about page. Focus on readability and content. Publish everything." },
	{ label: "Copy an existing site", prompt: "I want to build a website inspired by an existing one. Ask me for the URL and I'll share it with you." },
	{ label: "Start from scratch", prompt: "Help me build a custom website. Ask me questions about what I need — business type, pages, features — then build it step by step." },
];

const DEFAULT_ACTIONS = [
	{ label: "Write & publish a post", prompt: "Write a blog post about the latest trends in our industry. Publish it so it appears on the website." },
	{ label: "Redesign my site", prompt: "Look at my current site structure and help me redesign it. Update the settings, add missing sections, and improve the content." },
	{ label: "Add a new section", prompt: "Help me add a new section to my website. What kind of section would work best for my site?" },
	{ label: "Browse for inspiration", prompt: "I want to look at a website for inspiration. Ask me for the URL." },
];

function getQuickActions(ctx: PageContext | null): Array<{ label: string; prompt: string }> {
	if (!ctx) return DEFAULT_ACTIONS;

	switch (ctx.type) {
		case "content":
			if (ctx.isEditing) return [
				{ label: "Improve this content", prompt: `Read the content item ${ctx.contentId} in ${ctx.collection} and suggest improvements to make it more engaging.` },
				{ label: "Translate to French", prompt: `Translate the content item ${ctx.contentId} in ${ctx.collection} to French and create a new translated version.` },
				{ label: "Add SEO metadata", prompt: `Check the SEO of content item ${ctx.contentId} in ${ctx.collection} and help me optimize it.` },
				{ label: "Publish this", prompt: `Publish content item ${ctx.contentId} in ${ctx.collection} to make it live on the website.` },
			];
			if (ctx.isNew) return [
				{ label: "Help me write this", prompt: `I'm creating a new ${ctx.collection} item. Check the schema and help me fill in all the fields with great content.` },
				{ label: "Generate from brief", prompt: `I want to create a new ${ctx.collection} item. Ask me what it should be about and write it for me.` },
			];
			return [
				{ label: `Create new ${ctx.collection}`, prompt: `Create a new item in the ${ctx.collection} collection with great content and publish it.` },
				{ label: `List all ${ctx.collection}`, prompt: `List all items in the ${ctx.collection} collection with their status.` },
				{ label: `Add field to ${ctx.collection}`, prompt: `Show me the current fields in ${ctx.collection} and suggest what fields I should add.` },
				{ label: "Bulk create content", prompt: `Create 5 sample items in ${ctx.collection} with realistic content and publish them all.` },
			];
		case "menu":
			if (ctx.menuName) return [
				{ label: "Add menu items", prompt: `Show me the current items in the ${ctx.menuName} menu and help me add more navigation links.` },
				{ label: "Rebuild this menu", prompt: `Delete all items in the ${ctx.menuName} menu and rebuild it based on the site's collections and pages.` },
				{ label: "Create footer menu", prompt: "Create a footer menu with links to About, Contact, Privacy, and Terms pages." },
			];
			return [
				{ label: "Create primary nav", prompt: "Create a primary navigation menu with links to all main sections of the site." },
				{ label: "List all menus", prompt: "Show me all menus and their items." },
			];
		case "taxonomy":
			return [
				{ label: `Add ${ctx.taxonomy} terms`, prompt: `Show me existing ${ctx.taxonomy} terms and suggest new ones to add based on the site content.` },
				{ label: "Organize terms", prompt: `Help me reorganize the ${ctx.taxonomy} taxonomy for better content organization.` },
			];
		case "settings":
			return [
				{ label: "Update site info", prompt: "Show me the current site settings and help me update the title, tagline, and description." },
				{ label: "Configure SEO", prompt: "Help me set up the SEO settings for better search engine visibility." },
				{ label: "Set up social links", prompt: "Help me configure social media links for the site." },
			];
		case "content-types":
			if (ctx.slug) return [
				{ label: "Add fields", prompt: `Show me the fields in ${ctx.slug} and suggest what fields I should add for a professional site.` },
				{ label: "Create sample content", prompt: `Create 3 sample items with realistic content in ${ctx.slug} and publish them.` },
			];
			return [
				{ label: "Create a collection", prompt: "Help me create a new content type. Ask me what it's for and set it up with the right fields." },
				{ label: "Review all types", prompt: "List all content types with their fields so I can review the site structure." },
			];
		case "media":
			return [
				{ label: "List all images", prompt: "List all uploaded images with their alt text and dimensions." },
				{ label: "Find unused media", prompt: "Help me identify media files that aren't used in any content." },
			];
		case "comments":
			return [
				{ label: "Show pending", prompt: "List all pending comments that need moderation." },
				{ label: "Moderate all", prompt: "Show me all pending comments and help me approve or reject them." },
			];
		case "sections":
			return [
				{ label: "Create hero section", prompt: "Create a hero section with a compelling headline and description for the homepage." },
				{ label: "Create feature grid", prompt: "Create a features/services section with 3-6 items highlighting key offerings." },
				{ label: "List all sections", prompt: "Show me all existing page sections." },
			];
		case "widgets":
			return [
				{ label: "Set up sidebar", prompt: "Create a sidebar widget area with recent posts and categories." },
				{ label: "Set up footer", prompt: "Create a footer widget area with a navigation menu and copyright text." },
			];
		case "redirects":
			return [
				{ label: "List redirects", prompt: "Show me all URL redirects currently configured." },
				{ label: "Create redirect", prompt: "Help me create a URL redirect from an old page to a new one." },
			];
		case "users":
			return [
				{ label: "List users", prompt: "Show me all site users with their roles." },
			];
		default:
			return DEFAULT_ACTIONS;
	}
}

function getPlaceholder(ctx: PageContext | null): string {
	if (!ctx) return "Describe what you want to build...";

	switch (ctx.type) {
		case "content":
			if (ctx.isEditing) return `How should I help with this ${ctx.collection} item?`;
			if (ctx.isNew) return `What should this new ${ctx.collection} item be about?`;
			return `Ask about your ${ctx.collection}...`;
		case "menu":
			return ctx.menuName ? `What should I add to the ${ctx.menuName} menu?` : "How can I help with menus?";
		case "taxonomy":
			return `Manage ${ctx.taxonomy} terms...`;
		case "settings":
			return "What settings would you like to change?";
		case "content-types":
			return ctx.slug ? `How should I modify the ${ctx.slug} collection?` : "What content type do you need?";
		case "media":
			return "How can I help with your media?";
		case "comments":
			return "How should I handle these comments?";
		case "sections":
			return "What kind of section do you want to create?";
		case "widgets":
			return "How should I set up your widget areas?";
		case "redirects":
			return "What redirect do you need?";
		default:
			return "Describe what you want to build...";
	}
}

function getEmptyTitle(ctx: PageContext | null): string {
	if (!ctx) return "Build your website";
	switch (ctx.type) {
		case "content": return ctx.isEditing ? "Edit with AI" : `Manage ${ctx.collection || "content"}`;
		case "menu": return "Build your navigation";
		case "taxonomy": return `Organize ${ctx.taxonomy || "taxonomy"}`;
		case "settings": return "Configure your site";
		case "content-types": return "Design your schema";
		case "media": return "Manage your media";
		case "comments": return "Moderate comments";
		case "sections": return "Design page sections";
		case "widgets": return "Set up widgets";
		case "redirects": return "Manage redirects";
		default: return "Build your website";
	}
}

// ── Tool Badges (grouped) ────────────────────────────────────────────────────

function ToolBadges({ events }: { events: ToolEvent[] }) {
	// Group by tool name, keep latest status
	const grouped = new Map<string, { count: number; status: ToolEvent["type"]; error?: string }>();
	for (const ev of events) {
		const existing = grouped.get(ev.name);
		if (existing) {
			existing.count++;
			existing.status = ev.type;
			if (ev.error) existing.error = ev.error;
		} else {
			grouped.set(ev.name, { count: 1, status: ev.type, error: ev.error });
		}
	}

	return (
		<div className="flex flex-wrap gap-1.5 mb-2">
			{Array.from(grouped.entries()).map(([name, info]) => {
				const label = name.replace(/_/g, " ");
				const count = info.count > 1 ? ` x${info.count}` : "";
				const cls =
					info.status === "executing"
						? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
						: info.status === "success"
							? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
							: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400";
				const Icon = info.status === "executing" ? CircleNotch : info.status === "success" ? CheckCircle : WarningCircle;

				return (
					<span key={name} title={info.error} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${cls}`}>
						<Icon className={`h-3 w-3 ${info.status === "executing" ? "animate-spin" : ""}`} />
						{label}{count}
					</span>
				);
			})}
		</div>
	);
}

// ── Message Bubble ────────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: ChatMessage }) {
	if (msg.role === "user") {
		return (
			<div className="flex justify-end mb-4">
				<div className="max-w-[75%] rounded-2xl rounded-tr-md bg-blue-600 text-white px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm">
					{msg.content}
				</div>
			</div>
		);
	}

	if (msg.role === "error") {
		return (
			<div className="flex justify-start mb-4">
				<div className="max-w-[75%] rounded-2xl rounded-tl-md border border-red-200 bg-red-50 text-red-700 px-4 py-2.5 text-sm dark:border-red-800 dark:bg-red-950/50 dark:text-red-300">
					{msg.message}
				</div>
			</div>
		);
	}

	return (
		<div className="flex justify-start gap-3 mb-4">
			<div className="flex-shrink-0 mt-1 h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
				<Sparkle className="h-3.5 w-3.5 text-white" weight="fill" />
			</div>
			<div className="flex-1 min-w-0 max-w-[85%]">
				{msg.toolEvents.length > 0 && <ToolBadges events={msg.toolEvents} />}
				{(msg.text || msg.streaming) && (
					<div className="rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed" style={{ backgroundColor: "#ffffff", color: "#1f2937", border: "1px solid #e5e7eb" }}>
						{msg.text ? renderMarkdown(msg.text) : null}
						{msg.streaming && !msg.text && (
							<span className="inline-flex gap-1">
								{[0, 1, 2].map((i) => (
									<span key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
								))}
							</span>
						)}
						{msg.streaming && msg.text && <span className="ml-0.5 inline-block h-4 w-0.5 bg-blue-500 animate-pulse rounded-full" />}
					</div>
				)}
			</div>
		</div>
	);
}

// ── Conversation History Sidebar ──────────────────────────────────────────────

function HistorySidebar({
	conversations,
	activeId,
	onSelect,
	onDelete,
	onNew,
	isOpen,
	onToggle,
}: {
	conversations: ConversationMeta[];
	activeId: string | null;
	onSelect: (id: string) => void;
	onDelete: (id: string) => void;
	onNew: () => void;
	isOpen: boolean;
	onToggle: () => void;
}) {
	const grouped = React.useMemo(() => {
		const today = new Date(); today.setHours(0, 0, 0, 0);
		const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
		const week = new Date(today); week.setDate(week.getDate() - 7);

		const groups: { label: string; items: ConversationMeta[] }[] = [
			{ label: "Today", items: [] },
			{ label: "Yesterday", items: [] },
			{ label: "This week", items: [] },
			{ label: "Older", items: [] },
		];

		for (const c of conversations) {
			const d = new Date(c.updatedAt);
			if (d >= today) groups[0]!.items.push(c);
			else if (d >= yesterday) groups[1]!.items.push(c);
			else if (d >= week) groups[2]!.items.push(c);
			else groups[3]!.items.push(c);
		}
		return groups.filter((g) => g.items.length > 0);
	}, [conversations]);

	if (!isOpen) {
		return (
			<div className="flex-shrink-0 border-r flex flex-col items-center py-3 px-1" style={{ backgroundColor: "#f3f4f6", borderColor: "#e5e7eb" }}>
				<button onClick={onToggle} className="p-2 rounded-lg hover:bg-white transition-colors" title="Show history" style={{ color: "#374151" }}>
					<ChatCircle className="h-5 w-5" />
				</button>
			</div>
		);
	}

	return (
		<div className="w-64 flex-shrink-0 border-r flex flex-col" style={{ backgroundColor: "#f3f4f6", borderColor: "#e5e7eb" }}>
			<div className="p-3 border-b flex items-center justify-between">
				<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">History</span>
				<div className="flex items-center gap-1">
					<button onClick={onNew} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="New chat">
						<Plus className="h-3.5 w-3.5" />
					</button>
					<button onClick={onToggle} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Hide">
						<CaretLeft className="h-3.5 w-3.5" />
					</button>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto p-2 space-y-3">
				{grouped.map((group) => (
					<div key={group.label}>
						<div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{group.label}</div>
						{group.items.map((c) => (
							<div
								key={c.id}
								className={`group flex items-center gap-1 px-2 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
									c.id === activeId ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300" : "hover:bg-muted"
								}`}
							>
								<button onClick={() => onSelect(c.id)} className="flex-1 text-left truncate min-w-0">
									{c.title}
								</button>
								<button
									onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
									className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 transition-all"
								>
									<Trash className="h-3 w-3" />
								</button>
							</div>
						))}
					</div>
				))}
				{conversations.length === 0 && (
					<p className="text-xs text-muted-foreground text-center py-4">No conversations yet</p>
				)}
			</div>
		</div>
	);
}

// ── Main Chat Page ────────────────────────────────────────────────────────────

function ChatPage() {
	const pageCtx = usePageContext();
	const quickActions = React.useMemo(() => getQuickActions(pageCtx), [pageCtx]);
	const placeholder = React.useMemo(() => getPlaceholder(pageCtx), [pageCtx]);
	const emptyTitle = React.useMemo(() => getEmptyTitle(pageCtx), [pageCtx]);

	const [messages, setMessages] = React.useState<ChatMessage[]>([]);
	const [input, setInput] = React.useState("");
	const [isStreaming, setIsStreaming] = React.useState(false);
	const [conversationId, setConversationId] = React.useState<string>(uid());
	const [conversations, setConversations] = React.useState<ConversationMeta[]>([]);
	const [historyOpen, setHistoryOpen] = React.useState(true);
	const [showPreview, setShowPreview] = React.useState(false);
	const [previewKey, setPreviewKey] = React.useState(0);
	const iframeRef = React.useRef<HTMLIFrameElement>(null);
	const [attachments, setAttachments] = React.useState<Array<{ name: string; type: string; base64: string; preview?: string }>>([]);
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const bottomRef = React.useRef<HTMLDivElement>(null);
	const textareaRef = React.useRef<HTMLTextAreaElement>(null);
	const abortRef = React.useRef<AbortController | null>(null);

	// Auto-scroll
	React.useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

	// Load conversation list on mount
	React.useEffect(() => {
		void (async () => {
			try {
				const res = await apiFetch(`${API_BASE}/conversations`);
				if (res.ok) {
					const data = await res.json() as { data?: ConversationMeta[] };
					setConversations(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data as unknown as ConversationMeta[] : []);
				}
			} catch { /* ignore */ }
		})();
	}, []);

	// Auto-save conversation after streaming ends
	const saveConversation = React.useCallback(async (msgs: ChatMessage[], convId: string) => {
		if (msgs.length === 0) return;
		const firstUser = msgs.find((m) => m.role === "user");
		const title = firstUser?.role === "user" ? firstUser.content.slice(0, 60) : "New conversation";
		try {
			await apiFetch(`${API_BASE}/conversations/save`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: convId, title, messages: msgs }),
			});
			// Refresh list
			const res = await apiFetch(`${API_BASE}/conversations`);
			if (res.ok) {
				const data = await res.json() as { data?: ConversationMeta[] };
				setConversations(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data as unknown as ConversationMeta[] : []);
			}
		} catch { /* ignore */ }
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(e.target.value);
		e.target.style.height = "auto";
		e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
	};

	const updateLastAssistant = (updater: (msg: AssistantMessage) => AssistantMessage) => {
		setMessages((prev) => {
			const next = [...prev];
			const last = next[next.length - 1];
			if (last?.role === "assistant") next[next.length - 1] = updater(last);
			return next;
		});
	};

	// ── File handling ──
	const handleFiles = async (files: FileList | File[]) => {
		const newAttachments: typeof attachments = [];
		for (const file of Array.from(files)) {
			const base64 = await new Promise<string>((resolve) => {
				const reader = new FileReader();
				reader.onload = () => {
					const result = reader.result as string;
					resolve(result.split(",")[1] ?? "");
				};
				reader.readAsDataURL(file);
			});
			const isImage = file.type.startsWith("image/");
			newAttachments.push({
				name: file.name,
				type: file.type,
				base64,
				preview: isImage ? `data:${file.type};base64,${base64}` : undefined,
			});
		}
		setAttachments((prev) => [...prev, ...newAttachments]);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const items = e.dataTransfer.items;
		const files: File[] = [];
		for (let i = 0; i < items.length; i++) {
			const item = items[i]!;
			if (item.kind === "file") {
				const entry = item.webkitGetAsEntry?.();
				if (entry?.isDirectory) {
					// Read directory recursively
					const dirReader = (entry as FileSystemDirectoryEntry).createReader();
					dirReader.readEntries((entries) => {
						const dirFiles: File[] = [];
						let pending = entries.length;
						if (pending === 0) return;
						entries.forEach((e) => {
							if (e.isFile) {
								(e as FileSystemFileEntry).file((f) => {
									dirFiles.push(f);
									if (--pending === 0) void handleFiles(dirFiles);
								});
							} else {
								if (--pending === 0 && dirFiles.length > 0) void handleFiles(dirFiles);
							}
						});
					});
				} else {
					const f = item.getAsFile();
					if (f) files.push(f);
				}
			}
		}
		if (files.length > 0) void handleFiles(files);
	};

	const removeAttachment = (index: number) => {
		setAttachments((prev) => prev.filter((_, i) => i !== index));
	};

	const send = async (text: string) => {
		const trimmed = text.trim();
		if ((!trimmed && attachments.length === 0) || isStreaming) return;
		setInput("");
		if (textareaRef.current) textareaRef.current.style.height = "auto";

		// Build user message content — text + any image attachments
		const currentAttachments = [...attachments];
		setAttachments([]);

		let displayText = trimmed;
		if (currentAttachments.length > 0) {
			const fileNames = currentAttachments.map((a) => a.name).join(", ");
			displayText = trimmed ? `${trimmed}\n📎 ${fileNames}` : `📎 ${fileNames}`;
		}

		const userMsg: UserMessage = { role: "user", content: displayText || "📎 Files attached" };
		const assistantMsg: AssistantMessage = { role: "assistant", text: "", toolEvents: [], streaming: true };
		const newMessages = [...messages, userMsg, assistantMsg];
		setMessages(newMessages);
		setIsStreaming(true);

		const abort = new AbortController();
		abortRef.current = abort;

		try {
			const apiMessages: Array<{ role: string; content: unknown }> = [];
			for (const m of messages) {
				if (m.role === "user") apiMessages.push({ role: "user", content: m.content });
				else if (m.role === "assistant") apiMessages.push({ role: "assistant", content: m.text });
			}
			// Build the last user message with attachments (Anthropic vision format)
			if (currentAttachments.length > 0) {
				const contentParts: Array<unknown> = [];
				// Add images as base64
				for (const att of currentAttachments) {
					if (att.type.startsWith("image/")) {
						contentParts.push({
							type: "image",
							source: { type: "base64", media_type: att.type, data: att.base64 },
						});
					} else {
						// Non-image files: send as text description
						try {
							const text = atob(att.base64);
							contentParts.push({
								type: "text",
								text: `[File: ${att.name}]\n${text.slice(0, 10000)}`,
							});
						} catch {
							contentParts.push({
								type: "text",
								text: `[File: ${att.name} — binary, cannot display]`,
							});
						}
					}
				}
				if (trimmed) contentParts.push({ type: "text", text: trimmed });
				apiMessages.push({ role: "user", content: contentParts });
			} else {
				apiMessages.push({ role: "user", content: trimmed || "..." });
			}
			await runAgenticLoop(apiMessages, abort.signal);
		} catch (err) {
			if ((err as { name?: string }).name !== "AbortError") {
				const msg = err instanceof Error ? err.message : String(err);
				setMessages((prev) => {
					const next = [...prev];
					const last = next[next.length - 1];
					if (last?.role === "assistant" && !last.text) next[next.length - 1] = { role: "error", message: msg };
					else next.push({ role: "error", message: msg });
					return next;
				});
			}
		} finally {
			updateLastAssistant((m) => ({ ...m, streaming: false }));
			setIsStreaming(false);
			abortRef.current = null;
			// Save after response completes
			setMessages((finalMsgs) => { void saveConversation(finalMsgs, conversationId); return finalMsgs; });
			// Auto-refresh preview after AI finishes
			if (showPreview) setPreviewKey((k) => k + 1);
		}
	};

	async function runAgenticLoop(conversation: Array<{ role: string; content: unknown }>, signal: AbortSignal) {
		const conv = [...conversation];
		for (let turn = 0; turn < 20; turn++) {
			if (signal.aborted) break;
			const response = await apiFetch(CHAT_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: conv, pageContext: pageCtx }),
				signal,
			});
			if (!response.ok || !response.body) {
				const errBody = await response.text().catch(() => "");
				let errMsg = `Server error: ${response.status}`;
				try { const parsed = JSON.parse(errBody) as { error?: string }; if (parsed.error) errMsg = parsed.error; } catch { /* */ }
				throw new Error(errMsg);
			}
			const { stopReason, blocks } = await parseAnthropicStream(
				response,
				(text) => updateLastAssistant((m) => ({ ...m, text: m.text + text })),
				(name) => updateLastAssistant((m) => ({ ...m, toolEvents: [...m.toolEvents, { type: "executing", name }] })),
			);
			const assistantContent = blocks.map((b) => {
				if (b.type === "text") return { type: "text", text: b.text ?? "" };
				if (b.type === "tool_use") return { type: "tool_use", id: b.id, name: b.name, input: b.input ?? {} };
				return b;
			});
			conv.push({ role: "assistant", content: assistantContent });
			if (stopReason !== "tool_use") break;

			const toolResults: Array<{ type: "tool_result"; tool_use_id: string; content: string }> = [];
			for (const block of blocks) {
				if (block.type !== "tool_use" || !block.id || !block.name) continue;
				if (signal.aborted) break;
				try {
					const result = await executeCmsTool(block.name, block.input ?? {});
					toolResults.push({ type: "tool_result", tool_use_id: block.id, content: JSON.stringify(result) });
					updateLastAssistant((m) => ({ ...m, toolEvents: m.toolEvents.map((ev) => ev.name === block.name && ev.type === "executing" ? { ...ev, type: "success" as const } : ev) }));
				} catch (err) {
					const errMsg = err instanceof Error ? err.message : String(err);
					toolResults.push({ type: "tool_result", tool_use_id: block.id, content: JSON.stringify({ error: errMsg }) });
					updateLastAssistant((m) => ({ ...m, toolEvents: m.toolEvents.map((ev) => ev.name === block.name && ev.type === "executing" ? { ...ev, type: "error" as const, error: errMsg } : ev) }));
				}
			}
			conv.push({ role: "user", content: toolResults });
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(input); }
	};

	const newChat = () => {
		if (!isStreaming) { setMessages([]); setConversationId(uid()); }
	};

	const loadConversation = async (id: string) => {
		try {
			const res = await apiFetch(`${API_BASE}/conversations/load`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			if (res.ok) {
				const data = await res.json() as { data?: { messages?: ChatMessage[] } };
				const msgs = data.data?.messages ?? (data as unknown as { messages?: ChatMessage[] }).messages;
				if (Array.isArray(msgs)) { setMessages(msgs); setConversationId(id); }
			}
		} catch { /* ignore */ }
	};

	const deleteConversation = async (id: string) => {
		try {
			await apiFetch(`${API_BASE}/conversations/delete`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			setConversations((prev) => prev.filter((c) => c.id !== id));
			if (id === conversationId) newChat();
		} catch { /* ignore */ }
	};

	return (
		<div ref={_chatContainerRef} className="flex h-full max-h-[calc(100vh-8rem)]">
			{/* History sidebar */}
			<HistorySidebar
				conversations={conversations}
				activeId={conversationId}
				onSelect={(id) => void loadConversation(id)}
				onDelete={(id) => void deleteConversation(id)}
				onNew={newChat}
				isOpen={historyOpen}
				onToggle={() => setHistoryOpen(!historyOpen)}
			/>

			{/* Chat area */}
			<div className="flex-1 flex flex-col min-w-0" style={{ color: "#1a1a2e" }}>
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-3 border-b" style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb" }}>
					<div className="flex items-center gap-3">
						<img src="/tp-logo.png" alt="Token Press" style={{ width: 32, height: 32, borderRadius: 8 }} />
						<div>
							<h1 className="text-base font-semibold" style={{ color: "#111827" }}>Token Press AI</h1>
							<p className="text-[11px]" style={{ color: "#6b7280" }}>Build your website with AI</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={() => setShowPreview(!showPreview)}
							className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm"
							style={showPreview ? { background: "#2563eb", color: "#fff" } : { background: "#eff6ff", color: "#2563eb" }}
						>
							<Globe className="h-3.5 w-3.5" />
							{showPreview ? "Hide Preview" : "Preview"}
						</button>
						<a
							href="/"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
							style={{ color: "#6b7280" }}
						>
							<ArrowSquareOut className="h-3.5 w-3.5" />
							Open site
						</a>
						<button onClick={newChat} disabled={isStreaming} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50" style={{ color: "#6b7280" }}>
							<ArrowClockwise className="h-3.5 w-3.5" />
							New
						</button>
					</div>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto px-6 py-6 min-h-0" style={{ backgroundColor: "#f9fafb" }}>
					{messages.length === 0 && (() => {
						const isOnboarding = conversations.length === 0;
						const actions = isOnboarding ? ONBOARDING_ACTIONS : quickActions;
						const title = isOnboarding ? "What kind of website do you want to build?" : emptyTitle;
						const subtitle = isOnboarding
							? "Choose a template below or describe your vision. I'll build your entire website — structure, content, design, and navigation — in minutes."
							: "Tell me what kind of website you want. I'll create the structure, write the content, and publish everything.";
						return (
							<div className="flex flex-col items-center justify-center h-full gap-8 text-center">
								<div className="space-y-3">
									<img src="/tp-logo.png" alt="Token Press" style={{ width: 56, height: 56, borderRadius: 16, margin: "0 auto", display: "block" }} />
									<h2 className="text-2xl font-bold" style={{ color: "#111827" }}>{title}</h2>
									<p style={{ color: "#6b7280" }} className="max-w-lg">{subtitle}</p>
								</div>
								<div className={`grid gap-2.5 w-full max-w-2xl ${isOnboarding ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}>
									{actions.map((action) => (
										<button
											key={action.label}
											onClick={() => void send(action.prompt)}
											disabled={isStreaming}
											className="text-left px-4 py-3.5 rounded-xl border hover:border-blue-300 transition-all text-sm disabled:opacity-50 group"
											style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb", color: "#374151" }}
										>
											<span className="font-semibold group-hover:text-blue-600 transition-colors">{action.label}</span>
										</button>
									))}
								</div>
							</div>
						);
					})()}

					{messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
					<div ref={bottomRef} />
				</div>

				{/* Input */}
				<div
					className="px-6 pb-4 pt-3 border-t"
					style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb" }}
					onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
					onDrop={handleDrop}
				>
					{/* Attachment previews */}
					{attachments.length > 0 && (
						<div className="flex gap-2 mb-2 flex-wrap">
							{attachments.map((att, i) => (
								<div key={i} className="relative" style={{ border: "1px solid #e5e7eb", borderRadius: "0.5rem", overflow: "hidden" }}>
									{att.preview ? (
										<img src={att.preview} alt={att.name} style={{ width: 60, height: 60, objectFit: "cover" }} />
									) : (
										<div style={{ width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6" }}>
											<FileIcon size={20} style={{ color: "#6b7280" }} />
										</div>
									)}
									<button
										onClick={() => removeAttachment(i)}
										style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", cursor: "pointer", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}
									>
										<X size={10} />
									</button>
									<div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: "7px", padding: "1px 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
										{att.name}
									</div>
								</div>
							))}
						</div>
					)}

					<div className="flex items-end gap-2 rounded-xl border shadow-sm p-2 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400" style={{ backgroundColor: "#f9fafb", borderColor: "#d1d5db" }}>
						{/* File upload button */}
						<button
							onClick={() => fileInputRef.current?.click()}
							disabled={isStreaming}
							className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
							style={{ color: "#6b7280" }}
							title="Attach files or images (drag & drop also works)"
						>
							<ImageIcon className="h-4 w-4" />
						</button>
						<input
							ref={fileInputRef}
							type="file"
							multiple
							accept="image/*,.pdf,.txt,.csv,.json,.md,.html,.css,.js,.ts,.tsx,.jsx"
							onChange={(e) => { if (e.target.files) void handleFiles(e.target.files); e.target.value = ""; }}
							style={{ display: "none" }}
						/>

						<textarea
							ref={textareaRef}
							value={input}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
							placeholder={attachments.length > 0 ? "Add a message about these files..." : placeholder}
							rows={1}
							disabled={isStreaming}
							className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none disabled:opacity-50 max-h-40"
							style={{ color: "#111827" }}
						/>
						{isStreaming ? (
							<button onClick={() => abortRef.current?.abort()} className="flex-shrink-0 h-8 w-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors" title="Stop">
								<span className="h-3 w-3 rounded-sm bg-white" />
							</button>
						) : (
							<button onClick={() => void send(input)} disabled={!input.trim() && attachments.length === 0} className="flex-shrink-0 h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm" title="Send">
								<ArrowUp className="h-4 w-4" weight="bold" />
							</button>
						)}
					</div>
					<p className="text-center text-[10px] mt-2" style={{ color: "#9ca3af" }}>
						Powered by Claude &middot; Token Press by Angkor AI
					</p>
				</div>
			</div>

			{/* ── Live Preview Panel ── */}
			{showPreview && (
				<div className="flex flex-col border-l" style={{ width: "50%", minWidth: "320px", borderColor: "#e5e7eb" }}>
					<div className="flex items-center justify-between px-3 py-2 border-b" style={{ backgroundColor: "#f9fafb", borderColor: "#e5e7eb" }}>
						<div className="flex items-center gap-2">
							<div className="flex gap-1">
								<span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
								<span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
								<span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
							</div>
							<span className="text-[11px] font-mono" style={{ color: "#9ca3af" }}>
								{typeof window !== "undefined" ? window.location.origin : ""}
							</span>
						</div>
						<button
							onClick={() => setPreviewKey((k) => k + 1)}
							className="p-1 rounded transition-colors"
							style={{ color: "#6b7280" }}
							title="Refresh preview"
						>
							<ArrowClockwise className="h-3.5 w-3.5" />
						</button>
					</div>
					<iframe
						ref={iframeRef}
						key={previewKey}
						src="/"
						className="flex-1 w-full border-0"
						style={{ backgroundColor: "#fff" }}
						title="Website Preview"
					/>
				</div>
			)}
		</div>
	);
}

// ── Exports ───────────────────────────────────────────────────────────────────

export const widgets: PluginAdminExports["widgets"] = {};
export const pages: PluginAdminExports["pages"] = { "/chat": ChatPage };
