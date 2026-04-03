globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { r as requireDb, u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { e as handleTaxonomyList, f as handleTaxonomyCreate } from "./taxonomies_DtYQ2fMe.mjs";
import { p as parseBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { ac as createTaxonomyDefBody } from "./redirects_BT6R8QAm.mjs";
const prerender = false;
const GET = async ({ locals }) => {
  const { emdash, user } = locals;
  const dbErr = requireDb(emdash?.db);
  if (dbErr) return dbErr;
  const denied = requirePerm(user, "taxonomies:read");
  if (denied) return denied;
  try {
    const result = await handleTaxonomyList(emdash.db);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to list taxonomies", "TAXONOMY_LIST_ERROR");
  }
};
const POST = async ({ request, locals }) => {
  const { emdash, user } = locals;
  const dbErr = requireDb(emdash?.db);
  if (dbErr) return dbErr;
  const denied = requirePerm(user, "taxonomies:manage");
  if (denied) return denied;
  try {
    const body = await parseBody(request, createTaxonomyDefBody);
    if (isParseError(body)) return body;
    const result = await handleTaxonomyCreate(emdash.db, body);
    return unwrapResult(result, 201);
  } catch (error) {
    return handleError(error, "Failed to create taxonomy", "TAXONOMY_CREATE_ERROR");
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
