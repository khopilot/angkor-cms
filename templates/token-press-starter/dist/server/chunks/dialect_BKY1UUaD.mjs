globalThis.process ??= {};
globalThis.process.env ??= {};
import { s as sql } from "./sql_DV5B95Nm.mjs";
import { env } from "cloudflare:workers";
import { SqliteAdapter, SqliteQueryCompiler, SqliteIntrospector } from "./index_DXU37IUC.mjs";
const DEFAULT_MIGRATION_TABLE = "kysely_migration";
const DEFAULT_MIGRATION_LOCK_TABLE = "kysely_migration_lock";
const SPLIT_PARENS_PATTERN = /[(),]/;
const WHITESPACE_PATTERN = /\s+/;
const QUOTES_PATTERN = /["`]/g;
var D1Introspector = class {
  #db;
  constructor(db) {
    this.#db = db;
  }
  async getSchemas() {
    return [];
  }
  async getTables(options = {}) {
    let query = this.#db.selectFrom("sqlite_master").where("type", "in", ["table", "view"]).where("name", "not like", "sqlite_%").where("name", "not like", "_cf_%").select([
      "name",
      "sql",
      "type"
    ]).orderBy("name");
    if (!options.withInternalKyselyTables) query = query.where("name", "!=", DEFAULT_MIGRATION_TABLE).where("name", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
    const tables = await query.execute();
    const result = [];
    for (const table of tables) {
      const tableName = table.name;
      const tableType = table.type;
      const tableSql = table.sql;
      const columns = await sql`SELECT * FROM pragma_table_info('${sql.raw(tableName)}')`.execute(this.#db);
      let autoIncrementCol = tableSql?.split(SPLIT_PARENS_PATTERN)?.find((it) => it.toLowerCase().includes("autoincrement"))?.trimStart()?.split(WHITESPACE_PATTERN)?.[0]?.replace(QUOTES_PATTERN, "");
      if (!autoIncrementCol) {
        const pkCols = columns.rows.filter((r) => r.pk > 0);
        if (pkCols.length === 1 && pkCols[0].type.toLowerCase() === "integer") autoIncrementCol = pkCols[0].name;
      }
      result.push({
        name: tableName,
        isView: tableType === "view",
        columns: columns.rows.map((col) => ({
          name: col.name,
          dataType: col.type,
          isNullable: !col.notnull,
          isAutoIncrementing: col.name === autoIncrementCol,
          hasDefaultValue: col.dflt_value != null,
          comment: void 0
        }))
      });
    }
    return result;
  }
  async getMetadata(options) {
    return { tables: await this.getTables(options) };
  }
};
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = function(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _D1Dialect_config, _D1Driver_config, _D1Connection_config;
class D1Dialect {
  constructor(config) {
    _D1Dialect_config.set(this, void 0);
    __classPrivateFieldSet(this, _D1Dialect_config, config, "f");
  }
  createAdapter() {
    return new SqliteAdapter();
  }
  createDriver() {
    return new D1Driver(__classPrivateFieldGet(this, _D1Dialect_config, "f"));
  }
  createQueryCompiler() {
    return new SqliteQueryCompiler();
  }
  createIntrospector(db) {
    return new SqliteIntrospector(db);
  }
}
_D1Dialect_config = /* @__PURE__ */ new WeakMap();
class D1Driver {
  constructor(config) {
    _D1Driver_config.set(this, void 0);
    __classPrivateFieldSet(this, _D1Driver_config, config, "f");
  }
  async init() {
  }
  async acquireConnection() {
    return new D1Connection(__classPrivateFieldGet(this, _D1Driver_config, "f"));
  }
  async beginTransaction(conn) {
    return await conn.beginTransaction();
  }
  async commitTransaction(conn) {
    return await conn.commitTransaction();
  }
  async rollbackTransaction(conn) {
    return await conn.rollbackTransaction();
  }
  async releaseConnection(_conn) {
  }
  async destroy() {
  }
}
_D1Driver_config = /* @__PURE__ */ new WeakMap();
class D1Connection {
  //   #transactionClient?: D1Connection
  constructor(config) {
    _D1Connection_config.set(this, void 0);
    __classPrivateFieldSet(this, _D1Connection_config, config, "f");
  }
  async executeQuery(compiledQuery) {
    const results = await __classPrivateFieldGet(this, _D1Connection_config, "f").database.prepare(compiledQuery.sql).bind(...compiledQuery.parameters).all();
    if (results.error) {
      throw new Error(results.error);
    }
    const numAffectedRows = results.meta.changes > 0 ? BigInt(results.meta.changes) : void 0;
    return {
      insertId: results.meta.last_row_id === void 0 || results.meta.last_row_id === null ? void 0 : BigInt(results.meta.last_row_id),
      rows: results?.results || [],
      numAffectedRows,
      // @ts-ignore deprecated in kysely >= 0.23, keep for backward compatibility.
      numUpdatedOrDeletedRows: numAffectedRows
    };
  }
  async beginTransaction() {
    throw new Error("Transactions are not supported yet.");
  }
  async commitTransaction() {
    throw new Error("Transactions are not supported yet.");
  }
  async rollbackTransaction() {
    throw new Error("Transactions are not supported yet.");
  }
  async *streamQuery(_compiledQuery, _chunkSize) {
    throw new Error("D1 Driver does not support streaming");
  }
}
_D1Connection_config = /* @__PURE__ */ new WeakMap();
var EmDashD1Dialect = class extends D1Dialect {
  createIntrospector(db) {
    return new D1Introspector(db);
  }
};
function createDialect$1(config) {
  const db = env[config.binding];
  if (!db) throw new Error(`D1 binding "${config.binding}" not found in environment. Check your wrangler.toml configuration:

[[d1_databases]]
binding = "${config.binding}"
database_name = "your-database-name"
database_id = "your-database-id"`);
  return new EmDashD1Dialect({ database: db });
}
function isSessionEnabled(config) {
  return !!config.session && config.session !== "disabled";
}
function getD1Binding(config) {
  if (!isSessionEnabled(config)) return null;
  return env[config.binding] ?? null;
}
function getDefaultConstraint(config) {
  if (config.session === "primary-first") return "first-primary";
  return "first-unconstrained";
}
function getBookmarkCookieName(config) {
  return config.bookmarkCookie ?? "__ec_d1_bookmark";
}
function createSessionDialect(session) {
  return new EmDashD1Dialect({ database: session });
}
const createDialect = createDialect$1;
export {
  createDialect,
  createSessionDialect,
  getBookmarkCookieName,
  getD1Binding,
  getDefaultConstraint,
  isSessionEnabled
};
