/**
 * CMS tools in Anthropic tool_use format.
 *
 * These mirror the 28 tools in packages/core/src/mcp/server.ts.
 * Claude calls these tools; the plugin proxies execution to /_emdash/api/mcp.
 */

export interface AnthropicTool {
	name: string;
	description: string;
	input_schema: {
		type: "object";
		properties: Record<string, unknown>;
		required?: string[];
	};
}

export const CMS_TOOLS: AnthropicTool[] = [
	// ── Content ──────────────────────────────────────────────────────────────
	{
		name: "content_list",
		description:
			"List content items in a collection. Use to browse existing posts, pages, or any content type. Returns items with their ID, title, slug, and status.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug (e.g. 'posts', 'pages')" },
				status: {
					type: "string",
					enum: ["draft", "published", "scheduled"],
					description: "Filter by status. Omit to get all.",
				},
				limit: { type: "number", description: "Max items (default 20, max 100)" },
				locale: { type: "string", description: "Filter by locale (e.g. 'en', 'fr')" },
			},
			required: ["collection"],
		},
	},
	{
		name: "content_get",
		description: "Get a single content item by ID or slug. Returns all field values.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug" },
				id: { type: "string", description: "Item ID (ULID) or slug" },
			},
			required: ["collection", "id"],
		},
	},
	{
		name: "content_create",
		description:
			"Create a new content item (article, page, etc.). Items are created as draft by default. Use content_publish to make them live. Rich text fields accept Portable Text JSON arrays — use simple strings for basic text.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug (e.g. 'posts')" },
				data: {
					type: "object",
					description: "Field values matching the collection schema. Use schema_get_collection to check fields.",
					additionalProperties: true,
				},
				slug: { type: "string", description: "URL slug (auto-generated from title if omitted)" },
				status: {
					type: "string",
					enum: ["draft", "published"],
					description: "Initial status (default: 'draft')",
				},
				locale: { type: "string", description: "Locale (e.g. 'fr', 'km', 'en')" },
				translationOf: { type: "string", description: "ID of the source item this translates" },
			},
			required: ["collection", "data"],
		},
	},
	{
		name: "content_update",
		description:
			"Update an existing content item. Only include fields you want to change.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug" },
				id: { type: "string", description: "Item ID or slug" },
				data: {
					type: "object",
					description: "Fields to update (only changed fields)",
					additionalProperties: true,
				},
				slug: { type: "string", description: "New slug" },
			},
			required: ["collection", "id"],
		},
	},
	{
		name: "content_publish",
		description: "Publish a draft item, making it live on the site.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug" },
				id: { type: "string", description: "Item ID or slug" },
			},
			required: ["collection", "id"],
		},
	},
	{
		name: "content_unpublish",
		description: "Unpublish an item, reverting it to draft. It will no longer appear on the site.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug" },
				id: { type: "string", description: "Item ID or slug" },
			},
			required: ["collection", "id"],
		},
	},
	{
		name: "content_delete",
		description: "Move a content item to trash (soft delete). Can be restored.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug" },
				id: { type: "string", description: "Item ID or slug" },
			},
			required: ["collection", "id"],
		},
	},
	{
		name: "content_duplicate",
		description: "Duplicate a content item as a new draft.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug" },
				id: { type: "string", description: "Item ID or slug" },
			},
			required: ["collection", "id"],
		},
	},

	// ── Schema ────────────────────────────────────────────────────────────────
	{
		name: "schema_list_collections",
		description:
			"List all content collections (content types) on the site. Use this first to understand the site structure.",
		input_schema: {
			type: "object",
			properties: {},
		},
	},
	{
		name: "schema_get_collection",
		description:
			"Get the schema for a collection — all fields, their types, and validation rules. Use before creating content to know what fields are available.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug" },
			},
			required: ["collection"],
		},
	},
	{
		name: "schema_create_collection",
		description:
			"Create a new content collection (content type). Use when the user needs a new type of content that doesn't exist yet.",
		input_schema: {
			type: "object",
			properties: {
				slug: {
					type: "string",
					description: "Unique slug, lowercase letters/numbers/underscores only (e.g. 'services', 'team_members')",
				},
				label: { type: "string", description: "Human-readable plural label (e.g. 'Services')" },
				labelSingular: { type: "string", description: "Singular label (e.g. 'Service')" },
				description: { type: "string", description: "What this collection is for" },
				supports: {
					type: "array",
					items: {
						type: "string",
						enum: ["drafts", "revisions", "preview", "scheduling", "search", "seo"],
					},
					description: "Features to enable. For blog content use ['drafts','revisions','search','seo']",
				},
			},
			required: ["slug", "label"],
		},
	},
	{
		name: "schema_create_field",
		description:
			"Add a field to a collection. Field types: string (short text), text (long text), portableText (rich text), number, integer, boolean, datetime, image, reference (link to another collection), select, json.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug to add field to" },
				slug: { type: "string", description: "Field identifier, lowercase (e.g. 'title', 'body', 'featured_image')" },
				label: { type: "string", description: "Display label (e.g. 'Title', 'Body', 'Featured Image')" },
				type: {
					type: "string",
					enum: ["string", "text", "portableText", "number", "integer", "boolean", "datetime", "image", "reference", "select", "json"],
					description: "Field type",
				},
				required: { type: "boolean", description: "Whether the field is required" },
				searchable: { type: "boolean", description: "Include in full-text search" },
			},
			required: ["collection", "slug", "label", "type"],
		},
	},

	// ── Search ────────────────────────────────────────────────────────────────
	{
		name: "search",
		description: "Full-text search across all content. Returns matching items ranked by relevance.",
		input_schema: {
			type: "object",
			properties: {
				query: { type: "string", description: "Search query" },
				limit: { type: "number", description: "Max results (default 10)" },
			},
			required: ["query"],
		},
	},

	// ── Taxonomy ──────────────────────────────────────────────────────────────
	{
		name: "taxonomy_list",
		description: "List all taxonomies (categories, tags, etc.) defined on the site.",
		input_schema: {
			type: "object",
			properties: {},
		},
	},
	{
		name: "taxonomy_get",
		description: "Get a taxonomy and all its terms.",
		input_schema: {
			type: "object",
			properties: {
				taxonomy: { type: "string", description: "Taxonomy slug (e.g. 'category', 'tag')" },
			},
			required: ["taxonomy"],
		},
	},
	{
		name: "taxonomy_create_term",
		description: "Add a new term to a taxonomy (e.g. add 'Technology' to the 'category' taxonomy).",
		input_schema: {
			type: "object",
			properties: {
				taxonomy: { type: "string", description: "Taxonomy slug" },
				name: { type: "string", description: "Term name" },
				slug: { type: "string", description: "URL slug (auto-generated if omitted)" },
				description: { type: "string", description: "Term description" },
			},
			required: ["taxonomy", "name"],
		},
	},

	// ── Menu ─────────────────────────────────────────────────────────────────
	{
		name: "menu_get",
		description: "Get a navigation menu and its items.",
		input_schema: {
			type: "object",
			properties: {
				menu: { type: "string", description: "Menu slug (e.g. 'primary', 'footer')" },
			},
			required: ["menu"],
		},
	},
];
