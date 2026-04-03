globalThis.process ??= {};
globalThis.process.env ??= {};
function isSafeRedirect(url) {
  return typeof url === "string" && url.startsWith("/") && !url.startsWith("//") && !url.includes("\\");
}
export {
  isSafeRedirect as i
};
