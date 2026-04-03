globalThis.process ??= {};
globalThis.process.env ??= {};
import "./adapt-sandbox-entry_DgOh8so3.mjs";
import "./index_lite_CWDp5SAU.mjs";
import "./index_DFnuKuIX.mjs";
import { g as getEmDashCollection } from "./query-CS_iSj34_lQDETB4f.mjs";
const siteTitle = "My Blog";
const siteDescription = "A blog about software, design, and the occasional stray thought.";
const GET = async ({ site, url }) => {
  const siteUrl = site?.toString() || url.origin;
  const { entries: posts } = await getEmDashCollection("posts", {
    orderBy: { published_at: "desc" },
    limit: 20
  });
  const items = posts.map((post) => {
    if (!post.data.publishedAt) return null;
    const pubDate = post.data.publishedAt.toUTCString();
    const postUrl = `${siteUrl}/posts/${post.id}`;
    const title = escapeXml(post.data.title || "Untitled");
    const description = escapeXml(post.data.excerpt || "");
    return `    <item>
      <title>${title}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
  }).filter(Boolean).join("\n");
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <description>${escapeXml(siteDescription)}</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${(/* @__PURE__ */ new Date()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;
  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
};
const XML_ESCAPE_PATTERNS = [
  [/&/g, "&amp;"],
  [/</g, "&lt;"],
  [/>/g, "&gt;"],
  [/"/g, "&quot;"],
  [/'/g, "&apos;"]
];
function escapeXml(str) {
  let result = str;
  for (const [pattern, replacement] of XML_ESCAPE_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
