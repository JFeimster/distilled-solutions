import { pages } from "@/lib/solutions/pages";
import { site } from "@/lib/config";
const origin = process.env.AUDIT_ORIGIN ?? "http://127.0.0.1:3000";
const failures: string[] = [];
for (const page of pages) {
  const url = `${origin}${page.route === "/" ? "/" : page.route}`;
  const response = await fetch(url);
  const html = await response.text();
  if (response.status !== 200) failures.push(`${page.route}: HTTP ${response.status}`);
  if (!html.includes(`rel="canonical" href="${page.canonicalUrl}"`)) failures.push(`${page.route}: canonical missing/mismatched`);
  if (!html.includes('name="robots" content="noindex, follow"')) failures.push(`${page.route}: expected noindex metadata missing`);
  if (!html.includes(page.title)) failures.push(`${page.route}: page title missing from HTML`);
  for (const match of html.matchAll(/<a\b[^>]*\bhref="(\/[^"#?]*)"/g)) {
    const path = match[1]!;
    if (path !== "/" && !pages.some((item) => item.route === path)) failures.push(`${page.route}: unresolved internal href ${path}`);
  }
}
const missing = await fetch(`${origin}/not-a-canonical-route`);
if (missing.status !== 404) failures.push(`Unknown route returned ${missing.status}, expected 404.`);
const mapResponse = await fetch(`${origin}/sitemap.xml`);
const mapText = await mapResponse.text();
if (!mapText.includes("<urlset")) failures.push("Sitemap XML missing urlset.");
if (mapText.includes(site.siteUrl)) failures.push("Preview sitemap should be empty while indexing is disabled.");
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`Production HTTP audit passed: ${pages.length} canonical routes, noindex metadata, canonicals, internal links, empty preview sitemap, and genuine 404.`);
