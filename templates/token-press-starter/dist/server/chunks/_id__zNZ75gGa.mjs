globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { a as apiError, r as requireDb, u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { b as handleCommentGet, c as handleCommentDelete } from "./comments_Bgh0R9FS.mjs";
const prerender = false;
const GET = async ({ params, locals }) => {
  const { emdash, user } = locals;
  const { id } = params;
  if (!id) {
    return apiError("VALIDATION_ERROR", "Comment ID required", 400);
  }
  const dbErr = requireDb(emdash?.db);
  if (dbErr) return dbErr;
  const denied = requirePerm(user, "comments:moderate");
  if (denied) return denied;
  try {
    const result = await handleCommentGet(emdash.db, id);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to get comment", "COMMENT_GET_ERROR");
  }
};
const DELETE = async ({ params, locals }) => {
  const { emdash, user } = locals;
  const { id } = params;
  if (!id) {
    return apiError("VALIDATION_ERROR", "Comment ID required", 400);
  }
  const dbErr = requireDb(emdash?.db);
  if (dbErr) return dbErr;
  const denied = requirePerm(user, "comments:delete");
  if (denied) return denied;
  try {
    const result = await handleCommentDelete(emdash.db, id);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to delete comment", "COMMENT_DELETE_ERROR");
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
