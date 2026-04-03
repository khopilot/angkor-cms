globalThis.process ??= {};
globalThis.process.env ??= {};
import { s as string, o as object, n as number, d as _enum, c as array, f as boolean, l as literal, r as record, S as custom, t as unknown, T as defineMiddleware, V as sequence } from "./chunks/sequence_DzjOVBrG.mjs";
import { _ as __exportAll, l as currentTimestamp, m as listTablesLike, n as isSqlite, v as validateIdentifier, o as currentTimestampValue, q as binaryType, P as PluginRouteError, r as definePlugin, s as runWithContext, t as setI18nConfig, g as getRequestContext, S as SchemaRegistry, u as createHookPipeline, F as FTSManager, O as OptionsRepository, E as EmailPipeline, w as CronExecutor, c as getDb, x as PluginStateRepository, y as loadBundleFromR2, z as normalizeManifestRoute, A as resolveExclusiveHooks, h as hashString, D as handleContentList, G as handleContentGet, H as handleContentGetIncludingTrashed, I as handleContentCreate, J as validateRev, R as RevisionRepository, K as handleContentUpdate, L as handleContentDelete, N as handleContentListTrashed, Q as handleContentRestore, T as handleContentPermanentDelete, U as handleContentCountTrashed, V as handleContentDuplicate, W as handleContentPublish, X as handleContentUnpublish, Y as handleContentSchedule, Z as handleContentUnschedule, $ as handleContentCountScheduled, a0 as handleContentDiscardDraft, a1 as handleContentCompare, a2 as handleContentTranslations, a3 as handleMediaList, a4 as handleMediaGet, a5 as handleMediaCreate, a6 as handleMediaUpdate, a7 as handleMediaDelete, a8 as handleRevisionList, a9 as handleRevisionGet, aa as handleRevisionRestore, ab as PluginRouteRegistry, ac as sanitizeHeadersForSandbox, ad as extractRequestMeta, M as MediaRepository, ae as RedirectRepository } from "./chunks/adapt-sandbox-entry_DgOh8so3.mjs";
import { K as Kysely } from "./chunks/kysely_0Asa_Yyn.mjs";
import { s as sql } from "./chunks/sql_DV5B95Nm.mjs";
import { M as Migrator } from "./chunks/migrator_Bpgoz8AJ.mjs";
import virtualConfig from "./chunks/config_CG7YeZVr.mjs";
import { isSessionEnabled, getD1Binding, createSessionDialect, getDefaultConstraint, getBookmarkCookieName, createDialect } from "./chunks/dialect_BKY1UUaD.mjs";
import { mediaProviders } from "./chunks/media-providers_CElbx6_p.mjs";
import "./chunks/index_lite_CWDp5SAU.mjs";
import "./chunks/index_DFnuKuIX.mjs";
import { u as ulid } from "./chunks/index_BQQDygAS.mjs";
import { env, exports as _exports } from "cloudflare:workers";
import { c as createKyselyAdapter } from "./chunks/kysely_onwAyh6v.mjs";
import "./chunks/index_CaKMUQvQ.mjs";
import { i as hasScope, h as hashPrefixedToken } from "./chunks/authenticate-j5GayLXB_DHkbhwdZ.mjs";
var _001_initial_exports = /* @__PURE__ */ __exportAll({
  down: () => down$30,
  up: () => up$30
});
async function up$30(db) {
  await db.schema.createTable("revisions").ifNotExists().addColumn("id", "text", (col) => col.primaryKey()).addColumn("collection", "text", (col) => col.notNull()).addColumn("entry_id", "text", (col) => col.notNull()).addColumn("data", "text", (col) => col.notNull()).addColumn("author_id", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.schema.createIndex("idx_revisions_entry").ifNotExists().on("revisions").columns(["collection", "entry_id"]).execute();
  await db.schema.createTable("taxonomies").ifNotExists().addColumn("id", "text", (col) => col.primaryKey()).addColumn("name", "text", (col) => col.notNull()).addColumn("slug", "text", (col) => col.notNull()).addColumn("label", "text", (col) => col.notNull()).addColumn("parent_id", "text").addColumn("data", "text").addUniqueConstraint("taxonomies_name_slug_unique", ["name", "slug"]).addForeignKeyConstraint("taxonomies_parent_fk", ["parent_id"], "taxonomies", ["id"], (cb) => cb.onDelete("set null")).execute();
  await db.schema.createIndex("idx_taxonomies_name").ifNotExists().on("taxonomies").column("name").execute();
  await db.schema.createTable("content_taxonomies").ifNotExists().addColumn("collection", "text", (col) => col.notNull()).addColumn("entry_id", "text", (col) => col.notNull()).addColumn("taxonomy_id", "text", (col) => col.notNull()).addPrimaryKeyConstraint("content_taxonomies_pk", [
    "collection",
    "entry_id",
    "taxonomy_id"
  ]).addForeignKeyConstraint("content_taxonomies_taxonomy_fk", ["taxonomy_id"], "taxonomies", ["id"], (cb) => cb.onDelete("cascade")).execute();
  await db.schema.createTable("media").ifNotExists().addColumn("id", "text", (col) => col.primaryKey()).addColumn("filename", "text", (col) => col.notNull()).addColumn("mime_type", "text", (col) => col.notNull()).addColumn("size", "integer").addColumn("width", "integer").addColumn("height", "integer").addColumn("alt", "text").addColumn("caption", "text").addColumn("storage_key", "text", (col) => col.notNull()).addColumn("content_hash", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("author_id", "text").execute();
  await db.schema.createIndex("idx_media_content_hash").ifNotExists().on("media").column("content_hash").execute();
  await db.schema.createTable("users").ifNotExists().addColumn("id", "text", (col) => col.primaryKey()).addColumn("email", "text", (col) => col.notNull().unique()).addColumn("password_hash", "text", (col) => col.notNull()).addColumn("name", "text").addColumn("role", "text", (col) => col.defaultTo("subscriber")).addColumn("avatar_id", "text").addColumn("data", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.schema.createIndex("idx_users_email").ifNotExists().on("users").column("email").execute();
  await db.schema.createTable("options").ifNotExists().addColumn("name", "text", (col) => col.primaryKey()).addColumn("value", "text", (col) => col.notNull()).execute();
  await db.schema.createTable("audit_logs").ifNotExists().addColumn("id", "text", (col) => col.primaryKey()).addColumn("timestamp", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("actor_id", "text").addColumn("actor_ip", "text").addColumn("action", "text", (col) => col.notNull()).addColumn("resource_type", "text").addColumn("resource_id", "text").addColumn("details", "text").addColumn("status", "text").execute();
  await db.schema.createIndex("idx_audit_actor").ifNotExists().on("audit_logs").column("actor_id").execute();
  await db.schema.createIndex("idx_audit_action").ifNotExists().on("audit_logs").column("action").execute();
  await db.schema.createIndex("idx_audit_timestamp").ifNotExists().on("audit_logs").column("timestamp").execute();
}
async function down$30(db) {
  await db.schema.dropTable("audit_logs").execute();
  await db.schema.dropTable("options").execute();
  await db.schema.dropTable("users").execute();
  await db.schema.dropTable("media").execute();
  await db.schema.dropTable("content_taxonomies").execute();
  await db.schema.dropTable("taxonomies").execute();
  await db.schema.dropTable("revisions").execute();
}
var _002_media_status_exports = /* @__PURE__ */ __exportAll({
  down: () => down$29,
  up: () => up$29
});
async function up$29(db) {
  await db.schema.alterTable("media").addColumn("status", "text", (col) => col.notNull().defaultTo("ready")).execute();
  await db.schema.createIndex("idx_media_status").on("media").column("status").execute();
}
async function down$29(db) {
  await db.schema.dropIndex("idx_media_status").execute();
}
var _003_schema_registry_exports = /* @__PURE__ */ __exportAll({
  down: () => down$28,
  up: () => up$28
});
async function up$28(db) {
  await db.schema.createTable("_emdash_collections").addColumn("id", "text", (col) => col.primaryKey()).addColumn("slug", "text", (col) => col.notNull().unique()).addColumn("label", "text", (col) => col.notNull()).addColumn("label_singular", "text").addColumn("description", "text").addColumn("icon", "text").addColumn("supports", "text").addColumn("source", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.schema.createTable("_emdash_fields").addColumn("id", "text", (col) => col.primaryKey()).addColumn("collection_id", "text", (col) => col.notNull()).addColumn("slug", "text", (col) => col.notNull()).addColumn("label", "text", (col) => col.notNull()).addColumn("type", "text", (col) => col.notNull()).addColumn("column_type", "text", (col) => col.notNull()).addColumn("required", "integer", (col) => col.defaultTo(0)).addColumn("unique", "integer", (col) => col.defaultTo(0)).addColumn("default_value", "text").addColumn("validation", "text").addColumn("widget", "text").addColumn("options", "text").addColumn("sort_order", "integer", (col) => col.defaultTo(0)).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addForeignKeyConstraint("fields_collection_fk", ["collection_id"], "_emdash_collections", ["id"], (cb) => cb.onDelete("cascade")).execute();
  await db.schema.createIndex("idx_fields_collection_slug").on("_emdash_fields").columns(["collection_id", "slug"]).unique().execute();
  await db.schema.createIndex("idx_fields_collection").on("_emdash_fields").column("collection_id").execute();
  await db.schema.createIndex("idx_fields_sort").on("_emdash_fields").columns(["collection_id", "sort_order"]).execute();
}
async function down$28(db) {
  await db.schema.dropTable("_emdash_fields").execute();
  await db.schema.dropTable("_emdash_collections").execute();
}
var _004_plugins_exports = /* @__PURE__ */ __exportAll({
  down: () => down$27,
  up: () => up$27
});
async function up$27(db) {
  await db.schema.createTable("_plugin_storage").addColumn("plugin_id", "text", (col) => col.notNull()).addColumn("collection", "text", (col) => col.notNull()).addColumn("id", "text", (col) => col.notNull()).addColumn("data", "text", (col) => col.notNull()).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addPrimaryKeyConstraint("pk_plugin_storage", [
    "plugin_id",
    "collection",
    "id"
  ]).execute();
  await db.schema.createIndex("idx_plugin_storage_list").on("_plugin_storage").columns([
    "plugin_id",
    "collection",
    "created_at"
  ]).execute();
  await db.schema.createTable("_plugin_state").addColumn("plugin_id", "text", (col) => col.primaryKey()).addColumn("version", "text", (col) => col.notNull()).addColumn("status", "text", (col) => col.notNull().defaultTo("installed")).addColumn("installed_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("activated_at", "text").addColumn("deactivated_at", "text").addColumn("data", "text").execute();
  await db.schema.createTable("_plugin_indexes").addColumn("plugin_id", "text", (col) => col.notNull()).addColumn("collection", "text", (col) => col.notNull()).addColumn("index_name", "text", (col) => col.notNull()).addColumn("fields", "text", (col) => col.notNull()).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addPrimaryKeyConstraint("pk_plugin_indexes", [
    "plugin_id",
    "collection",
    "index_name"
  ]).execute();
}
async function down$27(db) {
  await db.schema.dropTable("_plugin_indexes").execute();
  await db.schema.dropTable("_plugin_state").execute();
  await db.schema.dropTable("_plugin_storage").execute();
}
var _005_menus_exports = /* @__PURE__ */ __exportAll({
  down: () => down$26,
  up: () => up$26
});
async function up$26(db) {
  await db.schema.createTable("_emdash_menus").addColumn("id", "text", (col) => col.primaryKey()).addColumn("name", "text", (col) => col.notNull().unique()).addColumn("label", "text", (col) => col.notNull()).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.schema.createTable("_emdash_menu_items").addColumn("id", "text", (col) => col.primaryKey()).addColumn("menu_id", "text", (col) => col.notNull()).addColumn("parent_id", "text").addColumn("sort_order", "integer", (col) => col.notNull().defaultTo(0)).addColumn("type", "text", (col) => col.notNull()).addColumn("reference_collection", "text").addColumn("reference_id", "text").addColumn("custom_url", "text").addColumn("label", "text", (col) => col.notNull()).addColumn("title_attr", "text").addColumn("target", "text").addColumn("css_classes", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addForeignKeyConstraint("menu_items_menu_fk", ["menu_id"], "_emdash_menus", ["id"], (cb) => cb.onDelete("cascade")).addForeignKeyConstraint("menu_items_parent_fk", ["parent_id"], "_emdash_menu_items", ["id"], (cb) => cb.onDelete("cascade")).execute();
  await db.schema.createIndex("idx_menu_items_menu").on("_emdash_menu_items").columns(["menu_id", "sort_order"]).execute();
  await db.schema.createIndex("idx_menu_items_parent").on("_emdash_menu_items").column("parent_id").execute();
}
async function down$26(db) {
  await db.schema.dropTable("_emdash_menu_items").execute();
  await db.schema.dropTable("_emdash_menus").execute();
}
var _006_taxonomy_defs_exports = /* @__PURE__ */ __exportAll({
  down: () => down$25,
  up: () => up$25
});
async function up$25(db) {
  await db.schema.createTable("_emdash_taxonomy_defs").addColumn("id", "text", (col) => col.primaryKey()).addColumn("name", "text", (col) => col.notNull().unique()).addColumn("label", "text", (col) => col.notNull()).addColumn("label_singular", "text").addColumn("hierarchical", "integer", (col) => col.defaultTo(0)).addColumn("collections", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.insertInto("_emdash_taxonomy_defs").values([{
    id: "taxdef_category",
    name: "category",
    label: "Categories",
    label_singular: "Category",
    hierarchical: 1,
    collections: JSON.stringify(["posts"])
  }, {
    id: "taxdef_tag",
    name: "tag",
    label: "Tags",
    label_singular: "Tag",
    hierarchical: 0,
    collections: JSON.stringify(["posts"])
  }]).execute();
}
async function down$25(db) {
  await db.schema.dropTable("_emdash_taxonomy_defs").execute();
}
var _007_widgets_exports = /* @__PURE__ */ __exportAll({
  down: () => down$24,
  up: () => up$24
});
async function up$24(db) {
  await db.schema.createTable("_emdash_widget_areas").addColumn("id", "text", (col) => col.primaryKey()).addColumn("name", "text", (col) => col.notNull().unique()).addColumn("label", "text", (col) => col.notNull()).addColumn("description", "text").addColumn("created_at", "text", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)).execute();
  await db.schema.createTable("_emdash_widgets").addColumn("id", "text", (col) => col.primaryKey()).addColumn("area_id", "text", (col) => col.notNull().references("_emdash_widget_areas.id").onDelete("cascade")).addColumn("sort_order", "integer", (col) => col.notNull().defaultTo(0)).addColumn("type", "text", (col) => col.notNull()).addColumn("title", "text").addColumn("content", "text").addColumn("menu_name", "text").addColumn("component_id", "text").addColumn("component_props", "text").addColumn("created_at", "text", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)).execute();
  await db.schema.createIndex("idx_widgets_area").on("_emdash_widgets").columns(["area_id", "sort_order"]).execute();
}
async function down$24(db) {
  await db.schema.dropTable("_emdash_widgets").execute();
  await db.schema.dropTable("_emdash_widget_areas").execute();
}
var _008_auth_exports = /* @__PURE__ */ __exportAll({
  down: () => down$23,
  up: () => up$23
});
async function up$23(db) {
  await db.schema.createTable("users_new").addColumn("id", "text", (col) => col.primaryKey()).addColumn("email", "text", (col) => col.notNull().unique()).addColumn("name", "text").addColumn("avatar_url", "text").addColumn("role", "integer", (col) => col.notNull().defaultTo(10)).addColumn("email_verified", "integer", (col) => col.notNull().defaultTo(0)).addColumn("data", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await sql`
		INSERT INTO users_new (id, email, name, role, data, created_at, updated_at)
		SELECT
			id,
			email,
			name,
			CASE role
				WHEN 'admin' THEN 50
				WHEN 'editor' THEN 40
				WHEN 'author' THEN 30
				WHEN 'contributor' THEN 20
				ELSE 10
			END,
			data,
			created_at,
			${currentTimestampValue(db)}
		FROM users
	`.execute(db);
  await db.schema.dropTable("users").execute();
  await sql`ALTER TABLE users_new RENAME TO users`.execute(db);
  await db.schema.createIndex("idx_users_email").on("users").column("email").execute();
  await db.schema.createTable("credentials").addColumn("id", "text", (col) => col.primaryKey()).addColumn("user_id", "text", (col) => col.notNull()).addColumn("public_key", binaryType(db), (col) => col.notNull()).addColumn("counter", "integer", (col) => col.notNull().defaultTo(0)).addColumn("device_type", "text", (col) => col.notNull()).addColumn("backed_up", "integer", (col) => col.notNull().defaultTo(0)).addColumn("transports", "text").addColumn("name", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("last_used_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addForeignKeyConstraint("credentials_user_fk", ["user_id"], "users", ["id"], (cb) => cb.onDelete("cascade")).execute();
  await db.schema.createIndex("idx_credentials_user").on("credentials").column("user_id").execute();
  await db.schema.createTable("auth_tokens").addColumn("hash", "text", (col) => col.primaryKey()).addColumn("user_id", "text").addColumn("email", "text").addColumn("type", "text", (col) => col.notNull()).addColumn("role", "integer").addColumn("invited_by", "text").addColumn("expires_at", "text", (col) => col.notNull()).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addForeignKeyConstraint("auth_tokens_user_fk", ["user_id"], "users", ["id"], (cb) => cb.onDelete("cascade")).addForeignKeyConstraint("auth_tokens_invited_by_fk", ["invited_by"], "users", ["id"], (cb) => cb.onDelete("set null")).execute();
  await db.schema.createIndex("idx_auth_tokens_email").on("auth_tokens").column("email").execute();
  await db.schema.createTable("oauth_accounts").addColumn("provider", "text", (col) => col.notNull()).addColumn("provider_account_id", "text", (col) => col.notNull()).addColumn("user_id", "text", (col) => col.notNull()).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addPrimaryKeyConstraint("oauth_accounts_pk", ["provider", "provider_account_id"]).addForeignKeyConstraint("oauth_accounts_user_fk", ["user_id"], "users", ["id"], (cb) => cb.onDelete("cascade")).execute();
  await db.schema.createIndex("idx_oauth_accounts_user").on("oauth_accounts").column("user_id").execute();
  await db.schema.createTable("allowed_domains").addColumn("domain", "text", (col) => col.primaryKey()).addColumn("default_role", "integer", (col) => col.notNull().defaultTo(20)).addColumn("enabled", "integer", (col) => col.notNull().defaultTo(1)).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.schema.createTable("auth_challenges").addColumn("challenge", "text", (col) => col.primaryKey()).addColumn("type", "text", (col) => col.notNull()).addColumn("user_id", "text").addColumn("data", "text").addColumn("expires_at", "text", (col) => col.notNull()).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.schema.createIndex("idx_auth_challenges_expires").on("auth_challenges").column("expires_at").execute();
}
async function down$23(db) {
  await db.schema.dropTable("auth_challenges").execute();
  await db.schema.dropTable("allowed_domains").execute();
  await db.schema.dropTable("oauth_accounts").execute();
  await db.schema.dropTable("auth_tokens").execute();
  await db.schema.dropTable("credentials").execute();
  await db.schema.createTable("users_old").addColumn("id", "text", (col) => col.primaryKey()).addColumn("email", "text", (col) => col.notNull().unique()).addColumn("password_hash", "text", (col) => col.notNull()).addColumn("name", "text").addColumn("role", "text", (col) => col.defaultTo("subscriber")).addColumn("avatar_id", "text").addColumn("data", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await sql`
		INSERT INTO users_old (id, email, password_hash, name, role, data, created_at)
		SELECT
			id,
			email,
			'', -- No way to restore password
			name,
			CASE role
				WHEN 50 THEN 'admin'
				WHEN 40 THEN 'editor'
				WHEN 30 THEN 'author'
				WHEN 20 THEN 'contributor'
				ELSE 'subscriber'
			END,
			data,
			created_at
		FROM users
	`.execute(db);
  await db.schema.dropTable("users").execute();
  await sql`ALTER TABLE users_old RENAME TO users`.execute(db);
  await db.schema.createIndex("idx_users_email").on("users").column("email").execute();
}
var _009_user_disabled_exports = /* @__PURE__ */ __exportAll({
  down: () => down$22,
  up: () => up$22
});
async function up$22(db) {
  await sql`ALTER TABLE users ADD COLUMN disabled INTEGER NOT NULL DEFAULT 0`.execute(db);
  await db.schema.createIndex("idx_users_disabled").on("users").column("disabled").execute();
}
async function down$22(db) {
  await db.schema.dropIndex("idx_users_disabled").execute();
}
var _011_sections_exports = /* @__PURE__ */ __exportAll({
  down: () => down$21,
  up: () => up$21
});
async function up$21(db) {
  await db.schema.createTable("_emdash_section_categories").addColumn("id", "text", (col) => col.primaryKey()).addColumn("slug", "text", (col) => col.notNull().unique()).addColumn("label", "text", (col) => col.notNull()).addColumn("sort_order", "integer", (col) => col.defaultTo(0)).addColumn("created_at", "text", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)).execute();
  await db.schema.createTable("_emdash_sections").addColumn("id", "text", (col) => col.primaryKey()).addColumn("slug", "text", (col) => col.notNull().unique()).addColumn("title", "text", (col) => col.notNull()).addColumn("description", "text").addColumn("category_id", "text", (col) => col.references("_emdash_section_categories.id").onDelete("set null")).addColumn("keywords", "text").addColumn("content", "text", (col) => col.notNull()).addColumn("preview_media_id", "text").addColumn("source", "text", (col) => col.notNull().defaultTo("user")).addColumn("theme_id", "text").addColumn("created_at", "text", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)).addColumn("updated_at", "text", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)).execute();
  await db.schema.createIndex("idx_sections_category").on("_emdash_sections").columns(["category_id"]).execute();
  await db.schema.createIndex("idx_sections_source").on("_emdash_sections").columns(["source"]).execute();
}
async function down$21(db) {
  await db.schema.dropIndex("idx_content_taxonomies_term").execute();
  await db.schema.dropIndex("idx_media_mime_type").execute();
  await db.schema.dropTable("_emdash_sections").execute();
  await db.schema.dropTable("_emdash_section_categories").execute();
}
var _012_search_exports = /* @__PURE__ */ __exportAll({
  down: () => down$20,
  up: () => up$20
});
async function up$20(db) {
  await db.schema.alterTable("_emdash_collections").addColumn("search_config", "text").execute();
  await db.schema.alterTable("_emdash_fields").addColumn("searchable", "integer", (col) => col.defaultTo(0)).execute();
}
async function down$20(db) {
  await db.schema.alterTable("_emdash_fields").dropColumn("searchable").execute();
  await db.schema.alterTable("_emdash_collections").dropColumn("search_config").execute();
}
var _013_scheduled_publishing_exports = /* @__PURE__ */ __exportAll({
  down: () => down$19,
  up: () => up$19
});
async function up$19(db) {
  const tableNames = await listTablesLike(db, "ec_%");
  for (const tableName of tableNames) {
    const table = { name: tableName };
    await sql`
			ALTER TABLE ${sql.ref(table.name)} 
			ADD COLUMN scheduled_at TEXT
		`.execute(db);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${table.name}_scheduled`)} 
			ON ${sql.ref(table.name)} (scheduled_at)
			WHERE scheduled_at IS NOT NULL AND status = 'scheduled'
		`.execute(db);
  }
}
async function down$19(db) {
  const tableNames = await listTablesLike(db, "ec_%");
  for (const tableName of tableNames) {
    const table = { name: tableName };
    await sql`
			DROP INDEX IF EXISTS ${sql.ref(`idx_${table.name}_scheduled`)}
		`.execute(db);
    await sql`
			ALTER TABLE ${sql.ref(table.name)} 
			DROP COLUMN scheduled_at
		`.execute(db);
  }
}
var _014_draft_revisions_exports = /* @__PURE__ */ __exportAll({
  down: () => down$18,
  up: () => up$18
});
async function up$18(db) {
  const tables = await db.selectFrom("_emdash_collections").select("slug").execute();
  for (const row of tables) {
    const tableName = `ec_${row.slug}`;
    await sql`
			ALTER TABLE ${sql.ref(tableName)}
			ADD COLUMN live_revision_id TEXT REFERENCES revisions(id)
		`.execute(db);
    await sql`
			ALTER TABLE ${sql.ref(tableName)}
			ADD COLUMN draft_revision_id TEXT REFERENCES revisions(id)
		`.execute(db);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${row.slug}_live_revision`)}
			ON ${sql.ref(tableName)} (live_revision_id)
		`.execute(db);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${row.slug}_draft_revision`)}
			ON ${sql.ref(tableName)} (draft_revision_id)
		`.execute(db);
  }
}
async function down$18(db) {
  const tables = await db.selectFrom("_emdash_collections").select("slug").execute();
  for (const row of tables) {
    const tableName = `ec_${row.slug}`;
    await sql`
			DROP INDEX IF EXISTS ${sql.ref(`idx_${row.slug}_draft_revision`)}
		`.execute(db);
    await sql`
			DROP INDEX IF EXISTS ${sql.ref(`idx_${row.slug}_live_revision`)}
		`.execute(db);
    await sql`
			ALTER TABLE ${sql.ref(tableName)}
			DROP COLUMN draft_revision_id
		`.execute(db);
    await sql`
			ALTER TABLE ${sql.ref(tableName)}
			DROP COLUMN live_revision_id
		`.execute(db);
  }
}
var _015_indexes_exports = /* @__PURE__ */ __exportAll({
  down: () => down$17,
  up: () => up$17
});
async function up$17(db) {
  await db.schema.createIndex("idx_media_mime_type").on("media").column("mime_type").execute();
  await db.schema.createIndex("idx_media_filename").on("media").column("filename").execute();
  await db.schema.createIndex("idx_media_created_at").on("media").column("created_at").execute();
  await db.schema.createIndex("idx_content_taxonomies_term").on("content_taxonomies").column("taxonomy_id").execute();
  await db.schema.createIndex("idx_taxonomies_parent").on("taxonomies").column("parent_id").execute();
  await db.schema.createIndex("idx_audit_resource").on("audit_logs").columns(["resource_type", "resource_id"]).execute();
  const tableNames = await listTablesLike(db, "ec_%");
  for (const tableName of tableNames) {
    const table = { name: tableName };
    await sql`
			CREATE INDEX ${sql.ref(`idx_${table.name}_author`)} 
			ON ${sql.ref(table.name)} (author_id)
		`.execute(db);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${table.name}_updated`)} 
			ON ${sql.ref(table.name)} (updated_at)
		`.execute(db);
  }
}
async function down$17(db) {
  const tableNames = await listTablesLike(db, "ec_%");
  for (const tableName of tableNames) {
    const table = { name: tableName };
    await sql`DROP INDEX IF EXISTS ${sql.ref(`idx_${table.name}_updated`)}`.execute(db);
    await sql`DROP INDEX IF EXISTS ${sql.ref(`idx_${table.name}_author`)}`.execute(db);
  }
  await db.schema.dropIndex("idx_audit_resource").execute();
  await db.schema.dropIndex("idx_taxonomies_parent").execute();
  await db.schema.dropIndex("idx_content_taxonomies_term").execute();
  await db.schema.dropIndex("idx_media_created_at").execute();
  await db.schema.dropIndex("idx_media_filename").execute();
  await db.schema.dropIndex("idx_media_mime_type").execute();
}
var _016_api_tokens_exports = /* @__PURE__ */ __exportAll({
  down: () => down$16,
  up: () => up$16
});
async function up$16(db) {
  await db.schema.createTable("_emdash_api_tokens").addColumn("id", "text", (col) => col.primaryKey()).addColumn("name", "text", (col) => col.notNull()).addColumn("token_hash", "text", (col) => col.notNull().unique()).addColumn("prefix", "text", (col) => col.notNull()).addColumn("user_id", "text", (col) => col.notNull()).addColumn("scopes", "text", (col) => col.notNull()).addColumn("expires_at", "text").addColumn("last_used_at", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addForeignKeyConstraint("api_tokens_user_fk", ["user_id"], "users", ["id"], (cb) => cb.onDelete("cascade")).execute();
  await db.schema.createIndex("idx_api_tokens_token_hash").on("_emdash_api_tokens").column("token_hash").execute();
  await db.schema.createIndex("idx_api_tokens_user_id").on("_emdash_api_tokens").column("user_id").execute();
  await db.schema.createTable("_emdash_oauth_tokens").addColumn("token_hash", "text", (col) => col.primaryKey()).addColumn("token_type", "text", (col) => col.notNull()).addColumn("user_id", "text", (col) => col.notNull()).addColumn("scopes", "text", (col) => col.notNull()).addColumn("client_type", "text", (col) => col.notNull().defaultTo("cli")).addColumn("expires_at", "text", (col) => col.notNull()).addColumn("refresh_token_hash", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addForeignKeyConstraint("oauth_tokens_user_fk", ["user_id"], "users", ["id"], (cb) => cb.onDelete("cascade")).execute();
  await db.schema.createIndex("idx_oauth_tokens_user_id").on("_emdash_oauth_tokens").column("user_id").execute();
  await db.schema.createIndex("idx_oauth_tokens_expires").on("_emdash_oauth_tokens").column("expires_at").execute();
  await db.schema.createTable("_emdash_device_codes").addColumn("device_code", "text", (col) => col.primaryKey()).addColumn("user_code", "text", (col) => col.notNull().unique()).addColumn("scopes", "text", (col) => col.notNull()).addColumn("user_id", "text").addColumn("status", "text", (col) => col.notNull().defaultTo("pending")).addColumn("expires_at", "text", (col) => col.notNull()).addColumn("interval", "integer", (col) => col.notNull().defaultTo(5)).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
}
async function down$16(db) {
  await db.schema.dropTable("_emdash_device_codes").execute();
  await db.schema.dropTable("_emdash_oauth_tokens").execute();
  await db.schema.dropTable("_emdash_api_tokens").execute();
}
var _017_authorization_codes_exports = /* @__PURE__ */ __exportAll({
  down: () => down$15,
  up: () => up$15
});
async function up$15(db) {
  await db.schema.createTable("_emdash_authorization_codes").addColumn("code_hash", "text", (col) => col.primaryKey()).addColumn("client_id", "text", (col) => col.notNull()).addColumn("redirect_uri", "text", (col) => col.notNull()).addColumn("user_id", "text", (col) => col.notNull()).addColumn("scopes", "text", (col) => col.notNull()).addColumn("code_challenge", "text", (col) => col.notNull()).addColumn("code_challenge_method", "text", (col) => col.notNull().defaultTo("S256")).addColumn("resource", "text").addColumn("expires_at", "text", (col) => col.notNull()).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addForeignKeyConstraint("auth_codes_user_fk", ["user_id"], "users", ["id"], (cb) => cb.onDelete("cascade")).execute();
  await db.schema.createIndex("idx_auth_codes_expires").on("_emdash_authorization_codes").column("expires_at").execute();
  await sql`ALTER TABLE _emdash_oauth_tokens ADD COLUMN client_id TEXT`.execute(db);
}
async function down$15(db) {
  await db.schema.dropTable("_emdash_authorization_codes").execute();
}
var _018_seo_exports = /* @__PURE__ */ __exportAll({
  down: () => down$14,
  up: () => up$14
});
async function up$14(db) {
  await db.schema.createTable("_emdash_seo").addColumn("collection", "text", (col) => col.notNull()).addColumn("content_id", "text", (col) => col.notNull()).addColumn("seo_title", "text").addColumn("seo_description", "text").addColumn("seo_image", "text").addColumn("seo_canonical", "text").addColumn("seo_no_index", "integer", (col) => col.notNull().defaultTo(0)).addColumn("created_at", "text", (col) => col.notNull().defaultTo(currentTimestamp(db))).addColumn("updated_at", "text", (col) => col.notNull().defaultTo(currentTimestamp(db))).addPrimaryKeyConstraint("_emdash_seo_pk", ["collection", "content_id"]).execute();
  await sql`
		CREATE INDEX idx_emdash_seo_collection
		ON _emdash_seo (collection)
	`.execute(db);
  await sql`
		ALTER TABLE _emdash_collections
		ADD COLUMN has_seo INTEGER NOT NULL DEFAULT 0
	`.execute(db);
}
async function down$14(db) {
  await sql`DROP TABLE IF EXISTS _emdash_seo`.execute(db);
  await sql`
		ALTER TABLE _emdash_collections
		DROP COLUMN has_seo
	`.execute(db);
}
var _019_i18n_exports = /* @__PURE__ */ __exportAll({
  down: () => down$13,
  up: () => up$13
});
const DOUBLE_QUOTE_RE$1 = /"/g;
function quoteIdent(name) {
  return `"${name.replace(DOUBLE_QUOTE_RE$1, '""')}"`;
}
const I18N_TMP_SUFFIX = /_i18n_tmp$/;
const TABLE_NAME_PATTERN = /^ec_[a-z][a-z0-9_]*$/;
function validateTableName(name) {
  if (!TABLE_NAME_PATTERN.test(name)) throw new Error(`Invalid content table name: "${name}"`);
}
const ALLOWED_COLUMN_TYPES = /* @__PURE__ */ new Set([
  "TEXT",
  "INTEGER",
  "REAL",
  "BLOB",
  "JSON",
  "NUMERIC",
  ""
]);
function validateColumnType(type, colName) {
  if (!ALLOWED_COLUMN_TYPES.has(type.toUpperCase())) throw new Error(`Unexpected column type "${type}" for column "${colName}"`);
}
const SAFE_DEFAULT_PATTERN = /^(?:'[^']*'|NULL|-?\d+(?:\.\d+)?|\(?datetime\('now'\)\)?|\(?json\('[^']*'\)\)?|0|1)$/i;
function validateDefaultValue(value, colName) {
  if (!SAFE_DEFAULT_PATTERN.test(value)) throw new Error(`Unexpected default value "${value}" for column "${colName}"`);
}
const FUNCTION_DEFAULT_PATTERN = /^(?:datetime|json)\(/i;
function normalizeDdlDefault(value) {
  if (value.startsWith("(")) return value;
  if (FUNCTION_DEFAULT_PATTERN.test(value)) return `(${value})`;
  return value;
}
const CREATE_INDEX_PATTERN = /^CREATE\s+(UNIQUE\s+)?INDEX\s+/i;
function validateCreateIndexSql(sqlStr, idxName) {
  if (!CREATE_INDEX_PATTERN.test(sqlStr)) throw new Error(`Unexpected index SQL for "${idxName}": does not match CREATE INDEX pattern`);
  if (sqlStr.includes(";")) throw new Error(`Unexpected index SQL for "${idxName}": contains semicolon`);
}
async function upPostgres(db) {
  const tableNames = await listTablesLike(db, "ec_%");
  for (const t of tableNames) {
    validateTableName(t);
    if ((await sql`
			SELECT EXISTS(
				SELECT 1 FROM information_schema.columns
				WHERE table_schema = 'public' AND table_name = ${t} AND column_name = 'locale'
			) as exists
		`.execute(db)).rows[0]?.exists === true) continue;
    await sql`ALTER TABLE ${sql.ref(t)} ADD COLUMN locale TEXT NOT NULL DEFAULT 'en'`.execute(db);
    await sql`ALTER TABLE ${sql.ref(t)} ADD COLUMN translation_group TEXT`.execute(db);
    const constraints = await sql`
			SELECT conname FROM pg_constraint
			WHERE conrelid = ${t}::regclass
			AND contype = 'u'
			AND array_length(conkey, 1) = 1
			AND conkey[1] = (
				SELECT attnum FROM pg_attribute
				WHERE attrelid = ${t}::regclass AND attname = 'slug'
			)
		`.execute(db);
    for (const c of constraints.rows) await sql`ALTER TABLE ${sql.ref(t)} DROP CONSTRAINT ${sql.ref(c.conname)}`.execute(db);
    await sql`
			ALTER TABLE ${sql.ref(t)}
			ADD CONSTRAINT ${sql.ref(`${t}_slug_locale_unique`)} UNIQUE (slug, locale)
		`.execute(db);
    await sql`UPDATE ${sql.ref(t)} SET translation_group = id`.execute(db);
    await sql`CREATE INDEX ${sql.ref(`idx_${t}_locale`)} ON ${sql.ref(t)} (locale)`.execute(db);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${t}_translation_group`)}
			ON ${sql.ref(t)} (translation_group)
		`.execute(db);
  }
  if ((await sql`
		SELECT EXISTS(
			SELECT 1 FROM information_schema.columns
			WHERE table_schema = 'public' AND table_name = '_emdash_fields' AND column_name = 'translatable'
		) as exists
	`.execute(db)).rows[0]?.exists !== true) await sql`
			ALTER TABLE _emdash_fields
			ADD COLUMN translatable INTEGER NOT NULL DEFAULT 1
		`.execute(db);
}
async function up$13(db) {
  if (!isSqlite(db)) return upPostgres(db);
  const orphanedTmps = await listTablesLike(db, "ec_%_i18n_tmp");
  for (const tmpName of orphanedTmps) {
    validateTableName(tmpName.replace(I18N_TMP_SUFFIX, ""));
    await sql`DROP TABLE IF EXISTS ${sql.ref(tmpName)}`.execute(db);
  }
  const tables = { rows: (await listTablesLike(db, "ec_%")).map((name) => ({ name })) };
  for (const table of tables.rows) {
    const t = table.name;
    validateTableName(t);
    const tmp = `${t}_i18n_tmp`;
    {
      const trx = db;
      const columns = (await sql`
				PRAGMA table_info(${sql.ref(t)})
			`.execute(trx)).rows;
      if (columns.some((col) => col.name === "locale")) continue;
      const idxResult = await sql`
				PRAGMA index_list(${sql.ref(t)})
			`.execute(trx);
      const indexDefs = [];
      for (const idx of idxResult.rows) {
        if (idx.origin === "pk" || idx.name.startsWith("sqlite_autoindex_")) continue;
        const idxColResult = await sql`
					PRAGMA index_info(${sql.ref(idx.name)})
				`.execute(trx);
        indexDefs.push({
          name: idx.name,
          unique: idx.unique === 1,
          columns: idxColResult.rows.map((c) => c.name),
          partial: idx.partial
        });
      }
      const partialSqls = /* @__PURE__ */ new Map();
      for (const idx of indexDefs) if (idx.partial) {
        const createResult = await sql`
						SELECT sql FROM sqlite_master 
						WHERE type = 'index' AND name = ${idx.name}
					`.execute(trx);
        if (createResult.rows[0]?.sql) partialSqls.set(idx.name, createResult.rows[0].sql);
      }
      for (const col of columns) validateIdentifier(col.name, "column name");
      const colDefs = [];
      const colNames = [];
      for (const col of columns) {
        validateColumnType(col.type || "TEXT", col.name);
        colNames.push(quoteIdent(col.name));
        let def = `${quoteIdent(col.name)} ${col.type || "TEXT"}`;
        if (col.pk) def += " PRIMARY KEY";
        else if (col.name === "slug") ;
        else if (col.notnull) def += " NOT NULL";
        if (col.dflt_value !== null) {
          validateDefaultValue(col.dflt_value, col.name);
          def += ` DEFAULT ${normalizeDdlDefault(col.dflt_value)}`;
        }
        colDefs.push(def);
      }
      colDefs.push(`"locale" TEXT NOT NULL DEFAULT 'en'`);
      colDefs.push('"translation_group" TEXT');
      colDefs.push('UNIQUE("slug", "locale")');
      const createColsSql = colDefs.join(",\n				");
      const selectColsSql = colNames.join(", ");
      for (const idx of indexDefs) await sql`DROP INDEX IF EXISTS ${sql.ref(idx.name)}`.execute(trx);
      await sql.raw(`CREATE TABLE ${quoteIdent(tmp)} (
				${createColsSql}
			)`).execute(trx);
      await sql.raw(`INSERT INTO ${quoteIdent(tmp)} (${selectColsSql}, "locale", "translation_group")
			 SELECT ${selectColsSql}, 'en', "id" FROM ${quoteIdent(t)}`).execute(trx);
      await sql`DROP TABLE ${sql.ref(t)}`.execute(trx);
      await sql.raw(`ALTER TABLE ${quoteIdent(tmp)} RENAME TO ${quoteIdent(t)}`).execute(trx);
      for (const idx of indexDefs) {
        if (idx.name === `idx_${t}_slug`) continue;
        if (idx.partial && partialSqls.has(idx.name)) {
          const idxSql = partialSqls.get(idx.name);
          validateCreateIndexSql(idxSql, idx.name);
          await sql.raw(idxSql).execute(trx);
        } else {
          for (const c of idx.columns) validateIdentifier(c, "index column name");
          const cols = idx.columns.map((c) => quoteIdent(c)).join(", ");
          const unique = idx.unique ? "UNIQUE " : "";
          await sql.raw(`CREATE ${unique}INDEX ${quoteIdent(idx.name)} ON ${quoteIdent(t)} (${cols})`).execute(trx);
        }
      }
      await sql`
				CREATE INDEX ${sql.ref(`idx_${t}_slug`)} 
				ON ${sql.ref(t)} (slug)
			`.execute(trx);
      await sql`
				CREATE INDEX ${sql.ref(`idx_${t}_locale`)} 
				ON ${sql.ref(t)} (locale)
			`.execute(trx);
      await sql`
				CREATE INDEX ${sql.ref(`idx_${t}_translation_group`)} 
				ON ${sql.ref(t)} (translation_group)
			`.execute(trx);
    }
  }
  if (!(await sql`
		PRAGMA table_info(_emdash_fields)
	`.execute(db)).rows.some((col) => col.name === "translatable")) await sql`
			ALTER TABLE _emdash_fields 
			ADD COLUMN translatable INTEGER NOT NULL DEFAULT 1
		`.execute(db);
}
async function downPostgres(db) {
  await sql`ALTER TABLE _emdash_fields DROP COLUMN translatable`.execute(db);
  const tableNames = await listTablesLike(db, "ec_%");
  for (const t of tableNames) {
    validateTableName(t);
    await sql`DROP INDEX IF EXISTS ${sql.ref(`idx_${t}_locale`)}`.execute(db);
    await sql`DROP INDEX IF EXISTS ${sql.ref(`idx_${t}_translation_group`)}`.execute(db);
    await sql`ALTER TABLE ${sql.ref(t)} DROP CONSTRAINT IF EXISTS ${sql.ref(`${t}_slug_locale_unique`)}`.execute(db);
    await sql`ALTER TABLE ${sql.ref(t)} ADD CONSTRAINT ${sql.ref(`${t}_slug_unique`)} UNIQUE (slug)`.execute(db);
    await sql`ALTER TABLE ${sql.ref(t)} DROP COLUMN locale`.execute(db);
    await sql`ALTER TABLE ${sql.ref(t)} DROP COLUMN translation_group`.execute(db);
  }
}
async function down$13(db) {
  if (!isSqlite(db)) return downPostgres(db);
  await sql`
		ALTER TABLE _emdash_fields
		DROP COLUMN translatable
	`.execute(db);
  const tableNames = await listTablesLike(db, "ec_%");
  for (const tableName of tableNames) {
    const t = tableName;
    validateTableName(t);
    const tmp = `${t}_i18n_tmp`;
    {
      const trx = db;
      const columns = (await sql`
				PRAGMA table_info(${sql.ref(t)})
			`.execute(trx)).rows;
      const idxResult = await sql`
				PRAGMA index_list(${sql.ref(t)})
			`.execute(trx);
      const indexDefs = [];
      for (const idx of idxResult.rows) {
        if (idx.origin === "pk" || idx.name.startsWith("sqlite_autoindex_")) continue;
        const idxColResult = await sql`
					PRAGMA index_info(${sql.ref(idx.name)})
				`.execute(trx);
        indexDefs.push({
          name: idx.name,
          unique: idx.unique === 1,
          columns: idxColResult.rows.map((c) => c.name),
          partial: idx.partial
        });
      }
      const partialSqls = /* @__PURE__ */ new Map();
      for (const idx of indexDefs) if (idx.partial) {
        const createResult = await sql`
						SELECT sql FROM sqlite_master 
						WHERE type = 'index' AND name = ${idx.name}
					`.execute(trx);
        if (createResult.rows[0]?.sql) partialSqls.set(idx.name, createResult.rows[0].sql);
      }
      for (const col of columns) {
        if (col.name === "locale" || col.name === "translation_group") continue;
        validateIdentifier(col.name, "column name");
      }
      const colDefs = [];
      const colNames = [];
      for (const col of columns) {
        if (col.name === "locale" || col.name === "translation_group") continue;
        validateColumnType(col.type || "TEXT", col.name);
        colNames.push(quoteIdent(col.name));
        let def = `${quoteIdent(col.name)} ${col.type || "TEXT"}`;
        if (col.pk) def += " PRIMARY KEY";
        else if (col.name === "slug") def += " UNIQUE";
        else if (col.notnull) def += " NOT NULL";
        if (col.dflt_value !== null) {
          validateDefaultValue(col.dflt_value, col.name);
          def += ` DEFAULT ${normalizeDdlDefault(col.dflt_value)}`;
        }
        colDefs.push(def);
      }
      const createColsSql = colDefs.join(",\n				");
      const selectColsSql = colNames.join(", ");
      for (const idx of indexDefs) await sql`DROP INDEX IF EXISTS ${sql.ref(idx.name)}`.execute(trx);
      await sql.raw(`CREATE TABLE ${quoteIdent(tmp)} (
				${createColsSql}
			)`).execute(trx);
      await sql.raw(`INSERT OR IGNORE INTO ${quoteIdent(tmp)} (${selectColsSql})
			 SELECT ${selectColsSql} FROM ${quoteIdent(t)}
			 WHERE "locale" = 'en'`).execute(trx);
      await sql.raw(`INSERT OR IGNORE INTO ${quoteIdent(tmp)} (${selectColsSql})
			 SELECT ${selectColsSql} FROM ${quoteIdent(t)}
			 WHERE "id" NOT IN (SELECT "id" FROM ${quoteIdent(tmp)})
			 AND "id" IN (
				SELECT "id" FROM ${quoteIdent(t)} AS t2
				WHERE t2."translation_group" IS NOT NULL
				AND t2."locale" = (
					SELECT MIN(t3."locale") FROM ${quoteIdent(t)} AS t3
					WHERE t3."translation_group" = t2."translation_group"
				)
			 )`).execute(trx);
      await sql.raw(`INSERT OR IGNORE INTO ${quoteIdent(tmp)} (${selectColsSql})
			 SELECT ${selectColsSql} FROM ${quoteIdent(t)}
			 WHERE "id" NOT IN (SELECT "id" FROM ${quoteIdent(tmp)})
			 AND "translation_group" IS NULL`).execute(trx);
      await sql`DROP TABLE ${sql.ref(t)}`.execute(trx);
      await sql.raw(`ALTER TABLE ${quoteIdent(tmp)} RENAME TO ${quoteIdent(t)}`).execute(trx);
      for (const idx of indexDefs) {
        if (idx.name === `idx_${t}_locale`) continue;
        if (idx.name === `idx_${t}_translation_group`) continue;
        if (idx.partial && partialSqls.has(idx.name)) {
          const idxSql = partialSqls.get(idx.name);
          validateCreateIndexSql(idxSql, idx.name);
          await sql.raw(idxSql).execute(trx);
        } else {
          const cols = idx.columns.filter((c) => c !== "locale" && c !== "translation_group");
          if (cols.length === 0) continue;
          for (const c of cols) validateIdentifier(c, "index column name");
          const colsSql = cols.map((c) => quoteIdent(c)).join(", ");
          const unique = idx.unique ? "UNIQUE " : "";
          await sql.raw(`CREATE ${unique}INDEX ${quoteIdent(idx.name)} ON ${quoteIdent(t)} (${colsSql})`).execute(trx);
        }
      }
    }
  }
}
var _020_collection_url_pattern_exports = /* @__PURE__ */ __exportAll({
  down: () => down$12,
  up: () => up$12
});
async function up$12(db) {
  await sql`
		ALTER TABLE _emdash_collections
		ADD COLUMN url_pattern TEXT
	`.execute(db);
}
async function down$12(db) {
  await sql`
		ALTER TABLE _emdash_collections
		DROP COLUMN url_pattern
	`.execute(db);
}
var _021_remove_section_categories_exports = /* @__PURE__ */ __exportAll({
  down: () => down$11,
  up: () => up$11
});
async function up$11(db) {
  await db.schema.dropIndex("idx_sections_category").ifExists().execute();
  await db.schema.alterTable("_emdash_sections").dropColumn("category_id").execute();
  await db.schema.dropTable("_emdash_section_categories").execute();
}
async function down$11(db) {
  await db.schema.createTable("_emdash_section_categories").addColumn("id", "text", (col) => col.primaryKey()).addColumn("slug", "text", (col) => col.notNull().unique()).addColumn("label", "text", (col) => col.notNull()).addColumn("sort_order", "integer", (col) => col.defaultTo(0)).addColumn("created_at", "text", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)).execute();
  await db.schema.alterTable("_emdash_sections").addColumn("category_id", "text", (col) => col.references("_emdash_section_categories.id").onDelete("set null")).execute();
  await db.schema.createIndex("idx_sections_category").on("_emdash_sections").columns(["category_id"]).execute();
}
var _022_marketplace_plugin_state_exports = /* @__PURE__ */ __exportAll({
  down: () => down$10,
  up: () => up$10
});
async function up$10(db) {
  await sql`
		ALTER TABLE _plugin_state
		ADD COLUMN source TEXT NOT NULL DEFAULT 'config'
	`.execute(db);
  await sql`
		ALTER TABLE _plugin_state
		ADD COLUMN marketplace_version TEXT
	`.execute(db);
  await sql`
		CREATE INDEX idx_plugin_state_source
		ON _plugin_state (source)
		WHERE source = 'marketplace'
	`.execute(db);
}
async function down$10(db) {
  await sql`
		DROP INDEX IF EXISTS idx_plugin_state_source
	`.execute(db);
  await sql`
		ALTER TABLE _plugin_state
		DROP COLUMN marketplace_version
	`.execute(db);
  await sql`
		ALTER TABLE _plugin_state
		DROP COLUMN source
	`.execute(db);
}
var _023_plugin_metadata_exports = /* @__PURE__ */ __exportAll({
  down: () => down$9,
  up: () => up$9
});
async function up$9(db) {
  await sql`
		ALTER TABLE _plugin_state
		ADD COLUMN display_name TEXT
	`.execute(db);
  await sql`
		ALTER TABLE _plugin_state
		ADD COLUMN description TEXT
	`.execute(db);
}
async function down$9(db) {
  await sql`
		ALTER TABLE _plugin_state
		DROP COLUMN description
	`.execute(db);
  await sql`
		ALTER TABLE _plugin_state
		DROP COLUMN display_name
	`.execute(db);
}
var _024_media_placeholders_exports = /* @__PURE__ */ __exportAll({
  down: () => down$8,
  up: () => up$8
});
async function up$8(db) {
  await sql`
		ALTER TABLE media
		ADD COLUMN blurhash TEXT
	`.execute(db);
  await sql`
		ALTER TABLE media
		ADD COLUMN dominant_color TEXT
	`.execute(db);
}
async function down$8(db) {
  await sql`
		ALTER TABLE media
		DROP COLUMN dominant_color
	`.execute(db);
  await sql`
		ALTER TABLE media
		DROP COLUMN blurhash
	`.execute(db);
}
var _025_oauth_clients_exports = /* @__PURE__ */ __exportAll({
  down: () => down$7,
  up: () => up$7
});
async function up$7(db) {
  await db.schema.createTable("_emdash_oauth_clients").addColumn("id", "text", (col) => col.primaryKey()).addColumn("name", "text", (col) => col.notNull()).addColumn("redirect_uris", "text", (col) => col.notNull()).addColumn("scopes", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
}
async function down$7(db) {
  await db.schema.dropTable("_emdash_oauth_clients").execute();
}
var _026_cron_tasks_exports = /* @__PURE__ */ __exportAll({
  down: () => down$6,
  up: () => up$6
});
async function up$6(db) {
  await db.schema.createTable("_emdash_cron_tasks").addColumn("id", "text", (col) => col.primaryKey()).addColumn("plugin_id", "text", (col) => col.notNull()).addColumn("task_name", "text", (col) => col.notNull()).addColumn("schedule", "text", (col) => col.notNull()).addColumn("is_oneshot", "integer", (col) => col.notNull().defaultTo(0)).addColumn("data", "text").addColumn("next_run_at", "text", (col) => col.notNull()).addColumn("last_run_at", "text").addColumn("status", "text", (col) => col.notNull().defaultTo("idle")).addColumn("locked_at", "text").addColumn("enabled", "integer", (col) => col.notNull().defaultTo(1)).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addUniqueConstraint("uq_cron_tasks_plugin_task", ["plugin_id", "task_name"]).execute();
  await db.schema.createIndex("idx_cron_tasks_due").on("_emdash_cron_tasks").columns([
    "enabled",
    "status",
    "next_run_at"
  ]).execute();
  await db.schema.createIndex("idx_cron_tasks_plugin").on("_emdash_cron_tasks").column("plugin_id").execute();
}
async function down$6(db) {
  await db.schema.dropTable("_emdash_cron_tasks").execute();
}
var _027_comments_exports = /* @__PURE__ */ __exportAll({
  down: () => down$5,
  up: () => up$5
});
async function up$5(db) {
  await db.schema.createTable("_emdash_comments").addColumn("id", "text", (col) => col.primaryKey()).addColumn("collection", "text", (col) => col.notNull()).addColumn("content_id", "text", (col) => col.notNull()).addColumn("parent_id", "text", (col) => col.references("_emdash_comments.id").onDelete("cascade")).addColumn("author_name", "text", (col) => col.notNull()).addColumn("author_email", "text", (col) => col.notNull()).addColumn("author_url", "text").addColumn("author_user_id", "text", (col) => col.references("users.id").onDelete("set null")).addColumn("body", "text", (col) => col.notNull()).addColumn("status", "text", (col) => col.notNull().defaultTo("pending")).addColumn("ip_hash", "text").addColumn("user_agent", "text").addColumn("moderation_metadata", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.schema.createIndex("idx_comments_content").on("_emdash_comments").columns([
    "collection",
    "content_id",
    "status"
  ]).execute();
  await db.schema.createIndex("idx_comments_parent").on("_emdash_comments").column("parent_id").execute();
  await db.schema.createIndex("idx_comments_status").on("_emdash_comments").columns(["status", "created_at"]).execute();
  await db.schema.createIndex("idx_comments_author_email").on("_emdash_comments").column("author_email").execute();
  await db.schema.createIndex("idx_comments_author_user").on("_emdash_comments").column("author_user_id").execute();
  await db.schema.alterTable("_emdash_collections").addColumn("comments_enabled", "integer", (col) => col.defaultTo(0)).execute();
  await db.schema.alterTable("_emdash_collections").addColumn("comments_moderation", "text", (col) => col.defaultTo("first_time")).execute();
  await db.schema.alterTable("_emdash_collections").addColumn("comments_closed_after_days", "integer", (col) => col.defaultTo(90)).execute();
  await db.schema.alterTable("_emdash_collections").addColumn("comments_auto_approve_users", "integer", (col) => col.defaultTo(1)).execute();
}
async function down$5(db) {
  await db.schema.dropTable("_emdash_comments").execute();
}
var _028_drop_author_url_exports = /* @__PURE__ */ __exportAll({
  down: () => down$4,
  up: () => up$4
});
async function up$4(db) {
  await sql`ALTER TABLE _emdash_comments DROP COLUMN author_url`.execute(db);
}
async function down$4(db) {
  await db.schema.alterTable("_emdash_comments").addColumn("author_url", "text").execute();
}
var _029_redirects_exports = /* @__PURE__ */ __exportAll({
  down: () => down$3,
  up: () => up$3
});
async function up$3(db) {
  await db.schema.createTable("_emdash_redirects").addColumn("id", "text", (col) => col.primaryKey()).addColumn("source", "text", (col) => col.notNull()).addColumn("destination", "text", (col) => col.notNull()).addColumn("type", "integer", (col) => col.notNull().defaultTo(301)).addColumn("is_pattern", "integer", (col) => col.notNull().defaultTo(0)).addColumn("enabled", "integer", (col) => col.notNull().defaultTo(1)).addColumn("hits", "integer", (col) => col.notNull().defaultTo(0)).addColumn("last_hit_at", "text").addColumn("group_name", "text").addColumn("auto", "integer", (col) => col.notNull().defaultTo(0)).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.schema.createIndex("idx_redirects_source").on("_emdash_redirects").column("source").execute();
  await db.schema.createIndex("idx_redirects_enabled").on("_emdash_redirects").column("enabled").execute();
  await db.schema.createIndex("idx_redirects_group").on("_emdash_redirects").column("group_name").execute();
  await db.schema.createTable("_emdash_404_log").addColumn("id", "text", (col) => col.primaryKey()).addColumn("path", "text", (col) => col.notNull()).addColumn("referrer", "text").addColumn("user_agent", "text").addColumn("ip", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.schema.createIndex("idx_404_log_path").on("_emdash_404_log").column("path").execute();
  await db.schema.createIndex("idx_404_log_created").on("_emdash_404_log").column("created_at").execute();
}
async function down$3(db) {
  await db.schema.dropTable("_emdash_404_log").execute();
  await db.schema.dropTable("_emdash_redirects").execute();
}
var _030_widen_scheduled_index_exports = /* @__PURE__ */ __exportAll({
  down: () => down$2,
  up: () => up$2
});
async function up$2(db) {
  const tableNames = await listTablesLike(db, "ec_%");
  for (const tableName of tableNames) {
    const table = { name: tableName };
    await sql`
			DROP INDEX IF EXISTS ${sql.ref(`idx_${table.name}_scheduled`)}
		`.execute(db);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${table.name}_scheduled`)}
			ON ${sql.ref(table.name)} (scheduled_at)
			WHERE scheduled_at IS NOT NULL
		`.execute(db);
  }
}
async function down$2(db) {
  const tableNames = await listTablesLike(db, "ec_%");
  for (const tableName of tableNames) {
    const table = { name: tableName };
    await sql`
			DROP INDEX IF EXISTS ${sql.ref(`idx_${table.name}_scheduled`)}
		`.execute(db);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${table.name}_scheduled`)}
			ON ${sql.ref(table.name)} (scheduled_at)
			WHERE scheduled_at IS NOT NULL AND status = 'scheduled'
		`.execute(db);
  }
}
var _031_bylines_exports = /* @__PURE__ */ __exportAll({
  down: () => down$1,
  up: () => up$1
});
async function up$1(db) {
  await db.schema.createTable("_emdash_bylines").addColumn("id", "text", (col) => col.primaryKey()).addColumn("slug", "text", (col) => col.notNull().unique()).addColumn("display_name", "text", (col) => col.notNull()).addColumn("bio", "text").addColumn("avatar_media_id", "text", (col) => col.references("media.id").onDelete("set null")).addColumn("website_url", "text").addColumn("user_id", "text", (col) => col.references("users.id").onDelete("set null")).addColumn("is_guest", "integer", (col) => col.notNull().defaultTo(0)).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await sql`
		CREATE UNIQUE INDEX ${sql.ref("idx_bylines_user_id_unique")}
		ON ${sql.ref("_emdash_bylines")} (user_id)
		WHERE user_id IS NOT NULL
	`.execute(db);
  await db.schema.createIndex("idx_bylines_slug").on("_emdash_bylines").column("slug").execute();
  await db.schema.createIndex("idx_bylines_display_name").on("_emdash_bylines").column("display_name").execute();
  await db.schema.createTable("_emdash_content_bylines").addColumn("id", "text", (col) => col.primaryKey()).addColumn("collection_slug", "text", (col) => col.notNull()).addColumn("content_id", "text", (col) => col.notNull()).addColumn("byline_id", "text", (col) => col.notNull().references("_emdash_bylines.id").onDelete("cascade")).addColumn("sort_order", "integer", (col) => col.notNull().defaultTo(0)).addColumn("role_label", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addUniqueConstraint("content_bylines_unique", [
    "collection_slug",
    "content_id",
    "byline_id"
  ]).execute();
  await db.schema.createIndex("idx_content_bylines_content").on("_emdash_content_bylines").columns([
    "collection_slug",
    "content_id",
    "sort_order"
  ]).execute();
  await db.schema.createIndex("idx_content_bylines_byline").on("_emdash_content_bylines").column("byline_id").execute();
  const tableNames = await listTablesLike(db, "ec_%");
  for (const tableName of tableNames) {
    await sql`
			ALTER TABLE ${sql.ref(tableName)}
			ADD COLUMN primary_byline_id TEXT
		`.execute(db);
    await sql`
			CREATE INDEX ${sql.ref(`idx_${tableName}_primary_byline`)}
			ON ${sql.ref(tableName)} (primary_byline_id)
		`.execute(db);
  }
}
async function down$1(db) {
  const tableNames = await listTablesLike(db, "ec_%");
  for (const tableName of tableNames) {
    await sql`
			DROP INDEX IF EXISTS ${sql.ref(`idx_${tableName}_primary_byline`)}
		`.execute(db);
    await sql`
			ALTER TABLE ${sql.ref(tableName)}
			DROP COLUMN primary_byline_id
		`.execute(db);
  }
  await db.schema.dropTable("_emdash_content_bylines").execute();
  await db.schema.dropTable("_emdash_bylines").execute();
}
var _032_rate_limits_exports = /* @__PURE__ */ __exportAll({
  down: () => down,
  up: () => up
});
async function up(db) {
  await db.schema.createTable("_emdash_rate_limits").addColumn("key", "text", (col) => col.notNull()).addColumn("window", "text", (col) => col.notNull()).addColumn("count", "integer", (col) => col.notNull().defaultTo(1)).addPrimaryKeyConstraint("pk_rate_limits", ["key", "window"]).execute();
  await db.schema.createIndex("idx_rate_limits_window").on("_emdash_rate_limits").column("window").execute();
  await db.schema.alterTable("_emdash_device_codes").addColumn("last_polled_at", "text").execute();
}
async function down(db) {
  await db.schema.dropTable("_emdash_rate_limits").execute();
  await db.schema.alterTable("_emdash_device_codes").dropColumn("last_polled_at").execute();
}
var StaticMigrationProvider = class {
  async getMigrations() {
    return {
      "001_initial": _001_initial_exports,
      "002_media_status": _002_media_status_exports,
      "003_schema_registry": _003_schema_registry_exports,
      "004_plugins": _004_plugins_exports,
      "005_menus": _005_menus_exports,
      "006_taxonomy_defs": _006_taxonomy_defs_exports,
      "007_widgets": _007_widgets_exports,
      "008_auth": _008_auth_exports,
      "009_user_disabled": _009_user_disabled_exports,
      "011_sections": _011_sections_exports,
      "012_search": _012_search_exports,
      "013_scheduled_publishing": _013_scheduled_publishing_exports,
      "014_draft_revisions": _014_draft_revisions_exports,
      "015_indexes": _015_indexes_exports,
      "016_api_tokens": _016_api_tokens_exports,
      "017_authorization_codes": _017_authorization_codes_exports,
      "018_seo": _018_seo_exports,
      "019_i18n": _019_i18n_exports,
      "020_collection_url_pattern": _020_collection_url_pattern_exports,
      "021_remove_section_categories": _021_remove_section_categories_exports,
      "022_marketplace_plugin_state": _022_marketplace_plugin_state_exports,
      "023_plugin_metadata": _023_plugin_metadata_exports,
      "024_media_placeholders": _024_media_placeholders_exports,
      "025_oauth_clients": _025_oauth_clients_exports,
      "026_cron_tasks": _026_cron_tasks_exports,
      "027_comments": _027_comments_exports,
      "028_drop_author_url": _028_drop_author_url_exports,
      "029_redirects": _029_redirects_exports,
      "030_widen_scheduled_index": _030_widen_scheduled_index_exports,
      "031_bylines": _031_bylines_exports,
      "032_rate_limits": _032_rate_limits_exports
    };
  }
};
const MIGRATION_TABLE = "_emdash_migrations";
const MIGRATION_LOCK_TABLE = "_emdash_migrations_lock";
async function runMigrations(db) {
  const { error, results } = await new Migrator({
    db,
    provider: new StaticMigrationProvider(),
    migrationTableName: MIGRATION_TABLE,
    migrationLockTableName: MIGRATION_LOCK_TABLE
  }).migrateToLatest();
  const applied = results?.filter((r) => r.status === "Success").map((r) => r.migrationName) ?? [];
  if (error) {
    let msg = error instanceof Error ? error.message : JSON.stringify(error);
    if (!msg && error instanceof Error && error.cause) msg = error.cause instanceof Error ? error.cause.message : JSON.stringify(error.cause);
    const failedMigration = results?.find((r) => r.status === "Error");
    if (failedMigration) msg = `${msg || "unknown error"} (migration: ${failedMigration.migrationName})`;
    throw new Error(`Migration failed: ${msg}`);
  }
  return { applied };
}
const INTERNAL_MEDIA_PREFIX = "/_emdash/api/media/file/";
const URL_PATTERN = /^https?:\/\//;
async function normalizeMediaValue(value, getProvider) {
  if (value == null) return null;
  if (typeof value === "string") return normalizeStringUrl(value, getProvider);
  if (!isRecord$1(value)) return null;
  if (!("id" in value) && !("src" in value)) return null;
  const provider = (typeof value.provider === "string" ? value.provider : void 0) || "local";
  const id = typeof value.id === "string" ? value.id : "";
  if (provider === "external") return recordToMediaValue(value);
  const result = {
    ...recordToMediaValue(value),
    provider
  };
  if (provider === "local") delete result.src;
  const needsDimensions = result.width == null || result.height == null;
  const needsStorageKey = provider === "local" && !result.meta?.storageKey;
  const needsFileInfo = !result.mimeType || !result.filename;
  if (!(needsDimensions || needsStorageKey || needsFileInfo) || !id) return result;
  const mediaProvider = getProvider(provider);
  if (!mediaProvider?.get) return result;
  let providerItem;
  try {
    providerItem = await mediaProvider.get(id);
  } catch {
    return result;
  }
  if (!providerItem) return result;
  return mergeProviderData(result, providerItem);
}
function normalizeStringUrl(url, getProvider) {
  if (url.startsWith(INTERNAL_MEDIA_PREFIX)) return resolveInternalUrl(url, getProvider);
  if (URL_PATTERN.test(url)) return Promise.resolve({
    provider: "external",
    id: "",
    src: url
  });
  return Promise.resolve({
    provider: "external",
    id: "",
    src: url
  });
}
async function resolveInternalUrl(url, getProvider) {
  const storageKey = url.slice(24);
  const localProvider = getProvider("local");
  if (!localProvider?.get) return {
    provider: "external",
    id: "",
    src: url
  };
  let item;
  try {
    item = await localProvider.get(storageKey);
  } catch {
    return {
      provider: "external",
      id: "",
      src: url
    };
  }
  if (!item) return {
    provider: "external",
    id: "",
    src: url
  };
  return {
    provider: "local",
    id: item.id,
    filename: item.filename,
    mimeType: item.mimeType,
    width: item.width,
    height: item.height,
    alt: item.alt,
    meta: item.meta
  };
}
function mergeProviderData(existing, item) {
  const result = { ...existing };
  if (result.width == null && item.width != null) result.width = item.width;
  if (result.height == null && item.height != null) result.height = item.height;
  if (!result.filename && item.filename) result.filename = item.filename;
  if (!result.mimeType && item.mimeType) result.mimeType = item.mimeType;
  if (!result.alt && item.alt) result.alt = item.alt;
  if (item.meta) result.meta = {
    ...item.meta,
    ...result.meta
  };
  return result;
}
function isRecord$1(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function recordToMediaValue(obj) {
  const result = { id: typeof obj.id === "string" ? obj.id : "" };
  if (typeof obj.provider === "string") result.provider = obj.provider;
  if (typeof obj.src === "string") result.src = obj.src;
  if (typeof obj.previewUrl === "string") result.previewUrl = obj.previewUrl;
  if (typeof obj.filename === "string") result.filename = obj.filename;
  if (typeof obj.mimeType === "string") result.mimeType = obj.mimeType;
  if (typeof obj.width === "number") result.width = obj.width;
  if (typeof obj.height === "number") result.height = obj.height;
  if (typeof obj.alt === "string") result.alt = obj.alt;
  if (isRecord$1(obj.meta)) result.meta = obj.meta;
  return result;
}
var EmDashStorageError = class extends Error {
  constructor(message, code, cause) {
    super(message);
    this.code = code;
    this.cause = cause;
    this.name = "EmDashStorageError";
  }
};
function getAuthMode(config) {
  const auth = config?.auth;
  if (auth && "entrypoint" in auth && auth.entrypoint) return {
    type: "external",
    providerType: auth.type,
    entrypoint: auth.entrypoint,
    config: auth.config
  };
  return { type: "passkey" };
}
function getFormFields(form) {
  return form.pages.flatMap((p) => p.fields);
}
const CSV_ESCAPE_RE = /[,"\n]/;
const DOUBLE_QUOTE_RE = /"/g;
const CSV_FORMULA_TRIGGERS = /* @__PURE__ */ new Set(["=", "+", "-", "@", "	", "\r"]);
function formatSubmissionText(form, data, files) {
  const fields = getFormFields(form);
  const lines = [`New submission for "${form.name}"`, ""];
  for (const field of fields) {
    if (field.type === "hidden") continue;
    const value = data[field.name];
    if (value === void 0 || value === null || value === "") continue;
    const display = Array.isArray(value) ? value.join(", ") : String(value);
    lines.push(`${field.label}: ${display}`);
  }
  if (files && files.length > 0) {
    lines.push("", "Attached files:");
    for (const file of files) {
      lines.push(`  - ${file.filename} (${formatBytes(file.size)})`);
    }
  }
  lines.push("", `Submitted at: ${(/* @__PURE__ */ new Date()).toISOString()}`);
  return lines.join("\n");
}
function formatDigestText(form, formId, submissions2, siteUrl) {
  const lines = [
    `Daily digest for "${form.name}"`,
    "",
    `${submissions2.length} new submission${submissions2.length === 1 ? "" : "s"} since last digest.`,
    ""
  ];
  for (const sub of submissions2.slice(0, 10)) {
    const preview = getSubmissionPreview(form, sub);
    lines.push(`  - ${sub.createdAt}: ${preview}`);
  }
  if (submissions2.length > 10) {
    lines.push(`  ... and ${submissions2.length - 10} more`);
  }
  lines.push(
    "",
    `View all submissions: ${siteUrl}/_emdash/admin/plugins/emdash-forms/submissions?formId=${encodeURIComponent(formId)}`
  );
  return lines.join("\n");
}
function formatWebhookPayload(form, submissionId, data, files) {
  return {
    event: "form.submission",
    formId: form.slug,
    formName: form.name,
    submissionId,
    data,
    files: files?.map((f) => ({
      fieldName: f.fieldName,
      filename: f.filename,
      contentType: f.contentType,
      size: f.size,
      mediaId: f.mediaId
    })),
    submittedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function formatCsv(form, items) {
  const fields = getFormFields(form).filter((f) => f.type !== "hidden");
  const headers = ["ID", "Submitted At", "Status", ...fields.map((f) => f.label)];
  const rows = items.map(({ id, data: sub }) => {
    const values = [id, sub.createdAt, sub.status];
    for (const field of fields) {
      const v = sub.data[field.name];
      if (field.type === "file") {
        const file = sub.files?.find((f) => f.fieldName === field.name);
        values.push(file ? file.filename : "");
      } else if (Array.isArray(v)) {
        values.push(v.join("; "));
      } else {
        values.push(v === void 0 || v === null ? "" : String(v));
      }
    }
    return values;
  });
  return [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
}
function escapeCsv(value) {
  if (value.length > 0 && CSV_FORMULA_TRIGGERS.has(value.charAt(0))) {
    value = "'" + value;
  }
  if (CSV_ESCAPE_RE.test(value)) {
    return `"${value.replace(DOUBLE_QUOTE_RE, '""')}"`;
  }
  return value;
}
function getSubmissionPreview(form, sub) {
  const fields = getFormFields(form).filter((f) => f.type !== "hidden" && f.type !== "file");
  const previews = [];
  for (const field of fields.slice(0, 3)) {
    const v = sub.data[field.name];
    if (v !== void 0 && v !== null && v !== "") {
      const str = String(v);
      previews.push(str.length > 50 ? `${str.slice(0, 47)}...` : str);
    }
  }
  return previews.join(" | ") || "(empty)";
}
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function forms$3(ctx) {
  return ctx.storage.forms;
}
function submissions$3(ctx) {
  return ctx.storage.submissions;
}
async function handleCleanup(ctx) {
  let formsCursor;
  do {
    const formsBatch = await forms$3(ctx).query({ limit: 100, cursor: formsCursor });
    for (const formItem of formsBatch.items) {
      const form = formItem.data;
      if (form.settings.retentionDays === 0) continue;
      const cutoff = /* @__PURE__ */ new Date();
      cutoff.setDate(cutoff.getDate() - form.settings.retentionDays);
      const cutoffStr = cutoff.toISOString();
      let cursor;
      let deletedCount = 0;
      do {
        const batch = await submissions$3(ctx).query({
          where: {
            formId: formItem.id,
            createdAt: { lt: cutoffStr }
          },
          limit: 100,
          cursor
        });
        if (ctx.media && "delete" in ctx.media) {
          const mediaWithDelete = ctx.media;
          for (const item of batch.items) {
            if (item.data.files) {
              for (const file of item.data.files) {
                await mediaWithDelete.delete(file.mediaId).catch(() => {
                });
              }
            }
          }
        }
        const ids = batch.items.map((item) => item.id);
        if (ids.length > 0) {
          await submissions$3(ctx).deleteMany(ids);
          deletedCount += ids.length;
        }
        cursor = batch.cursor;
      } while (cursor);
      if (deletedCount > 0) {
        const count = await submissions$3(ctx).count({ formId: formItem.id });
        await forms$3(ctx).put(formItem.id, {
          ...form,
          submissionCount: count
        });
        ctx.log.info("Cleaned up expired submissions", {
          formId: formItem.id,
          formName: form.name,
          deleted: deletedCount
        });
      }
    }
    formsCursor = formsBatch.cursor;
  } while (formsCursor);
}
async function handleDigest(formId, ctx) {
  const form = await forms$3(ctx).get(formId);
  if (!form) {
    ctx.log.warn("Digest: form not found, cancelling", { formId });
    if (ctx.cron) {
      await ctx.cron.cancel(`digest:${formId}`).catch(() => {
      });
    }
    return;
  }
  if (!form.settings.digestEnabled || form.settings.notifyEmails.length === 0) {
    return;
  }
  if (!ctx.email) {
    ctx.log.warn("Digest: email not configured", { formId });
    return;
  }
  const since = /* @__PURE__ */ new Date();
  since.setDate(since.getDate() - 1);
  const recent = await submissions$3(ctx).query({
    where: {
      formId,
      createdAt: { gte: since.toISOString() }
    },
    orderBy: { createdAt: "desc" },
    limit: 100
  });
  if (recent.items.length === 0) {
    return;
  }
  const subs = recent.items.map((item) => item.data);
  const text = formatDigestText(form, formId, subs, ctx.site.url);
  for (const email of form.settings.notifyEmails) {
    await ctx.email.send({
      to: email,
      subject: `Daily digest: ${form.name} (${subs.length} new)`,
      text
    }).catch((err) => {
      ctx.log.error("Failed to send digest email", {
        error: String(err),
        to: email
      });
    });
  }
}
function forms$2(ctx) {
  return ctx.storage.forms;
}
function submissions$2(ctx) {
  return ctx.storage.submissions;
}
async function formsListHandler(ctx) {
  const result = await forms$2(ctx).query({
    orderBy: { createdAt: "desc" },
    limit: 100
  });
  return {
    items: result.items.map((item) => ({ id: item.id, ...item.data })),
    hasMore: result.hasMore,
    cursor: result.cursor
  };
}
async function formsCreateHandler(ctx) {
  const input = ctx.input;
  const existing = await forms$2(ctx).query({
    where: { slug: input.slug },
    limit: 1
  });
  if (existing.items.length > 0) {
    throw PluginRouteError.conflict(`A form with slug "${input.slug}" already exists`);
  }
  validateFieldNames(input.pages);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const id = ulid();
  const form = {
    name: input.name,
    slug: input.slug,
    pages: input.pages,
    settings: {
      confirmationMessage: input.settings.confirmationMessage ?? "Thank you for your submission.",
      redirectUrl: input.settings.redirectUrl || void 0,
      notifyEmails: input.settings.notifyEmails ?? [],
      digestEnabled: input.settings.digestEnabled ?? false,
      digestHour: input.settings.digestHour ?? 9,
      autoresponder: input.settings.autoresponder,
      webhookUrl: input.settings.webhookUrl || void 0,
      retentionDays: input.settings.retentionDays ?? 0,
      spamProtection: input.settings.spamProtection ?? "honeypot",
      submitLabel: input.settings.submitLabel ?? "Submit",
      nextLabel: input.settings.nextLabel,
      prevLabel: input.settings.prevLabel
    },
    status: "active",
    submissionCount: 0,
    lastSubmissionAt: null,
    createdAt: now,
    updatedAt: now
  };
  await forms$2(ctx).put(id, form);
  if (form.settings.digestEnabled && ctx.cron) {
    await ctx.cron.schedule(`digest:${id}`, {
      schedule: `0 ${form.settings.digestHour} * * *`
    });
  }
  return { id, ...form };
}
async function formsUpdateHandler(ctx) {
  const input = ctx.input;
  const existing = await forms$2(ctx).get(input.id);
  if (!existing) {
    throw PluginRouteError.notFound("Form not found");
  }
  if (input.slug && input.slug !== existing.slug) {
    const slugCheck = await forms$2(ctx).query({
      where: { slug: input.slug },
      limit: 1
    });
    if (slugCheck.items.length > 0) {
      throw PluginRouteError.conflict(`A form with slug "${input.slug}" already exists`);
    }
  }
  if (input.pages) {
    validateFieldNames(input.pages);
  }
  const updated = {
    ...existing,
    name: input.name ?? existing.name,
    slug: input.slug ?? existing.slug,
    pages: input.pages ?? existing.pages,
    settings: input.settings ? { ...existing.settings, ...input.settings } : existing.settings,
    status: input.status ?? existing.status,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (updated.settings.redirectUrl === "") updated.settings.redirectUrl = void 0;
  if (updated.settings.webhookUrl === "") updated.settings.webhookUrl = void 0;
  await forms$2(ctx).put(input.id, updated);
  if (ctx.cron) {
    if (updated.settings.digestEnabled && !existing.settings.digestEnabled) {
      await ctx.cron.schedule(`digest:${input.id}`, {
        schedule: `0 ${updated.settings.digestHour} * * *`
      });
    } else if (!updated.settings.digestEnabled && existing.settings.digestEnabled) {
      await ctx.cron.cancel(`digest:${input.id}`);
    } else if (updated.settings.digestEnabled && updated.settings.digestHour !== existing.settings.digestHour) {
      await ctx.cron.schedule(`digest:${input.id}`, {
        schedule: `0 ${updated.settings.digestHour} * * *`
      });
    }
  }
  return { id: input.id, ...updated };
}
async function formsDeleteHandler(ctx) {
  const input = ctx.input;
  const existing = await forms$2(ctx).get(input.id);
  if (!existing) {
    throw PluginRouteError.notFound("Form not found");
  }
  if (input.deleteSubmissions) {
    await deleteFormSubmissions(input.id, ctx);
  }
  if (ctx.cron) {
    await ctx.cron.cancel(`digest:${input.id}`).catch(() => {
    });
  }
  await forms$2(ctx).delete(input.id);
  return { deleted: true };
}
async function formsDuplicateHandler(ctx) {
  const input = ctx.input;
  const existing = await forms$2(ctx).get(input.id);
  if (!existing) {
    throw PluginRouteError.notFound("Form not found");
  }
  const newSlug = input.slug ?? `${existing.slug}-copy`;
  const newName = input.name ?? `${existing.name} (Copy)`;
  const slugCheck = await forms$2(ctx).query({
    where: { slug: newSlug },
    limit: 1
  });
  if (slugCheck.items.length > 0) {
    throw PluginRouteError.conflict(`A form with slug "${newSlug}" already exists`);
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const id = ulid();
  const duplicate = {
    ...existing,
    name: newName,
    slug: newSlug,
    submissionCount: 0,
    lastSubmissionAt: null,
    createdAt: now,
    updatedAt: now
  };
  await forms$2(ctx).put(id, duplicate);
  return { id, ...duplicate };
}
function validateFieldNames(pages) {
  const names = /* @__PURE__ */ new Set();
  for (const page of pages) {
    for (const field of page.fields) {
      if (names.has(field.name)) {
        throw PluginRouteError.badRequest(`Duplicate field name "${field.name}" across form pages`);
      }
      names.add(field.name);
    }
  }
}
async function deleteFormSubmissions(formId, ctx) {
  let cursor;
  do {
    const batch = await submissions$2(ctx).query({
      where: { formId },
      limit: 100,
      cursor
    });
    if (ctx.media && "delete" in ctx.media) {
      const mediaWithDelete = ctx.media;
      for (const item of batch.items) {
        const sub = item.data;
        if (sub.files) {
          for (const file of sub.files) {
            await mediaWithDelete.delete(file.mediaId).catch(() => {
            });
          }
        }
      }
    }
    const ids = batch.items.map((item) => item.id);
    if (ids.length > 0) {
      await submissions$2(ctx).deleteMany(ids);
    }
    cursor = batch.cursor;
  } while (cursor);
}
function forms$1(ctx) {
  return ctx.storage.forms;
}
function submissions$1(ctx) {
  return ctx.storage.submissions;
}
async function submissionsListHandler(ctx) {
  const input = ctx.input;
  const result = await submissions$1(ctx).query({
    where: {
      formId: input.formId,
      ...input.status ? { status: input.status } : {},
      ...input.starred !== void 0 ? { starred: input.starred } : {}
    },
    orderBy: { createdAt: "desc" },
    limit: input.limit,
    cursor: input.cursor
  });
  return {
    items: result.items.map((item) => ({ id: item.id, ...item.data })),
    hasMore: result.hasMore,
    cursor: result.cursor
  };
}
async function submissionGetHandler(ctx) {
  const sub = await submissions$1(ctx).get(ctx.input.id);
  if (!sub) {
    throw PluginRouteError.notFound("Submission not found");
  }
  return { id: ctx.input.id, ...sub };
}
async function submissionUpdateHandler(ctx) {
  const input = ctx.input;
  const existing = await submissions$1(ctx).get(input.id);
  if (!existing) {
    throw PluginRouteError.notFound("Submission not found");
  }
  const updated = {
    ...existing,
    status: input.status ?? existing.status,
    starred: input.starred ?? existing.starred,
    notes: input.notes !== void 0 ? input.notes : existing.notes
  };
  await submissions$1(ctx).put(input.id, updated);
  return { id: input.id, ...updated };
}
async function submissionDeleteHandler(ctx) {
  const input = ctx.input;
  const existing = await submissions$1(ctx).get(input.id);
  if (!existing) {
    throw PluginRouteError.notFound("Submission not found");
  }
  if (existing.files && ctx.media && "delete" in ctx.media) {
    const mediaWithDelete = ctx.media;
    for (const file of existing.files) {
      await mediaWithDelete.delete(file.mediaId).catch(() => {
      });
    }
  }
  await submissions$1(ctx).delete(input.id);
  if (existing.formId) {
    const form = await forms$1(ctx).get(existing.formId);
    if (form) {
      const count = await submissions$1(ctx).count({ formId: existing.formId });
      await forms$1(ctx).put(existing.formId, {
        ...form,
        submissionCount: count
      });
    }
  }
  return { deleted: true };
}
async function exportHandler(ctx) {
  const input = ctx.input;
  let form = null;
  const byId = await forms$1(ctx).get(input.formId);
  if (byId) {
    form = byId;
  } else {
    const bySlug = await forms$1(ctx).query({
      where: { slug: input.formId },
      limit: 1
    });
    if (bySlug.items.length > 0) {
      form = bySlug.items[0].data;
    }
  }
  if (!form) {
    throw PluginRouteError.notFound("Form not found");
  }
  const where = {
    formId: input.formId
  };
  if (input.status) where.status = input.status;
  if (input.from || input.to) {
    const range = {};
    if (input.from) range.gte = input.from;
    if (input.to) range.lte = input.to;
    where.createdAt = range;
  }
  const allItems = [];
  let cursor;
  do {
    const batch = await submissions$1(ctx).query({
      where,
      orderBy: { createdAt: "desc" },
      limit: 100,
      cursor
    });
    for (const item of batch.items) {
      allItems.push(item);
    }
    cursor = batch.cursor;
  } while (cursor);
  if (input.format === "json") {
    return {
      data: allItems.map((item) => item.data),
      count: allItems.length,
      contentType: "application/json"
    };
  }
  const csv = formatCsv(form, allItems);
  return {
    data: csv,
    count: allItems.length,
    contentType: "text/csv",
    filename: `${form.slug}-submissions-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`
  };
}
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
async function verifyTurnstile(token, secretKey, httpFetch, remoteIp) {
  const body = {
    secret: secretKey,
    response: token
  };
  if (remoteIp) {
    body.remoteip = remoteIp;
  }
  const res = await httpFetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return {
    success: data.success,
    errorCodes: data["error-codes"] ?? []
  };
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+/;
const TEL_RE = /^[+\d][\d\s()-]*$/;
function validateSubmission(fields, data) {
  const errors = [];
  const validated = {};
  for (const field of fields) {
    if (field.condition && !evaluateCondition(field.condition, data)) {
      continue;
    }
    const raw = data[field.name];
    const value = typeof raw === "string" ? raw.trim() : raw;
    const isEmpty = value === void 0 || value === null || value === "";
    if (field.required && isEmpty) {
      errors.push({ field: field.name, message: `${field.label} is required` });
      continue;
    }
    if (isEmpty) {
      continue;
    }
    const typeError = validateFieldType(field, value);
    if (typeError) {
      errors.push({ field: field.name, message: typeError });
      continue;
    }
    const ruleErrors = validateFieldRules(field, value);
    for (const msg of ruleErrors) {
      errors.push({ field: field.name, message: msg });
    }
    if (ruleErrors.length === 0) {
      validated[field.name] = coerceValue(field.type, value);
    }
  }
  return { valid: errors.length === 0, errors, data: validated };
}
function validateFieldType(field, value) {
  if (typeof value !== "string" && field.type !== "checkbox" && field.type !== "number") {
    return `${field.label} has an invalid value`;
  }
  const strValue = String(value);
  switch (field.type) {
    case "email":
      if (!EMAIL_RE.test(strValue)) return `${field.label} must be a valid email address`;
      break;
    case "url":
      if (!URL_RE.test(strValue)) return `${field.label} must be a valid URL`;
      break;
    case "tel":
      if (!TEL_RE.test(strValue)) return `${field.label} must be a valid phone number`;
      break;
    case "number": {
      const num = Number(value);
      if (Number.isNaN(num)) return `${field.label} must be a number`;
      break;
    }
    case "date":
      if (Number.isNaN(Date.parse(strValue))) return `${field.label} must be a valid date`;
      break;
    case "select":
    case "radio":
      if (field.options && !field.options.some((o) => o.value === strValue)) {
        return `${field.label} has an invalid selection`;
      }
      break;
    case "checkbox-group": {
      const values = Array.isArray(value) ? value : [value];
      if (field.options) {
        const validValues = new Set(field.options.map((o) => o.value));
        for (const v of values) {
          if (!validValues.has(String(v))) {
            return `${field.label} contains an invalid selection`;
          }
        }
      }
      break;
    }
  }
  return null;
}
function validateFieldRules(field, value) {
  const errors = [];
  const v = field.validation;
  if (!v) return errors;
  const strValue = String(value);
  if (v.minLength !== void 0 && strValue.length < v.minLength) {
    errors.push(`${field.label} must be at least ${v.minLength} characters`);
  }
  if (v.maxLength !== void 0 && strValue.length > v.maxLength) {
    errors.push(`${field.label} must be at most ${v.maxLength} characters`);
  }
  if (field.type === "number") {
    const num = Number(value);
    if (v.min !== void 0 && num < v.min) {
      errors.push(`${field.label} must be at least ${v.min}`);
    }
    if (v.max !== void 0 && num > v.max) {
      errors.push(`${field.label} must be at most ${v.max}`);
    }
  }
  if (v.pattern) {
    try {
      const re = new RegExp(v.pattern);
      if (!re.test(strValue)) {
        errors.push(v.patternMessage || `${field.label} has an invalid format`);
      }
    } catch {
    }
  }
  return errors;
}
function coerceValue(type, value) {
  switch (type) {
    case "number":
      return Number(value);
    case "checkbox":
      return value === "on" || value === "true" || value === true;
    case "checkbox-group":
      return Array.isArray(value) ? value : [value];
    default:
      return typeof value === "string" ? value.trim() : value;
  }
}
function evaluateCondition(condition, data) {
  const fieldValue = data[condition.field];
  const strValue = fieldValue === void 0 || fieldValue === null ? "" : String(fieldValue);
  const isFilled = strValue !== "";
  switch (condition.op) {
    case "eq":
      return strValue === (condition.value ?? "");
    case "neq":
      return strValue !== (condition.value ?? "");
    case "filled":
      return isFilled;
    case "empty":
      return !isFilled;
    default:
      return true;
  }
}
function forms(ctx) {
  return ctx.storage.forms;
}
function submissions(ctx) {
  return ctx.storage.submissions;
}
async function submitHandler(ctx) {
  const input = ctx.input;
  let formId = input.formId;
  let form = await forms(ctx).get(formId);
  if (!form) {
    const bySlug = await forms(ctx).query({
      where: { slug: input.formId },
      limit: 1
    });
    if (bySlug.items.length > 0) {
      formId = bySlug.items[0].id;
      form = bySlug.items[0].data;
    }
  }
  if (!form) {
    throw PluginRouteError.notFound("Form not found");
  }
  if (form.status === "paused") {
    throw new PluginRouteError(
      "FORM_PAUSED",
      "This form is not currently accepting submissions",
      410
    );
  }
  const settings = form.settings;
  if (settings.spamProtection === "turnstile") {
    const token = input.data["cf-turnstile-response"];
    if (typeof token !== "string" || !token) {
      throw PluginRouteError.forbidden("Spam verification required");
    }
    const secretKey = await ctx.kv.get("settings:turnstileSecretKey");
    if (!secretKey || !ctx.http) {
      throw PluginRouteError.internal("Turnstile is not configured");
    }
    const result2 = await verifyTurnstile(
      token,
      secretKey,
      ctx.http.fetch.bind(ctx.http),
      ctx.requestMeta.ip
    );
    if (!result2.success) {
      ctx.log.warn("Turnstile verification failed", {
        errorCodes: result2.errorCodes
      });
      throw PluginRouteError.forbidden("Spam verification failed. Please try again.");
    }
  }
  if (settings.spamProtection === "honeypot") {
    if (input.data._hp) {
      return {
        success: true,
        message: settings.confirmationMessage
      };
    }
  }
  const allFields = getFormFields(form);
  const result = validateSubmission(allFields, input.data);
  if (!result.valid) {
    throw PluginRouteError.badRequest("Validation failed", { errors: result.errors });
  }
  const files = [];
  if (input.files && ctx.media && "upload" in ctx.media) {
    const mediaWithWrite = ctx.media;
    for (const field of allFields.filter((f) => f.type === "file")) {
      const fileData = input.files[field.name];
      if (!fileData) continue;
      if (field.validation?.accept) {
        const allowed = field.validation.accept.split(",").map((s) => s.trim().toLowerCase());
        const ext = `.${fileData.filename.split(".").pop()?.toLowerCase()}`;
        const typeMatch = allowed.some(
          (a) => a === ext || a === fileData.contentType || fileData.contentType.startsWith(a.replace("/*", "/"))
        );
        if (!typeMatch) {
          throw PluginRouteError.badRequest(`File type not allowed for ${field.label}`);
        }
      }
      if (field.validation?.maxFileSize && fileData.bytes.byteLength > field.validation.maxFileSize) {
        throw PluginRouteError.badRequest(
          `File too large for ${field.label}. Maximum: ${Math.round(field.validation.maxFileSize / 1024)} KB`
        );
      }
      const uploaded = await mediaWithWrite.upload(
        fileData.filename,
        fileData.contentType,
        fileData.bytes
      );
      files.push({
        fieldName: field.name,
        filename: fileData.filename,
        contentType: fileData.contentType,
        size: fileData.bytes.byteLength,
        mediaId: uploaded.mediaId
      });
    }
  }
  const submissionId = ulid();
  const submission = {
    formId,
    data: result.data,
    files: files.length > 0 ? files : void 0,
    status: "new",
    starred: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    meta: {
      ip: ctx.requestMeta.ip,
      userAgent: ctx.requestMeta.userAgent,
      referer: ctx.requestMeta.referer,
      country: ctx.requestMeta.geo?.country ?? null
    }
  };
  await submissions(ctx).put(submissionId, submission);
  const submissionCount = await submissions(ctx).count({ formId });
  await forms(ctx).put(formId, {
    ...form,
    submissionCount,
    lastSubmissionAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  if (settings.notifyEmails.length > 0 && !settings.digestEnabled && ctx.email) {
    const text = formatSubmissionText(form, result.data, files);
    for (const email of settings.notifyEmails) {
      await ctx.email.send({
        to: email,
        subject: `New submission: ${form.name}`,
        text
      }).catch((err) => {
        ctx.log.error("Failed to send notification email", {
          error: String(err),
          to: email
        });
      });
    }
  }
  if (settings.autoresponder && ctx.email) {
    const emailField = allFields.find((f) => f.type === "email");
    const submitterEmail = emailField ? result.data[emailField.name] : null;
    if (typeof submitterEmail === "string" && submitterEmail) {
      await ctx.email.send({
        to: submitterEmail,
        subject: settings.autoresponder.subject,
        text: settings.autoresponder.body
      }).catch((err) => {
        ctx.log.error("Failed to send autoresponder", { error: String(err) });
      });
    }
  }
  if (settings.webhookUrl && ctx.http) {
    const payload = formatWebhookPayload(form, submissionId, result.data, files);
    ctx.http.fetch(settings.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch((err) => {
      ctx.log.error("Webhook failed", {
        error: String(err),
        url: settings.webhookUrl
      });
    });
  }
  return {
    success: true,
    message: settings.confirmationMessage,
    redirect: settings.redirectUrl
  };
}
async function definitionHandler(ctx) {
  const { id } = ctx.input;
  let form = await forms(ctx).get(id);
  if (!form) {
    const bySlug = await forms(ctx).query({
      where: { slug: id },
      limit: 1
    });
    if (bySlug.items.length > 0) {
      form = bySlug.items[0].data;
    }
  }
  if (!form) {
    throw PluginRouteError.notFound("Form not found");
  }
  if (form.status !== "active") {
    throw new PluginRouteError("FORM_PAUSED", "This form is not currently available", 410);
  }
  const turnstileSiteKey = form.settings.spamProtection === "turnstile" ? await ctx.kv.get("settings:turnstileSiteKey") : null;
  return {
    name: form.name,
    slug: form.slug,
    pages: form.pages,
    settings: {
      spamProtection: form.settings.spamProtection,
      submitLabel: form.settings.submitLabel,
      nextLabel: form.settings.nextLabel,
      prevLabel: form.settings.prevLabel
    },
    status: form.status,
    _turnstileSiteKey: turnstileSiteKey
  };
}
const HTTP_SCHEME_RE = /^https?:\/\//i;
const httpUrl = string().url().refine((url) => HTTP_SCHEME_RE.test(url), "URL must use http or https");
const fieldOptionSchema = object({
  label: string().min(1),
  value: string().min(1)
});
const fieldValidationSchema = object({
  minLength: number().int().min(0).optional(),
  maxLength: number().int().min(1).optional(),
  min: number().optional(),
  max: number().optional(),
  pattern: string().optional(),
  patternMessage: string().optional(),
  accept: string().optional(),
  maxFileSize: number().int().min(1).optional()
}).optional();
const fieldConditionSchema = object({
  field: string().min(1),
  op: _enum(["eq", "neq", "filled", "empty"]),
  value: string().optional()
}).optional();
const fieldTypeSchema = _enum([
  "text",
  "email",
  "textarea",
  "number",
  "tel",
  "url",
  "date",
  "select",
  "radio",
  "checkbox",
  "checkbox-group",
  "file",
  "hidden"
]);
const formFieldSchema = object({
  id: string().min(1),
  type: fieldTypeSchema,
  label: string().min(1),
  name: string().min(1).regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/, "Invalid field name"),
  placeholder: string().optional(),
  helpText: string().optional(),
  required: boolean(),
  validation: fieldValidationSchema,
  options: array(fieldOptionSchema).optional(),
  defaultValue: string().optional(),
  width: _enum(["full", "half"]).default("full"),
  condition: fieldConditionSchema
});
const formPageSchema = object({
  title: string().optional(),
  fields: array(formFieldSchema).min(1, "Each page must have at least one field")
});
const autoresponderSchema = object({
  subject: string().min(1),
  body: string().min(1)
}).optional();
const formSettingsSchema = object({
  confirmationMessage: string().min(1).default("Thank you for your submission."),
  redirectUrl: httpUrl.optional().or(literal("")),
  notifyEmails: array(string().email()).default([]),
  digestEnabled: boolean().default(false),
  digestHour: number().int().min(0).max(23).default(9),
  autoresponder: autoresponderSchema,
  webhookUrl: httpUrl.optional().or(literal("")),
  retentionDays: number().int().min(0).default(0),
  spamProtection: _enum(["none", "honeypot", "turnstile"]).default("honeypot"),
  submitLabel: string().min(1).default("Submit"),
  nextLabel: string().optional(),
  prevLabel: string().optional()
});
const formCreateSchema = object({
  name: string().min(1).max(200),
  slug: string().min(1).max(100).regex(/^[a-z][a-z0-9-]*$/, "Slug must be lowercase alphanumeric with hyphens"),
  pages: array(formPageSchema).min(1),
  settings: formSettingsSchema
});
const formUpdateSchema = object({
  id: string().min(1),
  name: string().min(1).max(200).optional(),
  slug: string().min(1).max(100).regex(/^[a-z][a-z0-9-]*$/).optional(),
  pages: array(formPageSchema).min(1).optional(),
  settings: formSettingsSchema.partial().optional(),
  status: _enum(["active", "paused"]).optional()
});
const formDeleteSchema = object({
  id: string().min(1),
  deleteSubmissions: boolean().default(true)
});
const formDuplicateSchema = object({
  id: string().min(1),
  name: string().min(1).max(200).optional(),
  slug: string().min(1).max(100).regex(/^[a-z][a-z0-9-]*$/).optional()
});
const definitionSchema = object({
  id: string().min(1)
});
const submitSchema = object({
  formId: string().min(1),
  data: record(string(), unknown()),
  files: record(
    string(),
    object({
      filename: string(),
      contentType: string(),
      bytes: custom()
    })
  ).optional()
});
const submissionsListSchema = object({
  formId: string().min(1),
  status: _enum(["new", "read", "archived"]).optional(),
  starred: boolean().optional(),
  cursor: string().optional(),
  limit: number().int().min(1).max(100).default(50)
});
const submissionGetSchema = object({
  id: string().min(1)
});
const submissionUpdateSchema = object({
  id: string().min(1),
  status: _enum(["new", "read", "archived"]).optional(),
  starred: boolean().optional(),
  notes: string().optional()
});
const submissionDeleteSchema = object({
  id: string().min(1)
});
const exportSchema = object({
  formId: string().min(1),
  format: _enum(["csv", "json"]).default("csv"),
  status: _enum(["new", "read", "archived"]).optional(),
  from: string().datetime().optional(),
  to: string().datetime().optional()
});
const FORMS_STORAGE_CONFIG = {
  forms: {
    indexes: ["status", "createdAt"],
    uniqueIndexes: ["slug"]
  },
  submissions: {
    indexes: [
      "formId",
      "status",
      "starred",
      "createdAt",
      ["formId", "createdAt"],
      ["formId", "status"]
    ]
  }
};
function createPlugin$1(_options = {}) {
  return definePlugin({
    id: "emdash-forms",
    version: "0.0.1",
    capabilities: ["email:send", "write:media", "network:fetch"],
    allowedHosts: ["*"],
    storage: FORMS_STORAGE_CONFIG,
    hooks: {
      "plugin:activate": {
        handler: async (_event, ctx) => {
          if (ctx.cron) {
            await ctx.cron.schedule("cleanup", { schedule: "@weekly" });
          }
        }
      },
      cron: {
        handler: async (event, ctx) => {
          if (event.name === "cleanup") {
            await handleCleanup(ctx);
          } else if (event.name.startsWith("digest:")) {
            const formId = event.name.slice("digest:".length);
            await handleDigest(formId, ctx);
          }
        }
      }
    },
    // Route handlers are typed with specific input schemas but the route record
    // erases the generic to `unknown`. The cast is safe because the input schema
    // guarantees the runtime shape matches the handler's expected type.
    routes: {
      // --- Public routes ---
      submit: {
        public: true,
        input: submitSchema,
        handler: submitHandler
      },
      definition: {
        public: true,
        input: definitionSchema,
        handler: definitionHandler
      },
      // --- Admin routes (require auth) ---
      "forms/list": {
        handler: formsListHandler
      },
      "forms/create": {
        input: formCreateSchema,
        handler: formsCreateHandler
      },
      "forms/update": {
        input: formUpdateSchema,
        handler: formsUpdateHandler
      },
      "forms/delete": {
        input: formDeleteSchema,
        handler: formsDeleteHandler
      },
      "forms/duplicate": {
        input: formDuplicateSchema,
        handler: formsDuplicateHandler
      },
      "submissions/list": {
        input: submissionsListSchema,
        handler: submissionsListHandler
      },
      "submissions/get": {
        input: submissionGetSchema,
        handler: submissionGetHandler
      },
      "submissions/update": {
        input: submissionUpdateSchema,
        handler: submissionUpdateHandler
      },
      "submissions/delete": {
        input: submissionDeleteSchema,
        handler: submissionDeleteHandler
      },
      "submissions/export": {
        input: exportSchema,
        handler: exportHandler
      },
      "settings/turnstile-status": {
        handler: async (ctx) => {
          const siteKey = await ctx.kv.get("settings:turnstileSiteKey");
          const secretKey = await ctx.kv.get("settings:turnstileSecretKey");
          return {
            hasSiteKey: !!siteKey,
            hasSecretKey: !!secretKey
          };
        }
      }
    },
    admin: {
      settingsSchema: {
        turnstileSiteKey: { type: "string", label: "Turnstile Site Key" },
        turnstileSecretKey: { type: "secret", label: "Turnstile Secret Key" }
      },
      pages: [
        { path: "/", label: "Forms", icon: "list" },
        { path: "/submissions", label: "Submissions", icon: "inbox" }
      ],
      widgets: [{ id: "recent-submissions", title: "Recent Submissions", size: "half" }],
      portableTextBlocks: [
        {
          type: "emdash-form",
          label: "Form",
          icon: "form",
          description: "Embed a form",
          fields: [
            {
              type: "select",
              action_id: "formId",
              label: "Form",
              options: [],
              optionsRoute: "forms/list"
            }
          ]
        }
      ]
    }
  });
}
const CMS_TOOLS = [
  // ── Content ──────────────────────────────────────────────────────────────
  {
    name: "content_list",
    description: "List content items in a collection. Returns items with ID, title, slug, status. Use to browse existing posts, pages, or any content type.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug (e.g. 'posts', 'pages')" },
        status: {
          type: "string",
          enum: ["draft", "published", "scheduled"],
          description: "Filter by status. Omit to get all."
        },
        limit: { type: "number", description: "Max items (default 50, max 100)" },
        locale: { type: "string", description: "Filter by locale (e.g. 'en', 'fr')" }
      },
      required: ["collection"]
    }
  },
  {
    name: "content_get",
    description: "Get a single content item by ID or slug. Returns all field values and a _rev token for updates.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" },
        id: { type: "string", description: "Item ID (ULID) or slug" }
      },
      required: ["collection", "id"]
    }
  },
  {
    name: "content_create",
    description: "Create a new content item. The 'data' object contains field values matching the collection schema (use schema_get_collection to check). IMPORTANT: Items are draft by default and INVISIBLE on the website — always set status to 'published' or call content_publish after creation.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug (e.g. 'posts')" },
        data: {
          type: "object",
          description: "Field values as key-value pairs matching the collection schema (e.g. {title: '...', content: '...'})",
          additionalProperties: true
        },
        slug: { type: "string", description: "URL slug (auto-generated from title if omitted)" },
        status: {
          type: "string",
          enum: ["draft", "published"],
          description: "Initial status (default: 'draft')"
        },
        locale: { type: "string", description: "Locale (e.g. 'fr', 'km', 'en')" },
        translationOf: { type: "string", description: "ID of the source item this translates" }
      },
      required: ["collection", "data"]
    }
  },
  {
    name: "content_update",
    description: "Update an existing content item. Only include fields you want to change in 'data'.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" },
        id: { type: "string", description: "Item ID or slug" },
        data: {
          type: "object",
          description: "Fields to update (only changed fields)",
          additionalProperties: true
        },
        slug: { type: "string", description: "New slug" }
      },
      required: ["collection", "id"]
    }
  },
  {
    name: "content_publish",
    description: "Publish a draft item, making it live on the site.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" },
        id: { type: "string", description: "Item ID or slug" }
      },
      required: ["collection", "id"]
    }
  },
  {
    name: "content_unpublish",
    description: "Unpublish an item, reverting it to draft. It will no longer appear on the site.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" },
        id: { type: "string", description: "Item ID or slug" }
      },
      required: ["collection", "id"]
    }
  },
  {
    name: "content_delete",
    description: "Move a content item to trash (soft delete). Can be restored with content_restore.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" },
        id: { type: "string", description: "Item ID or slug" }
      },
      required: ["collection", "id"]
    }
  },
  {
    name: "content_restore",
    description: "Restore a soft-deleted content item from the trash.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" },
        id: { type: "string", description: "Item ID or slug" }
      },
      required: ["collection", "id"]
    }
  },
  {
    name: "content_permanent_delete",
    description: "Permanently delete a trashed item. Cannot be undone. Item must be in trash first.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" },
        id: { type: "string", description: "Item ID or slug" }
      },
      required: ["collection", "id"]
    }
  },
  {
    name: "content_duplicate",
    description: "Create a copy of an existing content item as a new draft.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" },
        id: { type: "string", description: "Item ID or slug" }
      },
      required: ["collection", "id"]
    }
  },
  {
    name: "content_schedule",
    description: "Schedule a content item for future publication. Use ISO 8601 datetime.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" },
        id: { type: "string", description: "Item ID or slug" },
        scheduledAt: { type: "string", description: "ISO 8601 datetime (e.g. '2025-06-01T09:00:00Z')" }
      },
      required: ["collection", "id", "scheduledAt"]
    }
  },
  {
    name: "content_compare",
    description: "Compare the published (live) version with the current draft. Shows differences.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" },
        id: { type: "string", description: "Item ID or slug" }
      },
      required: ["collection", "id"]
    }
  },
  {
    name: "content_discard_draft",
    description: "Discard unpublished draft changes and revert to the last published version.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" },
        id: { type: "string", description: "Item ID or slug" }
      },
      required: ["collection", "id"]
    }
  },
  {
    name: "content_list_trashed",
    description: "List soft-deleted items in a collection's trash.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" },
        limit: { type: "number", description: "Max items (default 50)" }
      },
      required: ["collection"]
    }
  },
  {
    name: "content_translations",
    description: "List all locale variants of a content item (translation group).",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" },
        id: { type: "string", description: "Item ID or slug" }
      },
      required: ["collection", "id"]
    }
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
        terms: { type: "array", items: { type: "string" }, description: "Array of term slugs to assign" }
      },
      required: ["collection", "id", "taxonomy", "terms"]
    }
  },
  // ── Schema ────────────────────────────────────────────────────────────────
  {
    name: "schema_list_collections",
    description: "List all content collections (content types). Use first to understand site structure.",
    input_schema: { type: "object", properties: {} }
  },
  {
    name: "schema_get_collection",
    description: "Get a collection's schema — all fields, types, and validation rules. Use before creating content.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" }
      },
      required: ["collection"]
    }
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
          description: "Features to enable. Recommend ['drafts','revisions','search'] for blog content"
        }
      },
      required: ["slug", "label"]
    }
  },
  {
    name: "schema_create_field",
    description: "Add a field to a collection. Types: string, text, portableText (rich text), number, integer, boolean, datetime, image, file, reference, select, multiSelect, json, slug.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" },
        slug: { type: "string", description: "Field identifier, lowercase (e.g. 'title', 'body')" },
        label: { type: "string", description: "Display label (e.g. 'Title', 'Body')" },
        type: {
          type: "string",
          enum: ["string", "text", "portableText", "number", "integer", "boolean", "datetime", "image", "file", "reference", "select", "multiSelect", "json", "slug"]
        },
        required: { type: "boolean", description: "Whether the field is required" },
        searchable: { type: "boolean", description: "Include in full-text search" }
      },
      required: ["collection", "slug", "label", "type"]
    }
  },
  {
    name: "schema_delete_collection",
    description: "Delete a collection and its database table. Irreversible — deletes all content.",
    input_schema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Collection slug to delete" },
        force: { type: "boolean", description: "Force deletion even if collection has content" }
      },
      required: ["slug"]
    }
  },
  {
    name: "schema_delete_field",
    description: "Remove a field from a collection. Drops the column and all data in it. Irreversible.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" },
        fieldSlug: { type: "string", description: "Field slug to remove" }
      },
      required: ["collection", "fieldSlug"]
    }
  },
  // ── Media ─────────────────────────────────────────────────────────────────
  {
    name: "media_list",
    description: "List uploaded media files (images, documents). Returns filename, URL, dimensions, alt text.",
    input_schema: {
      type: "object",
      properties: {
        mimeType: { type: "string", description: "Filter by MIME prefix (e.g. 'image/', 'application/pdf')" },
        limit: { type: "number", description: "Max items (default 50)" }
      }
    }
  },
  {
    name: "media_get",
    description: "Get details of a single media file by ID.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Media item ID" }
      },
      required: ["id"]
    }
  },
  {
    name: "media_update",
    description: "Update media metadata (alt text, caption).",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Media item ID" },
        alt: { type: "string", description: "Alt text for accessibility" },
        caption: { type: "string", description: "Caption text" }
      },
      required: ["id"]
    }
  },
  {
    name: "media_delete",
    description: "Permanently delete a media file from storage. Cannot be undone.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Media item ID" }
      },
      required: ["id"]
    }
  },
  // ── Search ────────────────────────────────────────────────────────────────
  {
    name: "search",
    description: "Full-text search across all content. Returns matching items ranked by relevance.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
        limit: { type: "number", description: "Max results (default 20)" }
      },
      required: ["query"]
    }
  },
  // ── Taxonomy ──────────────────────────────────────────────────────────────
  {
    name: "taxonomy_list",
    description: "List all taxonomies (categories, tags, etc.) defined on the site.",
    input_schema: { type: "object", properties: {} }
  },
  {
    name: "taxonomy_get",
    description: "Get a taxonomy and all its terms.",
    input_schema: {
      type: "object",
      properties: {
        taxonomy: { type: "string", description: "Taxonomy slug (e.g. 'category', 'tag')" }
      },
      required: ["taxonomy"]
    }
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
        description: { type: "string", description: "Term description" }
      },
      required: ["taxonomy", "name"]
    }
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
        description: { type: "string", description: "New description" }
      },
      required: ["taxonomy", "termSlug"]
    }
  },
  {
    name: "taxonomy_delete_term",
    description: "Delete a taxonomy term.",
    input_schema: {
      type: "object",
      properties: {
        taxonomy: { type: "string", description: "Taxonomy slug" },
        termSlug: { type: "string", description: "Term slug to delete" }
      },
      required: ["taxonomy", "termSlug"]
    }
  },
  // ── Menus ─────────────────────────────────────────────────────────────────
  {
    name: "menu_list",
    description: "List all navigation menus on the site.",
    input_schema: { type: "object", properties: {} }
  },
  {
    name: "menu_get",
    description: "Get a menu and all its items (with nesting).",
    input_schema: {
      type: "object",
      properties: {
        menu: { type: "string", description: "Menu slug (e.g. 'primary', 'footer')" }
      },
      required: ["menu"]
    }
  },
  {
    name: "menu_create",
    description: "Create a new navigation menu.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Menu identifier slug (e.g. 'primary')" },
        label: { type: "string", description: "Display label (e.g. 'Primary Navigation')" }
      },
      required: ["name", "label"]
    }
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
        parentId: { type: "string", description: "Parent item ID for nesting (optional)" }
      },
      required: ["menu", "type", "label"]
    }
  },
  {
    name: "menu_delete",
    description: "Delete a navigation menu and all its items.",
    input_schema: {
      type: "object",
      properties: {
        menu: { type: "string", description: "Menu slug" }
      },
      required: ["menu"]
    }
  },
  // ── Revisions ─────────────────────────────────────────────────────────────
  {
    name: "revision_list",
    description: "List revision history for a content item.",
    input_schema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Collection slug" },
        id: { type: "string", description: "Content item ID" }
      },
      required: ["collection", "id"]
    }
  },
  {
    name: "revision_restore",
    description: "Restore content to a previous revision.",
    input_schema: {
      type: "object",
      properties: {
        revisionId: { type: "string", description: "Revision ID to restore" }
      },
      required: ["revisionId"]
    }
  },
  // ── Settings ──────────────────────────────────────────────────────────────
  {
    name: "settings_get",
    description: "Get site settings (title, tagline, logo, etc.).",
    input_schema: { type: "object", properties: {} }
  },
  {
    name: "settings_update",
    description: "Update site settings. Only include fields you want to change.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Site title" },
        tagline: { type: "string", description: "Site tagline/description" },
        postsPerPage: { type: "number", description: "Posts per page for pagination" }
      }
    }
  },
  // ── Redirects ─────────────────────────────────────────────────────────────
  {
    name: "redirect_list",
    description: "List all URL redirects on the site.",
    input_schema: { type: "object", properties: {} }
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
        enabled: { type: "boolean", description: "Whether the redirect is active (default true)" }
      },
      required: ["source", "destination"]
    }
  },
  {
    name: "redirect_delete",
    description: "Delete a URL redirect.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Redirect ID" }
      },
      required: ["id"]
    }
  },
  // ── Comments ──────────────────────────────────────────────────────────────
  {
    name: "comment_list",
    description: "List comments with optional status filter (pending, approved, spam).",
    input_schema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["pending", "approved", "spam"], description: "Filter by status" },
        limit: { type: "number", description: "Max items" }
      }
    }
  },
  {
    name: "comment_moderate",
    description: "Moderate a comment — approve, mark as spam, or trash it.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Comment ID" },
        status: { type: "string", enum: ["approved", "spam", "trash"], description: "New status" }
      },
      required: ["id", "status"]
    }
  },
  // ── Bylines ───────────────────────────────────────────────────────────────
  {
    name: "byline_list",
    description: "List all author bylines (guest and user-linked).",
    input_schema: { type: "object", properties: {} }
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
        url: { type: "string", description: "Author website URL" }
      },
      required: ["slug", "displayName"]
    }
  },
  // ── Sections (reusable page blocks) ──────────────────────────────────────
  {
    name: "section_list",
    description: "List reusable page sections (hero blocks, feature grids, CTAs, etc.).",
    input_schema: {
      type: "object",
      properties: {
        source: { type: "string", enum: ["theme", "user", "import"], description: "Filter by source" },
        search: { type: "string", description: "Search by title or keywords" }
      }
    }
  },
  {
    name: "section_get",
    description: "Get a section's content by slug.",
    input_schema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Section slug" }
      },
      required: ["slug"]
    }
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
        content: { type: "array", description: "Portable Text blocks array", items: { type: "object", additionalProperties: true } }
      },
      required: ["slug", "title", "content"]
    }
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
        content: { type: "array", description: "New Portable Text content", items: { type: "object", additionalProperties: true } }
      },
      required: ["slug"]
    }
  },
  {
    name: "section_delete",
    description: "Delete a user-created section. Cannot delete theme-provided sections.",
    input_schema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Section slug" }
      },
      required: ["slug"]
    }
  },
  // ── Widget Areas & Widgets ───────────────────────────────────────────────
  {
    name: "widget_area_list",
    description: "List all widget areas (sidebar, footer, etc.) with their widgets.",
    input_schema: { type: "object", properties: {} }
  },
  {
    name: "widget_area_create",
    description: "Create a new widget area for page layout (e.g. 'sidebar', 'footer', 'homepage-hero').",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Unique identifier (e.g. 'sidebar', 'footer')" },
        label: { type: "string", description: "Display name (e.g. 'Sidebar', 'Footer Widgets')" },
        description: { type: "string", description: "Where this area appears on the site" }
      },
      required: ["name", "label"]
    }
  },
  {
    name: "widget_area_delete",
    description: "Delete a widget area and all its widgets.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Widget area name" }
      },
      required: ["name"]
    }
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
        componentId: { type: "string", description: "Component ID (for type 'component', e.g. 'core:recent-posts')" }
      },
      required: ["area", "type"]
    }
  },
  {
    name: "widget_delete",
    description: "Remove a widget from a widget area.",
    input_schema: {
      type: "object",
      properties: {
        area: { type: "string", description: "Widget area name" },
        widgetId: { type: "string", description: "Widget ID to remove" }
      },
      required: ["area", "widgetId"]
    }
  },
  // ── Web Browsing ──────────────────────────────────────────────────────────
  {
    name: "web_browse",
    description: "Fetch and read a web page. Use to understand a user's existing website, get inspiration from competitors, or verify that published content is live. Returns the page title, meta description, and text content.",
    input_schema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Full URL to fetch (e.g. 'https://example.com')" }
      },
      required: ["url"]
    }
  }
];
const ANTHROPIC_VERSION = "2023-06-01";
function resolveProvider(apiKey) {
  if (apiKey.startsWith("sk-api-")) {
    return { baseUrl: "https://api.minimax.io/anthropic/v1/messages", model: "MiniMax-M2.7" };
  }
  return { baseUrl: "https://api.anthropic.com/v1/messages", model: "claude-sonnet-4-6" };
}
const SYSTEM_PROMPT = `You are Token Press AI — you help users BUILD beautiful, professional websites through conversation.

Every action you take changes the LIVE WEBSITE. The homepage has PRE-DESIGNED visual components that automatically render when you create the right collections.

VISUAL SECTIONS — COLLECTIONS THAT AUTO-RENDER:
The homepage and dedicated pages detect these collections and render them with professional design:

1. "services" → Beautiful service cards with icons (homepage grid + /services page)
   FIELDS: title (string), description (text), icon (string — emoji like ⚡🎯💡🔧📊🛡️)

2. "team" → Team member cards with avatars (homepage grid + /team page)
   FIELDS: name (string), role (string), bio (text)

3. "testimonials" → Testimonial quotes with author info (homepage section)
   FIELDS: quote (text), author_name (string), author_role (string), author_company (string)

4. "case_studies" → Case study cards with results badges (homepage section)
   FIELDS: title (string), client (string), description (text), results (string)

5. "faq" → Accordion FAQ section (homepage)
   FIELDS: question (string), answer (text)

6. "pricing" → Pricing tier cards (homepage)
   FIELDS: name (string), price (string), features (text — one per line), cta_text (string), cta_url (string), featured (boolean)

7. "posts" → Blog post cards (homepage + /posts page — already exists)

AVAILABLE PAGES (auto-generated from collections):
- / → Homepage with all sections
- /services → All services grid
- /services/{slug} → Individual service detail
- /team → All team members
- /posts → All blog posts
- /posts/{slug} → Individual post
- /contact → Contact page
- /pages/{slug} → CMS pages

SITE BUILDING WORKFLOW:
1. settings_update → site title + tagline (shown in hero banner)
2. Create collections with EXACT field names above
3. Create + PUBLISH content items (status: "published" + content_publish)
4. menu_create "primary" → menu_add_item for each page (type: "custom", customUrl: "/services")
5. Tell user to click "View website" — professional site with gradient hero, designed cards, CTAs

CRITICAL RULES:
1. Use EXACT field slugs above — they must match for visual components to render
2. ALWAYS publish (status: "published" + content_publish)
3. Check schema_get_collection before creating content
4. content_create data param: {title: "...", description: "..."}
5. Icons: use emoji ⚡ 🎯 💡 🔧 📊 🛡️ 🚀 💼 🌐 📱
6. Act immediately — no confirmation needed (except deletions)
7. Respond in user's language
8. Menu items: type "custom", customUrl "/path"
9. web_browse URLs the user shares before building
10. When building a COMPLETE site, create ALL collections at once, then ALL content, then menu`;
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function createPlugin(options = {}) {
  return definePlugin({
    id: "ai-interface",
    version: "0.2.0",
    capabilities: [],
    allowedHosts: ["api.anthropic.com", "api.minimax.io"],
    admin: {
      entry: "@angkor-cms/plugin-ai-interface/admin",
      pages: [{ path: "/chat", label: "AI Assistant", icon: "sparkle" }],
      widgets: []
    },
    routes: {
      // ── Anthropic proxy ──────────────────────────────────────────
      chat: {
        handler: async (ctx) => {
          let apiKey = options.anthropicApiKey;
          if (!apiKey) {
            try {
              const { env: env2 } = await import("cloudflare:workers");
              apiKey = env2.ANTHROPIC_API_KEY;
            } catch {
            }
          }
          if (!apiKey) {
            return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), {
              status: 500,
              headers: { "Content-Type": "application/json" }
            });
          }
          const input = ctx.input;
          const messages = Array.isArray(input?.messages) ? input.messages : [];
          if (messages.length === 0) {
            return new Response(JSON.stringify({ error: "No messages provided" }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
          }
          let systemPrompt = SYSTEM_PROMPT;
          const pc = input?.pageContext;
          if (pc) {
            let ctx_prompt = "";
            switch (pc.type) {
              case "content":
                if (pc.isEditing) ctx_prompt = `

CONTEXT: The user is editing content item "${pc.contentId}" in the "${pc.collection}" collection. Prioritize: improving text, translating, SEO, publishing. Use content_get to read current content before suggesting changes.`;
                else if (pc.isNew) ctx_prompt = `

CONTEXT: The user is creating a new "${pc.collection}" item. Use schema_get_collection to check fields, then help fill them with great content.`;
                else ctx_prompt = `

CONTEXT: The user is browsing the "${pc.collection}" collection. They may want to create, edit, or manage items.`;
                break;
              case "menu":
                ctx_prompt = pc.menuName ? `

CONTEXT: The user is editing the "${pc.menuName}" menu. Use menu_get to see current items, then help add/remove/reorder.` : `

CONTEXT: The user is managing menus. Use menu_list to see existing menus.`;
                break;
              case "taxonomy":
                ctx_prompt = `

CONTEXT: The user is managing the "${pc.taxonomy}" taxonomy. Help add, edit, or organize terms.`;
                break;
              case "settings":
                ctx_prompt = `

CONTEXT: The user is in site settings (${pc.settingsPage || "general"}). Use settings_get to see current values, then help configure.`;
                break;
              case "content-types":
                ctx_prompt = pc.slug ? `

CONTEXT: The user is editing the "${pc.slug}" content type. Use schema_get_collection to see current schema.` : `

CONTEXT: The user is managing content types. Use schema_list_collections to see what exists.`;
                break;
              case "media":
                ctx_prompt = "\n\nCONTEXT: The user is in the media library. Help manage files — list, update metadata, or identify unused media.";
                break;
              case "comments":
                ctx_prompt = "\n\nCONTEXT: The user is managing comments. Use comment_list to show pending ones.";
                break;
              case "sections":
                ctx_prompt = "\n\nCONTEXT: The user is managing page sections. Help create reusable blocks (heroes, grids, CTAs).";
                break;
              case "widgets":
                ctx_prompt = "\n\nCONTEXT: The user is managing widget areas. Help set up sidebar, footer, or other zones.";
                break;
              case "redirects":
                ctx_prompt = "\n\nCONTEXT: The user is managing URL redirects. Help create or edit redirect rules.";
                break;
              case "users":
                ctx_prompt = "\n\nCONTEXT: The user is managing site users.";
                break;
              case "dashboard":
                ctx_prompt = "\n\nCONTEXT: The user is on the dashboard — overview mode. They may want to start building or check site status.";
                break;
            }
            systemPrompt += ctx_prompt;
          }
          const provider = resolveProvider(apiKey);
          const model = options.model ?? provider.model;
          const maxTokens = options.maxTokens ?? 4096;
          const anthropicResponse = await fetch(provider.baseUrl, {
            method: "POST",
            headers: {
              "x-api-key": apiKey,
              "anthropic-version": ANTHROPIC_VERSION,
              "content-type": "application/json"
            },
            body: JSON.stringify({
              model,
              max_tokens: maxTokens,
              system: systemPrompt,
              tools: CMS_TOOLS,
              messages,
              stream: true
            })
          });
          if (!anthropicResponse.ok || !anthropicResponse.body) {
            const errText = await anthropicResponse.text().catch(() => "Unknown error");
            return new Response(
              JSON.stringify({ error: `Anthropic API ${anthropicResponse.status}: ${errText}` }),
              { status: 502, headers: { "Content-Type": "application/json" } }
            );
          }
          return new Response(anthropicResponse.body, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              "X-Accel-Buffering": "no"
            }
          });
        }
      },
      // ── Web browsing proxy ───────────────────────────────────────
      browse: {
        handler: async (ctx) => {
          const input = isRecord(ctx.input) ? ctx.input : {};
          const url = typeof input.url === "string" ? input.url : "";
          if (!url || !url.startsWith("http://") && !url.startsWith("https://")) {
            return { error: "Invalid URL — must start with http:// or https://" };
          }
          try {
            const response = await fetch(url, {
              headers: { "User-Agent": "TokenPress-AI/1.0 (website builder bot)" },
              redirect: "follow"
            });
            const html = await response.text();
            const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
            const title = titleMatch?.[1]?.trim() ?? "";
            const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i);
            const description = descMatch?.[1]?.trim() ?? "";
            const text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "[NAV]").replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "[HEADER]").replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "[FOOTER]").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 1e4);
            return { title, description, url, statusCode: response.status, content: text };
          } catch (err) {
            return { error: `Failed to fetch: ${err instanceof Error ? err.message : String(err)}` };
          }
        }
      },
      // ── Conversation persistence ─────────────────────────────────
      conversations: {
        handler: async (ctx) => {
          const list = await ctx.kv.get(
            "conversations:index"
          ) ?? [];
          return list;
        }
      },
      "conversations/save": {
        handler: async (ctx) => {
          const input = isRecord(ctx.input) ? ctx.input : {};
          const id = typeof input.id === "string" ? input.id : "";
          const title = typeof input.title === "string" ? input.title : "Untitled";
          const messages = Array.isArray(input.messages) ? input.messages : [];
          if (!id) return { error: "Missing conversation id" };
          const now = (/* @__PURE__ */ new Date()).toISOString();
          await ctx.kv.set(`conversations:${id}`, { title, messages, updatedAt: now });
          const list = await ctx.kv.get(
            "conversations:index"
          ) ?? [];
          const existing = list.findIndex((c) => c.id === id);
          const meta = { id, title, updatedAt: now };
          if (existing >= 0) list[existing] = meta;
          else list.unshift(meta);
          await ctx.kv.set("conversations:index", list.slice(0, 50));
          return { success: true };
        }
      },
      "conversations/load": {
        handler: async (ctx) => {
          const input = isRecord(ctx.input) ? ctx.input : {};
          const id = typeof input.id === "string" ? input.id : "";
          if (!id) return { error: "Missing conversation id" };
          return await ctx.kv.get(`conversations:${id}`) ?? { error: "Not found" };
        }
      },
      "conversations/delete": {
        handler: async (ctx) => {
          const input = isRecord(ctx.input) ? ctx.input : {};
          const id = typeof input.id === "string" ? input.id : "";
          if (!id) return { error: "Missing conversation id" };
          await ctx.kv.delete(`conversations:${id}`);
          const list = await ctx.kv.get(
            "conversations:index"
          ) ?? [];
          await ctx.kv.set(
            "conversations:index",
            list.filter((c) => c.id !== id)
          );
          return { success: true };
        }
      }
    }
  });
}
const plugins = [
  createPlugin$1({}),
  createPlugin({})
];
function setEmailSendCallback(callback) {
}
const TRAILING_SLASH_RE = /\/$/;
const NEWLINE_RE = /[\n\r]/g;
const COMMENT_CLOSE_RE = /\*\//g;
function generatePluginWrapper(manifest, options) {
  const storageCollections = Object.keys(manifest.storage || {});
  const site = options?.site ?? {
    name: "",
    url: "",
    locale: "en"
  };
  const hasReadUsers = manifest.capabilities.includes("read:users");
  const hasEmailSend = manifest.capabilities.includes("email:send");
  return `
// =============================================================================
// Sandboxed Plugin Wrapper
// Generated by @emdash-cms/cloudflare
// Plugin: ${sanitizeComment(manifest.id)}@${sanitizeComment(manifest.version)}
// =============================================================================

import { WorkerEntrypoint } from "cloudflare:workers";

// Plugin code lives in a separate module for scope isolation
import pluginModule from "sandbox-plugin.js";

// Extract hooks and routes from the plugin module
const hooks = pluginModule?.hooks || pluginModule?.default?.hooks || {};
const routes = pluginModule?.routes || pluginModule?.default?.routes || {};

// -----------------------------------------------------------------------------
// Context Factory - creates ctx that proxies to BRIDGE
// -----------------------------------------------------------------------------

function createContext(env) {
	const bridge = env.BRIDGE;
	const storageCollections = ${JSON.stringify(storageCollections)};
	
	// KV - proxies to bridge.kvGet/Set/Delete/List
	const kv = {
		get: (key) => bridge.kvGet(key),
		set: (key, value) => bridge.kvSet(key, value),
		delete: (key) => bridge.kvDelete(key),
		list: (prefix) => bridge.kvList(prefix)
	};
	
	// Storage collection factory
	function createStorageCollection(collectionName) {
		return {
			get: (id) => bridge.storageGet(collectionName, id),
			put: (id, data) => bridge.storagePut(collectionName, id, data),
			delete: (id) => bridge.storageDelete(collectionName, id),
			exists: async (id) => (await bridge.storageGet(collectionName, id)) !== null,
			query: (opts) => bridge.storageQuery(collectionName, opts),
			count: (where) => bridge.storageCount(collectionName, where),
			getMany: (ids) => bridge.storageGetMany(collectionName, ids),
			putMany: (items) => bridge.storagePutMany(collectionName, items),
			deleteMany: (ids) => bridge.storageDeleteMany(collectionName, ids)
		};
	}
	
	// Storage proxy that creates collections on access
	const storage = new Proxy({}, {
		get(_, collectionName) {
			if (typeof collectionName !== "string") return undefined;
			return createStorageCollection(collectionName);
		}
	});
	
	// Content access - proxies to bridge (capability enforced by bridge)
	const content = {
		get: (collection, id) => bridge.contentGet(collection, id),
		list: (collection, opts) => bridge.contentList(collection, opts),
		create: (collection, data) => bridge.contentCreate(collection, data),
		update: (collection, id, data) => bridge.contentUpdate(collection, id, data),
		delete: (collection, id) => bridge.contentDelete(collection, id)
	};
	
	// Media access - proxies to bridge (capability enforced by bridge)
	const media = {
		get: (id) => bridge.mediaGet(id),
		list: (opts) => bridge.mediaList(opts),
		upload: (filename, contentType, bytes) => bridge.mediaUpload(filename, contentType, bytes),
		getUploadUrl: () => { throw new Error("getUploadUrl is not available in sandbox mode. Use media.upload(filename, contentType, bytes) instead."); },
		delete: (id) => bridge.mediaDelete(id)
	};
	
	// HTTP access - proxies to bridge (capability + host enforced by bridge)
	const http = {
		fetch: async (url, init) => {
			const result = await bridge.httpFetch(url, init);
			// Bridge returns serialized response, reconstruct Response-like object
			return {
				status: result.status,
				ok: result.status >= 200 && result.status < 300,
				headers: new Headers(result.headers),
				text: async () => result.text,
				json: async () => JSON.parse(result.text)
			};
		}
	};
	
	// Logger - proxies to bridge
	const log = {
		debug: (msg, data) => bridge.log("debug", msg, data),
		info: (msg, data) => bridge.log("info", msg, data),
		warn: (msg, data) => bridge.log("warn", msg, data),
		error: (msg, data) => bridge.log("error", msg, data)
	};
	
	// Site info - injected at wrapper generation time, no RPC needed
	const site = ${JSON.stringify(site)};
	
	// URL helper - generates absolute URLs from paths
	const siteBaseUrl = ${JSON.stringify(site.url.replace(TRAILING_SLASH_RE, ""))};
	function url(path) {
		if (!path.startsWith("/")) {
			throw new Error('URL path must start with "/", got: "' + path + '"');
		}
		if (path.startsWith("//")) {
			throw new Error('URL path must not be protocol-relative, got: "' + path + '"');
		}
		return siteBaseUrl + path;
	}
	
	// User access - proxies to bridge (capability enforced by bridge)
	const users = ${hasReadUsers} ? {
		get: (id) => bridge.userGet(id),
		getByEmail: (email) => bridge.userGetByEmail(email),
		list: (opts) => bridge.userList(opts)
	} : undefined;
	
	// Email access - proxies to bridge (capability enforced by bridge)
	const email = ${hasEmailSend} ? {
		send: (message) => bridge.emailSend(message)
	} : undefined;
	
	return {
		plugin: {
			id: env.PLUGIN_ID,
			version: env.PLUGIN_VERSION
		},
		storage,
		kv,
		content,
		media,
		http,
		log,
		site,
		url,
		users,
		email
	};
}

// -----------------------------------------------------------------------------
// Worker Entrypoint (RPC interface)
// -----------------------------------------------------------------------------

export default class PluginEntrypoint extends WorkerEntrypoint {
	async invokeHook(hookName, event) {
		const ctx = createContext(this.env);
		
		// Find the hook handler
		const hookDef = hooks[hookName];
		
		if (!hookDef) {
			// No handler for this hook - that's ok, return undefined
			return undefined;
		}
		
		// Get the handler (might be wrapped in config object)
		const handler = typeof hookDef === "function" ? hookDef : hookDef.handler;
		
		if (typeof handler !== "function") {
			throw new Error(\`Hook \${hookName} handler is not a function\`);
		}
		
		// Execute the hook
		return handler(event, ctx);
	}
	
	async invokeRoute(routeName, input, serializedRequest) {
		const ctx = createContext(this.env);
		
		// Find the route handler
		const route = routes[routeName];
		
		if (!route) {
			throw new Error(\`Route not found: \${routeName}\`);
		}
		
		// Get handler (might be direct function or object with handler)
		const handler = typeof route === "function" ? route : route.handler;
		
		if (typeof handler !== "function") {
			throw new Error(\`Route \${routeName} handler is not a function\`);
		}
		
		// Execute the route handler with input, request metadata, and context
		return handler({ input, request: serializedRequest, requestMeta: serializedRequest.meta }, ctx);
	}
}
`;
}
function sanitizeComment(s) {
  return s.replace(NEWLINE_RE, " ").replace(COMMENT_CLOSE_RE, "* /");
}
const DEFAULT_LIMITS = {
  cpuMs: 50,
  memoryMb: 128,
  subrequests: 10,
  wallTimeMs: 3e4
};
function getLoader() {
  return env.LOADER;
}
function getPluginBridge() {
  return _exports.PluginBridge;
}
function resolveLimits(limits) {
  return {
    cpuMs: limits?.cpuMs ?? DEFAULT_LIMITS.cpuMs,
    memoryMb: limits?.memoryMb ?? DEFAULT_LIMITS.memoryMb,
    subrequests: limits?.subrequests ?? DEFAULT_LIMITS.subrequests,
    wallTimeMs: limits?.wallTimeMs ?? DEFAULT_LIMITS.wallTimeMs
  };
}
var CloudflareSandboxRunner = class {
  plugins = /* @__PURE__ */ new Map();
  options;
  resolvedLimits;
  siteInfo;
  constructor(options) {
    this.options = options;
    this.resolvedLimits = resolveLimits(options.limits);
    this.siteInfo = options.siteInfo;
    setEmailSendCallback(options.emailSend ?? null);
  }
  /**
  * Set the email send callback for sandboxed plugins.
  * Called after the EmailPipeline is created, since the pipeline
  * doesn't exist when the sandbox runner is constructed.
  */
  setEmailSend(callback) {
  }
  /**
  * Check if Worker Loader is available.
  */
  isAvailable() {
    return !!getLoader() && !!getPluginBridge();
  }
  /**
  * Load a sandboxed plugin.
  *
  * @param manifest - Plugin manifest with capabilities and storage declarations
  * @param code - The bundled plugin JavaScript code
  */
  async load(manifest, code) {
    const pluginId = `${manifest.id}:${manifest.version}`;
    const existing = this.plugins.get(pluginId);
    if (existing) return existing;
    const loader = getLoader();
    const pluginBridge = getPluginBridge();
    if (!loader) throw new Error("Worker Loader not available. Add worker_loaders binding to wrangler config.");
    if (!pluginBridge) throw new Error("PluginBridge not available. Export PluginBridge from your worker entrypoint.");
    const plugin = new CloudflareSandboxedPlugin(manifest, code, loader, pluginBridge, this.resolvedLimits, this.siteInfo);
    this.plugins.set(pluginId, plugin);
    return plugin;
  }
  /**
  * Terminate all loaded plugins.
  */
  async terminateAll() {
    for (const plugin of this.plugins.values()) await plugin.terminate();
    this.plugins.clear();
  }
};
var CloudflareSandboxedPlugin = class {
  id;
  manifest;
  loader;
  createBridge;
  code;
  wrapperCode = null;
  limits;
  siteInfo;
  constructor(manifest, code, loader, createBridge, limits, siteInfo) {
    this.id = `${manifest.id}:${manifest.version}`;
    this.manifest = manifest;
    this.code = code;
    this.loader = loader;
    this.createBridge = createBridge;
    this.limits = limits;
    this.siteInfo = siteInfo;
  }
  /**
  * Create a fresh worker stub for the current request.
  *
  * Worker Loader stubs contain bindings (like BRIDGE) that are tied to the
  * request context in which they were created. Reusing stubs across requests
  * causes "Cannot perform I/O on behalf of a different request" errors.
  *
  * The Worker Loader internally caches the V8 isolate, so we only pay the
  * cost of creating the bridge binding and stub wrapper per request.
  */
  createWorker() {
    if (!this.wrapperCode) this.wrapperCode = generatePluginWrapper(this.manifest, { site: this.siteInfo });
    const bridgeBinding = this.createBridge({ props: {
      pluginId: this.manifest.id,
      pluginVersion: this.manifest.version || "0.0.0",
      capabilities: this.manifest.capabilities || [],
      allowedHosts: this.manifest.allowedHosts || [],
      storageCollections: Object.keys(this.manifest.storage || {})
    } });
    const loaderLimits = {
      cpuMs: this.limits.cpuMs,
      subRequests: this.limits.subrequests
    };
    return this.loader.get(this.id, () => ({
      compatibilityDate: "2025-01-01",
      mainModule: "plugin.js",
      modules: {
        "plugin.js": { js: this.wrapperCode },
        "sandbox-plugin.js": { js: this.code }
      },
      globalOutbound: null,
      limits: loaderLimits,
      env: {
        PLUGIN_ID: this.manifest.id,
        PLUGIN_VERSION: this.manifest.version || "0.0.0",
        BRIDGE: bridgeBinding
      }
    }));
  }
  /**
  * Run a function with wall-time enforcement.
  *
  * CPU limits and subrequest limits are enforced by the Worker Loader
  * at the V8 isolate level. Wall-time is enforced here because Worker
  * Loader doesn't expose a wall-time limit — a plugin could stall
  * indefinitely waiting on network I/O.
  */
  async withWallTimeLimit(operation, fn) {
    const wallTimeMs = this.limits.wallTimeMs;
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => {
        reject(/* @__PURE__ */ new Error(`Plugin ${this.manifest.id} exceeded wall-time limit of ${wallTimeMs}ms during ${operation}`));
      }, wallTimeMs);
    });
    try {
      return await Promise.race([fn(), timeout]);
    } finally {
      if (timer !== void 0) clearTimeout(timer);
    }
  }
  /**
  * Invoke a hook in the sandboxed plugin.
  *
  * CPU and subrequest limits are enforced by Worker Loader.
  * Wall-time is enforced here.
  */
  async invokeHook(hookName, event) {
    return this.withWallTimeLimit(`hook:${hookName}`, () => {
      return this.createWorker().getEntrypoint("default").invokeHook(hookName, event);
    });
  }
  /**
  * Invoke an API route in the sandboxed plugin.
  *
  * CPU and subrequest limits are enforced by Worker Loader.
  * Wall-time is enforced here.
  */
  async invokeRoute(routeName, input, request) {
    return this.withWallTimeLimit(`route:${routeName}`, () => {
      return this.createWorker().getEntrypoint("default").invokeRoute(routeName, input, request);
    });
  }
  /**
  * Terminate the sandboxed plugin.
  */
  async terminate() {
    this.wrapperCode = null;
  }
};
const createSandboxRunner$1 = (options) => {
  return new CloudflareSandboxRunner(options);
};
const createSandboxRunner = createSandboxRunner$1;
const sandboxEnabled = true;
const sandboxedPlugins = [
  {
    id: "webhook-notifier",
    version: "0.1.0",
    options: {},
    capabilities: ["network:fetch:any"],
    allowedHosts: [],
    storage: { "deliveries": { "indexes": ["timestamp", "webhookUrl", "status"] } },
    adminPages: [{ "path": "/settings", "label": "Webhook Settings", "icon": "send" }],
    adminWidgets: [{ "id": "status", "title": "Webhooks", "size": "third" }],
    adminEntry: void 0,
    // Code read from: /Users/niko/Documents/github/angkor-cms/packages/plugins/webhook-notifier/src/sandbox-entry.ts
    code: '/**\n * Sandbox Entry Point -- Webhook Notifier\n *\n * Canonical plugin implementation using the standard format.\n * Runs in both trusted (in-process) and sandboxed (isolate) modes.\n */\n\nimport { definePlugin } from "emdash";\nimport type { PluginContext } from "emdash";\n\ninterface ContentSaveEvent {\n	content: Record<string, unknown>;\n	collection: string;\n	isNew: boolean;\n}\n\ninterface ContentDeleteEvent {\n	id: string;\n	collection: string;\n}\n\ninterface MediaUploadEvent {\n	media: { id: string };\n}\n\ninterface WebhookPayload {\n	event: string;\n	timestamp: string;\n	collection?: string;\n	resourceId: string;\n	resourceType: "content" | "media";\n	data?: Record<string, unknown>;\n	metadata?: Record<string, unknown>;\n}\n\n// ── SSRF protection ──\n\nconst IPV6_BRACKET_PATTERN = /^\\[|\\]$/g;\nconst BLOCKED_HOSTNAMES = new Set(["localhost", "metadata.google.internal", "[::1]"]);\nconst PRIVATE_RANGES = [\n	{ start: (127 << 24) >>> 0, end: ((127 << 24) | 0x00ffffff) >>> 0 },\n	{ start: (10 << 24) >>> 0, end: ((10 << 24) | 0x00ffffff) >>> 0 },\n	{\n		start: ((172 << 24) | (16 << 16)) >>> 0,\n		end: ((172 << 24) | (31 << 16) | 0xffff) >>> 0,\n	},\n	{\n		start: ((192 << 24) | (168 << 16)) >>> 0,\n		end: ((192 << 24) | (168 << 16) | 0xffff) >>> 0,\n	},\n	{\n		start: ((169 << 24) | (254 << 16)) >>> 0,\n		end: ((169 << 24) | (254 << 16) | 0xffff) >>> 0,\n	},\n	{ start: 0, end: 0x00ffffff },\n];\n\nfunction validateWebhookUrl(url: string): void {\n	let parsed: URL;\n	try {\n		parsed = new URL(url);\n	} catch {\n		throw new Error("Invalid webhook URL");\n	}\n	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {\n		throw new Error(`Webhook URL scheme \'${parsed.protocol}\' is not allowed`);\n	}\n	const hostname = parsed.hostname.replace(IPV6_BRACKET_PATTERN, "");\n	if (BLOCKED_HOSTNAMES.has(hostname.toLowerCase())) {\n		throw new Error("Webhook URLs targeting internal hosts are not allowed");\n	}\n	const parts = hostname.split(".");\n	if (parts.length === 4) {\n		const nums = parts.map(Number);\n		if (nums.every((n) => !isNaN(n) && n >= 0 && n <= 255)) {\n			const ip = ((nums[0]! << 24) | (nums[1]! << 16) | (nums[2]! << 8) | nums[3]!) >>> 0;\n			if (PRIVATE_RANGES.some((r) => ip >= r.start && ip <= r.end)) {\n				throw new Error("Webhook URLs targeting private IP addresses are not allowed");\n			}\n		}\n	}\n	if (\n		hostname === "::1" ||\n		hostname.startsWith("fe80:") ||\n		hostname.startsWith("fc") ||\n		hostname.startsWith("fd")\n	) {\n		throw new Error("Webhook URLs targeting internal addresses are not allowed");\n	}\n}\n\n// ── Webhook delivery ──\n\ntype FetchFn = (url: string, init?: RequestInit) => Promise<Response>;\ntype LogFn = PluginContext["log"];\n\nasync function sendWebhook(\n	fetchFn: FetchFn,\n	log: LogFn,\n	url: string,\n	payload: WebhookPayload,\n	token: string | undefined,\n	maxRetries: number,\n): Promise<{ success: boolean; status?: number; error?: string }> {\n	validateWebhookUrl(url);\n\n	let lastError: string | undefined;\n	let lastStatus: number | undefined;\n\n	for (let attempt = 1; attempt <= maxRetries; attempt++) {\n		try {\n			const headers: Record<string, string> = {\n				"Content-Type": "application/json",\n				"X-EmDash-Event": payload.event,\n			};\n			if (token) headers["Authorization"] = `Bearer ${token}`;\n\n			const response = await fetchFn(url, {\n				method: "POST",\n				headers,\n				body: JSON.stringify(payload),\n			});\n\n			lastStatus = response.status;\n			if (response.ok) {\n				log.info(`Delivered ${payload.event} to ${url} (${response.status})`);\n				return { success: true, status: response.status };\n			}\n\n			lastError = `HTTP ${response.status}: ${response.statusText}`;\n			log.warn(`Attempt ${attempt}/${maxRetries} failed: ${lastError}`);\n		} catch (error) {\n			lastError = error instanceof Error ? error.message : "Unknown error";\n			log.warn(`Attempt ${attempt}/${maxRetries} failed: ${lastError}`);\n		}\n\n		if (attempt < maxRetries) {\n			await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, attempt - 1)));\n		}\n	}\n\n	log.error(`Failed to deliver ${payload.event} after ${maxRetries} attempts`);\n	return { success: false, status: lastStatus, error: lastError };\n}\n\n// ── Helpers ──\n\nfunction isRecord(value: unknown): value is Record<string, unknown> {\n	return typeof value === "object" && value !== null && !Array.isArray(value);\n}\n\nfunction getString(value: unknown, key: string): string | undefined {\n	if (!isRecord(value)) return undefined;\n	const v = value[key];\n	return typeof v === "string" ? v : undefined;\n}\n\nconst MAX_RETRIES = 3;\n\nasync function getConfig(ctx: PluginContext) {\n	const url = await ctx.kv.get<string>("settings:webhookUrl");\n	const token = await ctx.kv.get<string>("settings:secretToken");\n	const enabled = await ctx.kv.get<boolean>("settings:enabled");\n	return { url, token, enabled };\n}\n\nfunction getFetchFn(ctx: PluginContext): FetchFn {\n	if (!ctx.http) {\n		throw new Error("Webhook notifier requires network:fetch capability");\n	}\n	return ctx.http.fetch;\n}\n\n// ── Plugin definition ──\n\nexport default definePlugin({\n	hooks: {\n		"content:afterSave": {\n			priority: 210,\n			timeout: 10000,\n			dependencies: ["audit-log"],\n			errorPolicy: "continue",\n			handler: async (event: ContentSaveEvent, ctx: PluginContext) => {\n				const { url, token, enabled } = await getConfig(ctx);\n				if (enabled === false || !url) return;\n\n				const contentId =\n					typeof event.content.id === "string" ? event.content.id : String(event.content.id);\n\n				const payload: WebhookPayload = {\n					event: event.isNew ? "content:create" : "content:update",\n					timestamp: new Date().toISOString(),\n					collection: event.collection,\n					resourceId: contentId,\n					resourceType: "content",\n					metadata: {\n						slug: event.content.slug,\n						status: event.content.status,\n					},\n				};\n\n				await sendWebhook(getFetchFn(ctx), ctx.log, url, payload, token ?? undefined, MAX_RETRIES);\n			},\n		},\n\n		"content:afterDelete": {\n			priority: 210,\n			timeout: 10000,\n			dependencies: ["audit-log"],\n			errorPolicy: "continue",\n			handler: async (event: ContentDeleteEvent, ctx: PluginContext) => {\n				const { url, token, enabled } = await getConfig(ctx);\n				if (enabled === false || !url) return;\n\n				const payload: WebhookPayload = {\n					event: "content:delete",\n					timestamp: new Date().toISOString(),\n					collection: event.collection,\n					resourceId: event.id,\n					resourceType: "content",\n				};\n\n				await sendWebhook(getFetchFn(ctx), ctx.log, url, payload, token ?? undefined, MAX_RETRIES);\n			},\n		},\n\n		"media:afterUpload": {\n			priority: 210,\n			timeout: 10000,\n			errorPolicy: "continue",\n			handler: async (event: MediaUploadEvent, ctx: PluginContext) => {\n				const { url, token, enabled } = await getConfig(ctx);\n				if (enabled === false || !url) return;\n\n				const payload: WebhookPayload = {\n					event: "media:upload",\n					timestamp: new Date().toISOString(),\n					resourceId: event.media.id,\n					resourceType: "media",\n				};\n\n				await sendWebhook(getFetchFn(ctx), ctx.log, url, payload, token ?? undefined, MAX_RETRIES);\n			},\n		},\n	},\n\n	routes: {\n		admin: {\n			handler: async (\n				routeCtx: { input: unknown; request: { url: string } },\n				ctx: PluginContext,\n			) => {\n				const interaction = routeCtx.input as {\n					type: string;\n					page?: string;\n					action_id?: string;\n					value?: string;\n					values?: Record<string, unknown>;\n				};\n\n				if (interaction.type === "page_load" && interaction.page === "widget:webhook-status") {\n					return buildStatusWidget(ctx);\n				}\n				if (interaction.type === "page_load" && interaction.page === "/settings") {\n					return buildSettingsPage(ctx);\n				}\n				if (interaction.type === "form_submit" && interaction.action_id === "save_settings") {\n					return saveSettings(ctx, interaction.values ?? {});\n				}\n				if (interaction.type === "block_action" && interaction.action_id === "test_webhook") {\n					return testWebhook(ctx);\n				}\n				return { blocks: [] };\n			},\n		},\n\n		status: {\n			handler: async (_routeCtx: { input: unknown; request: unknown }, ctx: PluginContext) => {\n				try {\n					const url = await ctx.kv.get<string>("settings:webhookUrl");\n					const enabled = await ctx.kv.get<boolean>("settings:enabled");\n					const deliveries = ctx.storage.deliveries!;\n					const successful = await deliveries.count({ status: "success" });\n					const failed = await deliveries.count({ status: "failed" });\n					const pending = await deliveries.count({ status: "pending" });\n\n					return {\n						configured: !!url,\n						enabled: enabled ?? true,\n						stats: { successful, failed, pending },\n					};\n				} catch (error) {\n					ctx.log.error("Failed to get status", error);\n					return {\n						configured: false,\n						enabled: true,\n						stats: { successful: 0, failed: 0, pending: 0 },\n					};\n				}\n			},\n		},\n\n		settings: {\n			handler: async (_routeCtx: { input: unknown; request: unknown }, ctx: PluginContext) => {\n				try {\n					const settings = await ctx.kv.list("settings:");\n					const map: Record<string, unknown> = {};\n					for (const entry of settings) {\n						map[entry.key.replace("settings:", "")] = entry.value;\n					}\n					return {\n						webhookUrl: typeof map.webhookUrl === "string" ? map.webhookUrl : "",\n						enabled: typeof map.enabled === "boolean" ? map.enabled : true,\n						includeData: typeof map.includeData === "boolean" ? map.includeData : false,\n						events: typeof map.events === "string" ? map.events : "all",\n					};\n				} catch (error) {\n					ctx.log.error("Failed to get settings", error);\n					return { webhookUrl: "", enabled: true, includeData: false, events: "all" };\n				}\n			},\n		},\n\n		"settings/save": {\n			handler: async (routeCtx: { input: unknown; request: unknown }, ctx: PluginContext) => {\n				try {\n					const input = isRecord(routeCtx.input) ? routeCtx.input : {};\n					if (typeof input.webhookUrl === "string")\n						await ctx.kv.set("settings:webhookUrl", input.webhookUrl);\n					if (typeof input.enabled === "boolean")\n						await ctx.kv.set("settings:enabled", input.enabled);\n					if (typeof input.includeData === "boolean")\n						await ctx.kv.set("settings:includeData", input.includeData);\n					if (typeof input.events === "string") await ctx.kv.set("settings:events", input.events);\n					return { success: true };\n				} catch (error) {\n					ctx.log.error("Failed to save settings", error);\n					return { success: false, error: String(error) };\n				}\n			},\n		},\n\n		test: {\n			handler: async (routeCtx: { input: unknown; request: unknown }, ctx: PluginContext) => {\n				const testUrl = getString(routeCtx.input, "url");\n				if (!testUrl) return { success: false, error: "No webhook URL provided" };\n\n				const token = await ctx.kv.get<string>("settings:secretToken");\n\n				const testPayload: WebhookPayload = {\n					event: "content:create",\n					timestamp: new Date().toISOString(),\n					resourceId: "test-" + Date.now(),\n					resourceType: "content",\n					metadata: { test: true, message: "Webhook test from EmDash CMS" },\n				};\n\n				const result = await sendWebhook(\n					getFetchFn(ctx),\n					ctx.log,\n					testUrl,\n					testPayload,\n					token ?? undefined,\n					1,\n				);\n				return {\n					success: result.success,\n					status: result.status,\n					error: result.error,\n					payload: testPayload,\n				};\n			},\n		},\n	},\n});\n\n// ── Block Kit admin helpers ──\n\nasync function buildStatusWidget(ctx: PluginContext) {\n	try {\n		const url = await ctx.kv.get<string>("settings:webhookUrl");\n		const enabled = await ctx.kv.get<boolean>("settings:enabled");\n		const isConfigured = !!url && enabled !== false;\n\n		let successful = 0;\n		let failed = 0;\n		let pending = 0;\n		try {\n			const deliveries = ctx.storage.deliveries!;\n			successful = await deliveries.count({ status: "success" });\n			failed = await deliveries.count({ status: "failed" });\n			pending = await deliveries.count({ status: "pending" });\n		} catch {\n			// Storage not available yet\n		}\n\n		const blocks: unknown[] = [\n			{\n				type: "fields",\n				fields: [\n					{\n						label: "Status",\n						value: isConfigured ? "Active" : "Not Configured",\n					},\n					{\n						label: "Endpoint",\n						value: url ? url : "None",\n					},\n				],\n			},\n		];\n\n		if (isConfigured) {\n			blocks.push({\n				type: "stats",\n				stats: [\n					{ label: "Delivered", value: String(successful) },\n					{ label: "Failed", value: String(failed) },\n					{ label: "Pending", value: String(pending) },\n				],\n			});\n		} else {\n			blocks.push({\n				type: "context",\n				text: "Configure a webhook URL in settings to start sending events.",\n			});\n		}\n\n		return { blocks };\n	} catch (error) {\n		ctx.log.error("Failed to build status widget", error);\n		return { blocks: [{ type: "context", text: "Failed to load webhook status" }] };\n	}\n}\n\nasync function buildSettingsPage(ctx: PluginContext) {\n	try {\n		const webhookUrl = (await ctx.kv.get<string>("settings:webhookUrl")) ?? "";\n		const enabled = (await ctx.kv.get<boolean>("settings:enabled")) ?? true;\n		const includeData = (await ctx.kv.get<boolean>("settings:includeData")) ?? false;\n		const events = (await ctx.kv.get<string>("settings:events")) ?? "all";\n\n		const payloadPreview = JSON.stringify(\n			{\n				event: "content:create",\n				timestamp: new Date().toISOString(),\n				collection: "posts",\n				resourceId: "abc123",\n				resourceType: "content",\n				...(includeData && {\n					data: { title: "Example Post", slug: "example-post" },\n				}),\n				metadata: { slug: "example-post", status: "published" },\n			},\n			null,\n			2,\n		);\n\n		return {\n			blocks: [\n				{ type: "header", text: "Webhook Settings" },\n				{\n					type: "context",\n					text: "Send notifications to external services when content changes.",\n				},\n				{ type: "divider" },\n				{\n					type: "form",\n					block_id: "webhook-settings",\n					fields: [\n						{\n							type: "text_input",\n							action_id: "webhookUrl",\n							label: "Webhook URL",\n							initial_value: webhookUrl,\n						},\n						{\n							type: "secret_input",\n							action_id: "secretToken",\n							label: "Secret Token",\n						},\n						{\n							type: "toggle",\n							action_id: "enabled",\n							label: "Enable Webhooks",\n							initial_value: enabled,\n						},\n						{\n							type: "select",\n							action_id: "events",\n							label: "Events to Send",\n							options: [\n								{ label: "All events", value: "all" },\n								{ label: "Content changes only", value: "content" },\n								{ label: "Media uploads only", value: "media" },\n							],\n							initial_value: events,\n						},\n						{\n							type: "toggle",\n							action_id: "includeData",\n							label: "Include Content Data",\n							initial_value: includeData,\n						},\n					],\n					submit: { label: "Save Settings", action_id: "save_settings" },\n				},\n				{ type: "divider" },\n				{ type: "section", text: "**Payload Preview**" },\n				{ type: "code", code: payloadPreview, language: "json" },\n				{\n					type: "actions",\n					elements: [\n						{\n							type: "button",\n							text: "Test Webhook",\n							action_id: "test_webhook",\n							style: "primary",\n						},\n					],\n				},\n			],\n		};\n	} catch (error) {\n		ctx.log.error("Failed to build settings page", error);\n		return { blocks: [{ type: "context", text: "Failed to load settings" }] };\n	}\n}\n\nasync function saveSettings(ctx: PluginContext, values: Record<string, unknown>) {\n	try {\n		if (typeof values.webhookUrl === "string")\n			await ctx.kv.set("settings:webhookUrl", values.webhookUrl);\n		if (typeof values.secretToken === "string" && values.secretToken !== "")\n			await ctx.kv.set("settings:secretToken", values.secretToken);\n		if (typeof values.enabled === "boolean") await ctx.kv.set("settings:enabled", values.enabled);\n		if (typeof values.events === "string") await ctx.kv.set("settings:events", values.events);\n		if (typeof values.includeData === "boolean")\n			await ctx.kv.set("settings:includeData", values.includeData);\n\n		return {\n			...(await buildSettingsPage(ctx)),\n			toast: { message: "Settings saved", type: "success" },\n		};\n	} catch (error) {\n		ctx.log.error("Failed to save settings", error);\n		return {\n			blocks: [{ type: "banner", style: "error", text: "Failed to save settings" }],\n			toast: { message: "Failed to save settings", type: "error" },\n		};\n	}\n}\n\nasync function testWebhook(ctx: PluginContext) {\n	const url = await ctx.kv.get<string>("settings:webhookUrl");\n	if (!url) {\n		return {\n			blocks: [{ type: "banner", style: "warning", text: "Enter a webhook URL first." }],\n			toast: { message: "No webhook URL configured", type: "error" },\n		};\n	}\n\n	const token = await ctx.kv.get<string>("settings:secretToken");\n	const testPayload: WebhookPayload = {\n		event: "content:create",\n		timestamp: new Date().toISOString(),\n		resourceId: "test-" + Date.now(),\n		resourceType: "content",\n		metadata: { test: true, message: "Webhook test from EmDash CMS" },\n	};\n\n	try {\n		const result = await sendWebhook(\n			getFetchFn(ctx),\n			ctx.log,\n			url,\n			testPayload,\n			token ?? undefined,\n			1,\n		);\n\n		if (result.success) {\n			return {\n				...(await buildSettingsPage(ctx)),\n				toast: { message: `Test sent -- HTTP ${result.status}`, type: "success" },\n			};\n		}\n		return {\n			...(await buildSettingsPage(ctx)),\n			toast: {\n				message: `Test failed: ${result.error ?? "Unknown error"}`,\n				type: "error",\n			},\n		};\n	} catch (error) {\n		const msg = error instanceof Error ? error.message : String(error);\n		return {\n			...(await buildSettingsPage(ctx)),\n			toast: { message: `Test failed: ${msg}`, type: "error" },\n		};\n	}\n}\n'
  }
];
const TRAILING_SLASH_REGEX = /\/$/;
var R2Storage = class {
  bucket;
  publicUrl;
  constructor(bucket, publicUrl) {
    this.bucket = bucket;
    this.publicUrl = publicUrl;
  }
  async upload(options) {
    try {
      const result = await this.bucket.put(options.key, options.body, { httpMetadata: { contentType: options.contentType } });
      if (!result) throw new EmDashStorageError(`Failed to upload file: ${options.key}`, "UPLOAD_FAILED");
      return {
        key: options.key,
        url: this.getPublicUrl(options.key),
        size: result.size
      };
    } catch (error) {
      if (error instanceof EmDashStorageError) throw error;
      throw new EmDashStorageError(`Failed to upload file: ${options.key}`, "UPLOAD_FAILED", error);
    }
  }
  async download(key) {
    try {
      const object2 = await this.bucket.get(key);
      if (!object2) throw new EmDashStorageError(`File not found: ${key}`, "NOT_FOUND");
      if (!("body" in object2) || !object2.body) throw new EmDashStorageError(`File not found: ${key}`, "NOT_FOUND");
      return {
        body: object2.body,
        contentType: object2.httpMetadata?.contentType || "application/octet-stream",
        size: object2.size
      };
    } catch (error) {
      if (error instanceof EmDashStorageError) throw error;
      throw new EmDashStorageError(`Failed to download file: ${key}`, "DOWNLOAD_FAILED", error);
    }
  }
  async delete(key) {
    try {
      await this.bucket.delete(key);
    } catch (error) {
      throw new EmDashStorageError(`Failed to delete file: ${key}`, "DELETE_FAILED", error);
    }
  }
  async exists(key) {
    try {
      return await this.bucket.head(key) !== null;
    } catch (error) {
      throw new EmDashStorageError(`Failed to check file existence: ${key}`, "HEAD_FAILED", error);
    }
  }
  async list(options = {}) {
    try {
      const response = await this.bucket.list({
        prefix: options.prefix,
        limit: options.limit,
        cursor: options.cursor
      });
      return {
        files: response.objects.map((item) => ({
          key: item.key,
          size: item.size,
          lastModified: item.uploaded,
          etag: item.etag
        })),
        nextCursor: response.truncated ? response.cursor : void 0
      };
    } catch (error) {
      throw new EmDashStorageError("Failed to list files", "LIST_FAILED", error);
    }
  }
  async getSignedUploadUrl(_options) {
    throw new EmDashStorageError("R2 bindings do not support pre-signed upload URLs. Use the S3 API with R2 credentials for signed URL support, or upload through the Worker.", "NOT_SUPPORTED");
  }
  getPublicUrl(key) {
    if (this.publicUrl) return `${this.publicUrl.replace(TRAILING_SLASH_REGEX, "")}/${key}`;
    return `/_emdash/api/media/file/${key}`;
  }
};
function createStorage$1(config) {
  const binding = typeof config.binding === "string" ? config.binding : "";
  const publicUrl = typeof config.publicUrl === "string" ? config.publicUrl : void 0;
  if (!binding) throw new EmDashStorageError(`R2 binding name is required in storage config.`, "BINDING_NOT_FOUND");
  const bucket = env[binding];
  if (!bucket) throw new EmDashStorageError(`R2 binding "${binding}" not found. Make sure the binding is defined in wrangler.jsonc and you're running on Cloudflare Workers.

Example wrangler.jsonc:
{
  "r2_buckets": [{
    "binding": "${binding}",
    "bucket_name": "my-bucket"
  }]
}`, "BINDING_NOT_FOUND");
  return new R2Storage(bucket, publicUrl);
}
const createStorage = createStorage$1;
async function cleanupExpiredChallenges(db) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const result = await db.deleteFrom("auth_challenges").where("expires_at", "<", now).executeTakeFirst();
  return Number(result.numDeletedRows ?? 0);
}
const REVISION_KEEP_COUNT = 50;
const REVISION_PRUNE_THRESHOLD = REVISION_KEEP_COUNT;
async function runSystemCleanup(db, storage) {
  const result = {
    challenges: -1,
    expiredTokens: -1,
    pendingUploads: -1,
    pendingUploadFiles: -1,
    revisionsPruned: -1
  };
  try {
    result.challenges = await cleanupExpiredChallenges(db);
  } catch (error) {
    console.error("[cleanup] Failed to clean expired challenges:", error);
  }
  try {
    await createKyselyAdapter(db).deleteExpiredTokens();
    result.expiredTokens = 0;
  } catch (error) {
    console.error("[cleanup] Failed to clean expired tokens:", error);
  }
  try {
    const orphanedKeys = await new MediaRepository(db).cleanupPendingUploads();
    result.pendingUploads = orphanedKeys.length;
    if (storage && orphanedKeys.length > 0) {
      let filesDeleted = 0;
      for (const key of orphanedKeys) try {
        await storage.delete(key);
        filesDeleted++;
      } catch (error) {
        console.error(`[cleanup] Failed to delete storage file ${key}:`, error);
      }
      result.pendingUploadFiles = filesDeleted;
    } else result.pendingUploadFiles = 0;
  } catch (error) {
    console.error("[cleanup] Failed to clean pending uploads:", error);
  }
  try {
    result.revisionsPruned = await pruneExcessiveRevisions(db);
  } catch (error) {
    console.error("[cleanup] Failed to prune revisions:", error);
  }
  return result;
}
async function pruneExcessiveRevisions(db) {
  const entries = await sql`
		SELECT collection, entry_id, COUNT(*) as cnt
		FROM revisions
		GROUP BY collection, entry_id
		HAVING cnt > ${REVISION_PRUNE_THRESHOLD}
	`.execute(db);
  if (entries.rows.length === 0) return 0;
  const revisionRepo = new RevisionRepository(db);
  let totalPruned = 0;
  for (const row of entries.rows) try {
    const pruned = await revisionRepo.pruneOldRevisions(row.collection, row.entry_id, REVISION_KEEP_COUNT);
    totalPruned += pruned;
  } catch (error) {
    console.error(`[cleanup] Failed to prune revisions for ${row.collection}/${row.entry_id}:`, error);
  }
  return totalPruned;
}
const DEFAULT_COMMENT_MODERATOR_PLUGIN_ID = "emdash-default-comment-moderator";
async function defaultCommentModerate(event, _ctx) {
  const { comment, collectionSettings, priorApprovedCount } = event;
  if (collectionSettings.commentsAutoApproveUsers && comment.authorUserId) return {
    status: "approved",
    reason: "Authenticated CMS user"
  };
  if (collectionSettings.commentsModeration === "none") return {
    status: "approved",
    reason: "Moderation disabled"
  };
  if (collectionSettings.commentsModeration === "first_time" && priorApprovedCount > 0) return {
    status: "approved",
    reason: "Returning commenter"
  };
  return {
    status: "pending",
    reason: "Held for review"
  };
}
const MIN_INTERVAL_MS = 1e3;
const MAX_INTERVAL_MS = 300 * 1e3;
var NodeCronScheduler = class {
  timer = null;
  running = false;
  systemCleanup = null;
  constructor(executor) {
    this.executor = executor;
  }
  setSystemCleanup(fn) {
    this.systemCleanup = fn;
  }
  start() {
    this.running = true;
    this.arm();
  }
  stop() {
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  reschedule() {
    if (!this.running) return;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.arm();
  }
  arm() {
    if (!this.running) return;
    this.executor.getNextDueTime().then((nextDue) => {
      if (!this.running) return void 0;
      let delayMs;
      if (nextDue) {
        const dueAt = new Date(nextDue).getTime();
        delayMs = Math.max(dueAt - Date.now(), MIN_INTERVAL_MS);
        delayMs = Math.min(delayMs, MAX_INTERVAL_MS);
      } else delayMs = MAX_INTERVAL_MS;
      this.timer = setTimeout(() => {
        if (!this.running) return;
        this.executeTick();
      }, delayMs);
      if (this.timer && typeof this.timer === "object" && "unref" in this.timer) this.timer.unref();
    }).catch((error) => {
      console.error("[cron:node] Failed to get next due time:", error);
      if (this.running) {
        this.timer = setTimeout(() => this.arm(), MAX_INTERVAL_MS);
        if (this.timer && typeof this.timer === "object" && "unref" in this.timer) this.timer.unref();
      }
    });
  }
  executeTick() {
    if (!this.running) return;
    const tasks = [this.executor.tick(), this.executor.recoverStaleLocks()];
    if (this.systemCleanup) tasks.push(this.systemCleanup());
    Promise.allSettled(tasks).then((results) => {
      for (const r of results) if (r.status === "rejected") console.error("[cron:node] Tick task failed:", r.reason);
    }).finally(() => {
      if (this.running) this.arm();
    });
  }
};
const DEBOUNCE_MS = 60 * 1e3;
var PiggybackScheduler = class {
  lastTickAt = 0;
  running = false;
  systemCleanup = null;
  constructor(executor) {
    this.executor = executor;
  }
  setSystemCleanup(fn) {
    this.systemCleanup = fn;
  }
  start() {
    this.running = true;
  }
  stop() {
    this.running = false;
  }
  /**
  * No-op for piggyback — tick happens on next request.
  */
  reschedule() {
  }
  /**
  * Call this from middleware on each request.
  * Debounced: only actually ticks if enough time has passed.
  */
  onRequest() {
    if (!this.running) return;
    const now = Date.now();
    if (now - this.lastTickAt < DEBOUNCE_MS) return;
    this.lastTickAt = now;
    const tasks = [this.executor.tick(), this.executor.recoverStaleLocks()];
    if (this.systemCleanup) tasks.push(this.systemCleanup());
    Promise.allSettled(tasks).then((results) => {
      for (const r of results) if (r.status === "rejected") console.error("[cron:piggyback] Tick task failed:", r.reason);
    });
  }
};
const LEADING_SLASH_PATTERN = /^\//;
const VALID_METADATA_KINDS = /* @__PURE__ */ new Set([
  "meta",
  "property",
  "link",
  "jsonld"
]);
const VALID_LINK_REL = /* @__PURE__ */ new Set([
  "canonical",
  "alternate",
  "author",
  "license",
  "site.standard.document"
]);
function isValidMetadataContribution(c) {
  if (!c || typeof c !== "object" || !("kind" in c)) return false;
  const obj = c;
  if (typeof obj.kind !== "string" || !VALID_METADATA_KINDS.has(obj.kind)) return false;
  switch (obj.kind) {
    case "meta":
      return typeof obj.name === "string" && typeof obj.content === "string";
    case "property":
      return typeof obj.property === "string" && typeof obj.content === "string";
    case "link":
      return typeof obj.href === "string" && typeof obj.rel === "string" && VALID_LINK_REL.has(obj.rel);
    case "jsonld":
      return obj.graph != null && typeof obj.graph === "object";
    default:
      return false;
  }
}
const FIELD_TYPE_TO_KIND = {
  string: "string",
  slug: "string",
  text: "richText",
  number: "number",
  integer: "number",
  boolean: "boolean",
  datetime: "datetime",
  select: "select",
  multiSelect: "multiSelect",
  portableText: "portableText",
  image: "image",
  file: "file",
  reference: "reference",
  json: "json"
};
function contentItemToRecord(item) {
  return { ...item };
}
const dbCache = /* @__PURE__ */ new Map();
let dbInitPromise = null;
const storageCache = /* @__PURE__ */ new Map();
const sandboxedPluginCache = /* @__PURE__ */ new Map();
const marketplacePluginKeys = /* @__PURE__ */ new Set();
const marketplaceManifestCache = /* @__PURE__ */ new Map();
const sandboxedRouteMetaCache = /* @__PURE__ */ new Map();
let sandboxRunner = null;
var EmDashRuntime = class EmDashRuntime2 {
  /**
  * The singleton database instance (worker-lifetime cached).
  * Use the `db` getter instead — it checks the request context first
  * for per-request overrides (D1 read replica sessions, DO multi-site).
  */
  _db;
  storage;
  configuredPlugins;
  sandboxedPlugins;
  sandboxedPluginEntries;
  schemaRegistry;
  _hooks;
  config;
  mediaProviders;
  mediaProviderEntries;
  cronExecutor;
  email;
  cronScheduler;
  enabledPlugins;
  pluginStates;
  /** Current hook pipeline. Use the `hooks` getter for external access. */
  get hooks() {
    return this._hooks;
  }
  /** All plugins eligible for the hook pipeline (includes built-in plugins).
  *  Stored so we can rebuild the pipeline when plugins are enabled/disabled. */
  allPipelinePlugins;
  /** Factory options for the hook pipeline context factory */
  pipelineFactoryOptions;
  /** Dependencies needed for exclusive hook resolution */
  runtimeDeps;
  /** Mutable ref for the cron invokeCronHook closure to read the current pipeline */
  pipelineRef;
  /**
  * Get the database instance for the current request.
  *
  * Checks the ALS-based request context first — middleware sets a
  * per-request Kysely instance there for D1 read replica sessions
  * or DO preview databases. Falls back to the singleton instance.
  */
  get db() {
    const ctx = getRequestContext();
    if (ctx?.db) return ctx.db;
    return this._db;
  }
  constructor(db, storage, configuredPlugins, sandboxedPlugins2, sandboxedPluginEntries, hooks, enabledPlugins, pluginStates, config, mediaProviders2, mediaProviderEntries, cronExecutor, cronScheduler, emailPipeline, allPipelinePlugins, pipelineFactoryOptions, runtimeDeps, pipelineRef) {
    this._db = db;
    this.storage = storage;
    this.configuredPlugins = configuredPlugins;
    this.sandboxedPlugins = sandboxedPlugins2;
    this.sandboxedPluginEntries = sandboxedPluginEntries;
    this.schemaRegistry = new SchemaRegistry(db);
    this._hooks = hooks;
    this.enabledPlugins = enabledPlugins;
    this.pluginStates = pluginStates;
    this.config = config;
    this.mediaProviders = mediaProviders2;
    this.mediaProviderEntries = mediaProviderEntries;
    this.cronExecutor = cronExecutor;
    this.cronScheduler = cronScheduler;
    this.email = emailPipeline;
    this.allPipelinePlugins = allPipelinePlugins;
    this.pipelineFactoryOptions = pipelineFactoryOptions;
    this.runtimeDeps = runtimeDeps;
    this.pipelineRef = pipelineRef;
  }
  /**
  * Get the sandbox runner instance (for marketplace install/update)
  */
  getSandboxRunner() {
    return sandboxRunner;
  }
  /**
  * Tick the cron system from request context (piggyback mode).
  * Call this from middleware on each request to ensure cron tasks
  * execute even when no dedicated scheduler is available.
  */
  tickCron() {
    if (this.cronScheduler instanceof PiggybackScheduler) this.cronScheduler.onRequest();
  }
  /**
  * Stop the cron scheduler gracefully.
  * Call during worker shutdown or hot-reload.
  */
  async stopCron() {
    if (this.cronScheduler) await this.cronScheduler.stop();
  }
  /**
  * Update in-memory plugin status and rebuild the hook pipeline.
  *
  * Rebuilding the pipeline ensures disabled plugins' hooks stop firing
  * and re-enabled plugins' hooks start firing again without a restart.
  * Exclusive hook selections are re-resolved after each rebuild.
  */
  async setPluginStatus(pluginId, status) {
    this.pluginStates.set(pluginId, status);
    if (status === "active") this.enabledPlugins.add(pluginId);
    else this.enabledPlugins.delete(pluginId);
    await this.rebuildHookPipeline();
  }
  /**
  * Rebuild the hook pipeline from the current set of enabled plugins.
  *
  * Filters `allPipelinePlugins` to only those in `enabledPlugins`,
  * creates a fresh HookPipeline, re-resolves exclusive hook selections,
  * and re-wires the context factory so existing references (cron
  * callbacks, email pipeline) use the new pipeline.
  */
  async rebuildHookPipeline() {
    const newPipeline = createHookPipeline(this.allPipelinePlugins.filter((p) => this.enabledPlugins.has(p.id)), this.pipelineFactoryOptions);
    await EmDashRuntime2.resolveExclusiveHooks(newPipeline, this.db, this.runtimeDeps);
    if (this.email) newPipeline.setContextFactory({
      db: this.db,
      emailPipeline: this.email
    });
    if (this.cronScheduler) {
      const scheduler = this.cronScheduler;
      newPipeline.setContextFactory({ cronReschedule: () => scheduler.reschedule() });
    }
    if (this.email) this.email.setPipeline(newPipeline);
    this.pipelineRef.current = newPipeline;
    this._hooks = newPipeline;
  }
  /**
  * Synchronize marketplace plugin runtime state with DB + storage.
  *
  * Ensures install/update/uninstall changes take effect immediately in the
  * current worker: loads newly active plugins and removes uninstalled ones.
  */
  async syncMarketplacePlugins() {
    if (!this.config.marketplace || !this.storage) return;
    if (!sandboxRunner || !sandboxRunner.isAvailable()) return;
    try {
      const marketplaceStates = await new PluginStateRepository(this.db).getMarketplacePlugins();
      const desired = /* @__PURE__ */ new Map();
      for (const state of marketplaceStates) {
        this.pluginStates.set(state.pluginId, state.status);
        if (state.status === "active") this.enabledPlugins.add(state.pluginId);
        else this.enabledPlugins.delete(state.pluginId);
        if (state.status !== "active") continue;
        desired.set(state.pluginId, state.marketplaceVersion ?? state.version);
      }
      const keysToRemove = [];
      for (const key of marketplacePluginKeys) {
        const [pluginId] = key.split(":");
        if (!pluginId) continue;
        const desiredVersion = desired.get(pluginId);
        if (desiredVersion && key === `${pluginId}:${desiredVersion}`) continue;
        keysToRemove.push(key);
      }
      for (const key of keysToRemove) {
        const [pluginId] = key.split(":");
        if (!pluginId) continue;
        if (!desired.get(pluginId)) {
          this.pluginStates.delete(pluginId);
          this.enabledPlugins.delete(pluginId);
        }
        const existing = sandboxedPluginCache.get(key);
        if (existing) try {
          await existing.terminate();
        } catch (error) {
          console.warn(`EmDash: Failed to terminate sandboxed plugin ${key}:`, error);
        }
        sandboxedPluginCache.delete(key);
        this.sandboxedPlugins.delete(key);
        marketplacePluginKeys.delete(key);
        if (pluginId) {
          sandboxedRouteMetaCache.delete(pluginId);
          marketplaceManifestCache.delete(pluginId);
        }
      }
      for (const [pluginId, version] of desired) {
        const key = `${pluginId}:${version}`;
        if (sandboxedPluginCache.has(key)) {
          marketplacePluginKeys.add(key);
          continue;
        }
        const bundle = await loadBundleFromR2(this.storage, pluginId, version);
        if (!bundle) {
          console.warn(`EmDash: Marketplace plugin ${pluginId}@${version} not found in R2`);
          continue;
        }
        const loaded = await sandboxRunner.load(bundle.manifest, bundle.backendCode);
        sandboxedPluginCache.set(key, loaded);
        this.sandboxedPlugins.set(key, loaded);
        marketplacePluginKeys.add(key);
        marketplaceManifestCache.set(pluginId, {
          id: bundle.manifest.id,
          version: bundle.manifest.version,
          admin: bundle.manifest.admin
        });
        if (bundle.manifest.routes.length > 0) {
          const routeMetaMap = /* @__PURE__ */ new Map();
          for (const entry of bundle.manifest.routes) {
            const normalized = normalizeManifestRoute(entry);
            routeMetaMap.set(normalized.name, { public: normalized.public === true });
          }
          sandboxedRouteMetaCache.set(pluginId, routeMetaMap);
        } else sandboxedRouteMetaCache.delete(pluginId);
      }
    } catch (error) {
      console.error("EmDash: Failed to sync marketplace plugins:", error);
    }
  }
  /**
  * Create and initialize the runtime
  */
  static async create(deps) {
    const db = await EmDashRuntime2.getDatabase(deps);
    if (isSqlite(db)) try {
      const repaired = await new FTSManager(db).verifyAndRepairAll();
      if (repaired > 0) console.log(`Repaired ${repaired} corrupted FTS index(es) at startup`);
    } catch {
    }
    const storage = EmDashRuntime2.getStorage(deps);
    let pluginStates = /* @__PURE__ */ new Map();
    try {
      const states = await db.selectFrom("_plugin_state").select(["plugin_id", "status"]).execute();
      pluginStates = new Map(states.map((s) => [s.plugin_id, s.status]));
    } catch {
    }
    const enabledPlugins = /* @__PURE__ */ new Set();
    for (const plugin of deps.plugins) {
      const status = pluginStates.get(plugin.id);
      if (status === void 0 || status === "active") enabledPlugins.add(plugin.id);
    }
    let siteInfo;
    try {
      const optionsRepo = new OptionsRepository(db);
      const siteName = await optionsRepo.get("emdash:site_title");
      const siteUrl = await optionsRepo.get("emdash:site_url");
      const locale = await optionsRepo.get("emdash:locale");
      siteInfo = {
        siteName: siteName ?? void 0,
        siteUrl: siteUrl ?? void 0,
        locale: locale ?? void 0
      };
    } catch {
    }
    const allPipelinePlugins = [...deps.plugins];
    try {
      const defaultModeratorPlugin = definePlugin({
        id: DEFAULT_COMMENT_MODERATOR_PLUGIN_ID,
        version: "0.0.0",
        capabilities: ["read:users"],
        hooks: { "comment:moderate": {
          exclusive: true,
          handler: defaultCommentModerate
        } }
      });
      allPipelinePlugins.push(defaultModeratorPlugin);
      enabledPlugins.add(defaultModeratorPlugin.id);
    } catch (error) {
      console.warn("[comments] Failed to register default moderator:", error);
    }
    const enabledPluginList = allPipelinePlugins.filter((p) => enabledPlugins.has(p.id));
    const pipelineFactoryOptions = {
      db,
      storage: storage ?? void 0,
      siteInfo
    };
    const pipeline = createHookPipeline(enabledPluginList, pipelineFactoryOptions);
    const sandboxedPlugins2 = await EmDashRuntime2.loadSandboxedPlugins(deps, db);
    if (deps.config.marketplace && storage) await EmDashRuntime2.loadMarketplacePlugins(db, storage, deps, sandboxedPlugins2);
    const mediaProviders2 = /* @__PURE__ */ new Map();
    const mediaProviderEntries = deps.mediaProviderEntries ?? [];
    const providerContext = {
      db,
      storage
    };
    for (const entry of mediaProviderEntries) try {
      const provider = entry.createProvider(providerContext);
      mediaProviders2.set(entry.id, provider);
    } catch (error) {
      console.warn(`Failed to initialize media provider "${entry.id}":`, error);
    }
    await EmDashRuntime2.resolveExclusiveHooks(pipeline, db, deps);
    const emailPipeline = new EmailPipeline(pipeline);
    if (sandboxRunner) sandboxRunner.setEmailSend((message, pluginId) => emailPipeline.send(message, pluginId));
    const pipelineRef = { current: pipeline };
    const invokeCronHook = async (pluginId, event) => {
      const result = await pipelineRef.current.invokeCronHook(pluginId, event);
      if (!result.success && result.error) throw result.error;
    };
    pipeline.setContextFactory({
      db,
      emailPipeline
    });
    let cronExecutor = null;
    let cronScheduler = null;
    try {
      cronExecutor = new CronExecutor(db, invokeCronHook);
      const recovered = await cronExecutor.recoverStaleLocks();
      if (recovered > 0) console.log(`[cron] Recovered ${recovered} stale task lock(s)`);
      if (typeof globalThis.navigator !== "undefined" && globalThis.navigator.userAgent === "Cloudflare-Workers") cronScheduler = new PiggybackScheduler(cronExecutor);
      else cronScheduler = new NodeCronScheduler(cronExecutor);
      cronScheduler.setSystemCleanup(async () => {
        try {
          await runSystemCleanup(db, storage ?? void 0);
        } catch (error) {
          console.error("[cleanup] System cleanup failed:", error);
        }
      });
      pipeline.setContextFactory({ cronReschedule: () => cronScheduler?.reschedule() });
      await cronScheduler.start();
    } catch (error) {
      console.warn("[cron] Failed to initialize cron system:", error);
    }
    return new EmDashRuntime2(db, storage, deps.plugins, sandboxedPlugins2, deps.sandboxedPluginEntries, pipeline, enabledPlugins, pluginStates, deps.config, mediaProviders2, mediaProviderEntries, cronExecutor, cronScheduler, emailPipeline, allPipelinePlugins, pipelineFactoryOptions, deps, pipelineRef);
  }
  /**
  * Get a media provider by ID
  */
  getMediaProvider(providerId) {
    return this.mediaProviders.get(providerId);
  }
  /**
  * Get all media provider entries (for admin UI)
  */
  getMediaProviderList() {
    return this.mediaProviderEntries.map((e) => ({
      id: e.id,
      name: e.name,
      icon: e.icon,
      capabilities: e.capabilities
    }));
  }
  /**
  * Get or create database instance
  */
  static async getDatabase(deps) {
    const ctx = getRequestContext();
    if (ctx?.db) return ctx.db;
    const dbConfig = deps.config.database;
    if (!dbConfig) try {
      return await getDb();
    } catch {
      throw new Error("EmDash database not configured. Either configure database in astro.config.mjs or use emdashLoader in live.config.ts");
    }
    const cacheKey = dbConfig.entrypoint;
    const cached = dbCache.get(cacheKey);
    if (cached) return cached;
    if (dbInitPromise) return dbInitPromise;
    dbInitPromise = (async () => {
      const db = new Kysely({ dialect: deps.createDialect(dbConfig.config) });
      await runMigrations(db);
      try {
        const [collectionCount, setupOption] = await Promise.all([db.selectFrom("_emdash_collections").select((eb) => eb.fn.countAll().as("count")).executeTakeFirstOrThrow(), db.selectFrom("options").select("value").where("name", "=", "emdash:setup_complete").executeTakeFirst()]);
        const setupDone = (() => {
          try {
            return setupOption && JSON.parse(setupOption.value) === true;
          } catch {
            return false;
          }
        })();
        if (collectionCount.count === 0 && !setupDone) {
          const { applySeed } = await import("./chunks/adapt-sandbox-entry_DgOh8so3.mjs").then((n) => n.aj).then((n) => n.n);
          const { loadSeed } = await import("./chunks/load-yOOlckBj_B1QkmqHt.mjs").then((n) => n.r);
          const { validateSeed } = await import("./chunks/adapt-sandbox-entry_DgOh8so3.mjs").then((n) => n.ai).then((n) => n.n);
          const seed = await loadSeed();
          if (validateSeed(seed).valid) {
            await applySeed(db, seed, { onConflict: "skip" });
            console.log("Auto-seeded default collections");
          }
        }
      } catch {
      }
      dbCache.set(cacheKey, db);
      return db;
    })();
    try {
      return await dbInitPromise;
    } finally {
      dbInitPromise = null;
    }
  }
  /**
  * Get or create storage instance
  */
  static getStorage(deps) {
    const storageConfig = deps.config.storage;
    if (!storageConfig || !deps.createStorage) return null;
    const cacheKey = storageConfig.entrypoint;
    const cached = storageCache.get(cacheKey);
    if (cached) return cached;
    const storage = deps.createStorage(storageConfig.config);
    storageCache.set(cacheKey, storage);
    return storage;
  }
  /**
  * Load sandboxed plugins using SandboxRunner
  */
  static async loadSandboxedPlugins(deps, db) {
    if (sandboxedPluginCache.size > 0) return sandboxedPluginCache;
    if (!deps.sandboxEnabled || deps.sandboxedPluginEntries.length === 0) return sandboxedPluginCache;
    if (!sandboxRunner && deps.createSandboxRunner) sandboxRunner = deps.createSandboxRunner({ db });
    if (!sandboxRunner) return sandboxedPluginCache;
    if (!sandboxRunner.isAvailable()) {
      console.debug("EmDash: Sandbox runner not available (missing bindings), skipping sandbox");
      return sandboxedPluginCache;
    }
    for (const entry of deps.sandboxedPluginEntries) {
      const pluginKey = `${entry.id}:${entry.version}`;
      if (sandboxedPluginCache.has(pluginKey)) continue;
      try {
        const manifest = {
          id: entry.id,
          version: entry.version,
          capabilities: entry.capabilities ?? [],
          allowedHosts: entry.allowedHosts ?? [],
          storage: entry.storage ?? {},
          hooks: [],
          routes: [],
          admin: {}
        };
        const plugin = await sandboxRunner.load(manifest, entry.code);
        sandboxedPluginCache.set(pluginKey, plugin);
        console.log(`EmDash: Loaded sandboxed plugin ${pluginKey} with capabilities: [${manifest.capabilities.join(", ")}]`);
      } catch (error) {
        console.error(`EmDash: Failed to load sandboxed plugin ${entry.id}:`, error);
      }
    }
    return sandboxedPluginCache;
  }
  /**
  * Cold-start: load marketplace-installed plugins from site-local R2 storage
  *
  * Queries _plugin_state for source='marketplace' rows, fetches each bundle
  * from R2, and loads via SandboxRunner.
  */
  static async loadMarketplacePlugins(db, storage, deps, cache) {
    if (!sandboxRunner && deps.createSandboxRunner) sandboxRunner = deps.createSandboxRunner({ db });
    if (!sandboxRunner || !sandboxRunner.isAvailable()) return;
    try {
      const marketplacePlugins = await new PluginStateRepository(db).getMarketplacePlugins();
      for (const plugin of marketplacePlugins) {
        if (plugin.status !== "active") continue;
        const version = plugin.marketplaceVersion ?? plugin.version;
        const pluginKey = `${plugin.pluginId}:${version}`;
        if (cache.has(pluginKey)) continue;
        try {
          const bundle = await loadBundleFromR2(storage, plugin.pluginId, version);
          if (!bundle) {
            console.warn(`EmDash: Marketplace plugin ${plugin.pluginId}@${version} not found in R2`);
            continue;
          }
          const loaded = await sandboxRunner.load(bundle.manifest, bundle.backendCode);
          cache.set(pluginKey, loaded);
          marketplacePluginKeys.add(pluginKey);
          marketplaceManifestCache.set(plugin.pluginId, {
            id: bundle.manifest.id,
            version: bundle.manifest.version,
            admin: bundle.manifest.admin
          });
          if (bundle.manifest.routes.length > 0) {
            const routeMeta = /* @__PURE__ */ new Map();
            for (const entry of bundle.manifest.routes) {
              const normalized = normalizeManifestRoute(entry);
              routeMeta.set(normalized.name, { public: normalized.public === true });
            }
            sandboxedRouteMetaCache.set(plugin.pluginId, routeMeta);
          }
          console.log(`EmDash: Loaded marketplace plugin ${pluginKey} with capabilities: [${bundle.manifest.capabilities.join(", ")}]`);
        } catch (error) {
          console.error(`EmDash: Failed to load marketplace plugin ${plugin.pluginId}:`, error);
        }
      }
    } catch {
    }
  }
  /**
  * Resolve exclusive hook selections on startup.
  *
  * Delegates to the shared resolveExclusiveHooks() in hooks.ts.
  * The runtime version considers all pipeline providers as "active" since
  * the pipeline was already built from only active/enabled plugins.
  */
  static async resolveExclusiveHooks(pipeline, db, deps) {
    if (pipeline.getRegisteredExclusiveHooks().length === 0) return;
    let optionsRepo;
    try {
      optionsRepo = new OptionsRepository(db);
    } catch {
      return;
    }
    const preferredHints = /* @__PURE__ */ new Map();
    for (const entry of deps.sandboxedPluginEntries) if (entry.preferred && entry.preferred.length > 0) preferredHints.set(entry.id, entry.preferred);
    await resolveExclusiveHooks({
      pipeline,
      isActive: () => true,
      getOption: (key) => optionsRepo.get(key),
      setOption: (key, value) => optionsRepo.set(key, value),
      deleteOption: async (key) => {
        await optionsRepo.delete(key);
      },
      preferredHints
    });
  }
  /**
  * Build the manifest (rebuilt on each request for freshness)
  */
  async getManifest() {
    const manifestCollections = {};
    try {
      const registry = new SchemaRegistry(this.db);
      const dbCollections = await registry.listCollections();
      for (const collection of dbCollections) {
        const collectionWithFields = await registry.getCollectionWithFields(collection.slug);
        const fields = {};
        if (collectionWithFields?.fields) for (const field of collectionWithFields.fields) {
          const entry = {
            kind: FIELD_TYPE_TO_KIND[field.type] ?? "string",
            label: field.label,
            required: field.required
          };
          if (field.widget) entry.widget = field.widget;
          if (field.validation?.options) entry.options = field.validation.options.map((v) => ({
            value: v,
            label: v.charAt(0).toUpperCase() + v.slice(1)
          }));
          fields[field.slug] = entry;
        }
        manifestCollections[collection.slug] = {
          label: collection.label,
          labelSingular: collection.labelSingular || collection.label,
          supports: collection.supports || [],
          hasSeo: collection.hasSeo,
          fields
        };
      }
    } catch (error) {
      console.debug("EmDash: Could not load database collections:", error);
    }
    const manifestPlugins = {};
    for (const plugin of this.configuredPlugins) {
      const status = this.pluginStates.get(plugin.id);
      const enabled = status === void 0 || status === "active";
      const hasAdminEntry = !!plugin.admin?.entry;
      const hasAdminPages = (plugin.admin?.pages?.length ?? 0) > 0;
      const hasWidgets = (plugin.admin?.widgets?.length ?? 0) > 0;
      let adminMode = "none";
      if (hasAdminEntry) adminMode = "react";
      else if (hasAdminPages || hasWidgets) adminMode = "blocks";
      manifestPlugins[plugin.id] = {
        version: plugin.version,
        enabled,
        adminMode,
        adminPages: plugin.admin?.pages,
        dashboardWidgets: plugin.admin?.widgets,
        portableTextBlocks: plugin.admin?.portableTextBlocks,
        fieldWidgets: plugin.admin?.fieldWidgets
      };
    }
    for (const entry of this.sandboxedPluginEntries) {
      const status = this.pluginStates.get(entry.id);
      const enabled = status === void 0 || status === "active";
      const hasAdminPages = (entry.adminPages?.length ?? 0) > 0;
      const hasWidgets = (entry.adminWidgets?.length ?? 0) > 0;
      manifestPlugins[entry.id] = {
        version: entry.version,
        enabled,
        sandboxed: true,
        adminMode: hasAdminPages || hasWidgets ? "blocks" : "none",
        adminPages: entry.adminPages,
        dashboardWidgets: entry.adminWidgets
      };
    }
    for (const [pluginId, meta] of marketplaceManifestCache) {
      if (manifestPlugins[pluginId]) continue;
      const enabled = this.pluginStates.get(pluginId) === "active";
      const pages = meta.admin?.pages;
      const widgets = meta.admin?.widgets;
      const hasAdminPages = (pages?.length ?? 0) > 0;
      const hasWidgets = (widgets?.length ?? 0) > 0;
      manifestPlugins[pluginId] = {
        version: meta.version,
        enabled,
        sandboxed: true,
        adminMode: hasAdminPages || hasWidgets ? "blocks" : "none",
        adminPages: pages,
        dashboardWidgets: widgets
      };
    }
    const manifestHash = await hashString(JSON.stringify(manifestCollections) + JSON.stringify(manifestPlugins));
    const authMode = getAuthMode(this.config);
    const authModeValue = authMode.type === "external" ? authMode.providerType : "passkey";
    const { getI18nConfig, isI18nEnabled } = await import("./chunks/adapt-sandbox-entry_DgOh8so3.mjs").then((n) => n.ak).then((n) => n.t);
    const i18nConfig = getI18nConfig();
    return {
      version: "0.1.0",
      hash: manifestHash,
      collections: manifestCollections,
      plugins: manifestPlugins,
      authMode: authModeValue,
      i18n: isI18nEnabled() && i18nConfig ? {
        defaultLocale: i18nConfig.defaultLocale,
        locales: i18nConfig.locales
      } : void 0,
      marketplace: !!this.config.marketplace
    };
  }
  /**
  * Invalidate the cached manifest (no-op now that we don't cache).
  * Kept for API compatibility.
  */
  invalidateManifest() {
  }
  async handleContentList(collection, params) {
    return handleContentList(this.db, collection, params);
  }
  async handleContentGet(collection, id, locale) {
    return handleContentGet(this.db, collection, id, locale);
  }
  async handleContentGetIncludingTrashed(collection, id, locale) {
    return handleContentGetIncludingTrashed(this.db, collection, id, locale);
  }
  async handleContentCreate(collection, body) {
    let processedData = body.data;
    if (this.hooks.hasHooks("content:beforeSave")) processedData = (await this.hooks.runContentBeforeSave(body.data, collection, true)).content;
    processedData = await this.runSandboxedBeforeSave(processedData, collection, true);
    processedData = await this.normalizeMediaFields(collection, processedData);
    const result = await handleContentCreate(this.db, collection, {
      ...body,
      data: processedData,
      authorId: body.authorId,
      bylines: body.bylines
    });
    if (result.success && result.data) this.runAfterSaveHooks(contentItemToRecord(result.data.item), collection, true);
    return result;
  }
  async handleContentUpdate(collection, id, body) {
    const { ContentRepository } = await import("./chunks/adapt-sandbox-entry_DgOh8so3.mjs").then((n) => n.ag).then((n) => n.n);
    const repo = new ContentRepository(this.db);
    const resolvedItem = await repo.findByIdOrSlug(collection, id);
    const resolvedId = resolvedItem?.id ?? id;
    if (body._rev) {
      if (!resolvedItem) return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Content item not found: ${id}`
        }
      };
      const revCheck = validateRev(body._rev, resolvedItem);
      if (!revCheck.valid) return {
        success: false,
        error: {
          code: "CONFLICT",
          message: revCheck.message
        }
      };
    }
    const { _rev: _discardedRev, ...bodyWithoutRev } = body;
    let processedData = bodyWithoutRev.data;
    if (bodyWithoutRev.data) {
      if (this.hooks.hasHooks("content:beforeSave")) processedData = (await this.hooks.runContentBeforeSave(bodyWithoutRev.data, collection, false)).content;
      processedData = await this.runSandboxedBeforeSave(processedData, collection, false);
      processedData = await this.normalizeMediaFields(collection, processedData);
    }
    let usesDraftRevisions = false;
    if (processedData) try {
      if ((await this.schemaRegistry.getCollectionWithFields(collection))?.supports?.includes("revisions")) {
        usesDraftRevisions = true;
        const revisionRepo = new RevisionRepository(this.db);
        const existing = await repo.findById(collection, resolvedId);
        if (existing) {
          let baseData;
          if (existing.draftRevisionId) baseData = (await revisionRepo.findById(existing.draftRevisionId))?.data ?? existing.data;
          else baseData = existing.data;
          const mergedData = {
            ...baseData,
            ...processedData
          };
          if (bodyWithoutRev.slug !== void 0) mergedData._slug = bodyWithoutRev.slug;
          if (bodyWithoutRev.skipRevision && existing.draftRevisionId) await revisionRepo.updateData(existing.draftRevisionId, mergedData);
          else {
            const revision = await revisionRepo.create({
              collection,
              entryId: resolvedId,
              data: mergedData,
              authorId: bodyWithoutRev.authorId ?? void 0
            });
            const tableName = `ec_${collection}`;
            await sql`
								UPDATE ${sql.ref(tableName)}
								SET draft_revision_id = ${revision.id},
									updated_at = ${(/* @__PURE__ */ new Date()).toISOString()}
								WHERE id = ${resolvedId}
							`.execute(this.db);
            revisionRepo.pruneOldRevisions(collection, resolvedId, 50).catch(() => {
            });
          }
        }
      }
    } catch {
    }
    const result = await handleContentUpdate(this.db, collection, resolvedId, {
      ...bodyWithoutRev,
      data: usesDraftRevisions ? void 0 : processedData,
      slug: usesDraftRevisions ? void 0 : bodyWithoutRev.slug,
      authorId: bodyWithoutRev.authorId,
      bylines: bodyWithoutRev.bylines
    });
    if (result.success && result.data) this.runAfterSaveHooks(contentItemToRecord(result.data.item), collection, false);
    return result;
  }
  async handleContentDelete(collection, id) {
    if (this.hooks.hasHooks("content:beforeDelete")) {
      const { allowed } = await this.hooks.runContentBeforeDelete(id, collection);
      if (!allowed) return {
        success: false,
        error: {
          code: "DELETE_BLOCKED",
          message: "Delete blocked by plugin hook"
        }
      };
    }
    if (!await this.runSandboxedBeforeDelete(id, collection)) return {
      success: false,
      error: {
        code: "DELETE_BLOCKED",
        message: "Delete blocked by sandboxed plugin hook"
      }
    };
    const result = await handleContentDelete(this.db, collection, id);
    if (result.success) this.runAfterDeleteHooks(id, collection);
    return result;
  }
  async handleContentListTrashed(collection, params = {}) {
    return handleContentListTrashed(this.db, collection, params);
  }
  async handleContentRestore(collection, id) {
    return handleContentRestore(this.db, collection, id);
  }
  async handleContentPermanentDelete(collection, id) {
    return handleContentPermanentDelete(this.db, collection, id);
  }
  async handleContentCountTrashed(collection) {
    return handleContentCountTrashed(this.db, collection);
  }
  async handleContentDuplicate(collection, id, authorId) {
    return handleContentDuplicate(this.db, collection, id, authorId);
  }
  async handleContentPublish(collection, id) {
    return handleContentPublish(this.db, collection, id);
  }
  async handleContentUnpublish(collection, id) {
    return handleContentUnpublish(this.db, collection, id);
  }
  async handleContentSchedule(collection, id, scheduledAt) {
    return handleContentSchedule(this.db, collection, id, scheduledAt);
  }
  async handleContentUnschedule(collection, id) {
    return handleContentUnschedule(this.db, collection, id);
  }
  async handleContentCountScheduled(collection) {
    return handleContentCountScheduled(this.db, collection);
  }
  async handleContentDiscardDraft(collection, id) {
    return handleContentDiscardDraft(this.db, collection, id);
  }
  async handleContentCompare(collection, id) {
    return handleContentCompare(this.db, collection, id);
  }
  async handleContentTranslations(collection, id) {
    return handleContentTranslations(this.db, collection, id);
  }
  async handleMediaList(params) {
    return handleMediaList(this.db, params);
  }
  async handleMediaGet(id) {
    return handleMediaGet(this.db, id);
  }
  async handleMediaCreate(input) {
    let processedInput = input;
    if (this.hooks.hasHooks("media:beforeUpload")) {
      const hookResult = await this.hooks.runMediaBeforeUpload({
        name: input.filename,
        type: input.mimeType,
        size: input.size || 0
      });
      processedInput = {
        ...input,
        filename: hookResult.file.name,
        mimeType: hookResult.file.type,
        size: hookResult.file.size
      };
    }
    const result = await handleMediaCreate(this.db, processedInput);
    if (result.success && this.hooks.hasHooks("media:afterUpload")) {
      const item = result.data.item;
      const mediaItem = {
        id: item.id,
        filename: item.filename,
        mimeType: item.mimeType,
        size: item.size,
        url: `/media/${item.id}/${item.filename}`,
        createdAt: item.createdAt
      };
      this.hooks.runMediaAfterUpload(mediaItem).catch((err) => console.error("EmDash afterUpload hook error:", err));
    }
    return result;
  }
  async handleMediaUpdate(id, input) {
    return handleMediaUpdate(this.db, id, input);
  }
  async handleMediaDelete(id) {
    return handleMediaDelete(this.db, id);
  }
  async handleRevisionList(collection, entryId, params = {}) {
    return handleRevisionList(this.db, collection, entryId, params);
  }
  async handleRevisionGet(revisionId) {
    return handleRevisionGet(this.db, revisionId);
  }
  async handleRevisionRestore(revisionId, callerUserId) {
    return handleRevisionRestore(this.db, revisionId, callerUserId);
  }
  /**
  * Get route metadata for a plugin route without invoking the handler.
  * Used by the catch-all route to decide auth before dispatch.
  * Returns null if the plugin or route doesn't exist.
  */
  getPluginRouteMeta(pluginId, path) {
    if (!this.isPluginEnabled(pluginId)) return null;
    const routeKey = path.replace(LEADING_SLASH_PATTERN, "");
    const trustedPlugin = this.configuredPlugins.find((p) => p.id === pluginId);
    if (trustedPlugin) {
      const route = trustedPlugin.routes[routeKey];
      if (!route) return null;
      return { public: route.public === true };
    }
    const meta = sandboxedRouteMetaCache.get(pluginId);
    if (meta) {
      const routeMeta = meta.get(routeKey);
      if (routeMeta) return routeMeta;
    }
    if (routeKey === "admin") {
      const manifestMeta = marketplaceManifestCache.get(pluginId);
      if (manifestMeta?.admin?.pages?.length || manifestMeta?.admin?.widgets?.length) return { public: false };
      const entry = this.sandboxedPluginEntries.find((e) => e.id === pluginId);
      if (entry?.adminPages?.length || entry?.adminWidgets?.length) return { public: false };
    }
    if (this.findSandboxedPlugin(pluginId)) return { public: false };
    return null;
  }
  async handlePluginApiRoute(pluginId, _method, path, request) {
    if (!this.isPluginEnabled(pluginId)) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Plugin not enabled: ${pluginId}`
      }
    };
    const trustedPlugin = this.configuredPlugins.find((p) => p.id === pluginId);
    if (trustedPlugin && this.enabledPlugins.has(trustedPlugin.id)) {
      const routeRegistry = new PluginRouteRegistry({ db: this.db });
      routeRegistry.register(trustedPlugin);
      const routeKey = path.replace(LEADING_SLASH_PATTERN, "");
      let body = void 0;
      try {
        body = await request.json();
      } catch {
      }
      return routeRegistry.invoke(pluginId, routeKey, {
        request,
        body
      });
    }
    const sandboxedPlugin = this.findSandboxedPlugin(pluginId);
    if (sandboxedPlugin) return this.handleSandboxedRoute(sandboxedPlugin, path, request);
    return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Plugin not found: ${pluginId}`
      }
    };
  }
  findSandboxedPlugin(pluginId) {
    for (const [key, plugin] of this.sandboxedPlugins) if (key.startsWith(pluginId + ":")) return plugin;
  }
  /**
  * Normalize image/file fields in content data.
  * Fills missing dimensions, storageKey, mimeType, and filename from providers.
  */
  async normalizeMediaFields(collection, data) {
    let collectionInfo;
    try {
      collectionInfo = await this.schemaRegistry.getCollectionWithFields(collection);
    } catch {
      return data;
    }
    if (!collectionInfo?.fields) return data;
    const imageFields = collectionInfo.fields.filter((f) => f.type === "image" || f.type === "file");
    if (imageFields.length === 0) return data;
    const getProvider = (id) => this.getMediaProvider(id);
    const result = { ...data };
    for (const field of imageFields) {
      const value = result[field.slug];
      if (value == null) continue;
      try {
        const normalized = await normalizeMediaValue(value, getProvider);
        if (normalized) result[field.slug] = normalized;
      } catch {
      }
    }
    return result;
  }
  async runSandboxedBeforeSave(content, collection, isNew) {
    let result = content;
    for (const [pluginKey, plugin] of this.sandboxedPlugins) {
      const [id] = pluginKey.split(":");
      if (!id || !this.isPluginEnabled(id)) continue;
      try {
        const hookResult = await plugin.invokeHook("content:beforeSave", {
          content: result,
          collection,
          isNew
        });
        if (hookResult && typeof hookResult === "object" && !Array.isArray(hookResult)) {
          const record2 = {};
          for (const [k, v] of Object.entries(hookResult)) record2[k] = v;
          result = record2;
        }
      } catch (error) {
        console.error(`EmDash: Sandboxed plugin ${id} beforeSave hook error:`, error);
      }
    }
    return result;
  }
  async runSandboxedBeforeDelete(id, collection) {
    for (const [pluginKey, plugin] of this.sandboxedPlugins) {
      const [pluginId] = pluginKey.split(":");
      if (!pluginId || !this.isPluginEnabled(pluginId)) continue;
      try {
        if (await plugin.invokeHook("content:beforeDelete", {
          id,
          collection
        }) === false) return false;
      } catch (error) {
        console.error(`EmDash: Sandboxed plugin ${pluginId} beforeDelete hook error:`, error);
      }
    }
    return true;
  }
  runAfterSaveHooks(content, collection, isNew) {
    if (this.hooks.hasHooks("content:afterSave")) this.hooks.runContentAfterSave(content, collection, isNew).catch((err) => console.error("EmDash afterSave hook error:", err));
    for (const [pluginKey, plugin] of this.sandboxedPlugins) {
      const [id] = pluginKey.split(":");
      if (!id || !this.isPluginEnabled(id)) continue;
      plugin.invokeHook("content:afterSave", {
        content,
        collection,
        isNew
      }).catch((err) => console.error(`EmDash: Sandboxed plugin ${id} afterSave error:`, err));
    }
  }
  runAfterDeleteHooks(id, collection) {
    if (this.hooks.hasHooks("content:afterDelete")) this.hooks.runContentAfterDelete(id, collection).catch((err) => console.error("EmDash afterDelete hook error:", err));
    for (const [pluginKey, plugin] of this.sandboxedPlugins) {
      const [pluginId] = pluginKey.split(":");
      if (!pluginId || !this.isPluginEnabled(pluginId)) continue;
      plugin.invokeHook("content:afterDelete", {
        id,
        collection
      }).catch((err) => console.error(`EmDash: Sandboxed plugin ${pluginId} afterDelete error:`, err));
    }
  }
  async handleSandboxedRoute(plugin, path, request) {
    const routeName = path.replace(LEADING_SLASH_PATTERN, "");
    let body = void 0;
    try {
      body = await request.json();
    } catch {
    }
    try {
      const headers = sanitizeHeadersForSandbox(request.headers);
      const meta = extractRequestMeta(request);
      return {
        success: true,
        data: await plugin.invokeRoute(routeName, body, {
          url: request.url,
          method: request.method,
          headers,
          meta
        })
      };
    } catch (error) {
      console.error(`EmDash: Sandboxed plugin route error:`, error);
      return {
        success: false,
        error: {
          code: "ROUTE_ERROR",
          message: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }
  /**
  * Cache for page contributions. Uses a WeakMap keyed on the PublicPageContext
  * object so results are collected once per page context per request, even when
  * multiple render components (EmDashHead, EmDashBodyStart, EmDashBodyEnd)
  * request contributions from the same page.
  */
  pageContributionCache = /* @__PURE__ */ new WeakMap();
  /**
  * Collect all page contributions (metadata + fragments) in a single pass.
  * Results are cached by page context object identity.
  */
  async collectPageContributions(page) {
    const cached = this.pageContributionCache.get(page);
    if (cached) return cached;
    const promise = this.doCollectPageContributions(page);
    this.pageContributionCache.set(page, promise);
    return promise;
  }
  async doCollectPageContributions(page) {
    const metadata = [];
    const fragments = [];
    if (this.hooks.hasHooks("page:metadata")) {
      const results = await this.hooks.runPageMetadata({ page });
      for (const r of results) metadata.push(...r.contributions);
    }
    if (this.hooks.hasHooks("page:fragments")) {
      const results = await this.hooks.runPageFragments({ page });
      for (const r of results) fragments.push(...r.contributions);
    }
    for (const [pluginKey, plugin] of this.sandboxedPlugins) {
      const [id] = pluginKey.split(":");
      if (!id || !this.isPluginEnabled(id)) continue;
      try {
        const result = await plugin.invokeHook("page:metadata", { page });
        if (result != null) {
          const items = Array.isArray(result) ? result : [result];
          for (const item of items) if (isValidMetadataContribution(item)) metadata.push(item);
        }
      } catch (error) {
        console.error(`EmDash: Sandboxed plugin ${id} page:metadata error:`, error);
      }
    }
    return {
      metadata,
      fragments
    };
  }
  /**
  * Collect page metadata contributions from trusted and sandboxed plugins.
  * Delegates to the single-pass collector and returns the metadata portion.
  */
  async collectPageMetadata(page) {
    const { metadata } = await this.collectPageContributions(page);
    return metadata;
  }
  /**
  * Collect page fragment contributions from trusted plugins only.
  * Delegates to the single-pass collector and returns the fragments portion.
  */
  async collectPageFragments(page) {
    const { fragments } = await this.collectPageContributions(page);
    return fragments;
  }
  isPluginEnabled(pluginId) {
    const status = this.pluginStates.get(pluginId);
    return status === void 0 || status === "active";
  }
};
let runtimeInstance = null;
let runtimeInitializing = false;
let i18nInitialized = false;
let setupVerified = false;
function getConfig() {
  if (virtualConfig && typeof virtualConfig === "object") {
    if (!i18nInitialized) {
      i18nInitialized = true;
      const config = virtualConfig;
      if (config.i18n && typeof config.i18n === "object") setI18nConfig(config.i18n);
      else setI18nConfig(null);
    }
    return virtualConfig;
  }
  return null;
}
function getPlugins() {
  return plugins || [];
}
function buildDependencies(config) {
  return {
    config,
    plugins: getPlugins(),
    createDialect,
    createStorage,
    sandboxEnabled,
    sandboxedPluginEntries: sandboxedPlugins || [],
    createSandboxRunner,
    mediaProviderEntries: mediaProviders || []
  };
}
async function getRuntime(config) {
  if (runtimeInstance) return runtimeInstance;
  if (runtimeInitializing) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getRuntime(config);
  }
  runtimeInitializing = true;
  try {
    const deps = buildDependencies(config);
    const runtime = await EmDashRuntime.create(deps);
    runtimeInstance = runtime;
    return runtime;
  } finally {
    runtimeInitializing = false;
  }
}
function setBaselineSecurityHeaders(response) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  if (!response.headers.has("Content-Security-Policy")) response.headers.set("X-Frame-Options", "SAMEORIGIN");
}
const PUBLIC_RUNTIME_ROUTES = /* @__PURE__ */ new Set(["/sitemap.xml", "/robots.txt"]);
const onRequest$5 = defineMiddleware(async (context, next) => {
  const { request, locals, cookies } = context;
  const url = context.url;
  const isEmDashRoute = url.pathname.startsWith("/_emdash");
  const isPublicRuntimeRoute = PUBLIC_RUNTIME_ROUTES.has(url.pathname);
  const hasEditCookie = cookies.get("emdash-edit-mode")?.value === "true";
  const hasPreviewToken = url.searchParams.has("_preview");
  const playgroundDb = locals.__playgroundDb;
  if (!isEmDashRoute && !isPublicRuntimeRoute && !hasEditCookie && !hasPreviewToken) {
    if (!await context.session?.get("user") && !playgroundDb) {
      if (!setupVerified) try {
        const { getDb: getDb2 } = await import("./chunks/adapt-sandbox-entry_DgOh8so3.mjs").then((n) => n.ah).then((n) => n.r);
        await (await getDb2()).selectFrom("_emdash_migrations").selectAll().limit(1).execute();
        setupVerified = true;
      } catch {
        return context.redirect("/_emdash/admin/setup");
      }
      const response = await next();
      setBaselineSecurityHeaders(response);
      return response;
    }
  }
  const config = getConfig();
  if (!config) {
    console.error("EmDash: No configuration found");
    return next();
  }
  const doInit = async () => {
    try {
      const runtime = await getRuntime(config);
      setupVerified = true;
      locals.emdashManifest = await runtime.getManifest();
      locals.emdash = {
        handleContentList: runtime.handleContentList.bind(runtime),
        handleContentGet: runtime.handleContentGet.bind(runtime),
        handleContentCreate: runtime.handleContentCreate.bind(runtime),
        handleContentUpdate: runtime.handleContentUpdate.bind(runtime),
        handleContentDelete: runtime.handleContentDelete.bind(runtime),
        handleContentListTrashed: runtime.handleContentListTrashed.bind(runtime),
        handleContentRestore: runtime.handleContentRestore.bind(runtime),
        handleContentPermanentDelete: runtime.handleContentPermanentDelete.bind(runtime),
        handleContentCountTrashed: runtime.handleContentCountTrashed.bind(runtime),
        handleContentGetIncludingTrashed: runtime.handleContentGetIncludingTrashed.bind(runtime),
        handleContentDuplicate: runtime.handleContentDuplicate.bind(runtime),
        handleContentPublish: runtime.handleContentPublish.bind(runtime),
        handleContentUnpublish: runtime.handleContentUnpublish.bind(runtime),
        handleContentSchedule: runtime.handleContentSchedule.bind(runtime),
        handleContentUnschedule: runtime.handleContentUnschedule.bind(runtime),
        handleContentCountScheduled: runtime.handleContentCountScheduled.bind(runtime),
        handleContentDiscardDraft: runtime.handleContentDiscardDraft.bind(runtime),
        handleContentCompare: runtime.handleContentCompare.bind(runtime),
        handleContentTranslations: runtime.handleContentTranslations.bind(runtime),
        handleMediaList: runtime.handleMediaList.bind(runtime),
        handleMediaGet: runtime.handleMediaGet.bind(runtime),
        handleMediaCreate: runtime.handleMediaCreate.bind(runtime),
        handleMediaUpdate: runtime.handleMediaUpdate.bind(runtime),
        handleMediaDelete: runtime.handleMediaDelete.bind(runtime),
        handleRevisionList: runtime.handleRevisionList.bind(runtime),
        handleRevisionGet: runtime.handleRevisionGet.bind(runtime),
        handleRevisionRestore: runtime.handleRevisionRestore.bind(runtime),
        handlePluginApiRoute: runtime.handlePluginApiRoute.bind(runtime),
        getPluginRouteMeta: runtime.getPluginRouteMeta.bind(runtime),
        getMediaProvider: runtime.getMediaProvider.bind(runtime),
        getMediaProviderList: runtime.getMediaProviderList.bind(runtime),
        storage: runtime.storage,
        db: runtime.db,
        hooks: runtime.hooks,
        email: runtime.email,
        configuredPlugins: runtime.configuredPlugins,
        config,
        invalidateManifest: runtime.invalidateManifest.bind(runtime),
        getSandboxRunner: runtime.getSandboxRunner.bind(runtime),
        syncMarketplacePlugins: runtime.syncMarketplacePlugins.bind(runtime),
        setPluginStatus: runtime.setPluginStatus.bind(runtime)
      };
    } catch (error) {
      console.error("EmDash middleware error:", error);
    }
    const dbConfig = config?.database?.config;
    if (dbConfig && typeof isSessionEnabled === "function" && isSessionEnabled(dbConfig) && typeof getD1Binding === "function" && createSessionDialect) {
      const d1Binding = getD1Binding(dbConfig);
      if (d1Binding && typeof d1Binding === "object" && "withSession" in d1Binding) {
        const isAuthenticated = !!await context.session?.get("user");
        const isWrite = request.method !== "GET" && request.method !== "HEAD";
        const configConstraint = getDefaultConstraint(dbConfig);
        const cookieName = getBookmarkCookieName(dbConfig);
        let constraint = configConstraint;
        if (isAuthenticated && isWrite) constraint = "first-primary";
        else if (isAuthenticated) {
          const bookmarkCookie = context.cookies.get(cookieName);
          if (bookmarkCookie?.value) constraint = bookmarkCookie.value;
        }
        const session = d1Binding.withSession.call(d1Binding, constraint);
        return runWithContext({
          editMode: false,
          db: new Kysely({ dialect: createSessionDialect(session) })
        }, async () => {
          const response2 = await next();
          setBaselineSecurityHeaders(response2);
          if (isAuthenticated && session && typeof session === "object" && "getBookmark" in session) {
            const newBookmark = session.getBookmark.call(session);
            if (newBookmark) response2.headers.append("Set-Cookie", `${cookieName}=${newBookmark}; Path=/; HttpOnly; SameSite=Lax; Secure`);
          }
          return response2;
        });
      }
    }
    const response = await next();
    setBaselineSecurityHeaders(response);
    return response;
  };
  if (playgroundDb) return runWithContext({
    editMode: context.cookies.get("emdash-edit-mode")?.value === "true",
    db: playgroundDb
  }, doInit);
  return doInit();
});
const SKIP_PREFIXES = ["/_emdash", "/_image"];
const ASSET_EXTENSION = /\.\w{1,10}$/;
function isRedirectCode(code) {
  return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
}
const onRequest$4 = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return next();
  if (ASSET_EXTENSION.test(pathname)) return next();
  const { emdash } = context.locals;
  if (!emdash?.db) return next();
  try {
    const repo = new RedirectRepository(emdash.db);
    const match = await repo.matchPath(pathname);
    if (match) {
      if (match.resolvedDestination.startsWith("//") || match.resolvedDestination.startsWith("/\\")) return next();
      repo.recordHit(match.redirect.id).catch(() => {
      });
      const code = isRedirectCode(match.redirect.type) ? match.redirect.type : 301;
      return context.redirect(match.resolvedDestination, code);
    }
    const response = await next();
    if (response.status === 404) {
      const referrer = context.request.headers.get("referer") ?? null;
      const userAgent = context.request.headers.get("user-agent") ?? null;
      repo.log404({
        path: pathname,
        referrer,
        userAgent
      }).catch(() => {
      });
    }
    return response;
  } catch {
    return next();
  }
});
const onRequest$3 = defineMiddleware(async (context, next) => {
  const isAdminRoute = context.url.pathname.startsWith("/_emdash/admin");
  const isSetupRoute = context.url.pathname.startsWith("/_emdash/admin/setup");
  if (isAdminRoute && !isSetupRoute) {
    const { emdash } = context.locals;
    if (!emdash?.db) return next();
    try {
      const setupComplete = await emdash.db.selectFrom("options").select("value").where("name", "=", "emdash:setup_complete").executeTakeFirst();
      if (!(setupComplete && (() => {
        try {
          const parsed = JSON.parse(setupComplete.value);
          return parsed === true || parsed === "true";
        } catch {
          return false;
        }
      })())) return context.redirect("/_emdash/admin/setup");
      if (getAuthMode(emdash.config).type === "passkey") {
        if ((await emdash.db.selectFrom("users").select((eb) => eb.fn.countAll().as("count")).executeTakeFirstOrThrow()).count === 0) return context.redirect("/_emdash/admin/setup");
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("no such table")) return context.redirect("/_emdash/admin/setup");
      console.error("Setup middleware error:", error);
    }
  }
  return next();
});
const API_CACHE_HEADERS = { "Cache-Control": "private, no-store" };
function apiError(code, message, status) {
  return Response.json({ error: {
    code,
    message
  } }, {
    status,
    headers: API_CACHE_HEADERS
  });
}
const authenticate = void 0;
function checkPublicCsrf(request, url) {
  if (request.headers.get("X-EmDash-Request") === "1") return null;
  const origin = request.headers.get("Origin");
  if (origin) {
    try {
      if (new URL(origin).origin === url.origin) return null;
    } catch {
    }
    return apiError("CSRF_REJECTED", "Cross-origin request blocked", 403);
  }
  return null;
}
async function resolveApiToken(db, rawToken) {
  const hash = hashPrefixedToken(rawToken);
  const row = await db.selectFrom("_emdash_api_tokens").select([
    "id",
    "user_id",
    "scopes",
    "expires_at"
  ]).where("token_hash", "=", hash).executeTakeFirst();
  if (!row) return null;
  if (row.expires_at && new Date(row.expires_at) < /* @__PURE__ */ new Date()) return null;
  db.updateTable("_emdash_api_tokens").set({ last_used_at: (/* @__PURE__ */ new Date()).toISOString() }).where("id", "=", row.id).execute().catch(() => {
  });
  return {
    userId: row.user_id,
    scopes: JSON.parse(row.scopes)
  };
}
async function resolveOAuthToken(db, rawToken) {
  const hash = hashPrefixedToken(rawToken);
  const row = await db.selectFrom("_emdash_oauth_tokens").select([
    "user_id",
    "scopes",
    "expires_at",
    "token_type"
  ]).where("token_hash", "=", hash).where("token_type", "=", "access").executeTakeFirst();
  if (!row) return null;
  if (new Date(row.expires_at) < /* @__PURE__ */ new Date()) return null;
  return {
    userId: row.user_id,
    scopes: JSON.parse(row.scopes)
  };
}
const MW_CACHE_HEADERS = { "Cache-Control": "private, no-store" };
const ROLE_ADMIN = 50;
function buildEmDashCsp(marketplaceUrl) {
  const imgSources = [
    "'self'",
    "data:",
    "blob:"
  ];
  if (marketplaceUrl) try {
    imgSources.push(new URL(marketplaceUrl).origin);
  } catch {
  }
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "connect-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    `img-src ${imgSources.join(" ")}`,
    "object-src 'none'",
    "base-uri 'self'"
  ].join("; ");
}
const PUBLIC_API_PREFIXES = [
  "/_emdash/api/setup",
  "/_emdash/api/auth/login",
  "/_emdash/api/auth/register",
  "/_emdash/api/auth/dev-bypass",
  "/_emdash/api/auth/signup/",
  "/_emdash/api/auth/magic-link/",
  "/_emdash/api/auth/invite/accept",
  "/_emdash/api/auth/invite/complete",
  "/_emdash/api/auth/oauth/",
  "/_emdash/api/oauth/device/token",
  "/_emdash/api/oauth/device/code",
  "/_emdash/api/oauth/token",
  "/_emdash/api/comments/",
  "/_emdash/api/media/file/",
  "/_emdash/.well-known/"
];
const PUBLIC_API_EXACT = /* @__PURE__ */ new Set([
  "/_emdash/api/auth/passkey/options",
  "/_emdash/api/auth/passkey/verify",
  "/_emdash/api/oauth/token",
  "/_emdash/api/snapshot"
]);
function isPublicEmDashRoute(pathname) {
  if (PUBLIC_API_EXACT.has(pathname)) return true;
  if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  return false;
}
const onRequest$2 = defineMiddleware(async (context, next) => {
  const { url } = context;
  const isAdminRoute = url.pathname.startsWith("/_emdash/admin");
  const isSetupRoute = url.pathname.startsWith("/_emdash/admin/setup");
  const isApiRoute = url.pathname.startsWith("/_emdash/api");
  const isPublicApiRoute = isPublicEmDashRoute(url.pathname);
  const isPublicRoute = !isAdminRoute && !isApiRoute;
  if (isPublicApiRoute) {
    const method2 = context.request.method.toUpperCase();
    if (method2 !== "GET" && method2 !== "HEAD" && method2 !== "OPTIONS") {
      const csrfError = checkPublicCsrf(context.request, url);
      if (csrfError) return csrfError;
    }
    return next();
  }
  if (url.pathname.startsWith("/_emdash/api/plugins/")) {
    const method2 = context.request.method.toUpperCase();
    if (method2 !== "GET" && method2 !== "HEAD" && method2 !== "OPTIONS") {
      const csrfError = checkPublicCsrf(context.request, url);
      if (csrfError) return csrfError;
    }
    return handlePluginRouteAuth(context, next);
  }
  if (isSetupRoute) {
    const method2 = context.request.method.toUpperCase();
    if (method2 !== "GET" && method2 !== "HEAD" && method2 !== "OPTIONS") {
      if (context.request.headers.get("X-EmDash-Request") !== "1") return new Response(JSON.stringify({ error: {
        code: "CSRF_REJECTED",
        message: "Missing required header"
      } }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          ...MW_CACHE_HEADERS
        }
      });
    }
    return next();
  }
  if (isPublicRoute) return handlePublicRouteAuth(context, next);
  const bearerResult = await handleBearerAuth(context);
  if (bearerResult === "invalid") {
    const headers = {
      "Content-Type": "application/json",
      ...MW_CACHE_HEADERS
    };
    if (url.pathname === "/_emdash/api/mcp") headers["WWW-Authenticate"] = `Bearer resource_metadata="${url.origin}/.well-known/oauth-protected-resource"`;
    return new Response(JSON.stringify({ error: {
      code: "INVALID_TOKEN",
      message: "Invalid or expired token"
    } }), {
      status: 401,
      headers
    });
  }
  const isTokenAuth = bearerResult === "authenticated";
  const method = context.request.method.toUpperCase();
  const isOAuthConsent = url.pathname.startsWith("/_emdash/oauth/authorize");
  if (isApiRoute && !isTokenAuth && !isOAuthConsent && method !== "GET" && method !== "HEAD" && method !== "OPTIONS" && !isPublicApiRoute) {
    if (context.request.headers.get("X-EmDash-Request") !== "1") return new Response(JSON.stringify({ error: {
      code: "CSRF_REJECTED",
      message: "Missing required header"
    } }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
        ...MW_CACHE_HEADERS
      }
    });
  }
  if (isTokenAuth) {
    const scopeError = enforceTokenScope(url.pathname, method, context.locals.tokenScopes);
    if (scopeError) return scopeError;
    const response2 = await next();
    {
      const marketplaceUrl = context.locals.emdash?.config.marketplace;
      response2.headers.set("Content-Security-Policy", buildEmDashCsp(marketplaceUrl));
    }
    return response2;
  }
  const response = await handleEmDashAuth(context, next);
  {
    const marketplaceUrl = context.locals.emdash?.config.marketplace;
    response.headers.set("Content-Security-Policy", buildEmDashCsp(marketplaceUrl));
  }
  return response;
});
async function handleEmDashAuth(context, next) {
  const { url, locals } = context;
  const { emdash } = locals;
  const isLoginRoute = url.pathname.startsWith("/_emdash/admin/login");
  const isApiRoute = url.pathname.startsWith("/_emdash/api");
  if (!emdash?.db) return next();
  const authMode = getAuthMode(emdash.config);
  if (authMode.type === "external") {
    return handleExternalAuth(context, next, authMode);
  }
  if (isLoginRoute) return next();
  return handlePasskeyAuth(context, next, isApiRoute);
}
async function handlePluginRouteAuth(context, next) {
  const { locals } = context;
  const { emdash } = locals;
  try {
    const bearerResult = await handleBearerAuth(context);
    if (bearerResult === "authenticated") return next();
    if (bearerResult === "invalid") return new Response(JSON.stringify({ error: {
      code: "INVALID_TOKEN",
      message: "Invalid or expired token"
    } }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        ...MW_CACHE_HEADERS
      }
    });
  } catch (error) {
    console.error("Plugin route bearer auth error:", error);
  }
  try {
    const { session } = context;
    const sessionUser = await session?.get("user");
    if (sessionUser?.id && emdash?.db) {
      const user = await createKyselyAdapter(emdash.db).getUserById(sessionUser.id);
      if (user && !user.disabled) locals.user = user;
    }
  } catch (error) {
    console.error("Plugin route session auth error:", error);
  }
  return next();
}
async function handlePublicRouteAuth(context, next) {
  const { locals, session } = context;
  const { emdash } = locals;
  try {
    const sessionUser = await session?.get("user");
    if (sessionUser?.id && emdash?.db) {
      const user = await createKyselyAdapter(emdash.db).getUserById(sessionUser.id);
      if (user && !user.disabled) locals.user = user;
    }
  } catch {
  }
  return next();
}
async function handleExternalAuth(context, next, authMode, _isApiRoute) {
  const { locals, request } = context;
  const { emdash } = locals;
  try {
    if (typeof authenticate !== "function") throw new Error(`Auth provider ${authMode.entrypoint} does not export an authenticate function`);
    const authResult = await authenticate(request, authMode.config);
    const externalConfig = authMode.config;
    const adapter = createKyselyAdapter(emdash.db);
    let user = await adapter.getUserByEmail(authResult.email);
    if (!user) {
      if (externalConfig.autoProvision === false) return new Response("User not authorized", {
        status: 403,
        headers: {
          "Content-Type": "text/plain",
          ...MW_CACHE_HEADERS
        }
      });
      const userCount = await emdash.db.selectFrom("users").select(emdash.db.fn.count("id").as("count")).executeTakeFirst();
      const isFirstUser = Number(userCount?.count ?? 0) === 0;
      const role = isFirstUser ? ROLE_ADMIN : authResult.role;
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const newUser = {
        id: ulid(),
        email: authResult.email,
        name: authResult.name,
        role,
        email_verified: 1,
        created_at: now,
        updated_at: now
      };
      await emdash.db.insertInto("users").values(newUser).execute();
      user = await adapter.getUserByEmail(authResult.email);
      console.log(`[external-auth] Provisioned user: ${authResult.email} (role: ${role}, first: ${isFirstUser})`);
    } else {
      const updates = {};
      let newName;
      let newRole;
      if (authResult.name && user.name !== authResult.name) {
        newName = authResult.name;
        updates.name = newName;
      }
      if (externalConfig.syncRoles && user.role !== authResult.role) {
        newRole = authResult.role;
        updates.role = newRole;
      }
      if (Object.keys(updates).length > 0) {
        updates.updated_at = (/* @__PURE__ */ new Date()).toISOString();
        await emdash.db.updateTable("users").set(updates).where("id", "=", user.id).execute();
        user = {
          ...user,
          ...newName ? { name: newName } : {},
          ...newRole ? { role: newRole } : {}
        };
        console.log(`[external-auth] Updated user ${authResult.email}:`, Object.keys(updates).filter((k) => k !== "updated_at"));
      }
    }
    if (!user) return new Response("Failed to provision user", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
        ...MW_CACHE_HEADERS
      }
    });
    if (user.disabled) return new Response("Account disabled", {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
        ...MW_CACHE_HEADERS
      }
    });
    locals.user = user;
    const { session } = context;
    session?.set("user", { id: user.id });
    return next();
  } catch (error) {
    console.error("[external-auth] Auth error:", error);
    return new Response("Authentication failed", {
      status: 401,
      headers: {
        "Content-Type": "text/plain",
        ...MW_CACHE_HEADERS
      }
    });
  }
}
async function handleBearerAuth(context) {
  const authHeader = context.request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return "none";
  const token = authHeader.slice(7);
  if (!token) return "none";
  const { locals } = context;
  const { emdash } = locals;
  if (!emdash?.db) return "none";
  let resolved = null;
  if (token.startsWith("ec_pat_")) resolved = await resolveApiToken(emdash.db, token);
  else if (token.startsWith("ec_oat_")) resolved = await resolveOAuthToken(emdash.db, token);
  else return "invalid";
  if (!resolved) return "invalid";
  const user = await createKyselyAdapter(emdash.db).getUserById(resolved.userId);
  if (!user || user.disabled) return "invalid";
  locals.user = user;
  locals.tokenScopes = resolved.scopes;
  return "authenticated";
}
async function handlePasskeyAuth(context, next, isApiRoute) {
  const { url, locals, session } = context;
  const { emdash } = locals;
  try {
    const sessionUser = await session?.get("user");
    if (!sessionUser?.id) {
      if (isApiRoute) {
        const headers = { ...MW_CACHE_HEADERS };
        if (url.pathname === "/_emdash/api/mcp") headers["WWW-Authenticate"] = `Bearer resource_metadata="${url.origin}/.well-known/oauth-protected-resource"`;
        return Response.json({ error: {
          code: "NOT_AUTHENTICATED",
          message: "Not authenticated"
        } }, {
          status: 401,
          headers
        });
      }
      const loginUrl = new URL("/_emdash/admin/login", url.origin);
      loginUrl.searchParams.set("redirect", url.pathname);
      return context.redirect(loginUrl.toString());
    }
    const user = await createKyselyAdapter(emdash.db).getUserById(sessionUser.id);
    if (!user) {
      session?.destroy();
      if (isApiRoute) return Response.json({ error: {
        code: "NOT_FOUND",
        message: "User not found"
      } }, {
        status: 401,
        headers: MW_CACHE_HEADERS
      });
      return context.redirect("/_emdash/admin/login");
    }
    if (user.disabled) {
      session?.destroy();
      if (isApiRoute) return apiError("ACCOUNT_DISABLED", "Account disabled", 403);
      const loginUrl = new URL("/_emdash/admin/login", url.origin);
      loginUrl.searchParams.set("error", "account_disabled");
      return context.redirect(loginUrl.toString());
    }
    locals.user = user;
  } catch (error) {
    console.error("Auth middleware error:", error);
    return context.redirect("/_emdash/admin/login");
  }
  return next();
}
const SCOPE_RULES = [
  [
    "/_emdash/api/content",
    "GET",
    "content:read"
  ],
  [
    "/_emdash/api/content",
    "WRITE",
    "content:write"
  ],
  [
    "/_emdash/api/media/file",
    "*",
    "media:read"
  ],
  [
    "/_emdash/api/media",
    "GET",
    "media:read"
  ],
  [
    "/_emdash/api/media",
    "WRITE",
    "media:write"
  ],
  [
    "/_emdash/api/schema",
    "GET",
    "schema:read"
  ],
  [
    "/_emdash/api/schema",
    "WRITE",
    "schema:write"
  ],
  [
    "/_emdash/api/taxonomies",
    "GET",
    "content:read"
  ],
  [
    "/_emdash/api/taxonomies",
    "WRITE",
    "content:write"
  ],
  [
    "/_emdash/api/menus",
    "GET",
    "content:read"
  ],
  [
    "/_emdash/api/menus",
    "WRITE",
    "content:write"
  ],
  [
    "/_emdash/api/sections",
    "GET",
    "content:read"
  ],
  [
    "/_emdash/api/sections",
    "WRITE",
    "content:write"
  ],
  [
    "/_emdash/api/widget-areas",
    "GET",
    "content:read"
  ],
  [
    "/_emdash/api/widget-areas",
    "WRITE",
    "content:write"
  ],
  [
    "/_emdash/api/revisions",
    "GET",
    "content:read"
  ],
  [
    "/_emdash/api/revisions",
    "WRITE",
    "content:write"
  ],
  [
    "/_emdash/api/search",
    "GET",
    "content:read"
  ],
  [
    "/_emdash/api/search",
    "WRITE",
    "admin"
  ],
  [
    "/_emdash/api/import",
    "*",
    "admin"
  ],
  [
    "/_emdash/api/admin",
    "*",
    "admin"
  ],
  [
    "/_emdash/api/settings",
    "*",
    "admin"
  ],
  [
    "/_emdash/api/plugins",
    "*",
    "admin"
  ],
  [
    "/_emdash/api/mcp",
    "*",
    "content:read"
  ]
];
const WRITE_METHODS = /* @__PURE__ */ new Set([
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
]);
function enforceTokenScope(pathname, method, tokenScopes) {
  if (!tokenScopes) return null;
  const isWrite = WRITE_METHODS.has(method);
  for (const [prefix, ruleMethod, scope] of SCOPE_RULES) {
    if (pathname !== prefix && !pathname.startsWith(prefix + "/")) continue;
    if (ruleMethod === "*" || ruleMethod === "WRITE" && isWrite || ruleMethod === method) {
      if (hasScope(tokenScopes, scope)) return null;
      return new Response(JSON.stringify({ error: {
        code: "INSUFFICIENT_SCOPE",
        message: `Token lacks required scope: ${scope}`
      } }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          ...MW_CACHE_HEADERS
        }
      });
    }
  }
  if (hasScope(tokenScopes, "admin")) return null;
  return new Response(JSON.stringify({ error: {
    code: "INSUFFICIENT_SCOPE",
    message: "Token lacks required scope: admin"
  } }), {
    status: 403,
    headers: {
      "Content-Type": "application/json",
      ...MW_CACHE_HEADERS
    }
  });
}
function renderToolbar(config) {
  const { editMode, isPreview } = config;
  return `
<!-- EmDash Visual Editing Toolbar -->
<div id="emdash-toolbar" data-edit-mode="${editMode}" data-preview="${isPreview}">
  <div class="emdash-tb-inner">
    <span class="emdash-tb-logo">EmDash</span>

    <div class="emdash-tb-divider"></div>

    <label class="emdash-tb-toggle" title="Toggle edit mode">
      <input type="checkbox" id="emdash-edit-toggle" ${editMode ? "checked" : ""} />
      <span class="emdash-tb-toggle-track">
        <span class="emdash-tb-toggle-thumb"></span>
      </span>
      <span class="emdash-tb-toggle-label">Edit</span>
    </label>

    <span class="emdash-tb-status" id="emdash-tb-status"></span>

    <span class="emdash-tb-save-status" id="emdash-tb-save-status"></span>

    <a class="emdash-tb-admin" id="emdash-tb-admin" href="#" target="emdash-admin" style="display:none" title="Open in admin">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    </a>

    <button class="emdash-tb-publish" id="emdash-tb-publish" style="display:none">Publish</button>
  </div>
</div>

<style>
  #emdash-toolbar {
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
  }

  .emdash-tb-inner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    background: #1a1a1a;
    color: #e0e0e0;
    border-radius: 999px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08);
    white-space: nowrap;
    user-select: none;
  }

  .emdash-tb-logo {
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.02em;
    color: #fff;
    opacity: 0.7;
  }

  .emdash-tb-divider {
    width: 1px;
    height: 16px;
    background: rgba(255,255,255,0.15);
  }

  /* Toggle switch */
  .emdash-tb-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }

  .emdash-tb-toggle input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .emdash-tb-toggle-track {
    position: relative;
    width: 32px;
    height: 18px;
    background: #444;
    border-radius: 9px;
    transition: background 0.2s;
  }

  .emdash-tb-toggle input:checked + .emdash-tb-toggle-track {
    background: #3b82f6;
  }

  .emdash-tb-toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.2s;
  }

  .emdash-tb-toggle input:checked + .emdash-tb-toggle-track .emdash-tb-toggle-thumb {
    transform: translateX(14px);
  }

  .emdash-tb-toggle-label {
    font-size: 12px;
    color: #aaa;
  }

  .emdash-tb-toggle input:checked ~ .emdash-tb-toggle-label {
    color: #fff;
  }

  /* Status area — flex for multiple badges */
  .emdash-tb-status {
    display: inline-flex;
    gap: 6px;
    align-items: center;
  }

  /* Badges */
  .emdash-tb-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .emdash-tb-badge--preview {
    background: rgba(139,92,246,0.2);
    color: #a78bfa;
  }

  .emdash-tb-badge--draft {
    background: rgba(245,158,11,0.2);
    color: #fbbf24;
  }

  .emdash-tb-badge--published {
    background: rgba(34,197,94,0.2);
    color: #4ade80;
  }

  .emdash-tb-badge--pending {
    background: rgba(59,130,246,0.2);
    color: #60a5fa;
  }

  .emdash-tb-badge--unsaved {
    background: rgba(245,158,11,0.2);
    color: #fbbf24;
  }

  .emdash-tb-badge--saving {
    background: rgba(148,163,184,0.2);
    color: #94a3b8;
  }

  .emdash-tb-badge--saved {
    background: rgba(34,197,94,0.2);
    color: #4ade80;
    transition: opacity 0.3s;
  }

  .emdash-tb-badge--error {
    background: rgba(239,68,68,0.2);
    color: #f87171;
  }

  /* Admin link */
  .emdash-tb-admin {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #888;
    text-decoration: none;
    padding: 2px;
    border-radius: 4px;
    transition: color 0.15s;
  }

  .emdash-tb-admin:hover {
    color: #fff;
  }

  /* Publish button */
  .emdash-tb-publish {
    padding: 4px 12px;
    background: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
    font-family: inherit;
  }

  .emdash-tb-publish:hover {
    background: #2563eb;
  }

  .emdash-tb-publish:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Edit mode: editable hover styles — uses :has() to check toolbar state */
  body:has(#emdash-toolbar[data-edit-mode="true"]) [data-emdash-ref] {
    transition: box-shadow 0.15s, background-color 0.15s;
  }

  body:has(#emdash-toolbar[data-edit-mode="true"]) [data-emdash-ref]:hover {
    box-shadow: 0 0 0 2px rgba(59,130,246,0.5);
    border-radius: 4px;
    background-color: rgba(59,130,246,0.04);
    cursor: text;
  }

  /* Active editing state — override hover pencil cursor */
  [data-emdash-editing] {
    box-shadow: 0 0 0 2px #3b82f6 !important;
    border-radius: 4px !important;
    background-color: rgba(59,130,246,0.04) !important;
    cursor: text !important;
  }

  /* Suppress browser focus ring on contenteditable and tiptap editor */
  [data-emdash-editing]:focus,
  [data-emdash-ref] .tiptap:focus,
  [data-emdash-ref] .ProseMirror:focus {
    outline: none !important;
  }

  /* Image editor popover */
  .emdash-img-popover {
    position: fixed;
    z-index: 1000000;
    background: #1a1a1a;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08);
    color: #e0e0e0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    width: 320px;
    overflow: hidden;
    animation: emdash-img-fadein 0.15s ease-out;
  }

  @keyframes emdash-img-fadein {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .emdash-img-popover-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .emdash-img-popover-title {
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #999;
  }

  .emdash-img-popover-close {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 2px;
    line-height: 1;
    font-size: 16px;
    border-radius: 4px;
    transition: color 0.15s;
  }

  .emdash-img-popover-close:hover {
    color: #fff;
  }

  .emdash-img-popover-body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .emdash-img-preview {
    width: 100%;
    max-height: 160px;
    object-fit: contain;
    border-radius: 6px;
    background: #111;
  }

  .emdash-img-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    border: 2px dashed rgba(255,255,255,0.15);
    border-radius: 6px;
    color: #666;
    font-size: 12px;
  }

  .emdash-img-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .emdash-img-field label {
    font-size: 11px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .emdash-img-field input[type="text"] {
    background: #111;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 6px;
    color: #e0e0e0;
    padding: 6px 8px;
    font-size: 13px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s;
  }

  .emdash-img-field input[type="text"]:focus {
    border-color: #3b82f6;
  }

  .emdash-img-actions {
    display: flex;
    gap: 6px;
  }

  .emdash-img-btn {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 6px;
    background: #222;
    color: #e0e0e0;
    font-size: 12px;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    text-align: center;
    white-space: nowrap;
  }

  .emdash-img-btn:hover {
    background: #333;
    border-color: rgba(255,255,255,0.2);
  }

  .emdash-img-btn--primary {
    background: #3b82f6;
    border-color: #3b82f6;
    color: #fff;
  }

  .emdash-img-btn--primary:hover {
    background: #2563eb;
    border-color: #2563eb;
  }

  .emdash-img-btn--danger {
    color: #f87171;
    border-color: rgba(248,113,113,0.3);
  }

  .emdash-img-btn--danger:hover {
    background: rgba(248,113,113,0.1);
    border-color: rgba(248,113,113,0.5);
  }

  /* Media browser within the popover */
  .emdash-img-browser {
    border-top: 1px solid rgba(255,255,255,0.08);
    padding: 12px;
  }

  .emdash-img-browser-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .emdash-img-browser-title {
    font-size: 12px;
    font-weight: 600;
    color: #999;
  }

  .emdash-img-browser-back {
    background: none;
    border: none;
    color: #3b82f6;
    cursor: pointer;
    font-size: 12px;
    font-family: inherit;
    padding: 2px 4px;
  }

  .emdash-img-browser-back:hover {
    text-decoration: underline;
  }

  .emdash-img-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    max-height: 240px;
    overflow-y: auto;
  }

  .emdash-img-grid-item {
    aspect-ratio: 1;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.15s;
    background: #111;
  }

  .emdash-img-grid-item:hover {
    border-color: rgba(59,130,246,0.5);
  }

  .emdash-img-grid-item--selected {
    border-color: #3b82f6;
  }

  .emdash-img-grid-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .emdash-img-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    color: #666;
    font-size: 12px;
  }

  .emdash-img-drop {
    border: 2px dashed #3b82f6;
    background: rgba(59,130,246,0.05);
  }

  .emdash-img-uploading {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    color: #999;
    font-size: 12px;
  }

  .emdash-img-popover-backdrop {
    position: fixed;
    inset: 0;
    z-index: 999999;
  }
