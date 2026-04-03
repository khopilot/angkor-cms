globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { c as handleMenuItemReorder } from "./menus_Dw_k1n_d.mjs";
import { p as parseBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { N as reorderMenuItemsBody } from "./redirects_BT6R8QAm.mjs";
const prerender = false;
const POST = async ({ params, request, locals }) => {
  const { emdash, user } = locals;
  const name = params.name;
  const denied = requirePerm(user, "menus:manage");
  if (denied) return denied;
  try {
    const body = await parseBody(request, reorderMenuItemsBody);
    if (isParseError(body)) return body;
    const result = await handleMenuItemReorder(emdash.db, name, body.items);
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to reorder menu items", "MENU_REORDER_ERROR");
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
