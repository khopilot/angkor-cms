globalThis.process ??= {};
globalThis.process.env ??= {};
import { a as apiError, u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { c as handleTokenRefresh } from "./device-flow_DMyeaZHS.mjs";
import { p as parseBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { o as object, s as string } from "./sequence_DzjOVBrG.mjs";
const prerender = false;
const refreshSchema = object({
  refresh_token: string().min(1),
  grant_type: string().min(1)
});
const POST = async ({ request, locals }) => {
  const { emdash } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  try {
    const body = await parseBody(request, refreshSchema);
    if (isParseError(body)) return body;
    const result = await handleTokenRefresh(emdash.db, body);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to refresh token", "TOKEN_REFRESH_ERROR");
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
