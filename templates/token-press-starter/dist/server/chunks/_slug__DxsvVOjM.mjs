globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { r as requireDb, a as apiError, u as unwrapResult } from "./error_BF6Eb6os.mjs";
import "./revision_CaXmNFUU.mjs";
import { l as handleOrphanedTableRegister } from "./schema_DD71V53a.mjs";
import "./request-context_CERgKQIY.mjs";
import "./manifest-schema_B2T43Ro7.mjs";
import { b as parseOptionalBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { a0 as orphanRegisterBody } from "./redirects_BT6R8QAm.mjs";
const prerender = false;
const POST = async ({ params, request, locals }) => {
  const { emdash, user } = locals;
  const dbErr = requireDb(emdash?.db);
  if (dbErr) return dbErr;
  const denied = requirePerm(user, "schema:manage");
  if (denied) return denied;
  const slug = params.slug;
  if (!slug) {
    return apiError("VALIDATION_ERROR", "Slug is required", 400);
  }
  const options = await parseOptionalBody(request, orphanRegisterBody, {});
  if (isParseError(options)) return options;
  const result = await handleOrphanedTableRegister(emdash.db, slug, options);
  return unwrapResult(result, 201);
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
