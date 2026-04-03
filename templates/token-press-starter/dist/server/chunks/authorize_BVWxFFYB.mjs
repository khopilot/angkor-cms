globalThis.process ??= {};
globalThis.process.env ??= {};
import { h as hasPermission, c as canActOnOwn } from "./index_CaKMUQvQ.mjs";
import { a as apiError } from "./error_BF6Eb6os.mjs";
function requirePerm(user, permission) {
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", 401);
  }
  if (!hasPermission(user, permission)) {
    return apiError("FORBIDDEN", "Insufficient permissions", 403);
  }
  return null;
}
function requireOwnerPerm(user, ownerId, ownPermission, anyPermission) {
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", 401);
  }
  if (!canActOnOwn(user, ownerId, ownPermission, anyPermission)) {
    return apiError("FORBIDDEN", "Insufficient permissions", 403);
  }
  return null;
}
export {
  requireOwnerPerm as a,
  requirePerm as r
};
