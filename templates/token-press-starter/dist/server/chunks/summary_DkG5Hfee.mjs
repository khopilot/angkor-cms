globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { h as handleNotFoundSummary } from "./redirects_BDKrBfvH.mjs";
import { a as parseQuery, i as isParseError } from "./parse_4YX0X0po.mjs";
import { Q as notFoundSummaryQuery } from "./redirects_BT6R8QAm.mjs";
const prerender = false;
const GET = async ({ url, locals }) => {
  const { emdash, user } = locals;
  const db = emdash.db;
  const denied = requirePerm(user, "redirects:read");
  if (denied) return denied;
  try {
    const query = parseQuery(url, notFoundSummaryQuery);
    if (isParseError(query)) return query;
    const result = await handleNotFoundSummary(db, query.limit);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to fetch 404 summary", "NOT_FOUND_SUMMARY_ERROR");
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
