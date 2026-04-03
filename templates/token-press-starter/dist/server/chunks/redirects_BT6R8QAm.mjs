globalThis.process ??= {};
globalThis.process.env ??= {};
import { o as object, s as string, l as literal, n as number$1, f as boolean, d as _enum, c as array, r as record, t as unknown, u as union, v as any, w as lazy } from "./sequence_DzjOVBrG.mjs";
import { n as number, b as boolean$1 } from "./coerce_Db55XvBy.mjs";
const VALID_ROLE_LEVELS = /* @__PURE__ */ new Set([10, 20, 30, 40, 50]);
const roleLevel = number().int().refine((n) => VALID_ROLE_LEVELS.has(n), {
  message: "Invalid role level. Must be 10, 20, 30, 40, or 50"
});
const cursorPaginationQuery = object({
  cursor: string().optional().meta({ description: "Opaque cursor for pagination" }),
  limit: number().int().min(1).max(100).optional().default(50).meta({
    description: "Maximum number of items to return (1-100, default 50)"
  })
}).meta({ id: "CursorPaginationQuery" });
object({
  limit: number().int().min(1).max(100).optional().default(50),
  offset: number().int().min(0).optional().default(0)
}).meta({ id: "OffsetPaginationQuery" });
const slugPattern = /^[a-z][a-z0-9_]*$/;
const HTTP_SCHEME_RE = /^https?:\/\//i;
const httpUrl = string().url().refine((url) => HTTP_SCHEME_RE.test(url), "URL must use http or https");
const localeCode = string().regex(/^[a-z]{2,3}(-[a-z0-9]{2,8})*$/i, "Invalid locale code").transform((v) => v.toLowerCase());
object({
  error: object({
    code: string().meta({ description: "Machine-readable error code", example: "NOT_FOUND" }),
    message: string().meta({ description: "Human-readable error message" })
  })
}).meta({ id: "ApiError" });
object({ deleted: literal(true) }).meta({
  id: "DeleteResponse"
});
object({ count: number$1().int().min(0) }).meta({ id: "CountResponse" });
const bylineSlugPattern = /^[a-z][a-z0-9-]*$/;
const bylineSummarySchema = object({
  id: string(),
  slug: string(),
  displayName: string(),
  bio: string().nullable(),
  avatarMediaId: string().nullable(),
  websiteUrl: string().nullable(),
  userId: string().nullable(),
  isGuest: boolean(),
  createdAt: string(),
  updatedAt: string()
}).meta({ id: "BylineSummary" });
const bylineCreditSchema = object({
  byline: bylineSummarySchema,
  sortOrder: number$1().int(),
  roleLabel: string().nullable(),
  source: _enum(["explicit", "inferred"]).optional().meta({
    description: "Whether this credit was explicitly assigned or inferred from authorId"
  })
}).meta({ id: "BylineCredit" });
const contentBylineInputSchema = object({
  bylineId: string().min(1),
  roleLabel: string().nullish()
}).meta({ id: "ContentBylineInput" });
const bylinesListQuery = cursorPaginationQuery.extend({
  search: string().optional(),
  isGuest: boolean$1().optional(),
  userId: string().optional()
}).meta({ id: "BylinesListQuery" });
const bylineCreateBody = object({
  slug: string().min(1).regex(bylineSlugPattern, "Slug must contain only lowercase letters, digits, and hyphens"),
  displayName: string().min(1),
  bio: string().nullish(),
  avatarMediaId: string().nullish(),
  websiteUrl: httpUrl.nullish(),
  userId: string().nullish(),
  isGuest: boolean().optional()
}).meta({ id: "BylineCreateBody" });
const bylineUpdateBody = object({
  slug: string().min(1).regex(bylineSlugPattern, "Slug must contain only lowercase letters, digits, and hyphens").optional(),
  displayName: string().min(1).optional(),
  bio: string().nullish(),
  avatarMediaId: string().nullish(),
  websiteUrl: httpUrl.nullish(),
  userId: string().nullish(),
  isGuest: boolean().optional()
}).meta({ id: "BylineUpdateBody" });
object({
  items: array(bylineSummarySchema),
  nextCursor: string().optional()
}).meta({ id: "BylineListResponse" });
const contentSeoInput = object({
  title: string().max(200).nullish(),
  description: string().max(500).nullish(),
  image: string().nullish(),
  canonical: httpUrl.nullish(),
  noIndex: boolean().optional()
}).meta({ id: "ContentSeoInput" });
const contentListQuery = cursorPaginationQuery.extend({
  status: string().optional(),
  orderBy: string().optional(),
  order: _enum(["asc", "desc"]).optional(),
  locale: localeCode.optional()
}).meta({ id: "ContentListQuery" });
const contentCreateBody = object({
  data: record(string(), unknown()),
  slug: string().nullish(),
  status: string().optional(),
  bylines: array(contentBylineInputSchema).optional(),
  locale: localeCode.optional(),
  translationOf: string().optional(),
  seo: contentSeoInput.optional()
}).meta({ id: "ContentCreateBody" });
const contentUpdateBody = object({
  data: record(string(), unknown()).optional(),
  slug: string().nullish(),
  status: string().optional(),
  authorId: string().nullish(),
  bylines: array(contentBylineInputSchema).optional(),
  _rev: string().optional().meta({ description: "Opaque revision token for optimistic concurrency" }),
  skipRevision: boolean().optional(),
  seo: contentSeoInput.optional()
}).meta({ id: "ContentUpdateBody" });
const contentScheduleBody = object({
  scheduledAt: string().min(1, "scheduledAt is required").meta({
    description: "ISO 8601 datetime for scheduled publishing",
    example: "2025-06-15T09:00:00Z"
  })
}).meta({ id: "ContentScheduleBody" });
object({
  expiresIn: union([string(), number$1()]).optional(),
  pathPattern: string().optional()
}).meta({ id: "ContentPreviewUrlBody" });
const contentTermsBody = object({
  termIds: array(string())
}).meta({ id: "ContentTermsBody" });
const contentTrashQuery = cursorPaginationQuery;
const contentSeoSchema = object({
  title: string().nullable(),
  description: string().nullable(),
  image: string().nullable(),
  canonical: string().nullable(),
  noIndex: boolean()
}).meta({ id: "ContentSeo" });
const contentItemSchema = object({
  id: string(),
  type: string().meta({ description: "Collection slug this item belongs to" }),
  slug: string().nullable(),
  status: string().meta({ description: "draft, published, or scheduled" }),
  data: record(string(), unknown()).meta({
    description: "User-defined field values"
  }),
  authorId: string().nullable(),
  primaryBylineId: string().nullable(),
  byline: bylineSummarySchema.nullable().optional(),
  bylines: array(bylineCreditSchema).optional(),
  createdAt: string(),
  updatedAt: string(),
  publishedAt: string().nullable(),
  scheduledAt: string().nullable(),
  liveRevisionId: string().nullable(),
  draftRevisionId: string().nullable(),
  version: number$1().int(),
  locale: string().nullable(),
  translationGroup: string().nullable(),
  seo: contentSeoSchema.optional()
}).meta({ id: "ContentItem" });
object({
  item: contentItemSchema,
  _rev: string().optional().meta({ description: "Opaque revision token for optimistic concurrency" })
}).meta({ id: "ContentResponse" });
object({
  items: array(contentItemSchema),
  nextCursor: string().optional()
}).meta({ id: "ContentListResponse" });
const trashedContentItemSchema = object({
  id: string(),
  type: string(),
  slug: string().nullable(),
  status: string(),
  data: record(string(), unknown()),
  authorId: string().nullable(),
  createdAt: string(),
  updatedAt: string(),
  publishedAt: string().nullable(),
  deletedAt: string()
}).meta({ id: "TrashedContentItem" });
object({
  items: array(trashedContentItemSchema),
  nextCursor: string().optional()
}).meta({ id: "TrashedContentListResponse" });
object({
  hasChanges: boolean(),
  live: record(string(), unknown()).nullable(),
  draft: record(string(), unknown()).nullable()
}).meta({ id: "ContentCompareResponse" });
const contentTranslationSchema = object({
  id: string(),
  locale: string().nullable(),
  slug: string().nullable(),
  status: string(),
  updatedAt: string()
});
object({
  translationGroup: string(),
  translations: array(contentTranslationSchema)
}).meta({ id: "ContentTranslationsResponse" });
const mediaListQuery = cursorPaginationQuery.extend({
  mimeType: string().optional()
}).meta({ id: "MediaListQuery" });
const mediaUpdateBody = object({
  alt: string().optional(),
  caption: string().optional(),
  width: number$1().int().positive().optional(),
  height: number$1().int().positive().optional()
}).meta({ id: "MediaUpdateBody" });
const MAX_UPLOAD_SIZE = 50 * 1024 * 1024;
const mediaUploadUrlBody = object({
  filename: string().min(1, "filename is required"),
  contentType: string().min(1, "contentType is required"),
  size: number$1().int().positive().max(MAX_UPLOAD_SIZE, `File size must not exceed ${MAX_UPLOAD_SIZE / 1024 / 1024}MB`),
  contentHash: string().optional()
}).meta({ id: "MediaUploadUrlBody" });
const mediaConfirmBody = object({
  size: number$1().int().positive().optional(),
  width: number$1().int().positive().optional(),
  height: number$1().int().positive().optional()
}).meta({ id: "MediaConfirmBody" });
cursorPaginationQuery.extend({
  query: string().optional(),
  mimeType: string().optional()
}).meta({ id: "MediaProviderListQuery" });
const mediaStatusSchema = _enum(["pending", "ready", "failed"]);
const mediaItemSchema = object({
  id: string(),
  filename: string(),
  mimeType: string(),
  size: number$1().nullable(),
  width: number$1().nullable(),
  height: number$1().nullable(),
  alt: string().nullable(),
  caption: string().nullable(),
  storageKey: string(),
  status: mediaStatusSchema,
  contentHash: string().nullable(),
  blurhash: string().nullable(),
  dominantColor: string().nullable(),
  createdAt: string(),
  authorId: string().nullable()
}).meta({ id: "MediaItem" });
object({ item: mediaItemSchema }).meta({ id: "MediaResponse" });
object({
  items: array(mediaItemSchema),
  nextCursor: string().optional()
}).meta({ id: "MediaListResponse" });
object({
  uploadUrl: string(),
  method: literal("PUT"),
  headers: record(string(), string()),
  mediaId: string(),
  storageKey: string(),
  expiresAt: string()
}).meta({ id: "MediaUploadUrlResponse" });
object({
  existing: literal(true),
  mediaId: string(),
  storageKey: string(),
  url: string()
}).meta({ id: "MediaExistingResponse" });
object({
  item: mediaItemSchema.extend({ url: string() })
}).meta({ id: "MediaConfirmResponse" });
const collectionSupportValues = _enum(["drafts", "revisions", "preview", "scheduling", "search"]);
const collectionSourcePattern = /^(template:.+|import:.+|manual|discovered|seed)$/;
const fieldTypeValues = _enum([
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
]);
const fieldValidation = object({
  required: boolean().optional(),
  min: number$1().optional(),
  max: number$1().optional(),
  minLength: number$1().int().min(0).optional(),
  maxLength: number$1().int().min(0).optional(),
  pattern: string().optional(),
  options: array(string()).optional()
}).optional();
const fieldWidgetOptions = record(string(), unknown()).optional();
const createCollectionBody = object({
  slug: string().min(1).max(63).regex(slugPattern, "Invalid slug format"),
  label: string().min(1),
  labelSingular: string().optional(),
  description: string().optional(),
  icon: string().optional(),
  supports: array(collectionSupportValues).optional(),
  source: string().regex(collectionSourcePattern).optional(),
  urlPattern: string().optional(),
  hasSeo: boolean().optional()
}).meta({ id: "CreateCollectionBody" });
const updateCollectionBody = object({
  label: string().min(1).optional(),
  labelSingular: string().optional(),
  description: string().optional(),
  icon: string().optional(),
  supports: array(collectionSupportValues).optional(),
  urlPattern: string().nullish(),
  hasSeo: boolean().optional(),
  commentsEnabled: boolean().optional(),
  commentsModeration: _enum(["all", "first_time", "none"]).optional(),
  commentsClosedAfterDays: number$1().int().min(0).optional(),
  commentsAutoApproveUsers: boolean().optional()
}).meta({ id: "UpdateCollectionBody" });
const createFieldBody = object({
  slug: string().min(1).max(63).regex(slugPattern, "Invalid slug format"),
  label: string().min(1),
  type: fieldTypeValues,
  required: boolean().optional(),
  unique: boolean().optional(),
  defaultValue: unknown().optional(),
  validation: fieldValidation,
  widget: string().optional(),
  options: fieldWidgetOptions,
  sortOrder: number$1().int().min(0).optional(),
  searchable: boolean().optional(),
  translatable: boolean().optional()
}).meta({ id: "CreateFieldBody" });
const updateFieldBody = object({
  label: string().min(1).optional(),
  required: boolean().optional(),
  unique: boolean().optional(),
  defaultValue: unknown().optional(),
  validation: fieldValidation,
  widget: string().optional(),
  options: fieldWidgetOptions,
  sortOrder: number$1().int().min(0).optional(),
  searchable: boolean().optional(),
  translatable: boolean().optional()
}).meta({ id: "UpdateFieldBody" });
const fieldReorderBody = object({
  fieldSlugs: array(string().min(1))
}).meta({ id: "FieldReorderBody" });
const orphanRegisterBody = object({
  label: string().optional(),
  labelSingular: string().optional(),
  description: string().optional()
}).meta({ id: "OrphanRegisterBody" });
object({
  format: string().optional()
});
const collectionGetQuery = object({
  includeFields: string().transform((v) => v === "true").optional()
});
const collectionSchema = object({
  id: string(),
  slug: string(),
  label: string(),
  labelSingular: string().nullable(),
  description: string().nullable(),
  icon: string().nullable(),
  supports: array(string()),
  source: string().nullable(),
  urlPattern: string().nullable(),
  hasSeo: boolean(),
  createdAt: string(),
  updatedAt: string()
}).meta({ id: "Collection" });
const fieldSchema = object({
  id: string(),
  collectionId: string(),
  slug: string(),
  label: string(),
  type: fieldTypeValues,
  required: boolean(),
  unique: boolean(),
  defaultValue: unknown().nullable(),
  validation: record(string(), unknown()).nullable(),
  widget: string().nullable(),
  options: record(string(), unknown()).nullable(),
  sortOrder: number$1().int(),
  searchable: boolean(),
  translatable: boolean(),
  createdAt: string(),
  updatedAt: string()
}).meta({ id: "Field" });
object({ item: collectionSchema }).meta({ id: "CollectionResponse" });
object({
  item: collectionSchema.extend({ fields: array(fieldSchema) })
}).meta({ id: "CollectionWithFieldsResponse" });
object({ items: array(collectionSchema) }).meta({ id: "CollectionListResponse" });
object({ item: fieldSchema }).meta({ id: "FieldResponse" });
object({ items: array(fieldSchema) }).meta({ id: "FieldListResponse" });
const orphanedTableSchema = object({
  slug: string(),
  tableName: string(),
  rowCount: number$1().int()
}).meta({ id: "OrphanedTable" });
object({ items: array(orphanedTableSchema) }).meta({ id: "OrphanedTableListResponse" });
const createCommentBody = object({
  authorName: string().min(1).max(100),
  authorEmail: string().email(),
  body: string().min(1).max(5e3),
  parentId: string().optional(),
  /** Honeypot field — hidden in the form, filled only by bots */
  website_url: string().optional()
}).meta({ id: "CreateCommentBody" });
const commentStatusBody = object({
  status: _enum(["approved", "pending", "spam", "trash"])
}).meta({ id: "CommentStatusBody" });
const commentBulkBody = object({
  ids: array(string().min(1)).min(1).max(100),
  action: _enum(["approve", "spam", "trash", "delete"])
}).meta({ id: "CommentBulkBody" });
const commentListQuery = object({
  status: _enum(["pending", "approved", "spam", "trash"]).optional(),
  collection: string().optional(),
  search: string().optional(),
  limit: number().int().min(1).max(100).optional(),
  cursor: string().optional()
}).meta({ id: "CommentListQuery" });
const commentStatusValues = _enum(["pending", "approved", "spam", "trash"]);
const publicCommentSchema = object({
  id: string(),
  authorName: string(),
  isRegisteredUser: boolean(),
  body: string(),
  parentId: string().nullable(),
  createdAt: string(),
  replies: array(any()).optional()
}).meta({ id: "PublicComment" });
const commentSchema = object({
  id: string(),
  collection: string(),
  contentId: string(),
  authorName: string(),
  authorEmail: string(),
  body: string(),
  status: commentStatusValues,
  parentId: string().nullable(),
  ipHash: string().nullable(),
  createdAt: string(),
  updatedAt: string()
}).meta({ id: "Comment" });
object({
  items: array(publicCommentSchema),
  nextCursor: string().optional(),
  total: number$1().int()
}).meta({ id: "PublicCommentListResponse" });
object({
  items: array(commentSchema),
  nextCursor: string().optional()
}).meta({ id: "AdminCommentListResponse" });
object({
  pending: number$1().int(),
  approved: number$1().int(),
  spam: number$1().int(),
  trash: number$1().int()
}).meta({ id: "CommentCountsResponse" });
object({ affected: number$1().int() }).meta({ id: "CommentBulkResponse" });
const authenticatorTransport$1 = _enum(["usb", "nfc", "ble", "internal", "hybrid"]);
const registrationCredential$1 = object({
  id: string(),
  rawId: string(),
  type: literal("public-key"),
  response: object({
    clientDataJSON: string(),
    attestationObject: string(),
    transports: array(authenticatorTransport$1).optional()
  }),
  authenticatorAttachment: _enum(["platform", "cross-platform"]).optional()
});
const authenticationCredential = object({
  id: string(),
  rawId: string(),
  type: literal("public-key"),
  response: object({
    clientDataJSON: string(),
    authenticatorData: string(),
    signature: string(),
    userHandle: string().optional()
  }),
  authenticatorAttachment: _enum(["platform", "cross-platform"]).optional()
});
const signupRequestBody = object({
  email: string().email()
}).meta({ id: "SignupRequestBody" });
const signupCompleteBody = object({
  token: string().min(1),
  credential: registrationCredential$1,
  name: string().optional()
}).meta({ id: "SignupCompleteBody" });
const inviteCreateBody = object({
  email: string().email(),
  role: roleLevel.optional()
}).meta({ id: "InviteCreateBody" });
const inviteCompleteBody = object({
  token: string().min(1),
  credential: registrationCredential$1,
  name: string().optional()
}).meta({ id: "InviteCompleteBody" });
const magicLinkSendBody = object({
  email: string().email()
}).meta({ id: "MagicLinkSendBody" });
const passkeyOptionsBody = object({
  email: string().email().optional()
}).meta({ id: "PasskeyOptionsBody" });
const passkeyVerifyBody = object({
  credential: authenticationCredential
}).meta({ id: "PasskeyVerifyBody" });
const passkeyRegisterOptionsBody = object({
  name: string().optional()
}).meta({ id: "PasskeyRegisterOptionsBody" });
const passkeyRegisterVerifyBody = object({
  credential: registrationCredential$1,
  name: string().optional()
}).meta({ id: "PasskeyRegisterVerifyBody" });
const passkeyRenameBody = object({
  name: string().min(1)
}).meta({ id: "PasskeyRenameBody" });
const authMeActionBody = object({
  action: string().min(1)
}).meta({ id: "AuthMeActionBody" });
const menuItemType = string().min(1);
const createMenuBody = object({
  name: string().min(1),
  label: string().min(1)
}).meta({ id: "CreateMenuBody" });
const updateMenuBody = object({
  label: string().min(1).optional()
}).meta({ id: "UpdateMenuBody" });
const createMenuItemBody = object({
  type: menuItemType,
  label: string().min(1),
  referenceCollection: string().optional(),
  referenceId: string().optional(),
  customUrl: string().optional(),
  target: string().optional(),
  titleAttr: string().optional(),
  cssClasses: string().optional(),
  parentId: string().optional(),
  sortOrder: number$1().int().min(0).optional()
}).meta({ id: "CreateMenuItemBody" });
const updateMenuItemBody = object({
  label: string().min(1).optional(),
  customUrl: string().optional(),
  target: string().optional(),
  titleAttr: string().optional(),
  cssClasses: string().optional(),
  parentId: string().nullish(),
  sortOrder: number$1().int().min(0).optional()
}).meta({ id: "UpdateMenuItemBody" });
const menuItemDeleteQuery = object({
  id: string().min(1)
});
const menuItemUpdateQuery = object({
  id: string().min(1)
});
const reorderMenuItemsBody = object({
  items: array(
    object({
      id: string().min(1),
      parentId: string().nullable(),
      sortOrder: number$1().int().min(0)
    })
  )
}).meta({ id: "ReorderMenuItemsBody" });
const menuSchema = object({
  id: string(),
  name: string(),
  label: string(),
  created_at: string(),
  updated_at: string()
}).meta({ id: "Menu" });
const menuItemSchema = object({
  id: string(),
  menu_id: string(),
  parent_id: string().nullable(),
  sort_order: number$1().int(),
  type: string(),
  reference_collection: string().nullable(),
  reference_id: string().nullable(),
  custom_url: string().nullable(),
  label: string(),
  title_attr: string().nullable(),
  target: string().nullable(),
  css_classes: string().nullable(),
  created_at: string()
}).meta({ id: "MenuItem" });
menuSchema.extend({
  itemCount: number$1().int()
}).meta({ id: "MenuListItem" });
menuSchema.extend({
  items: array(menuItemSchema)
}).meta({ id: "MenuWithItems" });
const collectionSlugPattern = /^[a-z][a-z0-9_]*$/;
const createTaxonomyDefBody = object({
  name: string().min(1).max(63).regex(/^[a-z][a-z0-9_]*$/, "Name must be lowercase alphanumeric with underscores"),
  label: string().min(1).max(200),
  hierarchical: boolean().optional().default(false),
  collections: array(
    string().min(1).max(63).regex(collectionSlugPattern, "Invalid collection slug format")
  ).max(100).optional().default([])
}).meta({ id: "CreateTaxonomyDefBody" });
const createTermBody = object({
  slug: string().min(1),
  label: string().min(1),
  parentId: string().nullish(),
  description: string().optional()
}).meta({ id: "CreateTermBody" });
const updateTermBody = object({
  slug: string().min(1).optional(),
  label: string().min(1).optional(),
  parentId: string().nullish(),
  description: string().optional()
}).meta({ id: "UpdateTermBody" });
const taxonomyDefSchema = object({
  id: string(),
  name: string(),
  label: string(),
  labelSingular: string().optional(),
  hierarchical: boolean(),
  collections: array(string())
}).meta({ id: "TaxonomyDef" });
object({ taxonomies: array(taxonomyDefSchema) }).meta({ id: "TaxonomyListResponse" });
const termSchema = object({
  id: string(),
  name: string(),
  slug: string(),
  label: string(),
  parentId: string().nullable(),
  description: string().optional()
}).meta({ id: "Term" });
const termWithCountSchema = object({
  id: string(),
  name: string(),
  slug: string(),
  label: string(),
  parentId: string().nullable(),
  description: string().optional(),
  count: number$1().int(),
  children: array(lazy(() => termWithCountSchema))
}).meta({ id: "TermWithCount" });
object({ terms: array(termWithCountSchema) }).meta({ id: "TermListResponse" });
object({ term: termSchema }).meta({ id: "TermResponse" });
object({
  term: termSchema.extend({
    count: number$1().int(),
    children: array(
      object({
        id: string(),
        slug: string(),
        label: string()
      })
    )
  })
}).meta({ id: "TermGetResponse" });
const sectionSource = _enum(["theme", "user", "import"]);
const sectionsListQuery = object({
  source: sectionSource.optional(),
  search: string().optional(),
  limit: number().int().min(1).max(100).optional(),
  cursor: string().optional()
}).meta({ id: "SectionsListQuery" });
const createSectionBody = object({
  slug: string().min(1),
  title: string().min(1),
  description: string().optional(),
  keywords: array(string()).optional(),
  content: array(record(string(), unknown())),
  previewMediaId: string().optional(),
  source: sectionSource.optional(),
  themeId: string().optional()
}).meta({ id: "CreateSectionBody" });
const updateSectionBody = object({
  slug: string().min(1).optional(),
  title: string().min(1).optional(),
  description: string().optional(),
  keywords: array(string()).optional(),
  content: array(record(string(), unknown())).optional(),
  previewMediaId: string().nullish()
}).meta({ id: "UpdateSectionBody" });
const sectionSchema = object({
  id: string(),
  slug: string(),
  title: string(),
  description: string().nullable(),
  keywords: array(string()).nullable(),
  content: array(record(string(), unknown())),
  previewMediaId: string().nullable(),
  source: string(),
  themeId: string().nullable(),
  createdAt: string(),
  updatedAt: string()
}).meta({ id: "Section" });
object({
  items: array(sectionSchema),
  nextCursor: string().optional()
}).meta({ id: "SectionListResponse" });
const mediaReference = object({
  mediaId: string(),
  alt: string().optional()
});
const socialSettings = object({
  twitter: string().optional(),
  github: string().optional(),
  facebook: string().optional(),
  instagram: string().optional(),
  linkedin: string().optional(),
  youtube: string().optional()
});
const seoSettings = object({
  titleSeparator: string().max(10).optional(),
  defaultOgImage: mediaReference.optional(),
  robotsTxt: string().max(5e3).optional(),
  googleVerification: string().max(100).optional(),
  bingVerification: string().max(100).optional()
});
const settingsUpdateBody = object({
  title: string().optional(),
  tagline: string().optional(),
  logo: mediaReference.optional(),
  favicon: mediaReference.optional(),
  url: union([httpUrl, literal("")]).optional(),
  postsPerPage: number$1().int().min(1).max(100).optional(),
  dateFormat: string().optional(),
  timezone: string().optional(),
  social: socialSettings.optional(),
  seo: seoSettings.optional()
}).meta({ id: "SettingsUpdateBody" });
object({
  title: string().optional(),
  tagline: string().optional(),
  logo: mediaReference.optional(),
  favicon: mediaReference.optional(),
  url: string().optional(),
  postsPerPage: number$1().int().optional(),
  dateFormat: string().optional(),
  timezone: string().optional(),
  social: socialSettings.optional(),
  seo: seoSettings.optional()
}).meta({ id: "SiteSettings" });
const searchQuery = object({
  q: string().min(1),
  collections: string().optional(),
  status: string().optional(),
  locale: localeCode.optional(),
  limit: number().int().min(1).max(100).optional()
}).meta({ id: "SearchQuery" });
const searchSuggestQuery = object({
  q: string().min(1),
  collections: string().optional(),
  locale: localeCode.optional(),
  limit: number().int().min(1).max(20).optional()
}).meta({ id: "SearchSuggestQuery" });
const searchRebuildBody = object({
  collection: string().min(1)
}).meta({ id: "SearchRebuildBody" });
const searchEnableBody = object({
  collection: string().min(1),
  enabled: boolean(),
  weights: record(string(), number$1()).optional()
}).meta({ id: "SearchEnableBody" });
const searchResultSchema = object({
  collection: string(),
  id: string(),
  slug: string().nullable(),
  locale: string(),
  title: string().optional(),
  snippet: string().optional(),
  score: number$1()
}).meta({ id: "SearchResult" });
object({
  items: array(searchResultSchema),
  nextCursor: string().optional()
}).meta({ id: "SearchResponse" });
const importProbeBody = object({
  url: httpUrl
});
const wpPluginAnalyzeBody = object({
  url: httpUrl,
  token: string().min(1)
});
const wpPluginExecuteBody = object({
  url: httpUrl,
  token: string().min(1),
  config: record(string(), unknown())
});
const wpPrepareBody = object({
  postTypes: array(
    object({
      name: string().min(1),
      collection: string().min(1),
      fields: array(
        object({
          slug: string().min(1),
          label: string().min(1),
          type: string().min(1),
          required: boolean(),
          searchable: boolean().optional()
        })
      ).optional()
    })
  )
});
const wpMediaImportBody = object({
  attachments: array(record(string(), unknown())),
  stream: boolean().optional()
});
const wpRewriteUrlsBody = object({
  urlMap: record(string(), string()),
  collections: array(string()).optional()
});
const authenticatorTransport = _enum(["usb", "nfc", "ble", "internal", "hybrid"]);
const registrationCredential = object({
  id: string(),
  rawId: string(),
  type: literal("public-key"),
  response: object({
    clientDataJSON: string(),
    attestationObject: string(),
    transports: array(authenticatorTransport).optional()
  }),
  authenticatorAttachment: _enum(["platform", "cross-platform"]).optional()
});
const setupBody = object({
  title: string().min(1),
  tagline: string().optional(),
  includeContent: boolean()
});
const setupAdminBody = object({
  email: string().email(),
  name: string().optional()
});
const setupAdminVerifyBody = object({
  credential: registrationCredential
});
const usersListQuery = object({
  search: string().optional(),
  role: string().optional(),
  cursor: string().optional(),
  limit: number().int().min(1).max(100).optional().default(50)
}).meta({ id: "UsersListQuery" });
const userUpdateBody = object({
  name: string().optional(),
  email: string().email().optional(),
  role: roleLevel.optional()
}).meta({ id: "UserUpdateBody" });
const allowedDomainCreateBody = object({
  domain: string().min(1),
  defaultRole: roleLevel
}).meta({ id: "AllowedDomainCreateBody" });
const allowedDomainUpdateBody = object({
  enabled: boolean().optional(),
  defaultRole: roleLevel.optional()
}).meta({ id: "AllowedDomainUpdateBody" });
const userSchema = object({
  id: string(),
  email: string(),
  name: string().nullable(),
  avatarUrl: string().nullable(),
  role: number$1().int(),
  emailVerified: boolean(),
  disabled: boolean(),
  createdAt: string(),
  updatedAt: string(),
  lastLogin: string().nullable(),
  credentialCount: number$1().int().optional(),
  oauthProviders: array(string()).optional()
}).meta({ id: "User" });
object({
  items: array(userSchema),
  nextCursor: string().optional()
}).meta({ id: "UserListResponse" });
object({
  id: string(),
  email: string(),
  name: string().nullable(),
  avatarUrl: string().nullable(),
  role: number$1().int(),
  emailVerified: boolean(),
  disabled: boolean(),
  createdAt: string(),
  updatedAt: string(),
  lastLogin: string().nullable(),
  credentials: array(
    object({
      id: string(),
      name: string().nullable(),
      deviceType: string().nullable(),
      createdAt: string(),
      lastUsedAt: string()
    })
  ),
  oauthAccounts: array(
    object({
      provider: string(),
      createdAt: string()
    })
  )
}).meta({ id: "UserDetail" });
const widgetType = _enum(["content", "menu", "component"]);
const createWidgetAreaBody = object({
  name: string().min(1),
  label: string().min(1),
  description: string().optional()
}).meta({ id: "CreateWidgetAreaBody" });
const createWidgetBody = object({
  type: widgetType,
  title: string().optional(),
  content: array(record(string(), unknown())).optional(),
  menuName: string().optional(),
  componentId: string().optional(),
  componentProps: record(string(), unknown()).optional()
}).meta({ id: "CreateWidgetBody" });
const updateWidgetBody = object({
  type: widgetType.optional(),
  title: string().optional(),
  content: array(record(string(), unknown())).optional(),
  menuName: string().optional(),
  componentId: string().optional(),
  componentProps: record(string(), unknown()).optional()
}).meta({ id: "UpdateWidgetBody" });
const reorderWidgetsBody = object({
  widgetIds: array(string().min(1))
}).meta({ id: "ReorderWidgetsBody" });
const widgetAreaSchema = object({
  id: string(),
  name: string(),
  label: string(),
  description: string().nullable(),
  created_at: string(),
  updated_at: string()
}).meta({ id: "WidgetArea" });
const widgetSchema = object({
  id: string(),
  area_id: string(),
  type: string(),
  title: string().nullable(),
  content: string().nullable(),
  menu_name: string().nullable(),
  component_id: string().nullable(),
  component_props: string().nullable(),
  sort_order: number$1().int(),
  created_at: string(),
  updated_at: string()
}).meta({ id: "Widget" });
widgetAreaSchema.extend({
  widgets: array(widgetSchema)
}).meta({ id: "WidgetAreaWithWidgets" });
const redirectType = number().int().refine((n) => [301, 302, 307, 308].includes(n), {
  message: "Redirect type must be 301, 302, 307, or 308"
});
const CRLF = /[\r\n]/;
const urlPath = string().min(1).refine((s) => s.startsWith("/") && !s.startsWith("//"), {
  message: "Must be a path starting with / (no protocol-relative URLs)"
}).refine((s) => !CRLF.test(s), {
  message: "URL must not contain newline characters"
}).refine(
  (s) => {
    try {
      return !decodeURIComponent(s).split("/").includes("..");
    } catch {
      return false;
    }
  },
  { message: "URL must not contain path traversal segments" }
);
const createRedirectBody = object({
  source: urlPath,
  destination: urlPath,
  type: redirectType.optional().default(301),
  enabled: boolean().optional().default(true),
  groupName: string().nullish()
}).meta({ id: "CreateRedirectBody" });
const updateRedirectBody = object({
  source: urlPath.optional(),
  destination: urlPath.optional(),
  type: redirectType.optional(),
  enabled: boolean().optional(),
  groupName: string().nullish()
}).refine((o) => Object.values(o).some((v) => v !== void 0), {
  message: "At least one field must be provided"
}).meta({ id: "UpdateRedirectBody" });
const redirectsListQuery = cursorPaginationQuery.extend({
  search: string().optional(),
  group: string().optional(),
  enabled: _enum(["true", "false"]).transform((v) => v === "true").optional(),
  auto: _enum(["true", "false"]).transform((v) => v === "true").optional()
}).meta({ id: "RedirectsListQuery" });
const notFoundListQuery = cursorPaginationQuery.extend({
  search: string().optional()
}).meta({ id: "NotFoundListQuery" });
const notFoundSummaryQuery = object({
  limit: number().int().min(1).max(100).optional().default(50)
});
const notFoundPruneBody = object({
  olderThan: string().datetime({ message: "olderThan must be an ISO 8601 datetime" })
}).meta({ id: "NotFoundPruneBody" });
const redirectSchema = object({
  id: string(),
  source: string(),
  destination: string(),
  type: number$1().int(),
  isPattern: boolean(),
  enabled: boolean(),
  hits: number$1().int(),
  lastHitAt: string().nullable(),
  groupName: string().nullable(),
  auto: boolean(),
  createdAt: string(),
  updatedAt: string()
}).meta({ id: "Redirect" });
object({
  items: array(redirectSchema),
  nextCursor: string().optional()
}).meta({ id: "RedirectListResponse" });
const notFoundEntrySchema = object({
  id: string(),
  path: string(),
  referrer: string().nullable(),
  userAgent: string().nullable(),
  ip: string().nullable(),
  createdAt: string()
}).meta({ id: "NotFoundEntry" });
object({
  items: array(notFoundEntrySchema),
  nextCursor: string().optional()
}).meta({ id: "NotFoundListResponse" });
const notFoundSummarySchema = object({
  path: string(),
  count: number$1().int(),
  lastSeen: string(),
  topReferrer: string().nullable()
}).meta({ id: "NotFoundSummary" });
object({ items: array(notFoundSummarySchema) }).meta({ id: "NotFoundSummaryResponse" });
export {
  createCollectionBody as $,
  contentCreateBody as A,
  importProbeBody as B,
  wpMediaImportBody as C,
  wpPrepareBody as D,
  wpPluginAnalyzeBody as E,
  wpPluginExecuteBody as F,
  mediaUploadUrlBody as G,
  mediaConfirmBody as H,
  mediaUpdateBody as I,
  createMenuItemBody as J,
  updateMenuItemBody as K,
  menuItemUpdateQuery as L,
  menuItemDeleteQuery as M,
  reorderMenuItemsBody as N,
  updateMenuBody as O,
  createMenuBody as P,
  notFoundSummaryQuery as Q,
  notFoundListQuery as R,
  notFoundPruneBody as S,
  updateRedirectBody as T,
  redirectsListQuery as U,
  createRedirectBody as V,
  fieldReorderBody as W,
  updateFieldBody as X,
  createFieldBody as Y,
  collectionGetQuery as Z,
  updateCollectionBody as _,
  allowedDomainUpdateBody as a,
  orphanRegisterBody as a0,
  searchEnableBody as a1,
  searchRebuildBody as a2,
  searchSuggestQuery as a3,
  searchQuery as a4,
  updateSectionBody as a5,
  sectionsListQuery as a6,
  createSectionBody as a7,
  setupAdminVerifyBody as a8,
  setupAdminBody as a9,
  updateTermBody as aa,
  createTermBody as ab,
  createTaxonomyDefBody as ac,
  reorderWidgetsBody as ad,
  updateWidgetBody as ae,
  createWidgetBody as af,
  createWidgetAreaBody as ag,
  createCommentBody as ah,
  wpRewriteUrlsBody as ai,
  settingsUpdateBody as aj,
  mediaListQuery as ak,
  setupBody as al,
  allowedDomainCreateBody as b,
  bylineUpdateBody as c,
  bylinesListQuery as d,
  bylineCreateBody as e,
  commentBulkBody as f,
  commentStatusBody as g,
  commentListQuery as h,
  usersListQuery as i,
  inviteCompleteBody as j,
  inviteCreateBody as k,
  authMeActionBody as l,
  magicLinkSendBody as m,
  passkeyRegisterOptionsBody as n,
  passkeyRegisterVerifyBody as o,
  passkeyOptionsBody as p,
  passkeyVerifyBody as q,
  passkeyRenameBody as r,
  signupCompleteBody as s,
  signupRequestBody as t,
  userUpdateBody as u,
  contentTrashQuery as v,
  contentScheduleBody as w,
  contentTermsBody as x,
  contentUpdateBody as y,
  contentListQuery as z
};
