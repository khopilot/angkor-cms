globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { a as apiError } from "./error_BF6Eb6os.mjs";
import "./redirects_BT6R8QAm.mjs";
const prerender = false;
const POST = async ({ params, request, locals }) => {
  const { emdash, user } = locals;
  const denied = requirePerm(user, "content:read");
  if (denied) return denied;
  params.collection;
  params.id;
  {
    return apiError(
      "NOT_CONFIGURED",
      "Preview not configured. Set EMDASH_PREVIEW_SECRET environment variable.",
      500
    );
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
