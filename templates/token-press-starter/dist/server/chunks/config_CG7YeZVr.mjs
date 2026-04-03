globalThis.process ??= {};
globalThis.process.env ??= {};
const virtualConfig = { "database": { "entrypoint": "@emdash-cms/cloudflare/db/d1", "config": { "binding": "DB", "session": "auto" }, "type": "sqlite" }, "storage": { "entrypoint": "@emdash-cms/cloudflare/storage/r2", "config": { "binding": "MEDIA" } }, "marketplace": "https://marketplace.emdashcms.com" };
export {
  virtualConfig as default
};
