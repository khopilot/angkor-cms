globalThis.process ??= {};
globalThis.process.env ??= {};
import { r as requirePerm } from "./authorize_BVWxFFYB.mjs";
import { r as requireDb, u as unwrapResult, h as handleError } from "./error_BF6Eb6os.mjs";
import { d as handleCommentInbox } from "./comments_Bgh0R9FS.mjs";
import { a as parseQuery, i as isParseError } from "./parse_4YX0X0po.mjs";
import { h as commentListQuery } from "./redirects_BT6R8QAm.mjs";
const prerender = false;
const GET = async ({ url, locals }) => {
  const { emdash, user } = locals;
  const dbErr = requireDb(emdash?.db);
  if (dbErr) return dbErr;
  const denied = requirePerm(user, "comments:moderate");
  if (denied) return denied;
  try {
    const query = parseQuery(url, commentListQuery);
    if (isParseError(query)) return query;
    const result = await handleCommentInbox(emdash.db, {
      status: query.status,
      collection: query.collection,
      search: query.search,
      limit: query.limit,
      cursor: query.cursor
    });
    return unwrapResult(result);
  } catch (error) {
    return handleError(error, "Failed to list comments", "COMMENT_INBOX_ERROR");
  }
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
