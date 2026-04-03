globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { d as handleMenuGet, e as handleMenuUpdate, f as handleMenuDelete } from "./menus_Dw_k1n_d.mjs";
import { p as parseBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { O as updateMenuBody } from "./redirects_BT6R8QAm.mjs";
const prerender = false;
const GET = async ({ params, locals }) => {
  const { emdash, user } = locals;
  const name = params.name;
  const denied = requirePerm(user, "menus:read");
  if (denied) return denied;
  try {
    const result = await handleMenuGet(emdash.db, name);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to fetch menu", "MENU_GET_ERROR");
  }
};
const PUT = async ({ params, request, locals }) => {
  const { emdash, user } = locals;
  const name = params.name;
  const denied = requirePerm(user, "menus:manage");
  if (denied) return denied;
  try {
    const body = await parseBody(request, updateMenuBody);
    if (isParseError(body)) return body;
    const result = await handleMenuUpdate(emdash.db, name, body);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to update menu", "MENU_UPDATE_ERROR");
  }
};
const DELETE = async ({ params, locals }) => {
  const { emdash, user } = locals;
  const name = params.name;
  const denied = requirePerm(user, "menus:manage");
  if (denied) return denied;
  try {
    const result = await handleMenuDelete(emdash.db, name);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to delete menu", "MENU_DELETE_ERROR");
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
