globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { a as apiError, r as requireDb, u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { c as handleTermList, d as handleTermCreate } from "./taxonomies_DtYQ2fMe.mjs";
import { p as parseBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { ab as createTermBody } from "./redirects_BT6R8QAm.mjs";
const prerender = false;
const GET = async ({ params, locals }) => {
  const { emdash, user } = locals;
  const { name } = params;
  if (!name) {
    return apiError("VALIDATION_ERROR", "Taxonomy name required", 400);
  }
  const dbErr = requireDb(emdash?.db);
  if (dbErr) return dbErr;
  const denied = requirePerm(user, "taxonomies:read");
  if (denied) return denied;
  try {
    const result = await handleTermList(emdash.db, name);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to list terms", "TERM_LIST_ERROR");
  }
};
const POST = async ({ params, request, locals }) => {
  const { emdash, user } = locals;
  const { name } = params;
  if (!name) {
    return apiError("VALIDATION_ERROR", "Taxonomy name required", 400);
  }
  const dbErr = requireDb(emdash?.db);
  if (dbErr) return dbErr;
  const denied = requirePerm(user, "taxonomies:manage");
  if (denied) return denied;
  try {
    const body = await parseBody(request, createTermBody);
    if (isParseError(body)) return body;
    const result = await handleTermCreate(emdash.db, name, body);
    return unwrapResult(result, 201);
  } catch (error) {
    return handleError(error, "Failed to create term", "TERM_CREATE_ERROR");
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
