globalThis.process ??= {};
globalThis.process.env ??= {};
import { o as object, c as array, r as record, s as string, u as union, d as _enum, e as discriminatedUnion, f as boolean, n as number, l as literal } from "./sequence_DzjOVBrG.mjs";
const PLUGIN_CAPABILITIES = [
  "network:fetch",
  "network:fetch:any",
  "read:content",
  "write:content",
  "read:media",
  "write:media",
  "read:users",
  "email:send",
  "email:provide",
  "email:intercept",
  "page:inject"
];
const FIELD_TYPES = [
  "string",
  "text",
  "number",
  "integer",
  "boolean",
  "datetime",
  "select",
  "multiSelect",
  "portableText",
  "image",
  "file",
  "reference",
  "json",
  "slug"
];
const HOOK_NAMES = [
  "plugin:install",
  "plugin:activate",
  "plugin:deactivate",
  "plugin:uninstall",
  "content:beforeSave",
  "content:afterSave",
  "content:beforeDelete",
  "content:afterDelete",
  "media:beforeUpload",
  "media:afterUpload",
  "cron",
  "email:beforeSend",
  "email:deliver",
  "email:afterSend",
  "comment:beforeCreate",
  "comment:moderate",
  "comment:afterCreate",
  "comment:afterModerate",
  "page:metadata",
  "page:fragments"
];
const manifestHookEntrySchema = object({
  name: _enum(HOOK_NAMES),
  exclusive: boolean().optional(),
  priority: number().int().optional(),
  timeout: number().int().positive().optional()
});
const routeNamePattern = /^[a-zA-Z0-9][a-zA-Z0-9_\-/]*$/;
const manifestRouteEntrySchema = object({
  name: string().min(1).regex(routeNamePattern, "Route name must be a safe path segment"),
  public: boolean().optional()
});
const indexFieldName = string().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/);
const storageCollectionSchema = object({
  indexes: array(union([indexFieldName, array(indexFieldName)])),
  uniqueIndexes: array(union([indexFieldName, array(indexFieldName)])).optional()
});
const baseSettingFields = {
  label: string(),
  description: string().optional()
};
const settingFieldSchema = discriminatedUnion("type", [
  object({
    ...baseSettingFields,
    type: literal("string"),
    default: string().optional(),
    multiline: boolean().optional()
  }),
  object({
    ...baseSettingFields,
    type: literal("number"),
    default: number().optional(),
    min: number().optional(),
    max: number().optional()
  }),
  object({ ...baseSettingFields, type: literal("boolean"), default: boolean().optional() }),
  object({
    ...baseSettingFields,
    type: literal("select"),
    options: array(object({ value: string(), label: string() })),
    default: string().optional()
  }),
  object({ ...baseSettingFields, type: literal("secret") })
]);
const adminPageSchema = object({
  path: string(),
  label: string(),
  icon: string().optional()
});
const dashboardWidgetSchema = object({
  id: string(),
  size: _enum(["full", "half", "third"]).optional(),
  title: string().optional()
});
const pluginAdminConfigSchema = object({
  entry: string().optional(),
  settingsSchema: record(string(), settingFieldSchema).optional(),
  pages: array(adminPageSchema).optional(),
  widgets: array(dashboardWidgetSchema).optional(),
  fieldWidgets: array(
    object({
      name: string().min(1),
      label: string().min(1),
      fieldTypes: array(_enum(FIELD_TYPES)),
      elements: array(
        object({
          type: string(),
          action_id: string(),
          label: string().optional()
        }).passthrough()
      ).optional()
    })
  ).optional()
});
const pluginManifestSchema = object({
  id: string().min(1),
  version: string().min(1),
  capabilities: array(_enum(PLUGIN_CAPABILITIES)),
  allowedHosts: array(string()),
  storage: record(string(), storageCollectionSchema),
  /**
   * Hook declarations — accepts both plain name strings (legacy) and
   * structured objects with exclusive/priority/timeout metadata.
   * Plain strings are normalized to `{ name }` objects after parsing.
   */
  hooks: array(union([_enum(HOOK_NAMES), manifestHookEntrySchema])),
  /**
   * Route declarations — accepts both plain name strings and
   * structured objects with public metadata.
   * Plain strings are normalized to `{ name }` objects after parsing.
   */
  routes: array(
    union([
      string().min(1).regex(routeNamePattern, "Route name must be a safe path segment"),
      manifestRouteEntrySchema
    ])
  ),
  admin: pluginAdminConfigSchema
});
function normalizeManifestRoute(entry) {
  if (typeof entry === "string") {
    return { name: entry };
  }
  return entry;
}
export {
  normalizeManifestRoute as n,
  pluginManifestSchema as p
};
