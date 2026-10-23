import { pageSchema, solutionFamilies, type SolutionPage } from "@/schemas/solutions";
import { site } from "@/lib/config";

const routePattern = /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*)?$/;
export function validateSolutions(records: unknown[], requiredRoutes: string[]) {
  const errors: string[] = [];
  const valid: SolutionPage[] = [];
  for (const [index, record] of records.entries()) {
    const result = pageSchema.safeParse(record);
    if (result.success) valid.push(result.data);
    else errors.push(`Record ${index}: ${result.error.message}`);
  }
  for (const key of ["id", "slug", "route", "canonicalUrl"] as const) {
    const seen = new Set<string>();
    for (const page of valid) { if (seen.has(page[key])) errors.push(`Duplicate ${key}: ${page[key]}`); seen.add(page[key]); }
  }
  const byId = new Map(valid.map((page) => [page.id, page]));
  const routes = new Set(valid.map((page) => page.route));
  for (const route of requiredRoutes) if (!routes.has(route)) errors.push(`Missing required route: ${route}`);
  if (new Set(requiredRoutes).size !== requiredRoutes.length) errors.push("Duplicate required route contract");
  for (const page of valid) {
    if (!routePattern.test(page.route)) errors.push(`Malformed route or forbidden prefix: ${page.route}`);
    if (page.slug !== (page.route === "/" ? "home" : page.route.slice(1))) errors.push(`Slug mismatch: ${page.id}`);
    if (page.canonicalUrl !== `${site.siteUrl}${page.route === "/" ? "" : page.route}`) errors.push(`Canonical mismatch: ${page.id}`);
    if (page.route === "/" && (page.parent || page.id !== "home")) errors.push("Root must be home and have no parent");
    if (page.route !== "/" && (!page.parent || !byId.has(page.parent))) errors.push(`Missing parent/orphan: ${page.id}`);
    if (page.parent && !byId.has(page.parent)) errors.push(`Invalid parent reference: ${page.id} -> ${page.parent}`);
    if (page.solutionFamily && !solutionFamilies.includes(page.solutionFamily)) errors.push(`Invalid solution family: ${page.id}`);
    if (page.status === "index" && (page.indexStatus !== "index" || !page.lastReviewed)) errors.push(`Indexing without review date/status: ${page.id}`);
    if (page.status === "draft" && page.indexStatus !== "draft") errors.push(`Draft status mismatch: ${page.id}`);
    if (page.parent && byId.get(page.parent)?.status === "draft" && page.status !== "draft") errors.push(`Visible child of draft parent: ${page.id}`);
    for (const related of page.relatedSolutions) if (!byId.has(related)) errors.push(`Broken related solution: ${page.id} -> ${related}`);
    for (const related of page.internalLinks) if (!byId.has(related)) errors.push(`Broken internal link: ${page.id} -> ${related}`);
    for (const crumb of page.breadcrumbs) if (!byId.has(crumb)) errors.push(`Broken breadcrumb: ${page.id} -> ${crumb}`);
    for (const link of [...page.fundingConnections, ...page.toolConnections, ...page.acquireConnections]) {
      try { const url = new URL(link.href); if (url.protocol !== "https:" || url.username || url.password) errors.push(`Malformed external URL: ${page.id} -> ${link.href}`); }
      catch { errors.push(`Malformed external URL: ${page.id} -> ${link.href}`); }
    }
    const seen = new Set<string>(); let current: SolutionPage | undefined = page;
    while (current) { if (seen.has(current.id)) { errors.push(`Parent cycle: ${page.id}`); break; } seen.add(current.id); current = current.parent ? byId.get(current.parent) : undefined; }
  }
  for (const family of solutionFamilies) if (!valid.some((page) => page.id === family && page.pageType === "hub" || page.id === family && page.pageType === "service" || page.id === family && page.pageType === "assessment")) errors.push(`Missing family hub: ${family}`);
  for (const route of routes) if (route.startsWith("/solutions/")) errors.push(`Unwanted /solutions prefix: ${route}`);
  return errors;
}
