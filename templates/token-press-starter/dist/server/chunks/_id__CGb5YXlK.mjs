globalThis.process ??= {};
globalThis.process.env ??= {};
import "./index_CaKMUQvQ.mjs";
import { a as apiError, u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { h as handleApiTokenRevoke } from "./api-tokens_BW5KfE1h.mjs";
import { R as Role } from "./types-ndj-bYfi_Bn2CgOOF.mjs";
const prerender = false;
const DELETE = async ({ params, locals }) => {
  const { emdash, user } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  if (!user || user.role < Role.ADMIN) {
    return apiError("FORBIDDEN", "Admin privileges required", 403);
  }
  const tokenId = params.id;
  if (!tokenId) {
    return apiError("VALIDATION_ERROR", "Token ID is required", 400);
  }
  try {
    const result = await handleApiTokenRevoke(emdash.db, tokenId, user.id);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to revoke API token", "TOKEN_REVOKE_ERROR");
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
