globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { a as handleNotFoundList, b as handleNotFoundClear, c as handleNotFoundPrune } from "./redirects_BDKrBfvH.mjs";
import { a as parseQuery, i as isParseError, p as parseBody } from "./parse_4YX0X0po.mjs";
import { R as notFoundListQuery, S as notFoundPruneBody } from "./redirects_BT6R8QAm.mjs";
const prerender = false;
const GET = async ({ url, locals }) => {
  const { emdash, user } = locals;
  const db = emdash.db;
  const denied = requirePerm(user, "redirects:read");
  if (denied) return denied;
  try {
    const query = parseQuery(url, notFoundListQuery);
    if (isParseError(query)) return query;
    const result = await handleNotFoundList(db, query);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to fetch 404 log", "NOT_FOUND_LIST_ERROR");
  }
};
const DELETE = async ({ locals }) => {
  const { emdash, user } = locals;
  const db = emdash.db;
  const denied = requirePerm(user, "redirects:manage");
  if (denied) return denied;
  try {
    const result = await handleNotFoundClear(db);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to clear 404 log", "NOT_FOUND_CLEAR_ERROR");
  }
};
const POST = async ({ request, locals }) => {
  const { emdash, user } = locals;
  const db = emdash.db;
  const denied = requirePerm(user, "redirects:manage");
  if (denied) return denied;
  try {
    const body = await parseBody(request, notFoundPruneBody);
    if (isParseError(body)) return body;
    const result = await handleNotFoundPrune(db, body.olderThan);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to prune 404 log", "NOT_FOUND_PRUNE_ERROR");
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
