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
		description: "Add an item to a navigation menu. For custom links use type 'custom' with customUrl. For content references use type 'content' with referenceCollection and referenceId.",
		input_schema: {
			type: "object",
			properties: {
				menu: { type: "string", description: "Menu slug" },
				type: { type: "string", description: "Item type: 'custom' for URL links, 'content' for content references", enum: ["custom", "content"] },
				label: { type: "string", description: "Link label" },
				customUrl: { type: "string", description: "URL or path for custom links (e.g. '/', '/about')" },
				referenceCollection: { type: "string", description: "Collection slug for content links" },
				referenceId: { type: "string", description: "Content item ID for content links" },
				parentId: { type: "string", description: "Parent item ID for nesting (optional)" },
			},
			required: ["menu", "type", "label"],
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

	// ── Sections (reusable page blocks) ──────────────────────────────────────
	{
		name: "section_list",
		description: "List reusable page sections (hero blocks, feature grids, CTAs, etc.).",
		input_schema: {
			type: "object",
			properties: {
				source: { type: "string", enum: ["theme", "user", "import"], description: "Filter by source" },
				search: { type: "string", description: "Search by title or keywords" },
			},
		},
	},
	{
		name: "section_get",
		description: "Get a section's content by slug.",
		input_schema: {
			type: "object",
			properties: {
				slug: { type: "string", description: "Section slug" },
			},
			required: ["slug"],
		},
	},
	{
		name: "section_create",
		description: "Create a reusable page section (e.g. hero banner, feature grid, CTA block, testimonial carousel). Content uses Portable Text format — for simple text, use [{_key: 'k1', _type: 'block', style: 'normal', children: [{_key: 'c1', _type: 'span', text: 'Your text'}]}].",
		input_schema: {
			type: "object",
			properties: {
				slug: { type: "string", description: "Unique slug (e.g. 'hero-home', 'features-grid')" },
				title: { type: "string", description: "Section title (e.g. 'Homepage Hero')" },
				description: { type: "string", description: "What this section is for" },
				keywords: { type: "array", items: { type: "string" }, description: "Tags for searchability (e.g. ['hero', 'homepage'])" },
				content: { type: "array", description: "Portable Text blocks array", items: { type: "object", additionalProperties: true } },
			},
			required: ["slug", "title", "content"],
		},
	},
	{
		name: "section_update",
		description: "Update a section's content or metadata.",
		input_schema: {
			type: "object",
			properties: {
				slug: { type: "string", description: "Section slug to update" },
				title: { type: "string", description: "New title" },
				description: { type: "string", description: "New description" },
				content: { type: "array", description: "New Portable Text content", items: { type: "object", additionalProperties: true } },
			},
			required: ["slug"],
		},
	},
	{
		name: "section_delete",
		description: "Delete a user-created section. Cannot delete theme-provided sections.",
		input_schema: {
			type: "object",
			properties: {
				slug: { type: "string", description: "Section slug" },
			},
			required: ["slug"],
		},
	},

	// ── Widget Areas & Widgets ───────────────────────────────────────────────
	{
		name: "widget_area_list",
		description: "List all widget areas (sidebar, footer, etc.) with their widgets.",
		input_schema: { type: "object", properties: {} },
	},
	{
		name: "widget_area_create",
		description: "Create a new widget area for page layout (e.g. 'sidebar', 'footer', 'homepage-hero').",
		input_schema: {
			type: "object",
			properties: {
				name: { type: "string", description: "Unique identifier (e.g. 'sidebar', 'footer')" },
				label: { type: "string", description: "Display name (e.g. 'Sidebar', 'Footer Widgets')" },
				description: { type: "string", description: "Where this area appears on the site" },
			},
			required: ["name", "label"],
		},
	},
	{
		name: "widget_area_delete",
		description: "Delete a widget area and all its widgets.",
		input_schema: {
			type: "object",
			properties: {
				name: { type: "string", description: "Widget area name" },
			},
			required: ["name"],
		},
	},
	{
		name: "widget_add",
		description: "Add a widget to a widget area. Types: 'content' (rich text block), 'menu' (navigation menu), 'component' (built-in component like recent-posts).",
		input_schema: {
			type: "object",
			properties: {
				area: { type: "string", description: "Widget area name" },
				type: { type: "string", enum: ["content", "menu", "component"], description: "Widget type" },
				title: { type: "string", description: "Widget title" },
				content: { type: "array", description: "Portable Text content (for type 'content')", items: { type: "object", additionalProperties: true } },
				menuName: { type: "string", description: "Menu name to display (for type 'menu')" },
				componentId: { type: "string", description: "Component ID (for type 'component', e.g. 'core:recent-posts')" },
			},
			required: ["area", "type"],
		},
	},
	{
		name: "widget_delete",
		description: "Remove a widget from a widget area.",
		input_schema: {
			type: "object",
			properties: {
				area: { type: "string", description: "Widget area name" },
				widgetId: { type: "string", description: "Widget ID to remove" },
			},
			required: ["area", "widgetId"],
		},
	},

	// ── Site Blueprint (batch creation) ───────────────────────────────────────
	{
		name: "site_blueprint",
		description:
			"Create a complete website structure in ONE call. Creates all collections, fields, sample content, and navigation at once. Use this instead of calling schema_create_collection + schema_create_field + content_create individually. Much faster and more reliable.",
		input_schema: {
			type: "object",
			properties: {
				site_name: { type: "string", description: "Business/site name (e.g. 'ACME Corp')" },
				tagline: { type: "string", description: "One-line description (e.g. 'Building the future of tech')" },
				site_type: { type: "string", enum: ["business", "restaurant", "portfolio", "blog", "saas", "agency", "nonprofit", "ecommerce"], description: "Type of website to create" },
				services: {
					type: "array",
					description: "List of services/offerings. Each: { title, description, icon (emoji) }",
					items: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, icon: { type: "string" } }, required: ["title", "description"] },
				},
				team: {
					type: "array",
					description: "Team members. Each: { name, role, bio }",
					items: { type: "object", properties: { name: { type: "string" }, role: { type: "string" }, bio: { type: "string" } }, required: ["name", "role"] },
				},
				testimonials: {
					type: "array",
					description: "Client testimonials. Each: { quote, author_name, author_role, author_company }",
					items: { type: "object", properties: { quote: { type: "string" }, author_name: { type: "string" }, author_role: { type: "string" }, author_company: { type: "string" } }, required: ["quote", "author_name"] },
				},
				faqs: {
					type: "array",
					description: "FAQ items. Each: { question, answer }",
					items: { type: "object", properties: { question: { type: "string" }, answer: { type: "string" } }, required: ["question", "answer"] },
				},
				nav_links: {
					type: "array",
					description: "Navigation links. Each: { label, url }",
					items: { type: "object", properties: { label: { type: "string" }, url: { type: "string" } }, required: ["label", "url"] },
				},
			},
			required: ["site_name", "site_type"],
		},
	},

	// ── Image Generation (MiniMax image-01) ──────────────────────────────────
	{
		name: "image_generate",
		description:
			"Generate a professional image using AI (MiniMax image-01). Use for hero banners, team photos, product images, backgrounds, icons. The image is uploaded to the CMS media library and returns a media ID you can use in content_create (featured_image field). Write detailed prompts for best results.",
		input_schema: {
			type: "object",
			properties: {
				prompt: { type: "string", description: "Detailed image description. Be specific about: subject, lighting, mood, composition, style (e.g. 'Professional headshot of a smiling woman in a modern office, natural lighting, clean background, corporate style')" },
				aspect_ratio: { type: "string", enum: ["16:9", "4:3", "3:2", "1:1", "3:4", "2:3", "9:16"], description: "Image aspect ratio. Use 16:9 for hero banners, 1:1 for avatars/team, 4:3 for cards (default: 16:9)" },
			},
			required: ["prompt"],
		},
	},

	// ── Web Browsing ──────────────────────────────────────────────────────────
	{
		name: "web_browse",
		description:
			"Fetch and read a web page. Use to understand a user's existing website, get inspiration from competitors, or verify that published content is live. Returns the page title, meta description, and text content.",
		input_schema: {
			type: "object",
			properties: {
				url: { type: "string", description: "Full URL to fetch (e.g. 'https://example.com')" },
			},
			required: ["url"],
		},
	},

	// ── Site Deployment ───────────────────────────────────────────────────────
	{
		name: "site_get_config",
		description: "Get the current site configuration (theme, sections, hero, nav, footer, SEO).",
		input_schema: { type: "object", properties: {} },
	},
	{
		name: "site_set_config",
		description: "Update site configuration. Merge-updates: only include fields you want to change. Controls theme colors, fonts, which sections are shown, hero style, nav, footer, SEO.",
		input_schema: {
			type: "object",
			properties: {
				site: { type: "object", description: "{ name, tagline, locale }", additionalProperties: true },
				theme: { type: "object", description: "{ primary, secondary, accent, background, font: { heading, body }, darkMode }", additionalProperties: true },
				hero: { type: "object", description: "{ style, ctaText, ctaUrl, gradient: { from, via, to } }", additionalProperties: true },
				sections: { type: "object", description: "{ hero: true, services: true, team: false, ... }", additionalProperties: true },
				nav: { type: "object", description: "{ style: 'solid'|'transparent', menuName }", additionalProperties: true },
				footer: { type: "object", description: "{ showWidgets, copyright, showPoweredBy }", additionalProperties: true },
				seo: { type: "object", description: "{ titleTemplate, defaultDescription }", additionalProperties: true },
			},
		},
	},
	{
		name: "site_deploy",
		description: "Deploy the website to Cloudflare Pages. Creates a Pages project and makes the site live at {name}.pages.dev.",
		input_schema: { type: "object", properties: {} },
	},
	{
		name: "site_status",
		description: "Get the current deployment status (deploying, ready, error, not_deployed).",
		input_schema: { type: "object", properties: {} },
	},
	{
		name: "site_set_domain",
		description: "Configure a custom domain for the deployed site.",
		input_schema: {
			type: "object",
			properties: {
				domain: { type: "string", description: "Custom domain (e.g. 'mysite.com')" },
			},
			required: ["domain"],
		},
	},
];
