globalThis.process ??= {};
globalThis.process.env ??= {};
import { a as apiError, u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { d as handleTokenRevoke } from "./device-flow_DMyeaZHS.mjs";
import { p as parseBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { o as object, s as string } from "./sequence_DzjOVBrG.mjs";
const prerender = false;
const revokeSchema = object({
  token: string().min(1)
});
const POST = async ({ request, locals }) => {
  const { emdash } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  try {
    const body = await parseBody(request, revokeSchema);
    if (isParseError(body)) return body;
    const result = await handleTokenRevoke(emdash.db, body);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to revoke token", "TOKEN_REVOKE_ERROR");
  }
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
