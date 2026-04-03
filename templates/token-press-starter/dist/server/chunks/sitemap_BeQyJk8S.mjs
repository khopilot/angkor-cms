globalThis.process ??= {};
globalThis.process.env ??= {};
import { s as sql } from "./sql_DV5B95Nm.mjs";
import { v as validateIdentifier } from "./validate_Dvrjbe51.mjs";
import { g as getSiteSettingsWithDb } from "./index_nWW4h820.mjs";
const SITEMAP_MAX_ENTRIES = 5e4;
async function handleSitemapData(db) {
  try {
    const collections = await db.selectFrom("_emdash_collections").select(["slug"]).where("has_seo", "=", 1).execute();
    const entries = [];
    for (const col of collections) {
      if (entries.length >= SITEMAP_MAX_ENTRIES) break;
      try {
        validateIdentifier(col.slug, "collection slug");
      } catch {
        console.warn(`[SITEMAP] Skipping collection with invalid slug: ${col.slug}`);
        continue;
      }
      const tableName = `ec_${col.slug}`;
      const remaining = SITEMAP_MAX_ENTRIES - entries.length;
      try {
        const rows = await sql`
					SELECT c.slug, c.id, c.updated_at
					FROM ${sql.ref(tableName)} c
					LEFT JOIN _emdash_seo s
						ON s.collection = ${col.slug}
						AND s.content_id = c.id
					WHERE c.status = 'published'
					AND c.deleted_at IS NULL
					AND (s.seo_no_index IS NULL OR s.seo_no_index = 0)
					ORDER BY c.updated_at DESC
					LIMIT ${remaining}
				`.execute(db);
        for (const row of rows.rows) {
          entries.push({
            collection: col.slug,
            identifier: row.slug || row.id,
            updatedAt: row.updated_at
          });
        }
      } catch (err) {
        console.warn(`[SITEMAP] Failed to query collection "${col.slug}":`, err);
        continue;
      }
    }
    return { success: true, data: { entries } };
  } catch (error) {
    console.error("[SITEMAP_ERROR]", error);
    return {
      success: false,
      error: { code: "SITEMAP_ERROR", message: "Failed to generate sitemap data" }
    };
  }
}
const prerender = false;
const TRAILING_SLASH_RE = /\/$/;
const AMP_RE = /&/g;
const LT_RE = /</g;
const GT_RE = />/g;
const QUOT_RE = /"/g;
const APOS_RE = /'/g;
const GET = async ({ locals, url }) => {
  const { emdash } = locals;
  if (!emdash?.db) {
    return new Response("<!-- EmDash not configured -->", {
      status: 500,
      headers: { "Content-Type": "application/xml" }
    });
  }
  try {
    const settings = await getSiteSettingsWithDb(emdash.db);
    const siteUrl = (settings.url || url.origin).replace(TRAILING_SLASH_RE, "");
    const result = await handleSitemapData(emdash.db);
    if (!result.success || !result.data) {
      return new Response("<!-- Failed to generate sitemap -->", {
        status: 500,
        headers: { "Content-Type": "application/xml" }
      });
    }
    const entries = result.data.entries;
    const lines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ];
    for (const entry of entries) {
      const loc = `${siteUrl}/${encodeURIComponent(entry.collection)}/${encodeURIComponent(entry.identifier)}`;
      lines.push("  <url>");
      lines.push(`    <loc>${escapeXml(loc)}</loc>`);
      lines.push(`    <lastmod>${escapeXml(entry.updatedAt)}</lastmod>`);
      lines.push("    <changefreq>weekly</changefreq>");
      lines.push("    <priority>0.7</priority>");
      lines.push("  </url>");
    }
    lines.push("</urlset>");
    return new Response(lines.join("\n"), {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch {
    return new Response("<!-- Internal error generating sitemap -->", {
      status: 500,
      headers: { "Content-Type": "application/xml" }
    });
  }
};
function escapeXml(str) {
  return str.replace(AMP_RE, "&amp;").replace(LT_RE, "&lt;").replace(GT_RE, "&gt;").replace(QUOT_RE, "&quot;").replace(APOS_RE, "&apos;");
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
