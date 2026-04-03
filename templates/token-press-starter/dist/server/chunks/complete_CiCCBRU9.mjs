globalThis.process ??= {};
globalThis.process.env ??= {};
import { b as completeInvite, I as InviteError } from "./index_CaKMUQvQ.mjs";
import { c as createKyselyAdapter } from "./kysely_onwAyh6v.mjs";
import { v as verifyRegistrationResponse, r as registerPasskey } from "./authenticate-j5GayLXB_DHkbhwdZ.mjs";
import { a as apiError, b as apiSuccess, h as handleError } from "./error_BF6Eb6os.mjs";
import { p as parseBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { j as inviteCompleteBody } from "./redirects_BT6R8QAm.mjs";
import { g as getPasskeyConfig, c as createChallengeStore } from "./passkey-config_CWF7T1YR.mjs";
import { O as OptionsRepository } from "./options_CBMppY2k.mjs";
const prerender = false;
const POST = async ({ request, locals, session }) => {
  const { emdash } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  try {
    const body = await parseBody(request, inviteCompleteBody);
    if (isParseError(body)) return body;
    const adapter = createKyselyAdapter(emdash.db);
    const url = new URL(request.url);
    const options = new OptionsRepository(emdash.db);
    const siteName = await options.get("emdash:site_title") ?? void 0;
    const passkeyConfig = getPasskeyConfig(url, siteName);
    const challengeStore = createChallengeStore(emdash.db);
    const verified = await verifyRegistrationResponse(
      passkeyConfig,
      body.credential,
      challengeStore
    );
    const user = await completeInvite(adapter, body.token, {
      name: body.name
    });
    await registerPasskey(adapter, user.id, verified, "Initial passkey");
    if (session) {
      session.set("user", { id: user.id });
    }
    return apiSuccess({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    if (error instanceof InviteError) {
      const statusMap = {
        invalid_token: 404,
        token_expired: 410,
        user_exists: 409
      };
      return apiError(error.code.toUpperCase(), error.message, statusMap[error.code] ?? 400);
    }
    return handleError(error, "Failed to complete invite", "INVITE_COMPLETE_ERROR");
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
