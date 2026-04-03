globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { a as apiError, b as apiSuccess, h as handleError } from "./error_BF6Eb6os.mjs";
import { p as parseBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { O as OptionsRepository } from "./options_CBMppY2k.mjs";
import { o as object, s as string } from "./sequence_DzjOVBrG.mjs";
const prerender = false;
const HOOK_NAME_RE = /^[a-z]+:[a-zA-Z]+$/;
const setSelectionSchema = object({
  pluginId: string().min(1).nullable()
});
const PUT = async ({ params, request, locals }) => {
  const { emdash, user } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  const denied = requirePerm(user, "settings:manage");
  if (denied) return denied;
  const hookName = params.hookName;
  if (!hookName) {
    return apiError("VALIDATION_ERROR", "Hook name is required", 400);
  }
  if (!HOOK_NAME_RE.test(hookName)) {
    return apiError("VALIDATION_ERROR", "Invalid hook name format", 400);
  }
  try {
    const pipeline = emdash.hooks;
    if (!pipeline.isExclusiveHook(hookName)) {
      return apiError("NOT_FOUND", `Hook '${hookName}' is not a registered exclusive hook`, 404);
    }
    const body = await parseBody(request, setSelectionSchema);
    if (isParseError(body)) return body;
    const optionsRepo = new OptionsRepository(emdash.db);
    const optionKey = `emdash:exclusive_hook:${hookName}`;
    if (body.pluginId === null) {
      await optionsRepo.delete(optionKey);
      pipeline.clearExclusiveSelection(hookName);
    } else {
      const providers = pipeline.getExclusiveHookProviders(hookName);
      const isValidProvider = providers.some(
        (p) => p.pluginId === body.pluginId
      );
      if (!isValidProvider) {
        return apiError(
          "VALIDATION_ERROR",
          `Plugin '${body.pluginId}' is not a provider for hook '${hookName}'`,
          400
        );
      }
      await optionsRepo.set(optionKey, body.pluginId);
      pipeline.setExclusiveSelection(hookName, body.pluginId);
    }
    return apiSuccess({
      hookName,
      selectedPluginId: body.pluginId
    });
  } catch (error) {
    return handleError(error, "Failed to set exclusive hook selection", "EXCLUSIVE_HOOK_SET_ERROR");
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
