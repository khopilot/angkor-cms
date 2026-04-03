globalThis.process ??= {};
globalThis.process.env ??= {};
import { a as apiError, u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { a as handleDeviceCodeRequest } from "./device-flow_DMyeaZHS.mjs";
import { p as parseBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { g as getClientIp, c as checkRateLimit, r as rateLimitResponse } from "./rate-limit_Cs71QOuU.mjs";
import { o as object, s as string } from "./sequence_DzjOVBrG.mjs";
const prerender = false;
const deviceCodeSchema = object({
  client_id: string().optional(),
  scope: string().optional()
});
const POST = async ({ request, locals, url }) => {
  const { emdash } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  try {
    const body = await parseBody(request, deviceCodeSchema);
    if (isParseError(body)) return body;
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(emdash.db, ip, "device/code", 10, 60);
    if (!rateLimit.allowed) {
      return rateLimitResponse(60);
    }
    const verificationUri = new URL("/_emdash/admin/device", url.origin).toString();
    const result = await handleDeviceCodeRequest(emdash.db, body, verificationUri);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to create device code", "DEVICE_CODE_ERROR");
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
