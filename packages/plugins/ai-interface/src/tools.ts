/**
 * CMS tools in Anthropic tool_use format.
 *
 * Complete coverage of all CMS capabilities — content, schema, media,
 * search, taxonomy, menus, revisions, settings, redirects, comments,
 * and bylines.
 *
 * Claude calls these tools; the admin panel executes them via REST API.
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
			"List content items in a collection. Returns items with ID, title, slug, status. Use to browse existing posts, pages, or any content type.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug (e.g. 'posts', 'pages')" },
				status: {
					type: "string",
					enum: ["draft", "published", "scheduled"],
					description: "Filter by status. Omit to get all.",
				},
				limit: { type: "number", description: "Max items (default 50, max 100)" },
				locale: { type: "string", description: "Filter by locale (e.g. 'en', 'fr')" },
			},
			required: ["collection"],
		},
	},
	{
		name: "content_get",
		description: "Get a single content item by ID or slug. Returns all field values and a _rev token for updates.",
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
			"Create a new content item. The 'data' object contains field values matching the collection schema (use schema_get_collection to check). IMPORTANT: Items are draft by default and INVISIBLE on the website — always set status to 'published' or call content_publish after creation.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug (e.g. 'posts')" },
				data: {
					type: "object",
					description: "Field values as key-value pairs matching the collection schema (e.g. {title: '...', content: '...'})",
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
			"Update an existing content item. Only include fields you want to change in 'data'.",
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
		description: "Move a content item to trash (soft delete). Can be restored with content_restore.",
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
		name: "content_restore",
		description: "Restore a soft-deleted content item from the trash.",
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
		name: "content_permanent_delete",
		description: "Permanently delete a trashed item. Cannot be undone. Item must be in trash first.",
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
		description: "Create a copy of an existing content item as a new draft.",
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
		name: "content_schedule",
		description: "Schedule a content item for future publication. Use ISO 8601 datetime.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug" },
				id: { type: "string", description: "Item ID or slug" },
				scheduledAt: { type: "string", description: "ISO 8601 datetime (e.g. '2025-06-01T09:00:00Z')" },
			},
			required: ["collection", "id", "scheduledAt"],
		},
	},
	{
		name: "content_compare",
		description: "Compare the published (live) version with the current draft. Shows differences.",
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
		name: "content_discard_draft",
		description: "Discard unpublished draft changes and revert to the last published version.",
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
		name: "content_list_trashed",
		description: "List soft-deleted items in a collection's trash.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug" },
				limit: { type: "number", description: "Max items (default 50)" },
			},
			required: ["collection"],
		},
	},
	{
		name: "content_translations",
		description: "List all locale variants of a content item (translation group).",
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
		name: "content_set_terms",
		description: "Assign taxonomy terms (categories/tags) to a content item.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug" },
				id: { type: "string", description: "Item ID" },
				taxonomy: { type: "string", description: "Taxonomy name (e.g. 'category', 'tag')" },
				terms: { type: "array", items: { type: "string" }, description: "Array of term slugs to assign" },
			},
			required: ["collection", "id", "taxonomy", "terms"],
		},
	},

	// ── Schema ────────────────────────────────────────────────────────────────
	{
		name: "schema_list_collections",
		description: "List all content collections (content types). Use first to understand site structure.",
		input_schema: { type: "object", properties: {} },
	},
	{
		name: "schema_get_collection",
		description: "Get a collection's schema — all fields, types, and validation rules. Use before creating content.",
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
		description: "Create a new content collection (content type) with a database table.",
		input_schema: {
			type: "object",
			properties: {
				slug: { type: "string", description: "Unique slug, lowercase (e.g. 'services', 'team_members')" },
				label: { type: "string", description: "Plural label (e.g. 'Services')" },
				labelSingular: { type: "string", description: "Singular label (e.g. 'Service')" },
				description: { type: "string", description: "What this collection is for" },
				supports: {
					type: "array",
					items: { type: "string", enum: ["drafts", "revisions", "preview", "scheduling", "search"] },
					description: "Features to enable. Recommend ['drafts','revisions','search'] for blog content",
				},
			},
			required: ["slug", "label"],
		},
	},
	{
		name: "schema_create_field",
		description:
			"Add a field to a collection. Types: string, text, portableText (rich text), number, integer, boolean, datetime, image, file, reference, select, multiSelect, json, slug.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug" },
				slug: { type: "string", description: "Field identifier, lowercase (e.g. 'title', 'body')" },
				label: { type: "string", description: "Display label (e.g. 'Title', 'Body')" },
				type: {
					type: "string",
					enum: ["string", "text", "portableText", "number", "integer", "boolean", "datetime", "image", "file", "reference", "select", "multiSelect", "json", "slug"],
				},
				required: { type: "boolean", description: "Whether the field is required" },
				searchable: { type: "boolean", description: "Include in full-text search" },
			},
			required: ["collection", "slug", "label", "type"],
		},
	},
	{
		name: "schema_delete_collection",
		description: "Delete a collection and its database table. Irreversible — deletes all content.",
		input_schema: {
			type: "object",
			properties: {
				slug: { type: "string", description: "Collection slug to delete" },
				force: { type: "boolean", description: "Force deletion even if collection has content" },
			},
			required: ["slug"],
		},
	},
	{
		name: "schema_delete_field",
		description: "Remove a field from a collection. Drops the column and all data in it. Irreversible.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug" },
				fieldSlug: { type: "string", description: "Field slug to remove" },
			},
			required: ["collection", "fieldSlug"],
		},
	},

	// ── Media ─────────────────────────────────────────────────────────────────
	{
		name: "media_list",
		description: "List uploaded media files (images, documents). Returns filename, URL, dimensions, alt text.",
		input_schema: {
			type: "object",
			properties: {
				mimeType: { type: "string", description: "Filter by MIME prefix (e.g. 'image/', 'application/pdf')" },
				limit: { type: "number", description: "Max items (default 50)" },
			},
		},
	},
	{
		name: "media_get",
		description: "Get details of a single media file by ID.",
		input_schema: {
			type: "object",
			properties: {
				id: { type: "string", description: "Media item ID" },
			},
			required: ["id"],
		},
	},
	{
		name: "media_update",
		description: "Update media metadata (alt text, caption).",
		input_schema: {
			type: "object",
			properties: {
				id: { type: "string", description: "Media item ID" },
				alt: { type: "string", description: "Alt text for accessibility" },
				caption: { type: "string", description: "Caption text" },
			},
			required: ["id"],
		},
	},
	{
		name: "media_delete",
		description: "Permanently delete a media file from storage. Cannot be undone.",
		input_schema: {
			type: "object",
			properties: {
				id: { type: "string", description: "Media item ID" },
			},
			required: ["id"],
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
				limit: { type: "number", description: "Max results (default 20)" },
			},
			required: ["query"],
		},
	},

	// ── Taxonomy ──────────────────────────────────────────────────────────────
	{
		name: "taxonomy_list",
		description: "List all taxonomies (categories, tags, etc.) defined on the site.",
		input_schema: { type: "object", properties: {} },
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
		description: "Add a new term to a taxonomy (e.g. add 'Technology' to 'category').",
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
	{
		name: "taxonomy_update_term",
		description: "Update an existing taxonomy term.",
		input_schema: {
			type: "object",
			properties: {
				taxonomy: { type: "string", description: "Taxonomy slug" },
				termSlug: { type: "string", description: "Term slug to update" },
				name: { type: "string", description: "New name" },
				description: { type: "string", description: "New description" },
			},
			required: ["taxonomy", "termSlug"],
		},
	},
	{
		name: "taxonomy_delete_term",
		description: "Delete a taxonomy term.",
		input_schema: {
			type: "object",
			properties: {
				taxonomy: { type: "string", description: "Taxonomy slug" },
				termSlug: { type: "string", description: "Term slug to delete" },
			},
			required: ["taxonomy", "termSlug"],
		},
	},

	// ── Menus ─────────────────────────────────────────────────────────────────
	{
		name: "menu_list",
		description: "List all navigation menus on the site.",
		input_schema: { type: "object", properties: {} },
	},
	{
		name: "menu_get",
		description: "Get a menu and all its items (with nesting).",
		input_schema: {
			type: "object",
			properties: {
				menu: { type: "string", description: "Menu slug (e.g. 'primary', 'footer')" },
			},
			required: ["menu"],
		},
	},
	{
		name: "menu_create",
		description: "Create a new navigation menu.",
		input_schema: {
			type: "object",
			properties: {
				name: { type: "string", description: "Menu identifier slug (e.g. 'primary')" },
				label: { type: "string", description: "Display label (e.g. 'Primary Navigation')" },
			},
			required: ["name", "label"],
		},
	},
	{
		name: "menu_add_item",
		description: "Add an item to a navigation menu.",
		input_schema: {
			type: "object",
			properties: {
				menu: { type: "string", description: "Menu slug" },
				label: { type: "string", description: "Link label" },
				url: { type: "string", description: "URL or path (e.g. '/', '/about')" },
				parentId: { type: "string", description: "Parent item ID for nesting (optional)" },
			},
			required: ["menu", "label", "url"],
		},
	},
	{
		name: "menu_delete",
		description: "Delete a navigation menu and all its items.",
		input_schema: {
			type: "object",
			properties: {
				menu: { type: "string", description: "Menu slug" },
			},
			required: ["menu"],
		},
	},

	// ── Revisions ─────────────────────────────────────────────────────────────
	{
		name: "revision_list",
		description: "List revision history for a content item.",
		input_schema: {
			type: "object",
			properties: {
				collection: { type: "string", description: "Collection slug" },
				id: { type: "string", description: "Content item ID" },
			},
			required: ["collection", "id"],
		},
	},
	{
		name: "revision_restore",
		description: "Restore content to a previous revision.",
		input_schema: {
			type: "object",
			properties: {
				revisionId: { type: "string", description: "Revision ID to restore" },
			},
			required: ["revisionId"],
		},
	},

	// ── Settings ──────────────────────────────────────────────────────────────
	{
		name: "settings_get",
		description: "Get site settings (title, tagline, logo, etc.).",
		input_schema: { type: "object", properties: {} },
	},
	{
		name: "settings_update",
		description: "Update site settings. Only include fields you want to change.",
		input_schema: {
			type: "object",
			properties: {
				title: { type: "string", description: "Site title" },
				tagline: { type: "string", description: "Site tagline/description" },
				postsPerPage: { type: "number", description: "Posts per page for pagination" },
			},
		},
	},

	// ── Redirects ─────────────────────────────────────────────────────────────
	{
		name: "redirect_list",
		description: "List all URL redirects on the site.",
		input_schema: { type: "object", properties: {} },
	},
	{
		name: "redirect_create",
		description: "Create a URL redirect (e.g. /old-page → /new-page).",
		input_schema: {
			type: "object",
			properties: {
				source: { type: "string", description: "Source path (e.g. '/old-page')" },
				destination: { type: "string", description: "Destination path (e.g. '/new-page')" },
				type: { type: "number", enum: [301, 302, 307], description: "Redirect type (default 301)" },
				enabled: { type: "boolean", description: "Whether the redirect is active (default true)" },
			},
			required: ["source", "destination"],
		},
	},
	{
		name: "redirect_delete",
		description: "Delete a URL redirect.",
		input_schema: {
			type: "object",
			properties: {
				id: { type: "string", description: "Redirect ID" },
			},
			required: ["id"],
		},
	},

	// ── Comments ──────────────────────────────────────────────────────────────
	{
		name: "comment_list",
		description: "List comments with optional status filter (pending, approved, spam).",
		input_schema: {
			type: "object",
			properties: {
				status: { type: "string", enum: ["pending", "approved", "spam"], description: "Filter by status" },
				limit: { type: "number", description: "Max items" },
			},
		},
	},
	{
		name: "comment_moderate",
		description: "Moderate a comment — approve, mark as spam, or trash it.",
		input_schema: {
			type: "object",
			properties: {
				id: { type: "string", description: "Comment ID" },
				status: { type: "string", enum: ["approved", "spam", "trash"], description: "New status" },
			},
			required: ["id", "status"],
		},
	},

	// ── Bylines ───────────────────────────────────────────────────────────────
	{
		name: "byline_list",
		description: "List all author bylines (guest and user-linked).",
		input_schema: { type: "object", properties: {} },
	},
	{
		name: "byline_create",
		description: "Create a new author byline (for guest authors or attribution).",
		input_schema: {
			type: "object",
			properties: {
				slug: { type: "string", description: "Unique slug for the byline" },
				displayName: { type: "string", description: "Display name" },
				bio: { type: "string", description: "Author biography" },
				url: { type: "string", description: "Author website URL" },
			},
			required: ["slug", "displayName"],
		},
	},
];
