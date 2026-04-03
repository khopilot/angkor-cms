globalThis.process ??= {};
globalThis.process.env ??= {};
import { _ as __exportAll } from "./adapt-sandbox-entry_DgOh8so3.mjs";
var load_exports = /* @__PURE__ */ __exportAll({
  loadSeed: () => loadSeed,
  loadUserSeed: () => loadUserSeed
});
async function getSeedModule() {
  return import("./seed_Bk4z2yys.mjs");
}
async function loadSeed() {
  const { seed } = await getSeedModule();
  return seed;
}
async function loadUserSeed() {
  const { userSeed } = await getSeedModule();
  return userSeed ?? null;
}
export {
  loadUserSeed as n,
  load_exports as r,
  loadSeed as t
};
