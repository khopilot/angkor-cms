globalThis.process ??= {};
globalThis.process.env ??= {};
import { a as apiError } from "./error_BF6Eb6os.mjs";
const prerender = false;
const GET = async ({ locals }) => {
  {
    return apiError("FORBIDDEN", "Typegen is only available in development", 403);
  }
};
const POST = async ({ locals }) => {
  {
    return apiError("FORBIDDEN", "Typegen is only available in development", 403);
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
