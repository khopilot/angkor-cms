globalThis.process ??= {};
globalThis.process.env ??= {};
import { R as RedirectRepository, i as isPattern, v as validatePattern, a as validateDestinationParams } from "./redirect_DmmKzxFA.mjs";
async function handleRedirectList(db, params) {
  try {
    const repo = new RedirectRepository(db);
    const result = await repo.findMany(params);
    return { success: true, data: result };
  } catch {
    return {
      success: false,
      error: { code: "REDIRECT_LIST_ERROR", message: "Failed to fetch redirects" }
    };
  }
}
async function handleRedirectCreate(db, input) {
  try {
    const repo = new RedirectRepository(db);
    if (input.source === input.destination) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Source and destination must be different"
        }
      };
    }
    const sourceIsPattern = isPattern(input.source);
    if (sourceIsPattern) {
      const patternError = validatePattern(input.source);
      if (patternError) {
        return {
          success: false,
          error: { code: "VALIDATION_ERROR", message: `Invalid source pattern: ${patternError}` }
        };
      }
      const destError = validateDestinationParams(input.source, input.destination);
      if (destError) {
        return {
          success: false,
          error: { code: "VALIDATION_ERROR", message: destError }
        };
      }
    }
    const existing = await repo.findBySource(input.source);
    if (existing) {
      return {
        success: false,
        error: {
          code: "CONFLICT",
          message: `A redirect from "${input.source}" already exists`
        }
      };
    }
    const redirect = await repo.create({
      source: input.source,
      destination: input.destination,
      type: input.type ?? 301,
      isPattern: sourceIsPattern,
      enabled: input.enabled ?? true,
      groupName: input.groupName ?? null
    });
    return { success: true, data: redirect };
  } catch {
    return {
      success: false,
      error: { code: "REDIRECT_CREATE_ERROR", message: "Failed to create redirect" }
    };
  }
}
async function handleRedirectGet(db, id) {
  try {
    const repo = new RedirectRepository(db);
    const redirect = await repo.findById(id);
    if (!redirect) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: `Redirect "${id}" not found` }
      };
    }
    return { success: true, data: redirect };
  } catch {
    return {
      success: false,
      error: { code: "REDIRECT_GET_ERROR", message: "Failed to fetch redirect" }
    };
  }
}
async function handleRedirectUpdate(db, id, input) {
  try {
    const repo = new RedirectRepository(db);
    const existing = await repo.findById(id);
    if (!existing) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: `Redirect "${id}" not found` }
      };
    }
    const newSource = input.source ?? existing.source;
    const newDest = input.destination ?? existing.destination;
    if (newSource === newDest) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Source and destination must be different"
        }
      };
    }
    if (input.source !== void 0) {
      const sourceIsPattern = isPattern(input.source);
      if (sourceIsPattern) {
        const patternError = validatePattern(input.source);
        if (patternError) {
          return {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: `Invalid source pattern: ${patternError}`
            }
          };
        }
      }
      const dup = await repo.findBySource(input.source);
      if (dup && dup.id !== id) {
        return {
          success: false,
          error: {
            code: "CONFLICT",
            message: `A redirect from "${input.source}" already exists`
          }
        };
      }
    }
    if (isPattern(newSource)) {
      const destError = validateDestinationParams(newSource, newDest);
      if (destError) {
        return {
          success: false,
          error: { code: "VALIDATION_ERROR", message: destError }
        };
      }
    }
    const updated = await repo.update(id, {
      source: input.source,
      destination: input.destination,
      type: input.type,
      enabled: input.enabled,
      groupName: input.groupName
    });
    if (!updated) {
      return {
        success: false,
        error: { code: "REDIRECT_UPDATE_ERROR", message: "Failed to update redirect" }
      };
    }
    return { success: true, data: updated };
  } catch {
    return {
      success: false,
      error: { code: "REDIRECT_UPDATE_ERROR", message: "Failed to update redirect" }
    };
  }
}
async function handleRedirectDelete(db, id) {
  try {
    const repo = new RedirectRepository(db);
    const deleted = await repo.delete(id);
    if (!deleted) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: `Redirect "${id}" not found` }
      };
    }
    return { success: true, data: { deleted: true } };
  } catch {
    return {
      success: false,
      error: { code: "REDIRECT_DELETE_ERROR", message: "Failed to delete redirect" }
    };
  }
}
async function handleNotFoundList(db, params) {
  try {
    const repo = new RedirectRepository(db);
    const result = await repo.find404s(params);
    return { success: true, data: result };
  } catch {
    return {
      success: false,
      error: { code: "NOT_FOUND_LIST_ERROR", message: "Failed to fetch 404 log" }
    };
  }
}
async function handleNotFoundSummary(db, limit) {
  try {
    const repo = new RedirectRepository(db);
    const items = await repo.get404Summary(limit);
    return { success: true, data: { items } };
  } catch {
    return {
      success: false,
      error: { code: "NOT_FOUND_SUMMARY_ERROR", message: "Failed to fetch 404 summary" }
    };
  }
}
async function handleNotFoundClear(db) {
  try {
    const repo = new RedirectRepository(db);
    const deleted = await repo.clear404s();
    return { success: true, data: { deleted } };
  } catch {
    return {
      success: false,
      error: { code: "NOT_FOUND_CLEAR_ERROR", message: "Failed to clear 404 log" }
    };
  }
}
async function handleNotFoundPrune(db, olderThan) {
  try {
    const repo = new RedirectRepository(db);
    const deleted = await repo.prune404s(olderThan);
    return { success: true, data: { deleted } };
  } catch {
    return {
      success: false,
      error: { code: "NOT_FOUND_PRUNE_ERROR", message: "Failed to prune 404 log" }
    };
  }
}
export {
  handleNotFoundList as a,
  handleNotFoundClear as b,
  handleNotFoundPrune as c,
  handleRedirectGet as d,
  handleRedirectUpdate as e,
  handleRedirectDelete as f,
  handleRedirectList as g,
  handleNotFoundSummary as h,
  handleRedirectCreate as i
};
