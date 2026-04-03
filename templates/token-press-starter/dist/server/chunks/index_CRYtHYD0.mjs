globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { a as apiError, u as unwrapResult } from "./error_BF6Eb6os.mjs";
import "./revision_CaXmNFUU.mjs";
import "./request-context_CERgKQIY.mjs";
import { b as handleMarketplaceSearch } from "./marketplace_CGCbq6ks.mjs";
import "./redirects_BT6R8QAm.mjs";
const prerender = false;
const GET = async ({ url, locals }) => {
  const { emdash, user } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  const denied = requirePerm(user, "plugins:read");
  if (denied) return denied;
  const query = url.searchParams.get("q") ?? void 0;
  const category = url.searchParams.get("category") ?? void 0;
  const cursor = url.searchParams.get("cursor") ?? void 0;
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam, 10) || 50), 100) : void 0;
  const result = await handleMarketplaceSearch(emdash.config.marketplace, query, {
    category,
    cursor,
    limit
  });
  return unwrapResult(result);
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
