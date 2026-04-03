globalThis.process ??= {};
globalThis.process.env ??= {};
import { O as OptionsRepository } from "./options_CBMppY2k.mjs";
async function getSiteBaseUrl(db, request) {
  const options = new OptionsRepository(db);
  const storedUrl = await options.get("emdash:site_url");
  if (storedUrl) {
    return `${storedUrl}/_emdash`;
  }
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}/_emdash`;
}
export {
  getSiteBaseUrl as g
};
