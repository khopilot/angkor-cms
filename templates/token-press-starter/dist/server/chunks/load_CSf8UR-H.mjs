globalThis.process ??= {};
globalThis.process.env ??= {};
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
  loadSeed as a,
  loadUserSeed as l
};
