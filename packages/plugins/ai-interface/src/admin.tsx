/**
 * Angkor AI Interface — Admin Chat Panel
 *
 * A full-page AI chat interface in the CMS admin. Users manage their site
 * in natural language — Claude executes CMS actions via tool calls.
 */

import { ArrowUp, CircleNotch, Sparkle, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import type { PluginAdminExports } from "emdash";
import * as React from "react";

const API_URL = "/_emdash/api/plugins/ai-interface/chat";

// ── Types ────────────────────────────────────────────────────────────────────

interface UserMessage {
	role: "user";
	content: string;
}

interface AssistantMessage {
	role: "assistant";
	/** Streamed text chunks */
	text: string;
	/** Tool events during this response */
	toolEvents: ToolEvent[];
	/** Whether the response is still streaming */
	streaming: boolean;
}

interface ToolEvent {
	type: "tool_use" | "tool_executing" | "tool_result";
	name: string;
	success?: boolean;
	error?: string;
}

interface ErrorMessage {
	role: "error";
	message: string;
}

type ChatMessage = UserMessage | AssistantMessage | ErrorMessage;

/** SSE event from the chat endpoint */
interface SseEvent {
	type: "text" | "tool_use" | "tool_executing" | "tool_result" | "error" | "done";
	text?: string;
	name?: string;
	success?: boolean;
	error?: string;
	message?: string;
}

// ── Quick Actions ─────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
	{ label: "Create a blog post", prompt: "Create a new blog post about AI in Cambodia." },
	{ label: "List recent content", prompt: "List the 5 most recent posts." },
	{ label: "Generate site from brief", prompt: "Generate a complete site for a digital agency in Cambodia, in English and French." },
	{ label: "Add a collection", prompt: "Create a new 'Services' collection with title, description, and icon fields." },
];

// ── Tool Event Badge ──────────────────────────────────────────────────────────

function ToolBadge({ event }: { event: ToolEvent }) {
	const toolLabel = event.name.replace(/_/g, " ");

	if (event.type === "tool_use" || event.type === "tool_executing") {
		return (
			<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs dark:bg-blue-900/30 dark:text-blue-300">
				<CircleNotch className="h-3 w-3 animate-spin" />
				{toolLabel}
			</span>
		);
	}

	if (event.type === "tool_result") {
		if (event.success) {
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
				{toolLabel} failed
			</span>
		);
	}

	return null;
}

