import test from "node:test";
import assert from "node:assert/strict";
import records from "../data/solutions/solutions.pages.manifest.json";
import requiredRoutes from "../data/solutions/solutions.routes.manifest.json";
import navigation from "../data/solutions/solutions.navigation.manifest.json";
import { pages, getPage, getBreadcrumbs } from "../lib/solutions/pages";
import { validateSolutions } from "../lib/solutions/validate";
import { isIndexable, pageMetadata, safeJsonLd, structuredData } from "../lib/seo";

test("all 71 canonical records match the route contract and solution-family counts", () => {
  assert.equal(pages.length, 71);
  assert.equal(requiredRoutes.length, 71);
  assert.deepEqual(validateSolutions(records, requiredRoutes), []);
  assert.equal(pages.filter((page) => page.pageType === "hub").length, 4);
  assert.equal(pages.filter((page) => page.parent && page.parent !== "home").length, 62);
  assert.equal(navigation.families.length, 8);
  assert.equal(navigation.menus.flatMap((group) => group.links).length, 11);
  assert.ok(navigation.menus.flatMap((group) => group.links).length < pages.length);
  assert.equal(new Set(pages.map((page) => page.canonicalUrl)).size, 71);
  assert.equal(new Set(pages.map((page) => page.metaTitle)).size, 71);
  assert.equal(new Set(pages.map((page) => page.metaDescription)).size, 71);
});
test("route validation rejects duplicates, route prefixes, broken relationships and parent cycles", () => {
  const broken = structuredClone(pages);
  const child = broken.find((page) => page.id === "working-capital-gap")!;
  child.route = "/solutions/working-capital-gap";
  child.canonicalUrl = "https://wrong.example/working-capital-gap";
  child.parent = "missing";
  child.relatedSolutions.push("missing-page");
  broken.push(structuredClone(child));
  const errors = validateSolutions(broken, requiredRoutes).join("\n");
  for (const issue of ["Duplicate id", "Duplicate route", "Duplicate canonicalUrl", "Malformed route", "Canonical mismatch", "Missing parent/orphan", "Broken related solution"]) assert.ok(errors.includes(issue), issue);
});
test("parent-derived breadcrumbs reflect the canonical hierarchy", () => {
  assert.deepEqual(getBreadcrumbs(getPage("accounts-receivable-cash-flow")!).map((page) => page.route), ["/", "/improve-cash-flow", "/accounts-receivable-cash-flow"]);
  assert.deepEqual(getBreadcrumbs(getPage("buy-or-sell-a-business")!).map((page) => page.route), ["/", "/buy-or-sell-a-business"]);
});
test("indexing requires production, explicit enablement, both editorial approvals, and a review date", () => {
  const page = getPage("improve-cash-flow")!;
  const approved = { ...page, status: "index" as const, indexStatus: "index" as const, lastReviewed: "2026-10-23" };
  assert.equal(isIndexable(page, true, "production"), false);
  assert.equal(isIndexable(approved, true, "preview"), false);
  assert.equal(isIndexable(approved, true, undefined), false);
  assert.equal(isIndexable({ ...approved, lastReviewed: null }, true, "production"), false);
  assert.equal(isIndexable({ ...approved, indexStatus: "noindex" }, true, "production"), false);
  assert.equal(isIndexable({ ...approved, status: "review" }, true, "production"), false);
  assert.equal(isIndexable(approved, false, "production"), false);
  assert.equal(isIndexable(approved, true, "production"), true);
});
test("metadata and JSON-LD carry canonical SEO without unsupported rating claims", () => {
  const page = getPage("business-acquisition-financing")!;
  assert.equal(pageMetadata(page).alternates?.canonical, page.canonicalUrl);
  assert.deepEqual(pageMetadata(page).robots, { index: false, follow: true });
  assert.ok(JSON.stringify(structuredData(page)).includes("BreadcrumbList"));
  assert.ok(!JSON.stringify(structuredData(page)).includes("AggregateRating"));
  assert.ok(!safeJsonLd({ value: "</script><script>bad</script>" }).includes("<"));
});
