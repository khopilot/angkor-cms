globalThis.process ??= {};
globalThis.process.env ??= {};
import "./index_CaKMUQvQ.mjs";
import { a as apiError, u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { h as handleOAuthClientGet, a as handleOAuthClientUpdate, b as handleOAuthClientDelete } from "./oauth-clients_B3dZpJSx.mjs";
import { p as parseBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { R as Role } from "./types-ndj-bYfi_Bn2CgOOF.mjs";
import { o as object, c as array, s as string } from "./sequence_DzjOVBrG.mjs";
const prerender = false;
const updateClientSchema = object({
  name: string().min(1).max(255).optional(),
  redirectUris: array(string().url("Each redirect URI must be a valid URL")).min(1, "At least one redirect URI is required").optional(),
  scopes: array(string()).nullable().optional()
});
const GET = async ({ params, locals }) => {
  const { emdash, user } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  if (!user || user.role < Role.ADMIN) {
    return apiError("FORBIDDEN", "Admin privileges required", 403);
  }
  const clientId = params.id;
  if (!clientId) {
    return apiError("VALIDATION_ERROR", "Client ID is required", 400);
  }
  const result = await handleOAuthClientGet(emdash.db, clientId);
  return unwrapResult(result);
};
const PUT = async ({ params, request, locals }) => {
  const { emdash, user } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  if (!user || user.role < Role.ADMIN) {
    return apiError("FORBIDDEN", "Admin privileges required", 403);
  }
  const clientId = params.id;
  if (!clientId) {
    return apiError("VALIDATION_ERROR", "Client ID is required", 400);
  }
  try {
    const body = await parseBody(request, updateClientSchema);
    if (isParseError(body)) return body;
    const result = await handleOAuthClientUpdate(emdash.db, clientId, body);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to update OAuth client", "CLIENT_UPDATE_ERROR");
  }
};
const DELETE = async ({ params, locals }) => {
  const { emdash, user } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  if (!user || user.role < Role.ADMIN) {
    return apiError("FORBIDDEN", "Admin privileges required", 403);
  }
  const clientId = params.id;
  if (!clientId) {
    return apiError("VALIDATION_ERROR", "Client ID is required", 400);
  }
  try {
    const result = await handleOAuthClientDelete(emdash.db, clientId);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to delete OAuth client", "CLIENT_DELETE_ERROR");
  }
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
