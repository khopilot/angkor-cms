globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { r as requireDb, u as unwrapResult } from "./error_BF6Eb6os.mjs";
import "./revision_CaXmNFUU.mjs";
import { a as handleSchemaFieldGet, b as handleSchemaFieldUpdate, c as handleSchemaFieldDelete } from "./schema_DD71V53a.mjs";
import "./request-context_CERgKQIY.mjs";
import "./manifest-schema_B2T43Ro7.mjs";
import { p as parseBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { X as updateFieldBody } from "./redirects_BT6R8QAm.mjs";
const prerender = false;
const GET = async ({ params, locals }) => {
  const { emdash, user } = locals;
  const collectionSlug = params.slug;
  const fieldSlug = params.fieldSlug;
  const dbErr = requireDb(emdash?.db);
  if (dbErr) return dbErr;
  const denied = requirePerm(user, "schema:read");
  if (denied) return denied;
  const result = await handleSchemaFieldGet(emdash.db, collectionSlug, fieldSlug);
  return unwrapResult(result);
};
const PUT = async ({ params, request, locals }) => {
  const { emdash, user } = locals;
  const collectionSlug = params.slug;
  const fieldSlug = params.fieldSlug;
  const dbErr = requireDb(emdash?.db);
  if (dbErr) return dbErr;
  const denied = requirePerm(user, "schema:manage");
  if (denied) return denied;
  const body = await parseBody(request, updateFieldBody);
  if (isParseError(body)) return body;
  const result = await handleSchemaFieldUpdate(
    emdash.db,
    collectionSlug,
    fieldSlug,
    body
  );
  return unwrapResult(result);
};
const DELETE = async ({ params, locals }) => {
  const { emdash, user } = locals;
  const collectionSlug = params.slug;
  const fieldSlug = params.fieldSlug;
  const dbErr = requireDb(emdash?.db);
  if (dbErr) return dbErr;
  const denied = requirePerm(user, "schema:manage");
  if (denied) return denied;
  const result = await handleSchemaFieldDelete(emdash.db, collectionSlug, fieldSlug);
  return unwrapResult(result);
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