</style>

<script>
(function() {
  var toolbar = document.getElementById("emdash-toolbar");
  var toggle = document.getElementById("emdash-edit-toggle");
  var statusEl = document.getElementById("emdash-tb-status");
  var saveStatusEl = document.getElementById("emdash-tb-save-status");
  var publishBtn = document.getElementById("emdash-tb-publish");
  if (!toolbar || !toggle || !statusEl || !publishBtn || !saveStatusEl) return;

  var isEditMode = toolbar.getAttribute("data-edit-mode") === "true";

  // CSRF-protected fetch — adds X-EmDash-Request header to all API calls
  function ecFetch(url, init) {
    init = init || {};
    init.headers = Object.assign({ "X-EmDash-Request": "1" }, init.headers || {});
    return fetch(url, init);
  }

  // --- Save status tracking ---
  var saveState = "idle"; // idle | unsaved | saving | saved | error
  var saveHideTimer = null;

  function setSaveState(state) {
    saveState = state;
    clearTimeout(saveHideTimer);

    switch (state) {
      case "unsaved":
        saveStatusEl.innerHTML = '<span class="emdash-tb-badge emdash-tb-badge--unsaved">Unsaved</span>';
        break;
      case "saving":
        saveStatusEl.innerHTML = '<span class="emdash-tb-badge emdash-tb-badge--saving">Saving…</span>';
        break;
      case "saved":
        saveStatusEl.innerHTML = '<span class="emdash-tb-badge emdash-tb-badge--saved">Saved</span>';
        saveHideTimer = setTimeout(function() {
          saveStatusEl.innerHTML = "";
          saveState = "idle";
        }, 2000);
        break;
      case "error":
        saveStatusEl.innerHTML = '<span class="emdash-tb-badge emdash-tb-badge--error">Save failed</span>';
        saveHideTimer = setTimeout(function() {
          saveStatusEl.innerHTML = "";
          saveState = "idle";
        }, 3000);
        break;
      default:
        saveStatusEl.innerHTML = "";
    }
  }

  // Listen for save events from inline editors (e.g. PT editor)
  document.addEventListener("emdash:save", function(e) {
    var detail = e.detail || {};
    if (detail.state) {
      setSaveState(detail.state);
    }
  });

  document.addEventListener("emdash:content-changed", function(e) {
    var detail = e.detail || {};
    if (detail.collection && detail.id) {
      showUnpublishedChanges(detail.collection, detail.id);
    }
  });

  // --- Entry status ---
  var entryRef = null;

  function updateStatus() {
    if (!isEditMode) {
      statusEl.innerHTML = "";
      publishBtn.style.display = "none";
      return;
    }

    var first = document.querySelector("[data-emdash-ref]");
    if (!first) {
      statusEl.innerHTML = "";
      publishBtn.style.display = "none";
      return;
    }

    try {
      var ref = JSON.parse(first.getAttribute("data-emdash-ref"));
      entryRef = ref;
      if (!ref.status) return;

      // Show admin link
      var adminLink = document.getElementById("emdash-tb-admin");
      if (adminLink) {
        adminLink.href = "/_emdash/admin/content/" + encodeURIComponent(ref.collection) + "/" + encodeURIComponent(ref.id);
        adminLink.style.display = "";
      }

      if (ref.status === "draft") {
        statusEl.innerHTML = '<span class="emdash-tb-badge emdash-tb-badge--draft">Draft</span>';
        publishBtn.style.display = "";
        publishBtn.onclick = function() { publish(ref.collection, ref.id); };
      } else if (ref.status === "published" && ref.hasDraft) {
        statusEl.innerHTML = '<span class="emdash-tb-badge emdash-tb-badge--pending">Unpublished changes</span>';
        publishBtn.style.display = "";
        publishBtn.onclick = function() { publish(ref.collection, ref.id); };
      } else if (ref.status === "published") {
        statusEl.innerHTML = '<span class="emdash-tb-badge emdash-tb-badge--published">Published</span>';
        publishBtn.style.display = "none";
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  // Publish action
  function publish(collection, id) {
    publishBtn.disabled = true;
    publishBtn.textContent = "Publishing…";

    ecFetch("/_emdash/api/content/" + encodeURIComponent(collection) + "/" + encodeURIComponent(id) + "/publish", {
      method: "POST",
      credentials: "same-origin",
    })
    .then(function(res) {
      if (res.ok) {
        if (document.startViewTransition) {
          document.startViewTransition(function() { location.reload(); });
        } else {
          location.reload();
        }
      } else {
        publishBtn.disabled = false;
        publishBtn.textContent = "Publish";
        console.error("Publish failed:", res.status);
      }
    })
    .catch(function(err) {
      publishBtn.disabled = false;
      publishBtn.textContent = "Publish";
      console.error("Publish failed:", err);
    });
  }

  // Edit mode toggle
  toggle.addEventListener("change", function() {
    if (toggle.checked) {
      document.cookie = "emdash-edit-mode=true;path=/;samesite=lax";
    } else {
      document.cookie = "emdash-edit-mode=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    if (document.startViewTransition) {
      document.startViewTransition(function() { location.replace(location.href); });
    } else {
      location.replace(location.href);
    }
  });

  // --- Inline editing ---

  // Cached manifest (fetched once on first edit click)
  var manifestCache = null;
  var manifestPromise = null;

  function fetchManifest() {
    if (manifestCache) return Promise.resolve(manifestCache);
    if (manifestPromise) return manifestPromise;
    manifestPromise = ecFetch("/_emdash/api/manifest", { credentials: "same-origin" })
      .then(function(r) { return r.json(); })
      .then(function(m) { manifestCache = m; return m; });
    return manifestPromise;
  }

  function getFieldKind(manifest, collection, field) {
    var col = manifest.collections && manifest.collections[collection];
    if (!col || !col.fields) return null;
    var f = col.fields[field];
    return f ? f.kind : null;
  }

  // Save a single field value
  function saveField(collection, id, field, value) {
    setSaveState("saving");
    return ecFetch("/_emdash/api/content/" + encodeURIComponent(collection) + "/" + encodeURIComponent(id), {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { [field]: value } }),
    })
    .then(function(res) {
      if (res.ok) {
        setSaveState("saved");
        // A save creates/updates a draft — show unpublished changes
        showUnpublishedChanges(collection, id);
      } else {
        setSaveState("error");
        console.error("Save failed:", res.status);
      }
    })
    .catch(function(err) {
      setSaveState("error");
      console.error("Save failed:", err);
    });
  }

  function showUnpublishedChanges(collection, id) {
    statusEl.innerHTML = '<span class="emdash-tb-badge emdash-tb-badge--pending">Unpublished changes</span>';
    publishBtn.style.display = "";
    publishBtn.disabled = false;
    publishBtn.textContent = "Publish";
    publishBtn.onclick = function() { publish(collection, id); };
  }

  // Plain text inline editing (contenteditable)
  var currentlyEditing = null;

  function startTextEdit(element, annotation) {
    if (currentlyEditing === element) return;
    if (currentlyEditing) endCurrentEdit();

    currentlyEditing = element;
    var originalText = element.textContent || "";

    element.setAttribute("data-emdash-editing", "");
    element.contentEditable = "plaintext-only";
    element.focus();

    // Select all text
    var range = document.createRange();
    range.selectNodeContents(element);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    // Track dirty state via input events
    function handleInput() {
      var current = (element.textContent || "").trim();
      if (current !== originalText.trim()) {
        setSaveState("unsaved");
      } else {
        setSaveState("idle");
      }
    }

    function handleBlur() {
      element.removeEventListener("blur", handleBlur);
      element.removeEventListener("keydown", handleKeydown);
      element.removeEventListener("input", handleInput);
      element.contentEditable = "false";
      element.removeAttribute("data-emdash-editing");
      currentlyEditing = null;

      var newValue = (element.textContent || "").trim();
      if (newValue !== originalText.trim()) {
        saveField(annotation.collection, annotation.id, annotation.field, newValue);
      } else {
        setSaveState("idle");
      }
    }

    function handleKeydown(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        element.blur();
      }
      if (e.key === "Escape") {
        element.textContent = originalText;
        setSaveState("idle");
        element.blur();
      }
    }

    element.addEventListener("input", handleInput);
    element.addEventListener("blur", handleBlur);
    element.addEventListener("keydown", handleKeydown);
  }

  function endCurrentEdit() {
    if (currentlyEditing) {
      currentlyEditing.blur();
    }
  }

  // Fallback: open admin
  function openAdmin(annotation) {
    var url = "/_emdash/admin/content/" + encodeURIComponent(annotation.collection) + "/" + encodeURIComponent(annotation.id);
    if (annotation.field) {
      url += "?field=" + encodeURIComponent(annotation.field);
    }
    window.open(url, "emdash-admin");
  }

  // --- Inline image editing ---
  var activeImagePopover = null;

  function closeImagePopover() {
    if (activeImagePopover) {
      activeImagePopover.backdrop.remove();
      activeImagePopover.popover.remove();
      if (activeImagePopover.escapeHandler) {
        document.removeEventListener("keydown", activeImagePopover.escapeHandler);
      }
      activeImagePopover = null;
    }
  }

  function startImageEdit(element, annotation) {
    closeImagePopover();

    // Find the current image value by fetching the entry
    var collection = annotation.collection;
    var id = annotation.id;
    var field = annotation.field;

    // Find img element inside the annotated container (or the element itself if it's an img)
    var imgEl = element.tagName === "IMG" ? element : element.querySelector("img");

    // Fetch current field value from the content API
    ecFetch("/_emdash/api/content/" + encodeURIComponent(collection) + "/" + encodeURIComponent(id), {
      credentials: "same-origin"
    })
    .then(function(r) { return r.json(); })
    .then(function(entry) {
      var currentValue = entry.data && entry.data[field];
      showImagePopover(element, imgEl, annotation, currentValue);
    })
    .catch(function() {
      // If fetch fails, still show popover with what we can infer from DOM
      showImagePopover(element, imgEl, annotation, null);
    });
  }

  function showImagePopover(element, imgEl, annotation, currentValue) {
    closeImagePopover();

    var collection = annotation.collection;
    var id = annotation.id;
    var field = annotation.field;

    // Position near the element
    var rect = element.getBoundingClientRect();
    var viewportH = window.innerHeight;
    var viewportW = window.innerWidth;

    // Create backdrop for click-outside-to-close
    var backdrop = document.createElement("div");
    backdrop.className = "emdash-img-popover-backdrop";
    backdrop.addEventListener("click", function(e) {
      if (e.target === backdrop) closeImagePopover();
    });

    // Create popover
    var popover = document.createElement("div");
    popover.className = "emdash-img-popover";

    var currentSrc = currentValue ? (currentValue.previewUrl || currentValue.src) : (imgEl ? imgEl.src : null);
    var currentAlt = currentValue ? (currentValue.alt || "") : (imgEl ? (imgEl.alt || "") : "");

    // Build popover HTML
    var html = '';
    html += '<div class="emdash-img-popover-header">';
    html += '  <span class="emdash-img-popover-title">Image</span>';
    html += '  <button class="emdash-img-popover-close" data-action="close">&times;</button>';
    html += '</div>';
    html += '<div class="emdash-img-popover-body" id="emdash-img-main">';

    if (currentSrc) {
      html += '<img class="emdash-img-preview" src="' + escapeAttr(currentSrc) + '" alt="" />';
    } else {
      html += '<div class="emdash-img-empty">No image selected</div>';
    }

    html += '<div class="emdash-img-field">';
    html += '  <label for="emdash-img-alt">Alt text</label>';
    html += '  <input type="text" id="emdash-img-alt" value="' + escapeAttr(currentAlt) + '" placeholder="Describe the image" />';
    html += '</div>';

    html += '<div class="emdash-img-actions">';
    html += '  <button class="emdash-img-btn emdash-img-btn--primary" data-action="browse">Replace</button>';
    html += '  <label class="emdash-img-btn" style="cursor:pointer">';
    html += '    Upload';
    html += '    <input type="file" accept="image/*" id="emdash-img-upload" style="display:none" />';
    html += '  </label>';
    if (currentSrc) {
      html += '  <button class="emdash-img-btn emdash-img-btn--danger" data-action="remove">Remove</button>';
    }
    html += '</div>';
    html += '</div>';

    popover.innerHTML = html;

    backdrop.appendChild(popover);
    document.body.appendChild(backdrop);

    // Position the popover
    positionPopover(popover, rect, viewportW, viewportH);

    // Escape key handler
    function handleEscape(e) {
      if (e.key === "Escape") {
        closeImagePopover();
        document.removeEventListener("keydown", handleEscape);
      }
    }
    document.addEventListener("keydown", handleEscape);

    activeImagePopover = {
      backdrop: backdrop,
      popover: popover,
      annotation: annotation,
      currentValue: currentValue,
      element: element,
      imgEl: imgEl,
      escapeHandler: handleEscape
    };

    // Event handlers
    popover.querySelector('[data-action="close"]').addEventListener("click", closeImagePopover);

    popover.querySelector('[data-action="browse"]').addEventListener("click", function() {
      showMediaBrowser(popover, annotation, currentValue, element, imgEl);
    });

    var uploadInput = popover.querySelector("#emdash-img-upload");
    uploadInput.addEventListener("change", function(e) {
      var file = e.target.files && e.target.files[0];
      if (file) handleImageUpload(file, popover, annotation, element, imgEl);
    });

    var removeBtn = popover.querySelector('[data-action="remove"]');
    if (removeBtn) {
      removeBtn.addEventListener("click", function() {
        saveField(collection, id, field, null).then(function() {
          if (imgEl) {
            imgEl.style.display = "none";
          }
          closeImagePopover();
        });
      });
    }

    // Save alt text on change (debounced)
    var altInput = popover.querySelector("#emdash-img-alt");
    var altTimer = null;
    altInput.addEventListener("input", function() {
      clearTimeout(altTimer);
      altTimer = setTimeout(function() {
        var newAlt = altInput.value;
        if (currentValue) {
          var updated = Object.assign({}, currentValue, { alt: newAlt });
          saveField(collection, id, field, updated);
          if (imgEl) imgEl.alt = newAlt;
        }
      }, 500);
    });

    // Handle drag and drop on the popover body
    var body = popover.querySelector(".emdash-img-popover-body");
    body.addEventListener("dragover", function(e) {
      e.preventDefault();
      body.classList.add("emdash-img-drop");
    });
    body.addEventListener("dragleave", function() {
      body.classList.remove("emdash-img-drop");
    });
    body.addEventListener("drop", function(e) {
      e.preventDefault();
      body.classList.remove("emdash-img-drop");
      var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleImageUpload(file, popover, annotation, element, imgEl);
      }
    });
  }

  function positionPopover(popover, targetRect, viewportW, viewportH) {
    var popoverW = 320;
    var gap = 8;

    // Try to place to the right of the element
    var left = targetRect.right + gap;
    var top = targetRect.top;

    // If it overflows right, place to the left
    if (left + popoverW > viewportW - 16) {
      left = targetRect.left - popoverW - gap;
    }
    // If it still overflows (narrow viewport), center below
    if (left < 16) {
      left = Math.max(16, (viewportW - popoverW) / 2);
      top = targetRect.bottom + gap;
    }
    // Clamp vertically
    if (top + 400 > viewportH - 80) { // 80 for toolbar
      top = Math.max(16, viewportH - 480);
    }
    if (top < 16) top = 16;

    popover.style.left = left + "px";
    popover.style.top = top + "px";
  }

  function escapeAttr(str) {
    return String(str || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function showMediaBrowser(popover, annotation, currentValue, element, imgEl) {
    var mainBody = popover.querySelector("#emdash-img-main");
    if (mainBody) mainBody.style.display = "none";

    // Remove existing browser if any
    var existing = popover.querySelector(".emdash-img-browser");
    if (existing) existing.remove();

    var browser = document.createElement("div");
    browser.className = "emdash-img-browser";

    browser.innerHTML = '<div class="emdash-img-browser-header">' +
      '<span class="emdash-img-browser-title">Media Library</span>' +
      '<button class="emdash-img-browser-back">Back</button>' +
      '</div>' +
      '<div class="emdash-img-loading">Loading…</div>';

    popover.appendChild(browser);

    browser.querySelector(".emdash-img-browser-back").addEventListener("click", function() {
      browser.remove();
      if (mainBody) mainBody.style.display = "";
    });

    // Fetch media
    ecFetch("/_emdash/api/media?mimeType=image/&limit=30", { credentials: "same-origin" })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var items = data.items || [];
      var loadingEl = browser.querySelector(".emdash-img-loading");
      if (loadingEl) loadingEl.remove();

      if (items.length === 0) {
        var empty = document.createElement("div");
        empty.className = "emdash-img-loading";
        empty.textContent = "No images found";
        browser.appendChild(empty);
        return;
      }

      var grid = document.createElement("div");
      grid.className = "emdash-img-grid";

      items.forEach(function(item) {
        var thumb = document.createElement("div");
        thumb.className = "emdash-img-grid-item";
        if (currentValue && currentValue.id === item.id) {
          thumb.classList.add("emdash-img-grid-item--selected");
        }
        var thumbUrl = item.url || item.previewUrl || ("/_emdash/api/media/file/" + item.storageKey);
        thumb.innerHTML = '<img src="' + escapeAttr(thumbUrl) + '" alt="' + escapeAttr(item.alt || item.filename || "") + '" loading="lazy" />';

        thumb.addEventListener("click", function() {
          selectMediaItem(item, annotation, element, imgEl);
        });

        grid.appendChild(thumb);
      });

      browser.appendChild(grid);
    })
    .catch(function(err) {
      var loadingEl = browser.querySelector(".emdash-img-loading");
      if (loadingEl) loadingEl.textContent = "Failed to load media";
      console.error("Media fetch error:", err);
    });
  }

  function selectMediaItem(item, annotation, element, imgEl) {
    var collection = annotation.collection;
    var id = annotation.id;
    var field = annotation.field;

    var isLocal = !item.provider || item.provider === "local";
    var itemUrl = item.url || item.previewUrl || ("/_emdash/api/media/file/" + item.storageKey);

    var newValue = {
      id: item.id,
      provider: item.provider || "local",
      src: isLocal ? itemUrl : undefined,
      previewUrl: isLocal ? undefined : itemUrl,
      alt: item.alt || "",
      width: item.width,
      height: item.height,
      meta: item.meta
    };

    // Clean undefined fields
    Object.keys(newValue).forEach(function(k) {
      if (newValue[k] === undefined) delete newValue[k];
    });

    saveField(collection, id, field, newValue).then(function() {
      // Update the image in the DOM
      if (imgEl) {
        imgEl.src = itemUrl;
        imgEl.alt = item.alt || "";
        imgEl.style.display = "";
      }
      closeImagePopover();
    });
  }

  function handleImageUpload(file, popover, annotation, element, imgEl) {
    var collection = annotation.collection;
    var id = annotation.id;
    var field = annotation.field;

    // Show uploading state
    var mainBody = popover.querySelector("#emdash-img-main");
    var browserEl = popover.querySelector(".emdash-img-browser");
    if (browserEl) browserEl.remove();
    if (mainBody) {
      mainBody.innerHTML = '<div class="emdash-img-uploading">' +
        '<span>Uploading ' + escapeAttr(file.name) + '…</span>' +
        '</div>';
      mainBody.style.display = "";
    }

    // Detect dimensions before upload
    var dimPromise = new Promise(function(resolve) {
      if (!file.type.startsWith("image/")) return resolve({});
      var img = new Image();
      img.onload = function() {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = function() {
        resolve({});
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });

    dimPromise.then(function(dims) {
      var formData = new FormData();
      formData.append("file", file);
      if (dims.width) formData.append("width", String(dims.width));
      if (dims.height) formData.append("height", String(dims.height));

      return ecFetch("/_emdash/api/media", {
        method: "POST",
        credentials: "same-origin",
        body: formData
      });
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data.item) throw new Error("Upload failed");
      var item = data.item;
      selectMediaItem(item, annotation, element, imgEl);
    })
    .catch(function(err) {
      console.error("Upload error:", err);
      setSaveState("error");
      closeImagePopover();
    });
  }

  // Click handler for edit mode
  if (isEditMode) {
    document.addEventListener("click", function(e) {
      var target = e.target;

      // Don't intercept clicks on elements currently being edited
      if (target.hasAttribute && target.hasAttribute("data-emdash-editing")) return;

      // Walk up to find annotated element
      while (target && target !== document.body) {
        if (target.hasAttribute && target.hasAttribute("data-emdash-editing")) return;

        var ref = target.getAttribute && target.getAttribute("data-emdash-ref");
        if (ref) {
          e.preventDefault();
          e.stopPropagation();

          try {
            var annotation = JSON.parse(ref);

            // Entry-level annotation (no field) — ignore, it's a container
            if (!annotation.field) return;

            // Fetch manifest to determine field type, then dispatch
            fetchManifest().then(function(manifest) {
              var kind = getFieldKind(manifest, annotation.collection, annotation.field);

              // Close any open image popover before starting a new edit
              closeImagePopover();

              if (kind === "string" || kind === "text") {
                startTextEdit(target, annotation);
              } else if (kind === "image") {
                startImageEdit(target, annotation);
              } else {
                // Fallback: open admin for unsupported types
                openAdmin(annotation);
              }
            });
          } catch (err) {
            console.error("Failed to parse emdash ref:", err);
          }
          return;
        }
        target = target.parentElement;
      }
    }, true);
  }

  updateStatus();
})();
<\/script>
`;
}
async function injectToolbar(response, toolbarHtml) {
  if (!response.headers.get("content-type")?.includes("text/html")) return response;
  const html = await response.text();
  if (!html.includes("</body>")) return new Response(html, response);
  const injected = html.replace("</body>", `${toolbarHtml}</body>`);
  return new Response(injected, {
    status: response.status,
    headers: response.headers
  });
}
const onRequest$1 = defineMiddleware(async (context, next) => {
  const { cookies, url } = context;
  if (url.pathname.startsWith("/_emdash")) return next();
  const { user } = context.locals;
  const isEditor = !!user && user.role >= 30;
  const playgroundDb = context.locals.__playgroundDb;
  if (playgroundDb) return runWithContext({
    editMode: cookies.get("emdash-edit-mode")?.value === "true",
    db: playgroundDb
  }, () => next());
  const hasEditCookie = cookies.get("emdash-edit-mode")?.value === "true";
  const hasPreviewToken = url.searchParams.has("_preview");
  if (!hasEditCookie && !hasPreviewToken && !isEditor) return next();
  const editMode = hasEditCookie && isEditor;
  const locale = context.currentLocale;
  let preview;
  if (hasEditCookie || hasPreviewToken) return runWithContext({
    editMode,
    preview,
    locale
  }, async () => {
    let response = await next();
    if (isEditor) {
      const toolbarHtml = renderToolbar({
        editMode,
        isPreview: false
      });
      return injectToolbar(response, toolbarHtml);
    }
    return response;
  });
  if (isEditor) return injectToolbar(await next(), renderToolbar({
    editMode: false,
    isPreview: false
  }));
  return next();
});
const onRequest = sequence(
  onRequest$5,
  onRequest$4,
  onRequest$3,
  onRequest$2,
  onRequest$1
);
export {
  onRequest
};
