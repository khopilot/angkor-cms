globalThis.process ??= {};
globalThis.process.env ??= {};
import { o as object, k as safeParseAsync, p as date, c as array, s as string } from "./sequence_DzjOVBrG.mjs";
function formatZodError(error) {
  return error.issues.map((issue) => `  **${issue.path.join(".")}**: ${issue.message}`);
}
class LiveCollectionError extends Error {
  constructor(collection, message, cause) {
    super(message);
    this.collection = collection;
    this.message = message;
    this.cause = cause;
    this.name = "LiveCollectionError";
    if (cause?.stack) {
      this.stack = cause.stack;
    }
  }
  static is(error) {
    return error instanceof LiveCollectionError;
  }
}
class LiveEntryNotFoundError extends LiveCollectionError {
  constructor(collection, entryFilter) {
    super(
      collection,
      `Entry ${collection} → ${typeof entryFilter === "string" ? entryFilter : JSON.stringify(entryFilter)} was not found.`
    );
    this.name = "LiveEntryNotFoundError";
  }
  static is(error) {
    return error?.name === "LiveEntryNotFoundError";
  }
}
class LiveCollectionValidationError extends LiveCollectionError {
  constructor(collection, entryId, error) {
    super(
      collection,
      [
        `**${collection} → ${entryId}** data does not match the collection schema.
`,
        ...formatZodError(error),
        ""
      ].join("\n")
    );
    this.name = "LiveCollectionValidationError";
  }
  static is(error) {
    return error?.name === "LiveCollectionValidationError";
  }
}
class LiveCollectionCacheHintError extends LiveCollectionError {
  constructor(collection, entryId, error) {
    super(
      collection,
      [
        `**${String(collection)}${entryId ? ` → ${String(entryId)}` : ""}** returned an invalid cache hint.
`,
        ...formatZodError(error),
        ""
      ].join("\n")
    );
    this.name = "LiveCollectionCacheHintError";
  }
  static is(error) {
    return error?.name === "LiveCollectionCacheHintError";
  }
}
const cacheHintSchema = object({
  tags: array(string()).optional(),
  lastModified: date().optional()
});
async function parseLiveEntry(entry, schema, collection) {
  try {
    const parsed = await safeParseAsync(schema, entry.data);
    if (!parsed.success) {
      return {
        error: new LiveCollectionValidationError(collection, entry.id, parsed.error)
      };
    }
    if (entry.cacheHint) {
      const cacheHint = cacheHintSchema.safeParse(entry.cacheHint);
      if (!cacheHint.success) {
        return {
          error: new LiveCollectionCacheHintError(collection, entry.id, cacheHint.error)
        };
      }
      entry.cacheHint = cacheHint.data;
    }
    return {
      entry: {
        ...entry,
        data: parsed.data
      }
    };
  } catch (error) {
    return {
      error: new LiveCollectionError(
        collection,
        `Unexpected error parsing entry ${entry.id} in collection ${collection}`,
        error
      )
    };
  }
}
function createGetLiveCollection({
  liveCollections: liveCollections2
}) {
  return async function getLiveCollection2(collection, filter) {
    if (!(collection in liveCollections2)) {
      return {
        error: new LiveCollectionError(
          collection,
          `Collection "${collection}" is not a live collection. Use getCollection() instead of getLiveCollection() to load regular content collections.`
        )
      };
    }
    try {
      const context = {
        filter,
        collection
      };
      const response = await liveCollections2[collection].loader?.loadCollection?.(context);
      if (response && "error" in response) {
        return { error: response.error };
      }
      const { schema } = liveCollections2[collection];
      let processedEntries = response.entries;
      if (schema) {
        const entryResults = await Promise.all(
          response.entries.map((entry) => parseLiveEntry(entry, schema, collection))
        );
        for (const result of entryResults) {
          if (result.error) {
            return { error: result.error };
          }
        }
        processedEntries = entryResults.map((result) => result.entry);
      }
      let cacheHint = response.cacheHint;
      if (cacheHint) {
        const cacheHintResult = cacheHintSchema.safeParse(cacheHint);
        if (!cacheHintResult.success) {
          return {
            error: new LiveCollectionCacheHintError(collection, void 0, cacheHintResult.error)
          };
        }
        cacheHint = cacheHintResult.data;
      }
      if (processedEntries.length > 0) {
        const entryTags = /* @__PURE__ */ new Set();
        let latestModified;
        for (const entry of processedEntries) {
          if (entry.cacheHint) {
            if (entry.cacheHint.tags) {
              entry.cacheHint.tags.forEach((tag) => entryTags.add(tag));
            }
            if (entry.cacheHint.lastModified instanceof Date) {
              if (latestModified === void 0 || entry.cacheHint.lastModified > latestModified) {
                latestModified = entry.cacheHint.lastModified;
              }
            }
          }
        }
        if (entryTags.size > 0 || latestModified || cacheHint) {
          const mergedCacheHint = {};
          if (cacheHint?.tags || entryTags.size > 0) {
            mergedCacheHint.tags = [.../* @__PURE__ */ new Set([...cacheHint?.tags || [], ...entryTags])];
          }
          if (cacheHint?.lastModified && latestModified) {
            mergedCacheHint.lastModified = cacheHint.lastModified > latestModified ? cacheHint.lastModified : latestModified;
          } else if (cacheHint?.lastModified || latestModified) {
            mergedCacheHint.lastModified = cacheHint?.lastModified ?? latestModified;
          }
          cacheHint = mergedCacheHint;
        }
      }
      return {
        entries: processedEntries,
        cacheHint
      };
    } catch (error) {
      return {
        error: new LiveCollectionError(
          collection,
          `Unexpected error loading collection ${collection}${error instanceof Error ? `: ${error.message}` : ""}`,
          error
        )
      };
    }
  };
}
function createGetLiveEntry({
  liveCollections: liveCollections2
}) {
  return async function getLiveEntry2(collection, lookup) {
    if (!(collection in liveCollections2)) {
      return {
        error: new LiveCollectionError(
          collection,
          `Collection "${collection}" is not a live collection. Use getCollection() instead of getLiveEntry() to load regular content collections.`
        )
      };
    }
    try {
      const lookupObject = {
        filter: typeof lookup === "string" ? { id: lookup } : lookup,
        collection
      };
      let entry = await liveCollections2[collection].loader?.loadEntry?.(lookupObject);
      if (entry && "error" in entry) {
        return { error: entry.error };
      }
      if (!entry) {
        return {
          error: new LiveEntryNotFoundError(collection, lookup)
        };
      }
      const { schema } = liveCollections2[collection];
      if (schema) {
        const result = await parseLiveEntry(entry, schema, collection);
        if (result.error) {
          return { error: result.error };
        }
        entry = result.entry;
      }
      return {
        entry,
        cacheHint: entry.cacheHint
      };
    } catch (error) {
      return {
        error: new LiveCollectionError(
          collection,
          `Unexpected error loading entry ${collection} → ${typeof lookup === "string" ? lookup : JSON.stringify(lookup)}`,
          error
        )
      };
    }
  };
}
const liveCollections = (await import("./live.config_Dzghh3nd.mjs")).collections;
const getLiveCollection = createGetLiveCollection({
  liveCollections
});
const getLiveEntry = createGetLiveEntry({
  liveCollections
});
export {
  getLiveCollection,
  getLiveEntry
};
