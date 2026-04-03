globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { a as apiError, u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { s as sql } from "./sql_DV5B95Nm.mjs";
import { C as ContentRepository } from "./content_jaug25qM.mjs";
import { M as MediaRepository } from "./media_CNuKgdRs.mjs";
import { u as ulid } from "./index_BQQDygAS.mjs";
import { d as decodeCursor, e as encodeCursor } from "./types_BoKxFuUW.mjs";
import { v as validateIdentifier } from "./validate_Dvrjbe51.mjs";
class UserRepository {
  constructor(db) {
    this.db = db;
  }
  /**
   * Create a new user
   */
  async create(input) {
    const id = ulid();
    const row = {
      id,
      email: input.email.toLowerCase(),
      name: input.name ?? null,
      role: UserRepository.resolveRole(input.role ?? 10),
      avatar_url: input.avatarUrl ?? null,
      email_verified: 0,
      data: input.data ? JSON.stringify(input.data) : null
    };
    await this.db.insertInto("users").values(row).execute();
    const user = await this.findById(id);
    if (!user) {
      throw new Error("Failed to create user");
    }
    return user;
  }
  /**
   * Find user by ID
   */
  async findById(id) {
    const row = await this.db.selectFrom("users").selectAll().where("id", "=", id).executeTakeFirst();
    return row ? this.rowToUser(row) : null;
  }
  /**
   * Find user by email (case-insensitive)
   */
  async findByEmail(email) {
    const row = await this.db.selectFrom("users").selectAll().where("email", "=", email.toLowerCase()).executeTakeFirst();
    return row ? this.rowToUser(row) : null;
  }
  /**
   * List all users with cursor-based pagination
   */
  async findMany(options = {}) {
    const limit = Math.min(Math.max(1, options.limit || 50), 100);
    let query = this.db.selectFrom("users").selectAll().orderBy("created_at", "desc").orderBy("id", "desc").limit(limit + 1);
    if (options.role !== void 0) {
      query = query.where("role", "=", UserRepository.resolveRole(options.role));
    }
    if (options.cursor) {
      const decoded = decodeCursor(options.cursor);
      if (decoded) {
        query = query.where(
          (eb) => eb.or([
            eb("created_at", "<", decoded.orderValue),
            eb.and([eb("created_at", "=", decoded.orderValue), eb("id", "<", decoded.id)])
          ])
        );
      }
    }
    const rows = await query.execute();
    const items = rows.slice(0, limit).map((row) => this.rowToUser(row));
    const result = { items };
    if (rows.length > limit && items.length > 0) {
      const last = items.at(-1);
      result.nextCursor = encodeCursor(last.createdAt, last.id);
    }
    return result;
  }
  /**
   * Update a user
   */
  async update(id, input) {
    const existing = await this.findById(id);
    if (!existing) return null;
    const updates = {};
    if (input.name !== void 0) updates.name = input.name;
    if (input.role !== void 0) updates.role = UserRepository.resolveRole(input.role);
    if (input.avatarUrl !== void 0) updates.avatar_url = input.avatarUrl;
    if (input.data !== void 0) updates.data = JSON.stringify(input.data);
    if (Object.keys(updates).length > 0) {
      await this.db.updateTable("users").set(updates).where("id", "=", id).execute();
    }
    return this.findById(id);
  }
  /**
   * Delete a user
   */
  async delete(id) {
    const result = await this.db.deleteFrom("users").where("id", "=", id).executeTakeFirst();
    return (result.numDeletedRows ?? 0) > 0;
  }
  /**
   * Count users
   */
  async count(role) {
    let query = this.db.selectFrom("users").select((eb) => eb.fn.count("id").as("count"));
    if (role !== void 0) {
      query = query.where("role", "=", UserRepository.resolveRole(role));
    }
    const result = await query.executeTakeFirst();
    return Number(result?.count || 0);
  }
  /**
   * Check if email exists
   */
  async emailExists(email) {
    const row = await this.db.selectFrom("users").select("id").where("email", "=", email.toLowerCase()).executeTakeFirst();
    return !!row;
  }
  /**
   * Convert database row to User object
   */
  rowToUser(row) {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      role: UserRepository.toRole(row.role),
      avatarUrl: row.avatar_url,
      emailVerified: row.email_verified === 1,
      data: row.data ? JSON.parse(row.data) : null,
      createdAt: row.created_at
    };
  }
  /** Map of role name strings to numeric levels */
  static ROLE_NAME_TO_LEVEL = {
    subscriber: 10,
    contributor: 20,
    author: 30,
    editor: 40,
    admin: 50
  };
  /** Valid numeric role levels */
  static VALID_LEVELS = /* @__PURE__ */ new Set([10, 20, 30, 40, 50]);
  /**
   * Resolve a role name or number to a valid numeric UserRole.
   * Accepts both string names ("admin") and numeric levels (50).
   */
  static resolveRole(role) {
    if (typeof role === "string") {
      const level = UserRepository.ROLE_NAME_TO_LEVEL[role];
      if (level === void 0) {
        throw new Error(`Invalid role name: ${role}`);
      }
      return level;
    }
    if (!UserRepository.VALID_LEVELS.has(role)) {
      throw new Error(`Invalid role level: ${role}`);
    }
    return role;
  }
  /**
   * Convert a raw DB integer to a typed UserRole.
   * Falls back to subscriber (10) for unknown values.
   */
  static toRole(level) {
    if (UserRepository.VALID_LEVELS.has(level)) return level;
    return 10;
  }
}
async function handleDashboardStats(db) {
  try {
    const collections = await db.selectFrom("_emdash_collections").select(["slug", "label"]).orderBy("slug", "asc").execute();
    const contentRepo = new ContentRepository(db);
    const collectionStats = await Promise.all(
      collections.map(async (col) => {
        const [total, published, draft] = await Promise.all([
          contentRepo.count(col.slug),
          contentRepo.count(col.slug, { status: "published" }),
          contentRepo.count(col.slug, { status: "draft" })
        ]);
        return {
          slug: col.slug,
          label: col.label,
          total,
          published,
          draft
        };
      })
    );
    const mediaRepo = new MediaRepository(db);
    const userRepo = new UserRepository(db);
    const [mediaCount, userCount] = await Promise.all([mediaRepo.count(), userRepo.count()]);
    const recentItems = await fetchRecentItems(db, collections);
    return {
      success: true,
      data: {
        collections: collectionStats,
        mediaCount,
        userCount,
        recentItems
      }
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return {
      success: false,
      error: {
        code: "DASHBOARD_STATS_ERROR",
        message: "Failed to load dashboard statistics"
      }
    };
  }
}
async function fetchRecentItems(db, collections) {
  if (collections.length === 0) return [];
  const titleFields = await db.selectFrom("_emdash_fields as f").innerJoin("_emdash_collections as c", "c.id", "f.collection_id").select(["c.slug as collection_slug"]).where("f.slug", "=", "title").execute();
  const collectionsWithTitle = new Set(titleFields.map((r) => r.collection_slug));
  const subQueries = collections.map((col) => {
    validateIdentifier(col.slug);
    const table = `ec_${col.slug}`;
    const hasTitle = collectionsWithTitle.has(col.slug);
    const titleExpr = hasTitle ? sql`COALESCE(title, slug, id)` : sql`COALESCE(slug, id)`;
    return sql`
			SELECT * FROM (
				SELECT
					id,
					${sql.lit(col.slug)} AS collection,
					${sql.lit(col.label)} AS collection_label,
					${titleExpr} AS title,
					slug,
					status,
					updated_at,
					author_id
				FROM ${sql.ref(table)}
				WHERE deleted_at IS NULL
				ORDER BY updated_at DESC
				LIMIT 10
			)
		`;
  });
  let combined = subQueries[0];
  for (let i = 1; i < subQueries.length; i++) {
    combined = sql`${combined} UNION ALL ${subQueries[i]}`;
  }
  const result = await sql`
		SELECT * FROM (${combined})
		ORDER BY updated_at DESC
		LIMIT 10
	`.execute(db);
  return result.rows.map((row) => ({
    id: row.id,
    collection: row.collection,
    collectionLabel: row.collection_label,
    title: row.title,
    slug: row.slug,
    status: row.status,
    updatedAt: row.updated_at,
    authorId: row.author_id
  }));
}
const prerender = false;
const GET = async ({ locals }) => {
  const { emdash, user } = locals;
  const denied = requirePerm(user, "content:read");
  if (denied) return denied;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  try {
    const result = await handleDashboardStats(emdash.db);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to load dashboard", "DASHBOARD_ERROR");
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
