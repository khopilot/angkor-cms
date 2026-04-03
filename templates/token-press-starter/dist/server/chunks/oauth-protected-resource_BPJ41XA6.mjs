globalThis.process ??= {};
globalThis.process.env ??= {};
import "./index_CaKMUQvQ.mjs";
import { V as VALID_SCOPES } from "./authenticate-j5GayLXB_DHkbhwdZ.mjs";
const prerender = false;
const GET = async ({ url }) => {
  const origin = url.origin;
  return Response.json(
    {
      resource: `${origin}/_emdash/api/mcp`,
      authorization_servers: [`${origin}/_emdash`],
      scopes_supported: [...VALID_SCOPES],
      bearer_methods_supported: ["header"]
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*"
      }
    }
  );
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
