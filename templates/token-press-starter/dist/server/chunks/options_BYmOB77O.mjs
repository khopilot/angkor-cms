globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createKyselyAdapter } from "./kysely_onwAyh6v.mjs";
import { a as generateAuthenticationOptions } from "./authenticate-j5GayLXB_DHkbhwdZ.mjs";
import { a as apiError, b as apiSuccess, h as handleError } from "./error_BF6Eb6os.mjs";
import { b as parseOptionalBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { p as passkeyOptionsBody } from "./redirects_BT6R8QAm.mjs";
import { a as cleanupExpiredChallenges, g as getPasskeyConfig, c as createChallengeStore } from "./passkey-config_CWF7T1YR.mjs";
import { g as getClientIp, c as checkRateLimit, r as rateLimitResponse } from "./rate-limit_Cs71QOuU.mjs";
import { O as OptionsRepository } from "./options_CBMppY2k.mjs";
const prerender = false;
const POST = async ({ request, locals }) => {
  const { emdash } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  try {
    void cleanupExpiredChallenges(emdash.db).catch(() => {
    });
    const body = await parseOptionalBody(request, passkeyOptionsBody, {});
    if (isParseError(body)) return body;
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(emdash.db, ip, "passkey/options", 10, 60);
    if (!rateLimit.allowed) {
      return rateLimitResponse(60);
    }
    const adapter = createKyselyAdapter(emdash.db);
    let credentials = [];
    if (body.email) {
      const user = await adapter.getUserByEmail(body.email);
      if (user) {
        credentials = await adapter.getCredentialsByUserId(user.id);
      }
    }
    const url = new URL(request.url);
    const options = new OptionsRepository(emdash.db);
    const siteName = await options.get("emdash:site_title") ?? void 0;
    const passkeyConfig = getPasskeyConfig(url, siteName);
    const challengeStore = createChallengeStore(emdash.db);
    const authOptions = await generateAuthenticationOptions(
      passkeyConfig,
      credentials,
      challengeStore
    );
    return apiSuccess({
      success: true,
      options: authOptions
    });
  } catch (error) {
    return handleError(error, "Failed to generate passkey options", "PASSKEY_OPTIONS_ERROR");
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
