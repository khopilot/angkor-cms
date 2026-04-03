globalThis.process ??= {};
globalThis.process.env ??= {};
import { a as apiError, u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { h as handleDeviceAuthorize } from "./device-flow_DMyeaZHS.mjs";
import { p as parseBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { o as object, d as _enum, s as string } from "./sequence_DzjOVBrG.mjs";
const prerender = false;
const authorizeSchema = object({
  user_code: string().min(1),
  action: _enum(["approve", "deny"]).optional()
});
const POST = async ({ request, locals }) => {
  const { emdash } = locals;
  const { user } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  if (!user) {
    return apiError("NOT_AUTHENTICATED", "Authentication required", 401);
  }
  try {
    const body = await parseBody(request, authorizeSchema);
    if (isParseError(body)) return body;
    const result = await handleDeviceAuthorize(emdash.db, user.id, user.role, body);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to authorize device", "AUTHORIZE_ERROR");
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
