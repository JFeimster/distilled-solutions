import site from "../data/config/site.json";
import coreRoutes from "../data/solutions/solutions.core-routes.manifest.json";
import routes from "../data/solutions/solutions.routes.manifest.json";
import config from "../next.config";
import { pages } from "../lib/solutions/pages";
import { playbookPages } from "../lib/solutions/playbooks";
import { indexableSitemapEntries, isIndexable } from "../lib/seo";

const records = [...pages, ...playbookPages];
let failures = 0;
function report(status: "PASS" | "BLOCKED" | "NOT VERIFIED", item: string, detail: string) {
  console.log(`${status} | ${item} | ${detail}`);
}
function check(item: string, condition: boolean, detail: string) {
  report(condition ? "PASS" : "BLOCKED", item, detail);
  if (!condition) failures++;
}

check("Canonical domain", site.siteUrl === "https://solutions.distilledfunding.com", site.siteUrl);
check("Route contract", coreRoutes.length === 71 && routes.length === 84 && new Set(routes).size === 84 &&
  records.length === 84 && records.every((page, index) => page.route === routes[index]),
  `${coreRoutes.length} Solutions routes; ${routes.length} total routes`);
check("Canonical records", records.every((page) => page.canonicalUrl === `${site.siteUrl}${page.route === "/" ? "" : page.route}`),
  "Every generated canonical URL uses the configured host");

const headerRules = await config.headers?.();
const aliasNoindex = headerRules?.some((rule) => rule.source === "/:path*" &&
  rule.missing?.some((match) => match.type === "host" && match.value === "solutions.distilledfunding.com") &&
  rule.headers.some((header) => header.key.toLowerCase() === "x-robots-tag" && header.value === "noindex"));
check("Noncanonical host safeguard", !!aliasNoindex, "Host-scoped X-Robots-Tag: noindex without a premature redirect");

const eligible = records.filter((page) => isIndexable(page));
const sitemap = indexableSitemapEntries(records);
check("Index and sitemap consistency", sitemap.length === eligible.length &&
  sitemap.every((entry, index) => entry.url === eligible[index]?.canonicalUrl && entry.lastModified === eligible[index]?.lastReviewed),
  `${eligible.length} eligible routes; ${sitemap.length} sitemap entries`);
report("PASS", "Indexing flag", `ALLOW_INDEXING=${process.env.ALLOW_INDEXING === "true" ? "true" : "false"}; VERCEL_ENV=${process.env.VERCEL_ENV ?? "unset"}`);
if (eligible.length === 0) report("PASS", "Current noindex state", "No routes are eligible under this environment and editorial state");
else report("PASS", "Selective eligibility", eligible.map((page) => page.route).join(", "));

report("NOT VERIFIED", "Attached domain, DNS and HTTPS", "Check connected Vercel and authoritative DNS during Gate B");
report("NOT VERIFIED", "Provider redirect", "Configure and test only after the canonical host serves production over HTTPS");
report("BLOCKED", "Launch gates", "Domain activation, route-level editorial approval, and production indexing activation require separate owner authorization");
console.log(failures ? `Code preflight failed: ${failures} invariant(s).` : "Code preflight passed; owner launch gates remain pending.");
if (failures) process.exitCode = 1;
