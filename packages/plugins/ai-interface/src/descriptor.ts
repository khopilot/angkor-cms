/**
 * Angkor AI Interface Plugin Descriptor
 *
 * Adds a native AI chat panel to the CMS admin — manage your entire site
 * in natural language using Claude AI.
 */

import type { PluginDescriptor } from "emdash";

export interface AIInterfaceOptions {
	/** Anthropic API key. Falls back to env.ANTHROPIC_API_KEY wrangler secret. */
	anthropicApiKey?: string;
	/** Claude model to use (default: claude-sonnet-4-6) */
	model?: string;
	/** Max tokens per response (default: 4096) */
	maxTokens?: number;
}

export function aiInterfacePlugin(
	options: AIInterfaceOptions = {},
): PluginDescriptor<AIInterfaceOptions> {
	return {
		id: "ai-interface",
		version: "0.1.0",
		entrypoint: "@angkor-cms/plugin-ai-interface/plugin",
		options,
		adminEntry: "@angkor-cms/plugin-ai-interface/admin",
		adminPages: [{ path: "/chat", label: "AI Assistant", icon: "sparkle" }],
		adminWidgets: [],
	};
}
