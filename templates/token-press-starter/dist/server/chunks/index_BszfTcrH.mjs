globalThis.process ??= {};
globalThis.process.env ??= {};
import "./index_CaKMUQvQ.mjs";
import { a as apiError, u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { c as handleOAuthClientList, d as handleOAuthClientCreate } from "./oauth-clients_B3dZpJSx.mjs";
import { p as parseBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { R as Role } from "./types-ndj-bYfi_Bn2CgOOF.mjs";
import { o as object, c as array, s as string } from "./sequence_DzjOVBrG.mjs";
const prerender = false;
const createClientSchema = object({
  id: string().min(1, "Client ID is required").max(255, "Client ID must be at most 255 characters"),
  name: string().min(1, "Name is required").max(255, "Name must be at most 255 characters"),
  redirectUris: array(string().url("Each redirect URI must be a valid URL")).min(1, "At least one redirect URI is required"),
  scopes: array(string()).optional()
});
const GET = async ({ locals }) => {
  const { emdash, user } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  if (!user || user.role < Role.ADMIN) {
    return apiError("FORBIDDEN", "Admin privileges required", 403);
  }
  const result = await handleOAuthClientList(emdash.db);
  return unwrapResult(result);
};
const POST = async ({ request, locals }) => {
  const { emdash, user } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  if (!user || user.role < Role.ADMIN) {
    return apiError("FORBIDDEN", "Admin privileges required", 403);
  }
  try {
    const body = await parseBody(request, createClientSchema);
    if (isParseError(body)) return body;
    const result = await handleOAuthClientCreate(emdash.db, body);
    return unwrapResult(result, 201);
  } catch (error) {
    return handleError(error, "Failed to create OAuth client", "CLIENT_CREATE_ERROR");
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