// ── Message Bubble ────────────────────────────────────────────────────────────

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

	// assistant
	return (
		<div className="flex justify-start gap-2.5">
			<div className="flex-shrink-0 mt-1 h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
				<Sparkle className="h-4 w-4 text-white" weight="fill" />
			</div>
			<div className="flex-1 min-w-0 space-y-2">
				{/* Tool events */}
				{msg.toolEvents.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{msg.toolEvents.map((ev, i) => (
							<ToolBadge key={i} event={ev} />
						))}
					</div>
				)}

				{/* Text content */}
				{(msg.text || msg.streaming) && (
					<div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm whitespace-pre-wrap">
						{msg.text}
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

	// Auto-scroll on new content
	React.useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Auto-resize textarea
	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(e.target.value);
		e.target.style.height = "auto";
		e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
	};

	const send = async (text: string) => {
		const trimmed = text.trim();
		if (!trimmed || isStreaming) return;

		setInput("");
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
		}

		// Add user message
		const userMsg: UserMessage = { role: "user", content: trimmed };
		setMessages((prev) => [...prev, userMsg]);

		// Prepare assistant placeholder
		const assistantMsg: AssistantMessage = {
			role: "assistant",
			text: "",
			toolEvents: [],
			streaming: true,
		};
		setMessages((prev) => [...prev, assistantMsg]);
		setIsStreaming(true);

		// Build conversation history for API (only user/assistant text messages)
		const history = messages
			.filter((m): m is UserMessage | AssistantMessage => m.role === "user" || m.role === "assistant")
			.map((m) => {
				if (m.role === "user") return { role: "user", content: m.content };
				return { role: "assistant", content: m.text };
			});
		history.push({ role: "user", content: trimmed });

		const abort = new AbortController();
		abortRef.current = abort;

		try {
			const response = await fetch(API_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-EmDash-Request": "1",
				},
				body: JSON.stringify({ messages: history }),
				signal: abort.signal,
			});

			if (!response.ok || !response.body) {
				throw new Error(`Server error: ${response.status}`);
			}

			const reader = response.body.getReader();
			const dec = new TextDecoder();
			let buffer = "";

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += dec.decode(value, { stream: true });
				const lines = buffer.split("\n");
				buffer = lines.pop() ?? "";

				for (const line of lines) {
					if (!line.startsWith("data: ")) continue;
					let event: SseEvent;
					try {
						event = JSON.parse(line.slice(6)) as SseEvent;
					} catch {
						continue;
					}

					if (event.type === "done") break;

					if (event.type === "text" && event.text) {
						setMessages((prev) => {
							const next = [...prev];
							const last = next[next.length - 1];
							if (last?.role === "assistant") {
								next[next.length - 1] = { ...last, text: last.text + event.text };
							}
							return next;
						});
					} else if (
						(event.type === "tool_use" || event.type === "tool_executing" || event.type === "tool_result") &&
						event.name
					) {
						const toolEvent: ToolEvent = {
							type: event.type,
							name: event.name,
							success: event.success,
							error: event.error,
						};
						setMessages((prev) => {
							const next = [...prev];
							const last = next[next.length - 1];
							if (last?.role === "assistant") {
								// Deduplicate: replace last event for same tool name if upgrading state
								const existing = last.toolEvents.findIndex(
									(e) => e.name === event.name && e.type !== "tool_result",
								);
								const events =
									existing >= 0
										? last.toolEvents.map((e, i) => (i === existing ? toolEvent : e))
										: [...last.toolEvents, toolEvent];
								next[next.length - 1] = { ...last, toolEvents: events };
							}
							return next;
						});
					} else if (event.type === "error") {
						setMessages((prev) => {
							const next = [...prev];
							// Replace streaming assistant placeholder with error
							const last = next[next.length - 1];
							if (last?.role === "assistant" && !last.text) {
								next[next.length - 1] = {
									role: "error",
									message: event.message ?? "An error occurred",
								};
							} else {
								next.push({ role: "error", message: event.message ?? "An error occurred" });
							}
							return next;
						});
					}
				}
			}
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
			// Mark streaming done
			setMessages((prev) => {
				const next = [...prev];
				const last = next[next.length - 1];
				if (last?.role === "assistant") {
					next[next.length - 1] = { ...last, streaming: false };
				}
				return next;
			});
			setIsStreaming(false);
			abortRef.current = null;
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			void send(input);
		}
	};

	const handleStop = () => {
		abortRef.current?.abort();
	};

	return (
		<div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
			{/* Header */}
			<div className="flex items-center gap-3 pb-4 border-b">
				<div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
					<Sparkle className="h-5 w-5 text-white" weight="fill" />
				</div>
				<div>
					<h1 className="text-xl font-semibold">Angkor AI</h1>
					<p className="text-sm text-muted-foreground">Manage your site in natural language</p>
				</div>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto py-6 space-y-5 min-h-0">
				{messages.length === 0 && (
					<div className="flex flex-col items-center justify-center h-full gap-6 text-center px-4">
						<div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
							<Sparkle className="h-8 w-8 text-white" weight="fill" />
						</div>
						<div>
							<h2 className="text-2xl font-bold">What would you like to do?</h2>
							<p className="text-muted-foreground mt-1">
								Create content, build collections, publish posts — just ask.
							</p>
						</div>

						{/* Quick actions */}
						<div className="grid grid-cols-2 gap-2 w-full max-w-lg">
							{QUICK_ACTIONS.map((action) => (
								<button
									key={action.label}
									onClick={() => void send(action.prompt)}
									disabled={isStreaming}
									className="text-left px-4 py-3 rounded-xl border hover:bg-muted transition-colors text-sm disabled:opacity-50"
								>
									{action.label}
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
						placeholder="Ask Angkor AI to manage your site..."
						rows={1}
						disabled={isStreaming}
						className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50 max-h-40"
					/>
					{isStreaming ? (
						<button
							onClick={handleStop}
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
					Powered by Claude · Angkor AI CMS
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
