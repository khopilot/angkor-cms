globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requestSignup } from "./index_CaKMUQvQ.mjs";
import { c as createKyselyAdapter } from "./kysely_onwAyh6v.mjs";
import { a as apiError, b as apiSuccess } from "./error_BF6Eb6os.mjs";
import { p as parseBody, i as isParseError } from "./parse_4YX0X0po.mjs";
import { t as signupRequestBody } from "./redirects_BT6R8QAm.mjs";
import { g as getSiteBaseUrl } from "./site-url_DtTF7t-X.mjs";
import { O as OptionsRepository } from "./options_CBMppY2k.mjs";
const prerender = false;
const POST = async ({ request, locals }) => {
  const { emdash } = locals;
  if (!emdash?.db) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  if (!emdash.email?.isAvailable()) {
    return apiError(
      "EMAIL_NOT_CONFIGURED",
      "Email not configured. Self-signup is unavailable.",
      503
    );
  }
  try {
    const body = await parseBody(request, signupRequestBody);
    if (isParseError(body)) return body;
    const adapter = createKyselyAdapter(emdash.db);
    const options = new OptionsRepository(emdash.db);
    const siteName = await options.get("emdash:site_title") || "EmDash";
    const baseUrl = await getSiteBaseUrl(emdash.db, request);
    await requestSignup(
      {
        baseUrl,
        siteName,
        email: (message) => emdash.email.send(message, "system")
      },
      adapter,
      body.email.toLowerCase().trim()
    );
    return apiSuccess({
      success: true,
      message: "If your email domain is allowed, you'll receive a verification email."
    });
  } catch (error) {
    console.error("Signup request error:", error);
    return apiSuccess({
      success: true,
      message: "If your email domain is allowed, you'll receive a verification email."
    });
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
