import fs from "node:fs";
import records from "../data/solutions/solutions.pages.manifest.json";
import playbookRecords from "../data/solutions/solutions.playbooks.manifest.json";
import requiredRoutes from "../data/solutions/solutions.core-routes.manifest.json";
import canonicalRoutes from "../data/solutions/solutions.routes.manifest.json";
import navigation from "../data/solutions/solutions.navigation.manifest.json";
import { validateSolutions } from "../lib/solutions/validate";
import { playbookIndexSchema, playbookSchema, type PlaybookPage } from "../schemas/playbooks";
import site from "../data/config/site.json";
const errors = validateSolutions(records, requiredRoutes);
const playbookRoutes = playbookRecords.map((record) => record.route);
const allRoutes = [...requiredRoutes, ...playbookRoutes];
const routeSet = new Set(allRoutes);
const indexRecord = playbookRecords.find((record) => record.kind === "index");
const playbooks = playbookRecords.filter((record) => record.kind === "playbook");
if (requiredRoutes.length !== 71) errors.push(`The preserved Solutions route contract must remain 71; found ${requiredRoutes.length}.`);
if (playbookRecords.length !== 13 || !indexRecord || playbooks.length !== 12) errors.push(`Playbooks must contain one index and twelve playbooks; found ${playbookRecords.length} records.`);
for (const [index, record] of (playbookRecords as unknown as PlaybookPage[]).entries()) {
  const result = record.kind === "index" ? playbookIndexSchema.safeParse(record) : playbookSchema.safeParse(record);
  if (!result.success) errors.push(`Playbook record ${index} schema: ${result.error.message}`);
  if (record.canonicalUrl !== `${site.siteUrl}${record.route}`) errors.push(`Playbook canonical mismatch: ${record.id}`);
  if (record.status !== "review" || record.indexStatus !== "noindex" || record.lastReviewed !== null) errors.push(`New Playbook must remain review/noindex without a review date: ${record.id}`);
  if (record.kind === "playbook") {
    for (const route of record.relatedRoutes) if (!routeSet.has(route)) errors.push(`Broken Playbook related route: ${record.id} -> ${route}`);
    for (const crumb of record.breadcrumbs) if (!routeSet.has(crumb.route.split("#")[0]!)) errors.push(`Broken Playbook breadcrumb: ${record.id} -> ${crumb.route}`);
    for (const source of record.sources) {
      try { const url = new URL(source.href); if (url.protocol !== "https:" || url.username || url.password) errors.push(`Malformed Playbook source URL: ${record.id} -> ${source.href}`); }
      catch { errors.push(`Malformed Playbook source URL: ${record.id} -> ${source.href}`); }
    }
  } else {
    for (const category of record.categories) for (const id of category.relatedRoutes) if (!routeSet.has(`/${id}`)) errors.push(`Broken Playbook category route: ${category.id} -> ${id}`);
  }
}
if (new Set(playbookRecords.map((record) => record.id)).size !== 13) errors.push("Duplicate Playbook IDs.");
if (new Set(playbookRoutes).size !== 13) errors.push("Duplicate Playbook routes.");
if (new Set(allRoutes).size !== 84) errors.push(`The complete route contract must contain 84 unique routes; found ${new Set(allRoutes).size}.`);
if (JSON.stringify(canonicalRoutes) !== JSON.stringify(allRoutes)) errors.push("Combined route manifest must equal the 71 Solutions routes plus 13 Playbook routes in order.");
for (const group of navigation.menus) for (const link of group.links) if (!routeSet.has(link.route)) errors.push(`Broken navigation link: ${group.label} -> ${link.route}`);
if (new Set(navigation.menus.flatMap((group) => group.links.map((link) => link.route))).size !== navigation.menus.flatMap((group) => group.links).length) errors.push("Duplicate header menu route");
if (navigation.menus.flatMap((group) => group.links).length >= canonicalRoutes.length) errors.push("Header navigation must be intentionally smaller than the canonical sitemap");
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
const pageRecords = records as { pageType: string; parent: string | null }[];
const routes = fs.readFileSync("CANONICAL-SITEMAP.txt", "utf8").trim().split(/\r?\n/);
if (routes.length !== canonicalRoutes.length || routes.some((route, index) => route !== canonicalRoutes[index])) { console.error(`Canonical sitemap does not exactly match its ${canonicalRoutes.length}-route manifest.`); process.exit(1); }
console.log(`Validated ${records.length} Solutions pages, ${playbooks.length} playbooks and index, and ${canonicalRoutes.length} unique routes.`);
console.log("0 duplicate IDs/slugs/routes/canonicals; 0 orphaned parents; 0 broken relationships; 0 missing metadata; 0 malformed external URLs; 0 route prefix violations.");
console.log(`Page mix: ${pageRecords.filter((page) => page.parent === "home").length} solution-family hubs, ${pageRecords.filter((page) => page.parent && page.parent !== "home").length} child pages.`);
