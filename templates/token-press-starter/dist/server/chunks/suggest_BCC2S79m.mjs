globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { a as apiError, b as apiSuccess, h as handleError } from "./error_BF6Eb6os.mjs";
import { a as parseQuery, i as isParseError } from "./parse_4YX0X0po.mjs";
import { a3 as searchSuggestQuery } from "./redirects_BT6R8QAm.mjs";
import { a as getSuggestions } from "./query_nWJHNDR9.mjs";
const prerender = false;
const GET = async ({ url, locals }) => {
  const { emdash, user } = locals;
  const denied = requirePerm(user, "search:read");
  if (denied) return denied;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
  }
  const query = parseQuery(url, searchSuggestQuery);
  if (isParseError(query)) return query;
  const collections = query.collections ? query.collections.split(",").map((c) => c.trim()) : void 0;
  try {
    const suggestions = await getSuggestions(emdash.db, query.q, {
      collections,
      locale: query.locale,
      limit: query.limit
    });
    return apiSuccess({ items: suggestions });
  } catch (error) {
    return handleError(error, "Failed to get suggestions", "SUGGESTION_ERROR");
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
