globalThis.process ??= {};
globalThis.process.env ??= {};
import { s as sql } from "./sql_DV5B95Nm.mjs";
import { B as BylineRepository } from "./byline_DNpRXvlR.mjs";
import { v as validateIdentifier } from "./validate_Dvrjbe51.mjs";
import { g as getDb } from "./Base_CV0pa2kI.mjs";
async function getBylinesForEntries(collection, entryIds) {
  validateIdentifier(collection, "collection");
  const result = /* @__PURE__ */ new Map();
  for (const id of entryIds) {
    result.set(id, []);
  }
  if (entryIds.length === 0) {
    return result;
  }
  const db = await getDb();
  const repo = new BylineRepository(db);
  const bylinesMap = await repo.getContentBylinesMany(collection, entryIds);
  const fallbackEntryIds = [];
  const needsFallback = /* @__PURE__ */ new Map();
  for (const id of entryIds) {
    if (!bylinesMap.has(id)) {
      fallbackEntryIds.push(id);
    }
  }
  if (fallbackEntryIds.length > 0) {
    const authorMap = await getAuthorIds(db, collection, fallbackEntryIds);
    for (const [entryId, authorId] of authorMap) {
      needsFallback.set(entryId, authorId);
    }
  }
  const uniqueAuthorIds = [...new Set(needsFallback.values())];
  const authorBylineMap = await repo.findByUserIds(uniqueAuthorIds);
  for (const id of entryIds) {
    const explicit = bylinesMap.get(id);
    if (explicit && explicit.length > 0) {
      result.set(
        id,
        explicit.map((c) => ({ ...c, source: "explicit" }))
      );
      continue;
    }
    const authorId = needsFallback.get(id);
    if (authorId) {
      const fallback = authorBylineMap.get(authorId);
      if (fallback) {
        result.set(id, [{ byline: fallback, sortOrder: 0, roleLabel: null, source: "inferred" }]);
        continue;
      }
    }
  }
  return result;
}
async function getAuthorIds(db, collection, entryIds) {
  const tableName = `ec_${collection}`;
  validateIdentifier(tableName, "content table");
  const result = await sql`
		SELECT id, author_id FROM ${sql.ref(tableName)}
		WHERE id IN (${sql.join(entryIds.map((id) => sql`${id}`))})
	`.execute(db);
  const map = /* @__PURE__ */ new Map();
  for (const row of result.rows) {
    if (row.author_id) {
      map.set(row.id, row.author_id);
    }
  }
  return map;
}
export {
  getBylinesForEntries
};
