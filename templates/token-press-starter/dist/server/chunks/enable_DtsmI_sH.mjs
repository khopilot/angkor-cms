globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { a as apiError, u as unwrapResult } from "./error_BF6Eb6os.mjs";
import "./revision_CaXmNFUU.mjs";
import "./request-context_CERgKQIY.mjs";
import { a as handlePluginEnable } from "./plugins_C2fQ9r8K.mjs";
import "./manifest-schema_B2T43Ro7.mjs";
import "./redirects_BT6R8QAm.mjs";
import { s as setCronTasksEnabled } from "./cron_DC9VR1Ui.mjs";
const prerender = false;
const POST = async ({ params, locals }) => {
  const { emdash, user } = locals;
  const { id } = params;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  const denied = requirePerm(user, "plugins:manage");
  if (denied) return denied;
  if (!id) {
    return apiError("INVALID_REQUEST", "Plugin ID required", 400);
  }
  const result = await handlePluginEnable(emdash.db, emdash.configuredPlugins, id);
  if (!result.success) return unwrapResult(result);
  await emdash.setPluginStatus(id, "active");
  await setCronTasksEnabled(emdash.db, id, true);
  return unwrapResult(result);
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
