globalThis.process ??= {};
globalThis.process.env ??= {};
import { a as apiError, h as handleError, b as apiSuccess } from "./error_BF6Eb6os.mjs";
import { p as parseBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { al as setupBody } from "./redirects_BT6R8QAm.mjs";
import { g as getAuthMode } from "./mode_CJtjICg5.mjs";
import { M as Migrator } from "./migrator_Bpgoz8AJ.mjs";
import { a as currentTimestamp, c as currentTimestampValue, b as binaryType, l as listTablesLike, i as isSqlite } from "./dialect-helpers_Sy7Tyjq_.mjs";
import { s as sql } from "./sql_DV5B95Nm.mjs";
import { v as validateIdentifier } from "./validate_Dvrjbe51.mjs";
import { O as OptionsRepository } from "./options_CBMppY2k.mjs";
import { i as imageSize } from "./index_DFnuKuIX.mjs";
import { m as mime } from "./index_lite_CWDp5SAU.mjs";
import { u as ulid } from "./index_BQQDygAS.mjs";
import { B as BylineRepository } from "./byline_DNpRXvlR.mjs";
import { C as ContentRepository } from "./content_jaug25qM.mjs";
import { M as MediaRepository } from "./media_CNuKgdRs.mjs";
import { R as RedirectRepository } from "./redirect_DmmKzxFA.mjs";
import { T as TaxonomyRepository } from "./taxonomy_D21bMjzg.mjs";
import { v as validateExternalUrl, s as ssrfSafeFetch } from "./ssrf_CtCO8RCN.mjs";
import { SchemaRegistry } from "./registry_BmtqkhAJ.mjs";
import { FTSManager } from "./fts-manager_CwMYrMcX.mjs";
import { s as setSiteSettings } from "./index_nWW4h820.mjs";
import { F as FIELD_TYPES } from "./types__QwmMsgF.mjs";
import { a as loadSeed } from "./load_CSf8UR-H.mjs";
async function up$u(db) {
  await db.schema.createTable("revisions").ifNotExists().addColumn("id", "text", (col) => col.primaryKey()).addColumn("collection", "text", (col) => col.notNull()).addColumn("entry_id", "text", (col) => col.notNull()).addColumn("data", "text", (col) => col.notNull()).addColumn("author_id", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.schema.createIndex("idx_revisions_entry").ifNotExists().on("revisions").columns(["collection", "entry_id"]).execute();
  await db.schema.createTable("taxonomies").ifNotExists().addColumn("id", "text", (col) => col.primaryKey()).addColumn("name", "text", (col) => col.notNull()).addColumn("slug", "text", (col) => col.notNull()).addColumn("label", "text", (col) => col.notNull()).addColumn("parent_id", "text").addColumn("data", "text").addUniqueConstraint("taxonomies_name_slug_unique", ["name", "slug"]).addForeignKeyConstraint(
    "taxonomies_parent_fk",
    ["parent_id"],
    "taxonomies",
    ["id"],
    (cb) => cb.onDelete("set null")
  ).execute();
  await db.schema.createIndex("idx_taxonomies_name").ifNotExists().on("taxonomies").column("name").execute();
  await db.schema.createTable("content_taxonomies").ifNotExists().addColumn("collection", "text", (col) => col.notNull()).addColumn("entry_id", "text", (col) => col.notNull()).addColumn("taxonomy_id", "text", (col) => col.notNull()).addPrimaryKeyConstraint("content_taxonomies_pk", ["collection", "entry_id", "taxonomy_id"]).addForeignKeyConstraint(
    "content_taxonomies_taxonomy_fk",
    ["taxonomy_id"],
    "taxonomies",
    ["id"],
    (cb) => cb.onDelete("cascade")
  ).execute();
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
async function down$u(db) {
  await db.schema.dropTable("audit_logs").execute();
  await db.schema.dropTable("options").execute();
  await db.schema.dropTable("users").execute();
  await db.schema.dropTable("media").execute();
  await db.schema.dropTable("content_taxonomies").execute();
  await db.schema.dropTable("taxonomies").execute();
  await db.schema.dropTable("revisions").execute();
}
const m001 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$u,
  up: up$u
}, Symbol.toStringTag, { value: "Module" }));
async function up$t(db) {
  await db.schema.alterTable("media").addColumn("status", "text", (col) => col.notNull().defaultTo("ready")).execute();
  await db.schema.createIndex("idx_media_status").on("media").column("status").execute();
}
async function down$t(db) {
  await db.schema.dropIndex("idx_media_status").execute();
}
const m002 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$t,
  up: up$t
}, Symbol.toStringTag, { value: "Module" }));
async function up$s(db) {
  await db.schema.createTable("_emdash_collections").addColumn("id", "text", (col) => col.primaryKey()).addColumn("slug", "text", (col) => col.notNull().unique()).addColumn("label", "text", (col) => col.notNull()).addColumn("label_singular", "text").addColumn("description", "text").addColumn("icon", "text").addColumn("supports", "text").addColumn("source", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.schema.createTable("_emdash_fields").addColumn("id", "text", (col) => col.primaryKey()).addColumn("collection_id", "text", (col) => col.notNull()).addColumn("slug", "text", (col) => col.notNull()).addColumn("label", "text", (col) => col.notNull()).addColumn("type", "text", (col) => col.notNull()).addColumn("column_type", "text", (col) => col.notNull()).addColumn("required", "integer", (col) => col.defaultTo(0)).addColumn("unique", "integer", (col) => col.defaultTo(0)).addColumn("default_value", "text").addColumn("validation", "text").addColumn("widget", "text").addColumn("options", "text").addColumn("sort_order", "integer", (col) => col.defaultTo(0)).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addForeignKeyConstraint(
    "fields_collection_fk",
    ["collection_id"],
    "_emdash_collections",
    ["id"],
    (cb) => cb.onDelete("cascade")
  ).execute();
  await db.schema.createIndex("idx_fields_collection_slug").on("_emdash_fields").columns(["collection_id", "slug"]).unique().execute();
  await db.schema.createIndex("idx_fields_collection").on("_emdash_fields").column("collection_id").execute();
  await db.schema.createIndex("idx_fields_sort").on("_emdash_fields").columns(["collection_id", "sort_order"]).execute();
}
async function down$s(db) {
  await db.schema.dropTable("_emdash_fields").execute();
  await db.schema.dropTable("_emdash_collections").execute();
}
const m003 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$s,
  up: up$s
}, Symbol.toStringTag, { value: "Module" }));
async function up$r(db) {
  await db.schema.createTable("_plugin_storage").addColumn("plugin_id", "text", (col) => col.notNull()).addColumn("collection", "text", (col) => col.notNull()).addColumn("id", "text", (col) => col.notNull()).addColumn("data", "text", (col) => col.notNull()).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addPrimaryKeyConstraint("pk_plugin_storage", ["plugin_id", "collection", "id"]).execute();
  await db.schema.createIndex("idx_plugin_storage_list").on("_plugin_storage").columns(["plugin_id", "collection", "created_at"]).execute();
  await db.schema.createTable("_plugin_state").addColumn("plugin_id", "text", (col) => col.primaryKey()).addColumn("version", "text", (col) => col.notNull()).addColumn("status", "text", (col) => col.notNull().defaultTo("installed")).addColumn("installed_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("activated_at", "text").addColumn("deactivated_at", "text").addColumn("data", "text").execute();
  await db.schema.createTable("_plugin_indexes").addColumn("plugin_id", "text", (col) => col.notNull()).addColumn("collection", "text", (col) => col.notNull()).addColumn("index_name", "text", (col) => col.notNull()).addColumn("fields", "text", (col) => col.notNull()).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addPrimaryKeyConstraint("pk_plugin_indexes", ["plugin_id", "collection", "index_name"]).execute();
}
async function down$r(db) {
  await db.schema.dropTable("_plugin_indexes").execute();
  await db.schema.dropTable("_plugin_state").execute();
  await db.schema.dropTable("_plugin_storage").execute();
}
const m004 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$r,
  up: up$r
}, Symbol.toStringTag, { value: "Module" }));
async function up$q(db) {
  await db.schema.createTable("_emdash_menus").addColumn("id", "text", (col) => col.primaryKey()).addColumn("name", "text", (col) => col.notNull().unique()).addColumn("label", "text", (col) => col.notNull()).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.schema.createTable("_emdash_menu_items").addColumn("id", "text", (col) => col.primaryKey()).addColumn("menu_id", "text", (col) => col.notNull()).addColumn("parent_id", "text").addColumn("sort_order", "integer", (col) => col.notNull().defaultTo(0)).addColumn("type", "text", (col) => col.notNull()).addColumn("reference_collection", "text").addColumn("reference_id", "text").addColumn("custom_url", "text").addColumn("label", "text", (col) => col.notNull()).addColumn("title_attr", "text").addColumn("target", "text").addColumn("css_classes", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addForeignKeyConstraint(
    "menu_items_menu_fk",
    ["menu_id"],
    "_emdash_menus",
    ["id"],
    (cb) => cb.onDelete("cascade")
  ).addForeignKeyConstraint(
    "menu_items_parent_fk",
    ["parent_id"],
    "_emdash_menu_items",
    ["id"],
    (cb) => cb.onDelete("cascade")
  ).execute();
  await db.schema.createIndex("idx_menu_items_menu").on("_emdash_menu_items").columns(["menu_id", "sort_order"]).execute();
  await db.schema.createIndex("idx_menu_items_parent").on("_emdash_menu_items").column("parent_id").execute();
}
async function down$q(db) {
  await db.schema.dropTable("_emdash_menu_items").execute();
  await db.schema.dropTable("_emdash_menus").execute();
}
const m005 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$q,
  up: up$q
}, Symbol.toStringTag, { value: "Module" }));
async function up$p(db) {
  await db.schema.createTable("_emdash_taxonomy_defs").addColumn("id", "text", (col) => col.primaryKey()).addColumn("name", "text", (col) => col.notNull().unique()).addColumn("label", "text", (col) => col.notNull()).addColumn("label_singular", "text").addColumn("hierarchical", "integer", (col) => col.defaultTo(0)).addColumn("collections", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.insertInto("_emdash_taxonomy_defs").values([
    {
      id: "taxdef_category",
      name: "category",
      label: "Categories",
      label_singular: "Category",
      hierarchical: 1,
      collections: JSON.stringify(["posts"])
    },
    {
      id: "taxdef_tag",
      name: "tag",
      label: "Tags",
      label_singular: "Tag",
      hierarchical: 0,
      collections: JSON.stringify(["posts"])
    }
  ]).execute();
}
async function down$p(db) {
  await db.schema.dropTable("_emdash_taxonomy_defs").execute();
}
const m006 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$p,
  up: up$p
}, Symbol.toStringTag, { value: "Module" }));
async function up$o(db) {
  await db.schema.createTable("_emdash_widget_areas").addColumn("id", "text", (col) => col.primaryKey()).addColumn("name", "text", (col) => col.notNull().unique()).addColumn("label", "text", (col) => col.notNull()).addColumn("description", "text").addColumn("created_at", "text", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)).execute();
  await db.schema.createTable("_emdash_widgets").addColumn("id", "text", (col) => col.primaryKey()).addColumn(
    "area_id",
    "text",
    (col) => col.notNull().references("_emdash_widget_areas.id").onDelete("cascade")
  ).addColumn("sort_order", "integer", (col) => col.notNull().defaultTo(0)).addColumn("type", "text", (col) => col.notNull()).addColumn("title", "text").addColumn("content", "text").addColumn("menu_name", "text").addColumn("component_id", "text").addColumn("component_props", "text").addColumn("created_at", "text", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)).execute();
  await db.schema.createIndex("idx_widgets_area").on("_emdash_widgets").columns(["area_id", "sort_order"]).execute();
}
async function down$o(db) {
  await db.schema.dropTable("_emdash_widgets").execute();
  await db.schema.dropTable("_emdash_widget_areas").execute();
}
const m007 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$o,
  up: up$o
}, Symbol.toStringTag, { value: "Module" }));
async function up$n(db) {
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
  await db.schema.createTable("credentials").addColumn("id", "text", (col) => col.primaryKey()).addColumn("user_id", "text", (col) => col.notNull()).addColumn("public_key", binaryType(db), (col) => col.notNull()).addColumn("counter", "integer", (col) => col.notNull().defaultTo(0)).addColumn("device_type", "text", (col) => col.notNull()).addColumn("backed_up", "integer", (col) => col.notNull().defaultTo(0)).addColumn("transports", "text").addColumn("name", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("last_used_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addForeignKeyConstraint(
    "credentials_user_fk",
    ["user_id"],
    "users",
    ["id"],
    (cb) => cb.onDelete("cascade")
  ).execute();
  await db.schema.createIndex("idx_credentials_user").on("credentials").column("user_id").execute();
  await db.schema.createTable("auth_tokens").addColumn("hash", "text", (col) => col.primaryKey()).addColumn("user_id", "text").addColumn("email", "text").addColumn("type", "text", (col) => col.notNull()).addColumn("role", "integer").addColumn("invited_by", "text").addColumn("expires_at", "text", (col) => col.notNull()).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addForeignKeyConstraint(
    "auth_tokens_user_fk",
    ["user_id"],
    "users",
    ["id"],
    (cb) => cb.onDelete("cascade")
  ).addForeignKeyConstraint(
    "auth_tokens_invited_by_fk",
    ["invited_by"],
    "users",
    ["id"],
    (cb) => cb.onDelete("set null")
  ).execute();
  await db.schema.createIndex("idx_auth_tokens_email").on("auth_tokens").column("email").execute();
  await db.schema.createTable("oauth_accounts").addColumn("provider", "text", (col) => col.notNull()).addColumn("provider_account_id", "text", (col) => col.notNull()).addColumn("user_id", "text", (col) => col.notNull()).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addPrimaryKeyConstraint("oauth_accounts_pk", ["provider", "provider_account_id"]).addForeignKeyConstraint(
    "oauth_accounts_user_fk",
    ["user_id"],
    "users",
    ["id"],
    (cb) => cb.onDelete("cascade")
  ).execute();
  await db.schema.createIndex("idx_oauth_accounts_user").on("oauth_accounts").column("user_id").execute();
  await db.schema.createTable("allowed_domains").addColumn("domain", "text", (col) => col.primaryKey()).addColumn("default_role", "integer", (col) => col.notNull().defaultTo(20)).addColumn("enabled", "integer", (col) => col.notNull().defaultTo(1)).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.schema.createTable("auth_challenges").addColumn("challenge", "text", (col) => col.primaryKey()).addColumn("type", "text", (col) => col.notNull()).addColumn("user_id", "text").addColumn("data", "text").addColumn("expires_at", "text", (col) => col.notNull()).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.schema.createIndex("idx_auth_challenges_expires").on("auth_challenges").column("expires_at").execute();
}
async function down$n(db) {
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
const m008 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$n,
  up: up$n
}, Symbol.toStringTag, { value: "Module" }));
async function up$m(db) {
  await sql`ALTER TABLE users ADD COLUMN disabled INTEGER NOT NULL DEFAULT 0`.execute(db);
  await db.schema.createIndex("idx_users_disabled").on("users").column("disabled").execute();
}
async function down$m(db) {
  await db.schema.dropIndex("idx_users_disabled").execute();
}
const m009 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$m,
  up: up$m
}, Symbol.toStringTag, { value: "Module" }));
async function up$l(db) {
  await db.schema.createTable("_emdash_section_categories").addColumn("id", "text", (col) => col.primaryKey()).addColumn("slug", "text", (col) => col.notNull().unique()).addColumn("label", "text", (col) => col.notNull()).addColumn("sort_order", "integer", (col) => col.defaultTo(0)).addColumn("created_at", "text", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)).execute();
  await db.schema.createTable("_emdash_sections").addColumn("id", "text", (col) => col.primaryKey()).addColumn("slug", "text", (col) => col.notNull().unique()).addColumn("title", "text", (col) => col.notNull()).addColumn("description", "text").addColumn(
    "category_id",
    "text",
    (col) => col.references("_emdash_section_categories.id").onDelete("set null")
  ).addColumn("keywords", "text").addColumn("content", "text", (col) => col.notNull()).addColumn("preview_media_id", "text").addColumn("source", "text", (col) => col.notNull().defaultTo("user")).addColumn("theme_id", "text").addColumn("created_at", "text", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)).addColumn("updated_at", "text", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)).execute();
  await db.schema.createIndex("idx_sections_category").on("_emdash_sections").columns(["category_id"]).execute();
  await db.schema.createIndex("idx_sections_source").on("_emdash_sections").columns(["source"]).execute();
}
async function down$l(db) {
  await db.schema.dropIndex("idx_content_taxonomies_term").execute();
  await db.schema.dropIndex("idx_media_mime_type").execute();
  await db.schema.dropTable("_emdash_sections").execute();
  await db.schema.dropTable("_emdash_section_categories").execute();
}
const m011 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$l,
  up: up$l
}, Symbol.toStringTag, { value: "Module" }));
async function up$k(db) {
  await db.schema.alterTable("_emdash_collections").addColumn("search_config", "text").execute();
  await db.schema.alterTable("_emdash_fields").addColumn("searchable", "integer", (col) => col.defaultTo(0)).execute();
}
async function down$k(db) {
  await db.schema.alterTable("_emdash_fields").dropColumn("searchable").execute();
  await db.schema.alterTable("_emdash_collections").dropColumn("search_config").execute();
}
const m012 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$k,
  up: up$k
}, Symbol.toStringTag, { value: "Module" }));
async function up$j(db) {
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
async function down$j(db) {
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
const m013 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$j,
  up: up$j
}, Symbol.toStringTag, { value: "Module" }));
async function up$i(db) {
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
async function down$i(db) {
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
const m014 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$i,
  up: up$i
}, Symbol.toStringTag, { value: "Module" }));
async function up$h(db) {
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
async function down$h(db) {
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
const m015 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$h,
  up: up$h
}, Symbol.toStringTag, { value: "Module" }));
async function up$g(db) {
  await db.schema.createTable("_emdash_api_tokens").addColumn("id", "text", (col) => col.primaryKey()).addColumn("name", "text", (col) => col.notNull()).addColumn("token_hash", "text", (col) => col.notNull().unique()).addColumn("prefix", "text", (col) => col.notNull()).addColumn("user_id", "text", (col) => col.notNull()).addColumn("scopes", "text", (col) => col.notNull()).addColumn("expires_at", "text").addColumn("last_used_at", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addForeignKeyConstraint(
    "api_tokens_user_fk",
    ["user_id"],
    "users",
    ["id"],
    (cb) => cb.onDelete("cascade")
  ).execute();
  await db.schema.createIndex("idx_api_tokens_token_hash").on("_emdash_api_tokens").column("token_hash").execute();
  await db.schema.createIndex("idx_api_tokens_user_id").on("_emdash_api_tokens").column("user_id").execute();
  await db.schema.createTable("_emdash_oauth_tokens").addColumn("token_hash", "text", (col) => col.primaryKey()).addColumn("token_type", "text", (col) => col.notNull()).addColumn("user_id", "text", (col) => col.notNull()).addColumn("scopes", "text", (col) => col.notNull()).addColumn("client_type", "text", (col) => col.notNull().defaultTo("cli")).addColumn("expires_at", "text", (col) => col.notNull()).addColumn("refresh_token_hash", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addForeignKeyConstraint(
    "oauth_tokens_user_fk",
    ["user_id"],
    "users",
    ["id"],
    (cb) => cb.onDelete("cascade")
  ).execute();
  await db.schema.createIndex("idx_oauth_tokens_user_id").on("_emdash_oauth_tokens").column("user_id").execute();
  await db.schema.createIndex("idx_oauth_tokens_expires").on("_emdash_oauth_tokens").column("expires_at").execute();
  await db.schema.createTable("_emdash_device_codes").addColumn("device_code", "text", (col) => col.primaryKey()).addColumn("user_code", "text", (col) => col.notNull().unique()).addColumn("scopes", "text", (col) => col.notNull()).addColumn("user_id", "text").addColumn("status", "text", (col) => col.notNull().defaultTo("pending")).addColumn("expires_at", "text", (col) => col.notNull()).addColumn("interval", "integer", (col) => col.notNull().defaultTo(5)).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
}
async function down$g(db) {
  await db.schema.dropTable("_emdash_device_codes").execute();
  await db.schema.dropTable("_emdash_oauth_tokens").execute();
  await db.schema.dropTable("_emdash_api_tokens").execute();
}
const m016 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$g,
  up: up$g
}, Symbol.toStringTag, { value: "Module" }));
async function up$f(db) {
  await db.schema.createTable("_emdash_authorization_codes").addColumn("code_hash", "text", (col) => col.primaryKey()).addColumn("client_id", "text", (col) => col.notNull()).addColumn("redirect_uri", "text", (col) => col.notNull()).addColumn("user_id", "text", (col) => col.notNull()).addColumn("scopes", "text", (col) => col.notNull()).addColumn("code_challenge", "text", (col) => col.notNull()).addColumn("code_challenge_method", "text", (col) => col.notNull().defaultTo("S256")).addColumn("resource", "text").addColumn("expires_at", "text", (col) => col.notNull()).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addForeignKeyConstraint(
    "auth_codes_user_fk",
    ["user_id"],
    "users",
    ["id"],
    (cb) => cb.onDelete("cascade")
  ).execute();
  await db.schema.createIndex("idx_auth_codes_expires").on("_emdash_authorization_codes").column("expires_at").execute();
  await sql`ALTER TABLE _emdash_oauth_tokens ADD COLUMN client_id TEXT`.execute(db);
}
async function down$f(db) {
  await db.schema.dropTable("_emdash_authorization_codes").execute();
}
const m017 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$f,
  up: up$f
}, Symbol.toStringTag, { value: "Module" }));
async function up$e(db) {
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
async function down$e(db) {
  await sql`DROP TABLE IF EXISTS _emdash_seo`.execute(db);
  await sql`
		ALTER TABLE _emdash_collections
		DROP COLUMN has_seo
	`.execute(db);
}
const m018 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$e,
  up: up$e
}, Symbol.toStringTag, { value: "Module" }));
const DOUBLE_QUOTE_RE = /"/g;
function quoteIdent(name) {
  return `"${name.replace(DOUBLE_QUOTE_RE, '""')}"`;
}
const I18N_TMP_SUFFIX = /_i18n_tmp$/;
const TABLE_NAME_PATTERN = /^ec_[a-z][a-z0-9_]*$/;
function validateTableName(name) {
  if (!TABLE_NAME_PATTERN.test(name)) {
    throw new Error(`Invalid content table name: "${name}"`);
  }
}
const ALLOWED_COLUMN_TYPES = /* @__PURE__ */ new Set(["TEXT", "INTEGER", "REAL", "BLOB", "JSON", "NUMERIC", ""]);
function validateColumnType(type, colName) {
  if (!ALLOWED_COLUMN_TYPES.has(type.toUpperCase())) {
    throw new Error(`Unexpected column type "${type}" for column "${colName}"`);
  }
}
const SAFE_DEFAULT_PATTERN = /^(?:'[^']*'|NULL|-?\d+(?:\.\d+)?|\(?datetime\('now'\)\)?|\(?json\('[^']*'\)\)?|0|1)$/i;
function validateDefaultValue(value, colName) {
  if (!SAFE_DEFAULT_PATTERN.test(value)) {
    throw new Error(`Unexpected default value "${value}" for column "${colName}"`);
  }
}
const FUNCTION_DEFAULT_PATTERN = /^(?:datetime|json)\(/i;
function normalizeDdlDefault(value) {
  if (value.startsWith("(")) return value;
  if (FUNCTION_DEFAULT_PATTERN.test(value)) return `(${value})`;
  return value;
}
const CREATE_INDEX_PATTERN = /^CREATE\s+(UNIQUE\s+)?INDEX\s+/i;
function validateCreateIndexSql(sqlStr, idxName) {
  if (!CREATE_INDEX_PATTERN.test(sqlStr)) {
    throw new Error(`Unexpected index SQL for "${idxName}": does not match CREATE INDEX pattern`);
  }
  if (sqlStr.includes(";")) {
    throw new Error(`Unexpected index SQL for "${idxName}": contains semicolon`);
  }
}
async function upPostgres(db) {
  const tableNames = await listTablesLike(db, "ec_%");
  for (const t of tableNames) {
    validateTableName(t);
    const hasLocale = await sql`
			SELECT EXISTS(
				SELECT 1 FROM information_schema.columns
				WHERE table_schema = 'public' AND table_name = ${t} AND column_name = 'locale'
			) as exists
		`.execute(db);
    if (hasLocale.rows[0]?.exists === true) continue;
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
    for (const c of constraints.rows) {
      await sql`ALTER TABLE ${sql.ref(t)} DROP CONSTRAINT ${sql.ref(c.conname)}`.execute(db);
    }
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
  const hasTranslatable = await sql`
		SELECT EXISTS(
			SELECT 1 FROM information_schema.columns
			WHERE table_schema = 'public' AND table_name = '_emdash_fields' AND column_name = 'translatable'
		) as exists
	`.execute(db);
  if (hasTranslatable.rows[0]?.exists !== true) {
    await sql`
			ALTER TABLE _emdash_fields
			ADD COLUMN translatable INTEGER NOT NULL DEFAULT 1
		`.execute(db);
  }
}
async function up$d(db) {
  if (!isSqlite(db)) {
    return upPostgres(db);
  }
  const orphanedTmps = await listTablesLike(db, "ec_%_i18n_tmp");
  for (const tmpName of orphanedTmps) {
    validateTableName(tmpName.replace(I18N_TMP_SUFFIX, ""));
    await sql`DROP TABLE IF EXISTS ${sql.ref(tmpName)}`.execute(db);
  }
  const tableNames = await listTablesLike(db, "ec_%");
  const tables = { rows: tableNames.map((name) => ({ name })) };
  for (const table of tables.rows) {
    const t = table.name;
    validateTableName(t);
    const tmp = `${t}_i18n_tmp`;
    {
      const trx = db;
      const colResult = await sql`
				PRAGMA table_info(${sql.ref(t)})
			`.execute(trx);
      const columns = colResult.rows;
      if (columns.some((col) => col.name === "locale")) {
        continue;
      }
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
      for (const idx of indexDefs) {
        if (idx.partial) {
          const createResult = await sql`
						SELECT sql FROM sqlite_master 
						WHERE type = 'index' AND name = ${idx.name}
					`.execute(trx);
          if (createResult.rows[0]?.sql) {
            partialSqls.set(idx.name, createResult.rows[0].sql);
          }
        }
      }
      for (const col of columns) {
        validateIdentifier(col.name, "column name");
      }
      const colDefs = [];
      const colNames = [];
      for (const col of columns) {
        validateColumnType(col.type || "TEXT", col.name);
        colNames.push(quoteIdent(col.name));
        let def = `${quoteIdent(col.name)} ${col.type || "TEXT"}`;
        if (col.pk) {
          def += " PRIMARY KEY";
        } else if (col.name === "slug") ;
        else {
          if (col.notnull) def += " NOT NULL";
        }
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
      for (const idx of indexDefs) {
        await sql`DROP INDEX IF EXISTS ${sql.ref(idx.name)}`.execute(trx);
      }
      await sql.raw(`CREATE TABLE ${quoteIdent(tmp)} (
				${createColsSql}
			)`).execute(trx);
      await sql.raw(
        `INSERT INTO ${quoteIdent(tmp)} (${selectColsSql}, "locale", "translation_group")
			 SELECT ${selectColsSql}, 'en', "id" FROM ${quoteIdent(t)}`
      ).execute(trx);
      await sql`DROP TABLE ${sql.ref(t)}`.execute(trx);
      await sql.raw(`ALTER TABLE ${quoteIdent(tmp)} RENAME TO ${quoteIdent(t)}`).execute(trx);
      for (const idx of indexDefs) {
        if (idx.name === `idx_${t}_slug`) continue;
        if (idx.partial && partialSqls.has(idx.name)) {
          const idxSql = partialSqls.get(idx.name);
          validateCreateIndexSql(idxSql, idx.name);
          await sql.raw(idxSql).execute(trx);
        } else {
          for (const c of idx.columns) {
            validateIdentifier(c, "index column name");
          }
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
  const fieldCols = await sql`
		PRAGMA table_info(_emdash_fields)
	`.execute(db);
  if (!fieldCols.rows.some((col) => col.name === "translatable")) {
    await sql`
			ALTER TABLE _emdash_fields 
			ADD COLUMN translatable INTEGER NOT NULL DEFAULT 1
		`.execute(db);
  }
}
async function downPostgres(db) {
  await sql`ALTER TABLE _emdash_fields DROP COLUMN translatable`.execute(db);
  const tableNames = await listTablesLike(db, "ec_%");
  for (const t of tableNames) {
    validateTableName(t);
    await sql`DROP INDEX IF EXISTS ${sql.ref(`idx_${t}_locale`)}`.execute(db);
    await sql`DROP INDEX IF EXISTS ${sql.ref(`idx_${t}_translation_group`)}`.execute(db);
    await sql`ALTER TABLE ${sql.ref(t)} DROP CONSTRAINT IF EXISTS ${sql.ref(`${t}_slug_locale_unique`)}`.execute(
      db
    );
    await sql`ALTER TABLE ${sql.ref(t)} ADD CONSTRAINT ${sql.ref(`${t}_slug_unique`)} UNIQUE (slug)`.execute(
      db
    );
    await sql`ALTER TABLE ${sql.ref(t)} DROP COLUMN locale`.execute(db);
    await sql`ALTER TABLE ${sql.ref(t)} DROP COLUMN translation_group`.execute(db);
  }
}
async function down$d(db) {
  if (!isSqlite(db)) {
    return downPostgres(db);
  }
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
      const colResult = await sql`
				PRAGMA table_info(${sql.ref(t)})
			`.execute(trx);
      const columns = colResult.rows;
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
      for (const idx of indexDefs) {
        if (idx.partial) {
          const createResult = await sql`
						SELECT sql FROM sqlite_master 
						WHERE type = 'index' AND name = ${idx.name}
					`.execute(trx);
          if (createResult.rows[0]?.sql) {
            partialSqls.set(idx.name, createResult.rows[0].sql);
          }
        }
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
        if (col.pk) {
          def += " PRIMARY KEY";
        } else if (col.name === "slug") {
          def += " UNIQUE";
        } else {
          if (col.notnull) def += " NOT NULL";
        }
        if (col.dflt_value !== null) {
          validateDefaultValue(col.dflt_value, col.name);
          def += ` DEFAULT ${normalizeDdlDefault(col.dflt_value)}`;
        }
        colDefs.push(def);
      }
      const createColsSql = colDefs.join(",\n				");
      const selectColsSql = colNames.join(", ");
      for (const idx of indexDefs) {
        await sql`DROP INDEX IF EXISTS ${sql.ref(idx.name)}`.execute(trx);
      }
      await sql.raw(`CREATE TABLE ${quoteIdent(tmp)} (
				${createColsSql}
			)`).execute(trx);
      await sql.raw(
        `INSERT OR IGNORE INTO ${quoteIdent(tmp)} (${selectColsSql})
			 SELECT ${selectColsSql} FROM ${quoteIdent(t)}
			 WHERE "locale" = 'en'`
      ).execute(trx);
      await sql.raw(
        `INSERT OR IGNORE INTO ${quoteIdent(tmp)} (${selectColsSql})
			 SELECT ${selectColsSql} FROM ${quoteIdent(t)}
			 WHERE "id" NOT IN (SELECT "id" FROM ${quoteIdent(tmp)})
			 AND "id" IN (
				SELECT "id" FROM ${quoteIdent(t)} AS t2
				WHERE t2."translation_group" IS NOT NULL
				AND t2."locale" = (
					SELECT MIN(t3."locale") FROM ${quoteIdent(t)} AS t3
					WHERE t3."translation_group" = t2."translation_group"
				)
			 )`
      ).execute(trx);
      await sql.raw(
        `INSERT OR IGNORE INTO ${quoteIdent(tmp)} (${selectColsSql})
			 SELECT ${selectColsSql} FROM ${quoteIdent(t)}
			 WHERE "id" NOT IN (SELECT "id" FROM ${quoteIdent(tmp)})
			 AND "translation_group" IS NULL`
      ).execute(trx);
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
          for (const c of cols) {
            validateIdentifier(c, "index column name");
          }
          const colsSql = cols.map((c) => quoteIdent(c)).join(", ");
          const unique = idx.unique ? "UNIQUE " : "";
          await sql.raw(`CREATE ${unique}INDEX ${quoteIdent(idx.name)} ON ${quoteIdent(t)} (${colsSql})`).execute(trx);
        }
      }
    }
  }
}
const m019 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$d,
  up: up$d
}, Symbol.toStringTag, { value: "Module" }));
async function up$c(db) {
  await sql`
		ALTER TABLE _emdash_collections
		ADD COLUMN url_pattern TEXT
	`.execute(db);
}
async function down$c(db) {
  await sql`
		ALTER TABLE _emdash_collections
		DROP COLUMN url_pattern
	`.execute(db);
}
const m020 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$c,
  up: up$c
}, Symbol.toStringTag, { value: "Module" }));
async function up$b(db) {
  await db.schema.dropIndex("idx_sections_category").ifExists().execute();
  await db.schema.alterTable("_emdash_sections").dropColumn("category_id").execute();
  await db.schema.dropTable("_emdash_section_categories").execute();
}
async function down$b(db) {
  await db.schema.createTable("_emdash_section_categories").addColumn("id", "text", (col) => col.primaryKey()).addColumn("slug", "text", (col) => col.notNull().unique()).addColumn("label", "text", (col) => col.notNull()).addColumn("sort_order", "integer", (col) => col.defaultTo(0)).addColumn("created_at", "text", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)).execute();
  await db.schema.alterTable("_emdash_sections").addColumn(
    "category_id",
    "text",
    (col) => col.references("_emdash_section_categories.id").onDelete("set null")
  ).execute();
  await db.schema.createIndex("idx_sections_category").on("_emdash_sections").columns(["category_id"]).execute();
}
const m021 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$b,
  up: up$b
}, Symbol.toStringTag, { value: "Module" }));
async function up$a(db) {
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
async function down$a(db) {
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
const m022 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$a,
  up: up$a
}, Symbol.toStringTag, { value: "Module" }));
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
const m023 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$9,
  up: up$9
}, Symbol.toStringTag, { value: "Module" }));
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
const m024 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$8,
  up: up$8
}, Symbol.toStringTag, { value: "Module" }));
async function up$7(db) {
  await db.schema.createTable("_emdash_oauth_clients").addColumn("id", "text", (col) => col.primaryKey()).addColumn("name", "text", (col) => col.notNull()).addColumn("redirect_uris", "text", (col) => col.notNull()).addColumn("scopes", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
}
async function down$7(db) {
  await db.schema.dropTable("_emdash_oauth_clients").execute();
}
const m025 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$7,
  up: up$7
}, Symbol.toStringTag, { value: "Module" }));
async function up$6(db) {
  await db.schema.createTable("_emdash_cron_tasks").addColumn("id", "text", (col) => col.primaryKey()).addColumn("plugin_id", "text", (col) => col.notNull()).addColumn("task_name", "text", (col) => col.notNull()).addColumn("schedule", "text", (col) => col.notNull()).addColumn("is_oneshot", "integer", (col) => col.notNull().defaultTo(0)).addColumn("data", "text").addColumn("next_run_at", "text", (col) => col.notNull()).addColumn("last_run_at", "text").addColumn("status", "text", (col) => col.notNull().defaultTo("idle")).addColumn("locked_at", "text").addColumn("enabled", "integer", (col) => col.notNull().defaultTo(1)).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addUniqueConstraint("uq_cron_tasks_plugin_task", ["plugin_id", "task_name"]).execute();
  await db.schema.createIndex("idx_cron_tasks_due").on("_emdash_cron_tasks").columns(["enabled", "status", "next_run_at"]).execute();
  await db.schema.createIndex("idx_cron_tasks_plugin").on("_emdash_cron_tasks").column("plugin_id").execute();
}
async function down$6(db) {
  await db.schema.dropTable("_emdash_cron_tasks").execute();
}
const m026 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$6,
  up: up$6
}, Symbol.toStringTag, { value: "Module" }));
async function up$5(db) {
  await db.schema.createTable("_emdash_comments").addColumn("id", "text", (col) => col.primaryKey()).addColumn("collection", "text", (col) => col.notNull()).addColumn("content_id", "text", (col) => col.notNull()).addColumn(
    "parent_id",
    "text",
    (col) => col.references("_emdash_comments.id").onDelete("cascade")
  ).addColumn("author_name", "text", (col) => col.notNull()).addColumn("author_email", "text", (col) => col.notNull()).addColumn("author_url", "text").addColumn("author_user_id", "text", (col) => col.references("users.id").onDelete("set null")).addColumn("body", "text", (col) => col.notNull()).addColumn("status", "text", (col) => col.notNull().defaultTo("pending")).addColumn("ip_hash", "text").addColumn("user_agent", "text").addColumn("moderation_metadata", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await db.schema.createIndex("idx_comments_content").on("_emdash_comments").columns(["collection", "content_id", "status"]).execute();
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
const m027 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$5,
  up: up$5
}, Symbol.toStringTag, { value: "Module" }));
async function up$4(db) {
  await sql`ALTER TABLE _emdash_comments DROP COLUMN author_url`.execute(db);
}
async function down$4(db) {
  await db.schema.alterTable("_emdash_comments").addColumn("author_url", "text").execute();
}
const m028 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$4,
  up: up$4
}, Symbol.toStringTag, { value: "Module" }));
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
const m029 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$3,
  up: up$3
}, Symbol.toStringTag, { value: "Module" }));
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
const m030 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$2,
  up: up$2
}, Symbol.toStringTag, { value: "Module" }));
async function up$1(db) {
  await db.schema.createTable("_emdash_bylines").addColumn("id", "text", (col) => col.primaryKey()).addColumn("slug", "text", (col) => col.notNull().unique()).addColumn("display_name", "text", (col) => col.notNull()).addColumn("bio", "text").addColumn("avatar_media_id", "text", (col) => col.references("media.id").onDelete("set null")).addColumn("website_url", "text").addColumn("user_id", "text", (col) => col.references("users.id").onDelete("set null")).addColumn("is_guest", "integer", (col) => col.notNull().defaultTo(0)).addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addColumn("updated_at", "text", (col) => col.defaultTo(currentTimestamp(db))).execute();
  await sql`
		CREATE UNIQUE INDEX ${sql.ref("idx_bylines_user_id_unique")}
		ON ${sql.ref("_emdash_bylines")} (user_id)
		WHERE user_id IS NOT NULL
	`.execute(db);
  await db.schema.createIndex("idx_bylines_slug").on("_emdash_bylines").column("slug").execute();
  await db.schema.createIndex("idx_bylines_display_name").on("_emdash_bylines").column("display_name").execute();
  await db.schema.createTable("_emdash_content_bylines").addColumn("id", "text", (col) => col.primaryKey()).addColumn("collection_slug", "text", (col) => col.notNull()).addColumn("content_id", "text", (col) => col.notNull()).addColumn(
    "byline_id",
    "text",
    (col) => col.notNull().references("_emdash_bylines.id").onDelete("cascade")
  ).addColumn("sort_order", "integer", (col) => col.notNull().defaultTo(0)).addColumn("role_label", "text").addColumn("created_at", "text", (col) => col.defaultTo(currentTimestamp(db))).addUniqueConstraint("content_bylines_unique", ["collection_slug", "content_id", "byline_id"]).execute();
  await db.schema.createIndex("idx_content_bylines_content").on("_emdash_content_bylines").columns(["collection_slug", "content_id", "sort_order"]).execute();
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
const m031 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down: down$1,
  up: up$1
}, Symbol.toStringTag, { value: "Module" }));
async function up(db) {
  await db.schema.createTable("_emdash_rate_limits").addColumn("key", "text", (col) => col.notNull()).addColumn("window", "text", (col) => col.notNull()).addColumn("count", "integer", (col) => col.notNull().defaultTo(1)).addPrimaryKeyConstraint("pk_rate_limits", ["key", "window"]).execute();
  await db.schema.createIndex("idx_rate_limits_window").on("_emdash_rate_limits").column("window").execute();
  await db.schema.alterTable("_emdash_device_codes").addColumn("last_polled_at", "text").execute();
}
async function down(db) {
  await db.schema.dropTable("_emdash_rate_limits").execute();
  await db.schema.alterTable("_emdash_device_codes").dropColumn("last_polled_at").execute();
}
const m032 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  down,
  up
}, Symbol.toStringTag, { value: "Module" }));
class StaticMigrationProvider {
  async getMigrations() {
    return {
      "001_initial": m001,
      "002_media_status": m002,
      "003_schema_registry": m003,
      "004_plugins": m004,
      "005_menus": m005,
      "006_taxonomy_defs": m006,
      "007_widgets": m007,
      "008_auth": m008,
      "009_user_disabled": m009,
      "011_sections": m011,
      "012_search": m012,
      "013_scheduled_publishing": m013,
      "014_draft_revisions": m014,
      "015_indexes": m015,
      "016_api_tokens": m016,
      "017_authorization_codes": m017,
      "018_seo": m018,
      "019_i18n": m019,
      "020_collection_url_pattern": m020,
      "021_remove_section_categories": m021,
      "022_marketplace_plugin_state": m022,
      "023_plugin_metadata": m023,
      "024_media_placeholders": m024,
      "025_oauth_clients": m025,
      "026_cron_tasks": m026,
      "027_comments": m027,
      "028_drop_author_url": m028,
      "029_redirects": m029,
      "030_widen_scheduled_index": m030,
      "031_bylines": m031,
      "032_rate_limits": m032
    };
  }
}
const MIGRATION_TABLE = "_emdash_migrations";
const MIGRATION_LOCK_TABLE = "_emdash_migrations_lock";
async function runMigrations(db) {
  const migrator = new Migrator({
    db,
    provider: new StaticMigrationProvider(),
    migrationTableName: MIGRATION_TABLE,
    migrationLockTableName: MIGRATION_LOCK_TABLE
  });
  const { error, results } = await migrator.migrateToLatest();
  const applied = results?.filter((r) => r.status === "Success").map((r) => r.migrationName) ?? [];
  if (error) {
    let msg = error instanceof Error ? error.message : JSON.stringify(error);
    if (!msg && error instanceof Error && error.cause) {
      msg = error.cause instanceof Error ? error.cause.message : JSON.stringify(error.cause);
    }
    const failedMigration = results?.find((r) => r.status === "Error");
    if (failedMigration) {
      msg = `${msg || "unknown error"} (migration: ${failedMigration.migrationName})`;
    }
    throw new Error(`Migration failed: ${msg}`);
  }
  return { applied };
}
const COLLECTION_FIELD_SLUG_PATTERN = /^[a-z][a-z0-9_]*$/;
const SLUG_PATTERN = /^[a-z0-9-]+$/;
const REDIRECT_TYPES = /* @__PURE__ */ new Set([301, 302, 307, 308]);
const CRLF_PATTERN = /[\r\n]/;
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isValidRedirectPath(path) {
  if (!path.startsWith("/") || path.startsWith("//") || CRLF_PATTERN.test(path)) {
    return false;
  }
  try {
    return !decodeURIComponent(path).split("/").includes("..");
  } catch {
    return false;
  }
}
function validateSeed(data) {
  const errors = [];
  const warnings = [];
  if (!data || typeof data !== "object") {
    return {
      valid: false,
      errors: ["Seed must be an object"],
      warnings: []
    };
  }
  const seed = data;
  if (!seed.version) {
    errors.push("Seed must have a version field");
  } else if (seed.version !== "1") {
    errors.push(`Unsupported seed version: ${String(seed.version)}`);
  }
  if (seed.collections) {
    if (!Array.isArray(seed.collections)) {
      errors.push("collections must be an array");
    } else {
      const collectionSlugs = /* @__PURE__ */ new Set();
      for (let i = 0; i < seed.collections.length; i++) {
        const collection = seed.collections[i];
        const prefix = `collections[${i}]`;
        if (!collection.slug) {
          errors.push(`${prefix}: slug is required`);
        } else {
          if (!COLLECTION_FIELD_SLUG_PATTERN.test(collection.slug)) {
            errors.push(
              `${prefix}.slug: must start with a letter and contain only lowercase letters, numbers, and underscores`
            );
          }
          if (collectionSlugs.has(collection.slug)) {
            errors.push(`${prefix}.slug: duplicate collection slug "${collection.slug}"`);
          }
          collectionSlugs.add(collection.slug);
        }
        if (!collection.label) {
          errors.push(`${prefix}: label is required`);
        }
        if (!Array.isArray(collection.fields)) {
          errors.push(`${prefix}.fields: must be an array`);
        } else {
          const fieldSlugs = /* @__PURE__ */ new Set();
          for (let j = 0; j < collection.fields.length; j++) {
            const field = collection.fields[j];
            const fieldPrefix = `${prefix}.fields[${j}]`;
            if (!field.slug) {
              errors.push(`${fieldPrefix}: slug is required`);
            } else {
              if (!COLLECTION_FIELD_SLUG_PATTERN.test(field.slug)) {
                errors.push(
                  `${fieldPrefix}.slug: must start with a letter and contain only lowercase letters, numbers, and underscores`
                );
              }
              if (fieldSlugs.has(field.slug)) {
                errors.push(
                  `${fieldPrefix}.slug: duplicate field slug "${field.slug}" in collection "${collection.slug}"`
                );
              }
              fieldSlugs.add(field.slug);
            }
            if (!field.label) {
              errors.push(`${fieldPrefix}: label is required`);
            }
            if (!field.type) {
              errors.push(`${fieldPrefix}: type is required`);
            } else if (!FIELD_TYPES.includes(field.type)) {
              errors.push(`${fieldPrefix}.type: unsupported field type "${field.type}"`);
            }
          }
        }
      }
    }
  }
  if (seed.taxonomies) {
    if (!Array.isArray(seed.taxonomies)) {
      errors.push("taxonomies must be an array");
    } else {
      const taxonomyNames = /* @__PURE__ */ new Set();
      for (let i = 0; i < seed.taxonomies.length; i++) {
        const taxonomy = seed.taxonomies[i];
        const prefix = `taxonomies[${i}]`;
        if (!taxonomy.name) {
          errors.push(`${prefix}: name is required`);
        } else {
          if (taxonomyNames.has(taxonomy.name)) {
            errors.push(`${prefix}.name: duplicate taxonomy name "${taxonomy.name}"`);
          }
          taxonomyNames.add(taxonomy.name);
        }
        if (!taxonomy.label) {
          errors.push(`${prefix}: label is required`);
        }
        if (taxonomy.hierarchical === void 0) {
          errors.push(`${prefix}: hierarchical is required`);
        }
        if (!Array.isArray(taxonomy.collections)) {
          errors.push(`${prefix}.collections: must be an array`);
        } else if (taxonomy.collections.length === 0) {
          warnings.push(
            `${prefix}.collections: taxonomy "${taxonomy.name}" is not assigned to any collections`
          );
        }
        if (taxonomy.terms) {
          if (!Array.isArray(taxonomy.terms)) {
            errors.push(`${prefix}.terms: must be an array`);
          } else {
            const termSlugs = /* @__PURE__ */ new Set();
            for (let j = 0; j < taxonomy.terms.length; j++) {
              const term = taxonomy.terms[j];
              const termPrefix = `${prefix}.terms[${j}]`;
              if (!term.slug) {
                errors.push(`${termPrefix}: slug is required`);
              } else {
                if (termSlugs.has(term.slug)) {
                  errors.push(
                    `${termPrefix}.slug: duplicate term slug "${term.slug}" in taxonomy "${taxonomy.name}"`
                  );
                }
                termSlugs.add(term.slug);
              }
              if (!term.label) {
                errors.push(`${termPrefix}: label is required`);
              }
              if (term.parent && taxonomy.hierarchical) ;
              else if (term.parent && !taxonomy.hierarchical) {
                warnings.push(
                  `${termPrefix}.parent: taxonomy "${taxonomy.name}" is not hierarchical, parent will be ignored`
                );
              }
            }
            if (taxonomy.hierarchical && taxonomy.terms) {
              for (let j = 0; j < taxonomy.terms.length; j++) {
                const term = taxonomy.terms[j];
                if (term.parent && !termSlugs.has(term.parent)) {
                  errors.push(
                    `${prefix}.terms[${j}].parent: parent term "${term.parent}" not found in taxonomy`
                  );
                }
                if (term.parent === term.slug) {
                  errors.push(`${prefix}.terms[${j}].parent: term cannot be its own parent`);
                }
              }
            }
          }
        }
      }
    }
  }
  if (seed.menus) {
    if (!Array.isArray(seed.menus)) {
      errors.push("menus must be an array");
    } else {
      const menuNames = /* @__PURE__ */ new Set();
      for (let i = 0; i < seed.menus.length; i++) {
        const menu = seed.menus[i];
        const prefix = `menus[${i}]`;
        if (!menu.name) {
          errors.push(`${prefix}: name is required`);
        } else {
          if (menuNames.has(menu.name)) {
            errors.push(`${prefix}.name: duplicate menu name "${menu.name}"`);
          }
          menuNames.add(menu.name);
        }
        if (!menu.label) {
          errors.push(`${prefix}: label is required`);
        }
        if (!Array.isArray(menu.items)) {
          errors.push(`${prefix}.items: must be an array`);
        } else {
          validateMenuItems(menu.items, prefix, errors);
        }
      }
    }
  }
  if (seed.redirects) {
    if (!Array.isArray(seed.redirects)) {
      errors.push("redirects must be an array");
    } else {
      const redirectSources = /* @__PURE__ */ new Set();
      for (let i = 0; i < seed.redirects.length; i++) {
        const redirect = seed.redirects[i];
        const prefix = `redirects[${i}]`;
        if (!isRecord(redirect)) {
          errors.push(`${prefix}: must be an object`);
          continue;
        }
        const source = typeof redirect.source === "string" ? redirect.source : void 0;
        const destination = typeof redirect.destination === "string" ? redirect.destination : void 0;
        if (!source) {
          errors.push(`${prefix}: source is required`);
        } else {
          if (!isValidRedirectPath(source)) {
            errors.push(
              `${prefix}.source: must be a path starting with / (no protocol-relative URLs, path traversal, or newlines)`
            );
          }
          if (redirectSources.has(source)) {
            errors.push(`${prefix}.source: duplicate redirect source "${source}"`);
          }
          redirectSources.add(source);
        }
        if (!destination) {
          errors.push(`${prefix}: destination is required`);
        } else if (!isValidRedirectPath(destination)) {
          errors.push(
            `${prefix}.destination: must be a path starting with / (no protocol-relative URLs, path traversal, or newlines)`
          );
        }
        if (redirect.type !== void 0) {
          if (typeof redirect.type !== "number" || !REDIRECT_TYPES.has(redirect.type)) {
            errors.push(`${prefix}.type: must be 301, 302, 307, or 308`);
          }
        }
        if (redirect.enabled !== void 0 && typeof redirect.enabled !== "boolean") {
          errors.push(`${prefix}.enabled: must be a boolean`);
        }
        if (redirect.groupName !== void 0 && typeof redirect.groupName !== "string" && redirect.groupName !== null) {
          errors.push(`${prefix}.groupName: must be a string or null`);
        }
      }
    }
  }
  if (seed.widgetAreas) {
    if (!Array.isArray(seed.widgetAreas)) {
      errors.push("widgetAreas must be an array");
    } else {
      const areaNames = /* @__PURE__ */ new Set();
      for (let i = 0; i < seed.widgetAreas.length; i++) {
        const area = seed.widgetAreas[i];
        const prefix = `widgetAreas[${i}]`;
        if (!area.name) {
          errors.push(`${prefix}: name is required`);
        } else {
          if (areaNames.has(area.name)) {
            errors.push(`${prefix}.name: duplicate widget area name "${area.name}"`);
          }
          areaNames.add(area.name);
        }
        if (!area.label) {
          errors.push(`${prefix}: label is required`);
        }
        if (!Array.isArray(area.widgets)) {
          errors.push(`${prefix}.widgets: must be an array`);
        } else {
          for (let j = 0; j < area.widgets.length; j++) {
            const widget = area.widgets[j];
            const widgetPrefix = `${prefix}.widgets[${j}]`;
            if (!widget.type) {
              errors.push(`${widgetPrefix}: type is required`);
            } else if (!["content", "menu", "component"].includes(widget.type)) {
              errors.push(`${widgetPrefix}.type: must be "content", "menu", or "component"`);
            }
            if (widget.type === "menu" && !widget.menuName) {
              errors.push(`${widgetPrefix}: menuName is required for menu widgets`);
            }
            if (widget.type === "component" && !widget.componentId) {
              errors.push(`${widgetPrefix}: componentId is required for component widgets`);
            }
          }
        }
      }
    }
  }
  if (seed.sections) {
    if (!Array.isArray(seed.sections)) {
      errors.push("sections must be an array");
    } else {
      const sectionSlugs = /* @__PURE__ */ new Set();
      for (let i = 0; i < seed.sections.length; i++) {
        const section = seed.sections[i];
        const prefix = `sections[${i}]`;
        if (!section.slug) {
          errors.push(`${prefix}: slug is required`);
        } else {
          if (!SLUG_PATTERN.test(section.slug)) {
            errors.push(
              `${prefix}.slug: must contain only lowercase letters, numbers, and hyphens`
            );
          }
          if (sectionSlugs.has(section.slug)) {
            errors.push(`${prefix}.slug: duplicate section slug "${section.slug}"`);
          }
          sectionSlugs.add(section.slug);
        }
        if (!section.title) {
          errors.push(`${prefix}: title is required`);
        }
        if (!Array.isArray(section.content)) {
          errors.push(`${prefix}.content: must be an array`);
        }
        if (section.source && !["theme", "import"].includes(section.source)) {
          errors.push(`${prefix}.source: must be "theme" or "import"`);
        }
      }
    }
  }
  if (seed.bylines) {
    if (!Array.isArray(seed.bylines)) {
      errors.push("bylines must be an array");
    } else {
      const bylineIds = /* @__PURE__ */ new Set();
      const bylineSlugs = /* @__PURE__ */ new Set();
      for (let i = 0; i < seed.bylines.length; i++) {
        const byline = seed.bylines[i];
        const prefix = `bylines[${i}]`;
        if (!byline.id) {
          errors.push(`${prefix}: id is required`);
        } else {
          if (bylineIds.has(byline.id)) {
            errors.push(`${prefix}.id: duplicate byline id "${byline.id}"`);
          }
          bylineIds.add(byline.id);
        }
        if (!byline.slug) {
          errors.push(`${prefix}: slug is required`);
        } else {
          if (!SLUG_PATTERN.test(byline.slug)) {
            errors.push(
              `${prefix}.slug: must contain only lowercase letters, numbers, and hyphens`
            );
          }
          if (bylineSlugs.has(byline.slug)) {
            errors.push(`${prefix}.slug: duplicate byline slug "${byline.slug}"`);
          }
          bylineSlugs.add(byline.slug);
        }
        if (!byline.displayName) {
          errors.push(`${prefix}: displayName is required`);
        }
      }
    }
  }
  if (seed.content) {
    if (typeof seed.content !== "object" || Array.isArray(seed.content)) {
      errors.push("content must be an object (collection -> entries)");
    } else {
      for (const [collectionSlug, entries] of Object.entries(seed.content)) {
        if (!Array.isArray(entries)) {
          errors.push(`content.${collectionSlug}: must be an array`);
          continue;
        }
        const entryIds = /* @__PURE__ */ new Set();
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const prefix = `content.${collectionSlug}[${i}]`;
          if (!entry.id) {
            errors.push(`${prefix}: id is required`);
          } else {
            if (entryIds.has(entry.id)) {
              errors.push(
                `${prefix}.id: duplicate entry id "${entry.id}" in collection "${collectionSlug}"`
              );
            }
            entryIds.add(entry.id);
          }
          if (!entry.slug) {
            errors.push(`${prefix}: slug is required`);
          }
          if (!entry.data || typeof entry.data !== "object") {
            errors.push(`${prefix}: data must be an object`);
          }
          if (entry.translationOf) {
            if (!entry.locale) {
              errors.push(`${prefix}: locale is required when translationOf is set`);
            }
          }
        }
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          if (entry.translationOf && !entryIds.has(entry.translationOf)) {
            errors.push(
              `content.${collectionSlug}[${i}].translationOf: references "${entry.translationOf}" which is not in this collection`
            );
          }
        }
      }
    }
  }
  if (seed.menus && seed.content) {
    const allContentIds = /* @__PURE__ */ new Set();
    for (const entries of Object.values(seed.content)) {
      if (Array.isArray(entries)) {
        for (const entry of entries) {
          if (entry.id) {
            allContentIds.add(entry.id);
          }
        }
      }
    }
    for (const menu of seed.menus) {
      if (Array.isArray(menu.items)) {
        validateMenuItemRefs(menu.items, allContentIds, warnings);
      }
    }
  }
  if (seed.content) {
    const seedBylineIds = new Set((seed.bylines ?? []).map((byline) => byline.id));
    for (const [collectionSlug, entries] of Object.entries(seed.content)) {
      if (!Array.isArray(entries)) continue;
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (!entry.bylines) continue;
        if (!Array.isArray(entry.bylines)) {
          errors.push(`content.${collectionSlug}[${i}].bylines: must be an array`);
          continue;
        }
        for (let j = 0; j < entry.bylines.length; j++) {
          const credit = entry.bylines[j];
          const prefix = `content.${collectionSlug}[${i}].bylines[${j}]`;
          if (!credit.byline) {
            errors.push(`${prefix}.byline: is required`);
            continue;
          }
          if (!seedBylineIds.has(credit.byline)) {
            errors.push(`${prefix}.byline: references unknown byline "${credit.byline}"`);
          }
        }
      }
    }
  }
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
function validateMenuItems(items, prefix, errors, warnings) {
  for (let i = 0; i < items.length; i++) {
    const raw = items[i];
    const itemPrefix = `${prefix}.items[${i}]`;
    if (!isRecord(raw)) {
      errors.push(`${itemPrefix}: must be an object`);
      continue;
    }
    const item = raw;
    const itemType = typeof item.type === "string" ? item.type : void 0;
    if (!itemType) {
      errors.push(`${itemPrefix}: type is required`);
    } else if (!["custom", "page", "post", "taxonomy", "collection"].includes(itemType)) {
      errors.push(
        `${itemPrefix}.type: must be "custom", "page", "post", "taxonomy", or "collection"`
      );
    }
    if (itemType === "custom" && !item.url) {
      errors.push(`${itemPrefix}: url is required for custom menu items`);
    }
    if ((itemType === "page" || itemType === "post") && !item.ref) {
      errors.push(`${itemPrefix}: ref is required for page/post menu items`);
    }
    if (Array.isArray(item.children)) {
      validateMenuItems(item.children, itemPrefix, errors);
    }
  }
}
function validateMenuItemRefs(items, contentIds, warnings) {
  for (const item of items) {
    if ((item.type === "page" || item.type === "post") && item.ref) {
      if (!contentIds.has(item.ref)) {
        warnings.push(`Menu item references content "${item.ref}" which is not in the seed file`);
      }
    }
    if (item.children) {
      validateMenuItemRefs(item.children, contentIds, warnings);
    }
  }
}
const FILE_EXTENSION_PATTERN = /\.([a-z0-9]+)(?:\?|$)/i;
const EXTENSION_PATTERN = /\.[^.]+$/;
const QUERY_PARAM_PATTERN = /\?.*$/;
const SANITIZE_PATTERN = /[^a-zA-Z0-9_-]/g;
const MULTIPLE_HYPHENS_PATTERN = /-+/g;
async function applySeed(db, seed, options = {}) {
  const validation = validateSeed(seed);
  if (!validation.valid) {
    throw new Error(`Invalid seed file:
${validation.errors.join("\n")}`);
  }
  const {
    includeContent = false,
    storage,
    skipMediaDownload = false,
    onConflict = "skip"
  } = options;
  const result = {
    collections: { created: 0, skipped: 0, updated: 0 },
    fields: { created: 0, skipped: 0, updated: 0 },
    taxonomies: { created: 0, terms: 0 },
    bylines: { created: 0, skipped: 0, updated: 0 },
    menus: { created: 0, items: 0 },
    redirects: { created: 0, skipped: 0, updated: 0 },
    widgetAreas: { created: 0, widgets: 0 },
    sections: { created: 0, skipped: 0, updated: 0 },
    settings: { applied: 0 },
    content: { created: 0, skipped: 0, updated: 0 },
    media: { created: 0, skipped: 0 }
  };
  const mediaContext = {
    db,
    storage: storage ?? null,
    skipMediaDownload,
    mediaCache: /* @__PURE__ */ new Map()
    // Cache downloaded media by URL to avoid re-downloading
  };
  const seedIdMap = /* @__PURE__ */ new Map();
  const seedBylineIdMap = /* @__PURE__ */ new Map();
  if (seed.settings) {
    await setSiteSettings(seed.settings, db);
    result.settings.applied = Object.keys(seed.settings).length;
  }
  if (seed.collections) {
    const registry = new SchemaRegistry(db);
    for (const collection of seed.collections) {
      const existing = await registry.getCollection(collection.slug);
      if (existing) {
        if (onConflict === "error") {
          throw new Error(`Conflict: collection "${collection.slug}" already exists`);
        }
        if (onConflict === "update") {
          await registry.updateCollection(collection.slug, {
            label: collection.label,
            labelSingular: collection.labelSingular,
            description: collection.description,
            icon: collection.icon,
            supports: collection.supports || [],
            urlPattern: collection.urlPattern,
            commentsEnabled: collection.commentsEnabled
          });
          result.collections.updated++;
          for (const field of collection.fields) {
            const existingField = await registry.getField(collection.slug, field.slug);
            if (existingField) {
              await registry.updateField(collection.slug, field.slug, {
                label: field.label,
                required: field.required || false,
                unique: field.unique || false,
                searchable: field.searchable || false,
                defaultValue: field.defaultValue,
                validation: field.validation,
                widget: field.widget,
                options: field.options
              });
              result.fields.updated++;
            } else {
              await registry.createField(collection.slug, {
                slug: field.slug,
                label: field.label,
                type: field.type,
                required: field.required || false,
                unique: field.unique || false,
                searchable: field.searchable || false,
                defaultValue: field.defaultValue,
                validation: field.validation,
                widget: field.widget,
                options: field.options
              });
              result.fields.created++;
            }
          }
          continue;
        }
        result.collections.skipped++;
        result.fields.skipped += collection.fields.length;
        continue;
      }
      await registry.createCollection({
        slug: collection.slug,
        label: collection.label,
        labelSingular: collection.labelSingular,
        description: collection.description,
        icon: collection.icon,
        supports: collection.supports || [],
        source: "seed",
        urlPattern: collection.urlPattern,
        commentsEnabled: collection.commentsEnabled
      });
      result.collections.created++;
      for (const field of collection.fields) {
        await registry.createField(collection.slug, {
          slug: field.slug,
          label: field.label,
          type: field.type,
          required: field.required || false,
          unique: field.unique || false,
          searchable: field.searchable || false,
          defaultValue: field.defaultValue,
          validation: field.validation,
          widget: field.widget,
          options: field.options
        });
        result.fields.created++;
      }
    }
  }
  if (seed.taxonomies) {
    for (const taxonomy of seed.taxonomies) {
      const existingDef = await db.selectFrom("_emdash_taxonomy_defs").selectAll().where("name", "=", taxonomy.name).executeTakeFirst();
      if (existingDef) {
        if (onConflict === "error") {
          throw new Error(`Conflict: taxonomy "${taxonomy.name}" already exists`);
        }
        if (onConflict === "update") {
          await db.updateTable("_emdash_taxonomy_defs").set({
            label: taxonomy.label,
            label_singular: taxonomy.labelSingular ?? null,
            hierarchical: taxonomy.hierarchical ? 1 : 0,
            collections: JSON.stringify(taxonomy.collections)
          }).where("id", "=", existingDef.id).execute();
        }
      } else {
        await db.insertInto("_emdash_taxonomy_defs").values({
          id: ulid(),
          name: taxonomy.name,
          label: taxonomy.label,
          label_singular: taxonomy.labelSingular ?? null,
          hierarchical: taxonomy.hierarchical ? 1 : 0,
          collections: JSON.stringify(taxonomy.collections)
        }).execute();
        result.taxonomies.created++;
      }
      if (taxonomy.terms && taxonomy.terms.length > 0) {
        const termRepo = new TaxonomyRepository(db);
        if (taxonomy.hierarchical) {
          await applyHierarchicalTerms(termRepo, taxonomy.name, taxonomy.terms, result, onConflict);
        } else {
          for (const term of taxonomy.terms) {
            const existing = await termRepo.findBySlug(taxonomy.name, term.slug);
            if (existing) {
              if (onConflict === "error") {
                throw new Error(
                  `Conflict: taxonomy term "${term.slug}" in "${taxonomy.name}" already exists`
                );
              }
              if (onConflict === "update") {
                await termRepo.update(existing.id, {
                  label: term.label,
                  data: term.description ? { description: term.description } : {}
                });
                result.taxonomies.terms++;
              }
            } else {
              await termRepo.create({
                name: taxonomy.name,
                slug: term.slug,
                label: term.label,
                data: term.description ? { description: term.description } : void 0
              });
              result.taxonomies.terms++;
            }
          }
        }
      }
    }
  }
  if (seed.bylines) {
    const bylineRepo = new BylineRepository(db);
    for (const byline of seed.bylines) {
      const existing = await bylineRepo.findBySlug(byline.slug);
      if (existing) {
        if (onConflict === "error") {
          throw new Error(`Conflict: byline "${byline.slug}" already exists`);
        }
        if (onConflict === "update") {
          await bylineRepo.update(existing.id, {
            displayName: byline.displayName,
            bio: byline.bio ?? null,
            websiteUrl: byline.websiteUrl ?? null,
            isGuest: byline.isGuest
          });
          seedBylineIdMap.set(byline.id, existing.id);
          result.bylines.updated++;
          continue;
        }
        seedBylineIdMap.set(byline.id, existing.id);
        result.bylines.skipped++;
        continue;
      }
      const created = await bylineRepo.create({
        slug: byline.slug,
        displayName: byline.displayName,
        bio: byline.bio ?? null,
        websiteUrl: byline.websiteUrl ?? null,
        isGuest: byline.isGuest
      });
      seedBylineIdMap.set(byline.id, created.id);
      result.bylines.created++;
    }
  }
  if (includeContent && seed.content) {
    const contentRepo = new ContentRepository(db);
    const bylineRepo = new BylineRepository(db);
    for (const [collectionSlug, entries] of Object.entries(seed.content)) {
      for (const entry of entries) {
        const existing = await contentRepo.findBySlug(collectionSlug, entry.slug, entry.locale);
        if (existing) {
          if (onConflict === "error") {
            throw new Error(
              `Conflict: content "${entry.slug}" in "${collectionSlug}" already exists`
            );
          }
          if (onConflict === "update") {
            const resolvedData2 = await resolveReferences(
              entry.data,
              seedIdMap,
              mediaContext,
              result
            );
            const status2 = entry.status || "published";
            await contentRepo.update(collectionSlug, existing.id, {
              status: status2,
              data: resolvedData2
            });
            seedIdMap.set(entry.id, existing.id);
            result.content.updated++;
            await applyContentBylines(
              bylineRepo,
              collectionSlug,
              existing.id,
              entry,
              seedBylineIdMap,
              true
            );
            await applyContentTaxonomies(db, collectionSlug, existing.id, entry, true);
            continue;
          }
          result.content.skipped++;
          seedIdMap.set(entry.id, existing.id);
          continue;
        }
        const resolvedData = await resolveReferences(entry.data, seedIdMap, mediaContext, result);
        let translationOf;
        if (entry.translationOf) {
          const sourceId = seedIdMap.get(entry.translationOf);
          if (!sourceId) {
            console.warn(
              `content.${collectionSlug}: translationOf "${entry.translationOf}" not found (not yet created or missing). Skipping translation link.`
            );
          } else {
            translationOf = sourceId;
          }
        }
        const status = entry.status || "published";
        const created = await contentRepo.create({
          type: collectionSlug,
          slug: entry.slug,
          status,
          data: resolvedData,
          locale: entry.locale,
          translationOf,
          // Set published_at for published content so RSS/Archives work correctly
          publishedAt: status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null
        });
        seedIdMap.set(entry.id, created.id);
        result.content.created++;
        await applyContentBylines(bylineRepo, collectionSlug, created.id, entry, seedBylineIdMap);
        await applyContentTaxonomies(db, collectionSlug, created.id, entry, false);
      }
    }
  }
  if (seed.menus) {
    for (const menu of seed.menus) {
      const existingMenu = await db.selectFrom("_emdash_menus").selectAll().where("name", "=", menu.name).executeTakeFirst();
      let menuId;
      if (existingMenu) {
        menuId = existingMenu.id;
        await db.deleteFrom("_emdash_menu_items").where("menu_id", "=", menuId).execute();
      } else {
        menuId = ulid();
        await db.insertInto("_emdash_menus").values({
          id: menuId,
          name: menu.name,
          label: menu.label,
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).execute();
        result.menus.created++;
      }
      const itemCount = await applyMenuItems(
        db,
        menuId,
        menu.items,
        null,
        // parent_id
        0,
        // sort_order
        seedIdMap
      );
      result.menus.items += itemCount;
    }
  }
  if (seed.redirects) {
    const redirectRepo = new RedirectRepository(db);
    for (const redirect of seed.redirects) {
      const existing = await redirectRepo.findBySource(redirect.source);
      if (existing) {
        if (onConflict === "error") {
          throw new Error(`Conflict: redirect "${redirect.source}" already exists`);
        }
        if (onConflict === "update") {
          await redirectRepo.update(existing.id, {
            destination: redirect.destination,
            type: redirect.type,
            enabled: redirect.enabled,
            groupName: redirect.groupName
          });
          result.redirects.updated++;
          continue;
        }
        result.redirects.skipped++;
        continue;
      }
      await redirectRepo.create({
        source: redirect.source,
        destination: redirect.destination,
        type: redirect.type,
        enabled: redirect.enabled,
        groupName: redirect.groupName
      });
      result.redirects.created++;
    }
  }
  if (seed.widgetAreas) {
    for (const area of seed.widgetAreas) {
      const existingArea = await db.selectFrom("_emdash_widget_areas").selectAll().where("name", "=", area.name).executeTakeFirst();
      let areaId;
      if (existingArea) {
        areaId = existingArea.id;
        await db.deleteFrom("_emdash_widgets").where("area_id", "=", areaId).execute();
      } else {
        areaId = ulid();
        await db.insertInto("_emdash_widget_areas").values({
          id: areaId,
          name: area.name,
          label: area.label,
          description: area.description ?? null
        }).execute();
        result.widgetAreas.created++;
      }
      for (let i = 0; i < area.widgets.length; i++) {
        const widget = area.widgets[i];
        await applyWidget(db, areaId, widget, i);
        result.widgetAreas.widgets++;
      }
    }
  }
  if (seed.sections) {
    for (const section of seed.sections) {
      const existing = await db.selectFrom("_emdash_sections").select("id").where("slug", "=", section.slug).executeTakeFirst();
      if (existing) {
        if (onConflict === "error") {
          throw new Error(`Conflict: section "${section.slug}" already exists`);
        }
        if (onConflict === "update") {
          await db.updateTable("_emdash_sections").set({
            title: section.title,
            description: section.description ?? null,
            keywords: section.keywords ? JSON.stringify(section.keywords) : null,
            content: JSON.stringify(section.content),
            source: section.source || "theme",
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          }).where("id", "=", existing.id).execute();
          result.sections.updated++;
          continue;
        }
        result.sections.skipped++;
        continue;
      }
      const id = ulid();
      const now = (/* @__PURE__ */ new Date()).toISOString();
      await db.insertInto("_emdash_sections").values({
        id,
        slug: section.slug,
        title: section.title,
        description: section.description ?? null,
        keywords: section.keywords ? JSON.stringify(section.keywords) : null,
        content: JSON.stringify(section.content),
        preview_media_id: null,
        source: section.source || "theme",
        theme_id: section.source === "theme" ? section.slug : null,
        created_at: now,
        updated_at: now
      }).execute();
      result.sections.created++;
    }
  }
  if (seed.collections) {
    const ftsManager = new FTSManager(db);
    for (const collection of seed.collections) {
      if (collection.supports?.includes("search")) {
        const searchableFields = await ftsManager.getSearchableFields(collection.slug);
        if (searchableFields.length > 0) {
          try {
            await ftsManager.enableSearch(collection.slug);
          } catch (err) {
            console.warn(`Failed to enable search for ${collection.slug}:`, err);
          }
        }
      }
    }
  }
  return result;
}
async function applyHierarchicalTerms(termRepo, taxonomyName, terms, result, onConflict = "skip") {
  const slugToId = /* @__PURE__ */ new Map();
  let remaining = [...terms];
  let maxPasses = 10;
  while (remaining.length > 0 && maxPasses > 0) {
    const processedThisPass = [];
    for (const term of remaining) {
      if (!term.parent || slugToId.has(term.parent)) {
        const parentId = term.parent ? slugToId.get(term.parent) : void 0;
        const existing = await termRepo.findBySlug(taxonomyName, term.slug);
        if (existing) {
          if (onConflict === "error") {
            throw new Error(
              `Conflict: taxonomy term "${term.slug}" in "${taxonomyName}" already exists`
            );
          }
          if (onConflict === "update") {
            await termRepo.update(existing.id, {
              label: term.label,
              parentId,
              data: term.description ? { description: term.description } : {}
            });
            result.taxonomies.terms++;
          }
          slugToId.set(term.slug, existing.id);
        } else {
          const created = await termRepo.create({
            name: taxonomyName,
            slug: term.slug,
            label: term.label,
            parentId,
            data: term.description ? { description: term.description } : void 0
          });
          slugToId.set(term.slug, created.id);
          result.taxonomies.terms++;
        }
        processedThisPass.push(term.slug);
      }
    }
    remaining = remaining.filter((t) => !processedThisPass.includes(t.slug));
    maxPasses--;
  }
  if (remaining.length > 0) {
    console.warn(`Could not process ${remaining.length} terms due to missing parents`);
  }
}
async function applyContentBylines(bylineRepo, collectionSlug, contentId, entry, seedBylineIdMap, isUpdate = false) {
  if (!entry.bylines || entry.bylines.length === 0) {
    if (isUpdate) {
      await bylineRepo.setContentBylines(collectionSlug, contentId, []);
    }
    return;
  }
  const credits = entry.bylines.map((credit) => {
    const bylineId = seedBylineIdMap.get(credit.byline);
    if (!bylineId) return null;
    return {
      bylineId,
      roleLabel: credit.roleLabel ?? null
    };
  }).filter((credit) => Boolean(credit));
  if (credits.length !== entry.bylines.length) {
    console.warn(
      `content.${collectionSlug}.${entry.slug}: one or more byline refs could not be resolved`
    );
  }
  if (credits.length > 0 || isUpdate) {
    await bylineRepo.setContentBylines(collectionSlug, contentId, credits);
  }
}
async function applyContentTaxonomies(db, collectionSlug, contentId, entry, isUpdate) {
  if (isUpdate) {
    await db.deleteFrom("content_taxonomies").where("collection", "=", collectionSlug).where("entry_id", "=", contentId).execute();
  }
  if (!entry.taxonomies) return;
  for (const [taxonomyName, termSlugs] of Object.entries(entry.taxonomies)) {
    const termRepo = new TaxonomyRepository(db);
    for (const termSlug of termSlugs) {
      const term = await termRepo.findBySlug(taxonomyName, termSlug);
      if (term) {
        await termRepo.attachToEntry(collectionSlug, contentId, term.id);
      }
    }
  }
}
async function applyMenuItems(db, menuId, items, parentId, startOrder, seedIdMap) {
  let count = 0;
  let order = startOrder;
  for (const item of items) {
    const itemId = ulid();
    let referenceId = null;
    let referenceCollection = null;
    if (item.type === "page" || item.type === "post") {
      if (item.ref && seedIdMap.has(item.ref)) {
        referenceId = seedIdMap.get(item.ref);
        referenceCollection = item.collection || `${item.type}s`;
      }
    }
    await db.insertInto("_emdash_menu_items").values({
      id: itemId,
      menu_id: menuId,
      parent_id: parentId,
      sort_order: order,
      type: item.type,
      reference_collection: referenceCollection,
      reference_id: referenceId,
      custom_url: item.url ?? null,
      label: item.label || "",
      title_attr: item.titleAttr ?? null,
      target: item.target ?? null,
      css_classes: item.cssClasses ?? null,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }).execute();
    count++;
    order++;
    if (item.children && item.children.length > 0) {
      const childCount = await applyMenuItems(db, menuId, item.children, itemId, 0, seedIdMap);
      count += childCount;
    }
  }
  return count;
}
async function applyWidget(db, areaId, widget, sortOrder) {
  await db.insertInto("_emdash_widgets").values({
    id: ulid(),
    area_id: areaId,
    sort_order: sortOrder,
    type: widget.type,
    title: widget.title ?? null,
    content: widget.content ? JSON.stringify(widget.content) : null,
    menu_name: widget.menuName ?? null,
    component_id: widget.componentId ?? null,
    component_props: widget.props ? JSON.stringify(widget.props) : null
  }).execute();
}
function isSeedMediaReference(value) {
  if (typeof value !== "object" || value === null || !("$media" in value)) {
    return false;
  }
  const media = value.$media;
  return typeof media === "object" && media !== null && "url" in media && typeof media.url === "string";
}
async function resolveReferences(data, seedIdMap, mediaContext, result) {
  const resolved = {};
  for (const [key, value] of Object.entries(data)) {
    resolved[key] = await resolveValue(value, seedIdMap, mediaContext, result);
  }
  return resolved;
}
async function resolveValue(value, seedIdMap, mediaContext, result) {
  if (typeof value === "string" && value.startsWith("$ref:")) {
    const seedId = value.slice(5);
    return seedIdMap.get(seedId) ?? value;
  }
  if (isSeedMediaReference(value)) {
    return resolveMedia(value, mediaContext, result);
  }
  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => resolveValue(item, seedIdMap, mediaContext, result)));
  }
  if (typeof value === "object" && value !== null) {
    const resolved = {};
    for (const [k, v] of Object.entries(value)) {
      resolved[k] = await resolveValue(v, seedIdMap, mediaContext, result);
    }
    return resolved;
  }
  return value;
}
async function resolveMedia(ref, ctx, result) {
  const { url, alt, filename, caption } = ref.$media;
  const cached = ctx.mediaCache.get(url);
  if (cached) {
    result.media.skipped++;
    return { ...cached, alt: alt ?? cached.alt };
  }
  if (ctx.skipMediaDownload) {
    const mediaValue = {
      provider: "external",
      id: ulid(),
      src: url,
      alt: alt ?? void 0,
      filename: filename ?? void 0
    };
    ctx.mediaCache.set(url, mediaValue);
    result.media.created++;
    return mediaValue;
  }
  if (!ctx.storage) {
    console.warn(`Skipping $media reference (no storage configured): ${url}`);
    result.media.skipped++;
    return null;
  }
  try {
    validateExternalUrl(url);
    console.log(`  📥 Downloading: ${url}`);
    const response = await ssrfSafeFetch(url, {
      headers: {
        // Some services like Unsplash require a user-agent
        "User-Agent": "EmDash-CMS/1.0"
      }
    });
    if (!response.ok) {
      console.warn(`  ⚠️ Failed to download ${url}: ${response.status}`);
      result.media.skipped++;
      return null;
    }
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const ext = getExtensionFromContentType(contentType) || getExtensionFromUrl(url) || ".bin";
    const id = ulid();
    const finalFilename = filename || generateFilename(url, ext);
    const storageKey = `${id}${ext}`;
    const arrayBuffer = await response.arrayBuffer();
    const body = new Uint8Array(arrayBuffer);
    let width;
    let height;
    if (contentType.startsWith("image/")) {
      const dimensions = getImageDimensions(body);
      width = dimensions?.width;
      height = dimensions?.height;
    }
    await ctx.storage.upload({
      key: storageKey,
      body,
      contentType
    });
    const mediaRepo = new MediaRepository(ctx.db);
    await mediaRepo.create({
      filename: finalFilename,
      mimeType: contentType,
      size: body.length,
      width,
      height,
      alt,
      caption,
      storageKey,
      status: "ready"
    });
    const mediaValue = {
      provider: "local",
      id,
      alt: alt ?? void 0,
      width,
      height,
      mimeType: contentType,
      filename: finalFilename,
      meta: { storageKey }
    };
    ctx.mediaCache.set(url, mediaValue);
    result.media.created++;
    console.log(`  ✅ Uploaded: ${finalFilename}`);
    return mediaValue;
  } catch (error) {
    console.warn(
      `  ⚠️ Error processing $media ${url}:`,
      error instanceof Error ? error.message : error
    );
    result.media.skipped++;
    return null;
  }
}
function getExtensionFromContentType(contentType) {
  const baseMime = contentType.split(";")[0].trim();
  const ext = mime.getExtension(baseMime);
  return ext ? `.${ext}` : null;
}
function getExtensionFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(FILE_EXTENSION_PATTERN);
    return match ? `.${match[1]}` : null;
  } catch {
    return null;
  }
}
function generateFilename(url, ext) {
  try {
    const pathname = new URL(url).pathname;
    const basename = pathname.split("/").pop() || "media";
    const name = basename.replace(EXTENSION_PATTERN, "").replace(QUERY_PARAM_PATTERN, "");
    const sanitized = name.replace(SANITIZE_PATTERN, "-").replace(MULTIPLE_HYPHENS_PATTERN, "-");
    return `${sanitized || "media"}${ext}`;
  } catch {
    return `media${ext}`;
  }
}
function getImageDimensions(buffer) {
  try {
    const result = imageSize(buffer);
    if (result.width != null && result.height != null) {
      return { width: result.width, height: result.height };
    }
    return null;
  } catch {
    return null;
  }
}
const prerender = false;
const POST = async ({ request, locals }) => {
  const { emdash } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  try {
    try {
      const options = new OptionsRepository(emdash.db);
      const setupComplete = await options.get("emdash:setup_complete");
      if (setupComplete === true || setupComplete === "true") {
        return apiError("ALREADY_CONFIGURED", "Setup has already been completed", 409);
      }
    } catch {
    }
    const body = await parseBody(request, setupBody);
    if (isParseError(body)) return body;
    try {
      await runMigrations(emdash.db);
    } catch (error) {
      return handleError(error, "Failed to run database migrations", "MIGRATION_ERROR");
    }
    const seed = await loadSeed();
    seed.settings = {
      ...seed.settings,
      title: body.title,
      tagline: body.tagline
    };
    const validation = validateSeed(seed);
    if (!validation.valid) {
      return apiError("INVALID_SEED", `Invalid seed file: ${validation.errors.join(", ")}`, 400);
    }
    let result;
    try {
      result = await applySeed(emdash.db, seed, {
        includeContent: body.includeContent,
        onConflict: "skip",
        storage: emdash.storage ?? void 0
      });
    } catch (error) {
      return handleError(error, "Failed to apply seed", "SEED_ERROR");
    }
    const authMode = getAuthMode(emdash.config);
    const useExternalAuth = authMode.type === "external";
    try {
      const options = new OptionsRepository(emdash.db);
      const siteUrl = new URL(request.url).origin;
      await options.set("emdash:site_url", siteUrl);
      if (useExternalAuth) {
        await options.set("emdash:setup_complete", true);
        await options.set("emdash:site_title", body.title);
        if (body.tagline) {
          await options.set("emdash:site_tagline", body.tagline);
        }
      } else {
        await options.set("emdash:setup_state", {
          step: "site_complete",
          title: body.title,
          tagline: body.tagline
        });
      }
    } catch (error) {
      console.error("Failed to save setup state:", error);
    }
    return apiSuccess({
      success: true,
      // In external auth mode, setup is complete - redirect to admin
      setupComplete: useExternalAuth,
      result
    });
  } catch (error) {
    return handleError(error, "Setup failed", "SETUP_ERROR");
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
