import fs from "node:fs";
import records from "../data/solutions/solutions.pages.manifest.json";
import requiredRoutes from "../data/solutions/solutions.routes.manifest.json";
import navigation from "../data/solutions/solutions.navigation.manifest.json";
import { validateSolutions } from "../lib/solutions/validate";
const errors = validateSolutions(records, requiredRoutes);
const routeSet = new Set(requiredRoutes);
for (const group of navigation.menus) for (const link of group.links) if (!routeSet.has(link.route)) errors.push(`Broken navigation link: ${group.label} -> ${link.route}`);
if (new Set(navigation.menus.flatMap((group) => group.links.map((link) => link.route))).size !== navigation.menus.flatMap((group) => group.links).length) errors.push("Duplicate header menu route");
if (navigation.menus.flatMap((group) => group.links).length >= requiredRoutes.length) errors.push("Header navigation must be intentionally smaller than the canonical sitemap");
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
const pageRecords = records as { pageType: string; parent: string | null }[];
const routes = fs.readFileSync("CANONICAL-SITEMAP.txt", "utf8").trim().split(/\r?\n/);
if (routes.length !== records.length || routes.some((route, index) => route !== requiredRoutes[index])) { console.error(`Canonical sitemap does not exactly match its ${records.length}-route manifest.`); process.exit(1); }
console.log(`Validated ${records.length} pages and ${requiredRoutes.length} required routes.`);
console.log("0 duplicate IDs/slugs/routes/canonicals; 0 orphaned parents; 0 broken relationships; 0 missing metadata; 0 malformed external URLs; 0 route prefix violations.");
console.log(`Page mix: ${pageRecords.filter((page) => page.parent === "home").length} solution-family hubs, ${pageRecords.filter((page) => page.parent && page.parent !== "home").length} child pages.`);
