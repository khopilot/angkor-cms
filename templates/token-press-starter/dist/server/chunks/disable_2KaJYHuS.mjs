globalThis.process ??= {};
globalThis.process.env ??= {};
import "./index_CaKMUQvQ.mjs";
import { c as createKyselyAdapter } from "./kysely_onwAyh6v.mjs";
import { a as apiError, b as apiSuccess, h as handleError } from "./error_BF6Eb6os.mjs";
import { R as Role } from "./types-ndj-bYfi_Bn2CgOOF.mjs";
const prerender = false;
const POST = async ({ params, locals }) => {
  const { emdash, user: currentUser } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "Database not configured", 500);
  }
  if (!currentUser || currentUser.role < Role.ADMIN) {
    return apiError("FORBIDDEN", "Admin privileges required", 403);
  }
  const adapter = createKyselyAdapter(emdash.db);
  const { id } = params;
  if (!id) {
    return apiError("VALIDATION_ERROR", "User ID required", 400);
  }
  if (id === currentUser.id) {
    return apiError("VALIDATION_ERROR", "Cannot disable your own account", 400);
  }
  try {
    const targetUser = await adapter.getUserById(id);
    if (!targetUser) {
      return apiError("NOT_FOUND", "User not found", 404);
    }
    if (targetUser.role === Role.ADMIN) {
      const adminCount = await adapter.countAdmins();
      if (adminCount <= 1) {
        return apiError(
          "VALIDATION_ERROR",
          "Cannot disable the last admin. Promote another user first.",
          400
        );
      }
    }
    await adapter.updateUser(id, { disabled: true });
    await emdash.db.deleteFrom("_emdash_oauth_tokens").where("user_id", "=", id).execute();
    return apiSuccess({ success: true });
  } catch (error) {
    return handleError(error, "Failed to disable user", "USER_DISABLE_ERROR");
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
