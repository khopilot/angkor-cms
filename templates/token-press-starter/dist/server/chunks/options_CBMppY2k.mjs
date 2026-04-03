globalThis.process ??= {};
globalThis.process.env ??= {};
class OptionsRepository {
  constructor(db) {
    this.db = db;
  }
  /**
   * Get an option value
   */
  async get(name) {
    const row = await this.db.selectFrom("options").select("value").where("name", "=", name).executeTakeFirst();
    if (!row) return null;
    return JSON.parse(row.value);
  }
  /**
   * Get an option value with a default
   */
  async getOrDefault(name, defaultValue) {
    const value = await this.get(name);
    return value ?? defaultValue;
  }
  /**
   * Set an option value (creates or updates)
   */
  async set(name, value) {
    const row = {
      name,
      value: JSON.stringify(value)
    };
    await this.db.insertInto("options").values(row).onConflict((oc) => oc.column("name").doUpdateSet({ value: row.value })).execute();
  }
  /**
   * Delete an option
   */
  async delete(name) {
    const result = await this.db.deleteFrom("options").where("name", "=", name).executeTakeFirst();
    return (result.numDeletedRows ?? 0) > 0;
  }
  /**
   * Check if an option exists
   */
  async exists(name) {
    const row = await this.db.selectFrom("options").select("name").where("name", "=", name).executeTakeFirst();
    return !!row;
  }
  /**
   * Get multiple options at once
   */
  async getMany(names) {
    if (names.length === 0) return /* @__PURE__ */ new Map();
    const rows = await this.db.selectFrom("options").select(["name", "value"]).where("name", "in", names).execute();
    const result = /* @__PURE__ */ new Map();
    for (const row of rows) {
      result.set(row.name, JSON.parse(row.value));
    }
    return result;
  }
  /**
   * Set multiple options at once
   */
  async setMany(options) {
    const entries = Object.entries(options);
    if (entries.length === 0) return;
    for (const [name, value] of entries) {
      await this.set(name, value);
    }
  }
  /**
   * Get all options (use sparingly)
   */
  async getAll() {
    const rows = await this.db.selectFrom("options").select(["name", "value"]).execute();
    const result = /* @__PURE__ */ new Map();
    for (const row of rows) {
      result.set(row.name, JSON.parse(row.value));
    }
    return result;
  }
  /**
   * Get all options matching a prefix
   */
  async getByPrefix(prefix) {
    const rows = await this.db.selectFrom("options").select(["name", "value"]).where("name", "like", `${prefix}%`).execute();
    const result = /* @__PURE__ */ new Map();
    for (const row of rows) {
      result.set(row.name, JSON.parse(row.value));
    }
    return result;
  }
  /**
   * Delete all options matching a prefix
   */
  async deleteByPrefix(prefix) {
    const result = await this.db.deleteFrom("options").where("name", "like", `${prefix}%`).executeTakeFirst();
    return Number(result.numDeletedRows ?? 0);
  }
}
export {
  OptionsRepository as O
};
