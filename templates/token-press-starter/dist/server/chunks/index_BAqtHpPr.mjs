globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { a as apiError, u as unwrapResult } from "./error_BF6Eb6os.mjs";
import { a as parseQuery, i as isParseError, p as parseBody } from "./parse_4YX0X0po.mjs";
import { z as contentListQuery, A as contentCreateBody } from "./redirects_BT6R8QAm.mjs";
const prerender = false;
const GET = async ({ params, url, locals }) => {
  const { emdash, user } = locals;
  const denied = requirePerm(user, "content:read");
  if (denied) return denied;
  const collection = params.collection;
  const query = parseQuery(url, contentListQuery);
  if (isParseError(query)) return query;
  if (!emdash?.handleContentList) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  const result = await emdash.handleContentList(collection, query);
  return unwrapResult(result);
};
const POST = async ({ params, request, locals, cache }) => {
  const { emdash, user } = locals;
  const denied = requirePerm(user, "content:create");
  if (denied) return denied;
  const collection = params.collection;
  const body = await parseBody(request, contentCreateBody);
  if (isParseError(body)) return body;
  if (!emdash?.handleContentCreate) {
    return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  }
  const result = await emdash.handleContentCreate(collection, {
    ...body,
    authorId: user?.id,
    locale: body.locale,
    translationOf: body.translationOf
  });
  if (!result.success) return unwrapResult(result);
  if (cache.enabled) await cache.invalidate({ tags: [collection] });
  return unwrapResult(result, 201);
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
