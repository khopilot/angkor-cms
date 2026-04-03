globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { g as handleMenuList, i as handleMenuCreate } from "./menus_Dw_k1n_d.mjs";
import { p as parseBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { P as createMenuBody } from "./redirects_BT6R8QAm.mjs";
const prerender = false;
const GET = async ({ locals }) => {
  const { emdash, user } = locals;
  const denied = requirePerm(user, "menus:read");
  if (denied) return denied;
  try {
    const result = await handleMenuList(emdash.db);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to fetch menus", "MENU_LIST_ERROR");
  }
};
const POST = async ({ request, locals }) => {
  const { emdash, user } = locals;
  const denied = requirePerm(user, "menus:manage");
  if (denied) return denied;
  try {
    const body = await parseBody(request, createMenuBody);
    if (isParseError(body)) return body;
    const result = await handleMenuCreate(emdash.db, body);
    return unwrapResult(result, 201);
  } catch (error) {
    return handleError(error, "Failed to create menu", "MENU_CREATE_ERROR");
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
