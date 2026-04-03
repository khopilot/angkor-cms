globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { r as requireDb, u as unwrapResult } from "./error_BF6Eb6os.mjs";
import "./revision_CaXmNFUU.mjs";
import { f as handleSchemaCollectionGet, g as handleSchemaCollectionUpdate, i as handleSchemaCollectionDelete } from "./schema_DD71V53a.mjs";
import "./request-context_CERgKQIY.mjs";
import "./manifest-schema_B2T43Ro7.mjs";
import { a as parseQuery, i as isParseError, p as parseBody } from "./parse_4YX0X0po.mjs";
import { Z as collectionGetQuery, _ as updateCollectionBody } from "./redirects_BT6R8QAm.mjs";
const prerender = false;
const GET = async ({ params, url, locals }) => {
  const { emdash, user } = locals;
  const slug = params.slug;
  const dbErr = requireDb(emdash?.db);
  if (dbErr) return dbErr;
  const denied = requirePerm(user, "schema:read");
  if (denied) return denied;
  const query = parseQuery(url, collectionGetQuery);
  if (isParseError(query)) return query;
  const result = await handleSchemaCollectionGet(emdash.db, slug, {
    includeFields: query.includeFields ?? false
  });
  return unwrapResult(result);
};
const PUT = async ({ params, request, locals }) => {
  const { emdash, user } = locals;
  const slug = params.slug;
  const dbErr = requireDb(emdash?.db);
  if (dbErr) return dbErr;
  const denied = requirePerm(user, "schema:manage");
  if (denied) return denied;
  const body = await parseBody(request, updateCollectionBody);
  if (isParseError(body)) return body;
  const result = await handleSchemaCollectionUpdate(
    emdash.db,
    slug,
    // eslint-disable-next-line typescript-eslint(no-unsafe-type-assertion) -- parseBody validates via Zod
    body
  );
  return unwrapResult(result);
};
const DELETE = async ({ params, url, locals }) => {
  const { emdash, user } = locals;
  const slug = params.slug;
  const force = url.searchParams.get("force") === "true";
  const dbErr = requireDb(emdash?.db);
  if (dbErr) return dbErr;
  const denied = requirePerm(user, "schema:manage");
  if (denied) return denied;
  const result = await handleSchemaCollectionDelete(emdash.db, slug, {
    force
  });
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
