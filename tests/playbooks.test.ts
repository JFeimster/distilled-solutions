import test from "node:test";
import assert from "node:assert/strict";
import catalog from "../data/solutions/catalog.json";
import playbookRecords from "../data/solutions/solutions.playbooks.manifest.json";
import coreRoutes from "../data/solutions/solutions.core-routes.manifest.json";
import allRoutes from "../data/solutions/solutions.routes.manifest.json";
import { pages } from "../lib/solutions/pages";
import { formatPlaybookChecklist, getPlaybookByRoute, playbookIndex, playbooks } from "../lib/solutions/playbooks";
import { isIndexable, playbookMetadata } from "../lib/seo";
import { playbookIndexSchema, playbookSchema } from "../schemas/playbooks";

test("preserves the original 71 Solutions routes and adds one index plus twelve Playbooks", () => {
  assert.equal(pages.length, 71);
  assert.equal(coreRoutes.length, 71);
  assert.equal(playbookRecords.length, 13);
  assert.equal(playbooks.length, 12);
  assert.equal(allRoutes.length, 84);
  assert.equal(new Set(allRoutes).size, 84);
  assert.deepEqual(allRoutes.slice(0, 71), coreRoutes);
  assert.deepEqual(allRoutes.slice(71), playbookRecords.map((item) => item.route));
  assert.equal(playbookIndex.route, "/playbooks");
  assert.equal(getPlaybookByRoute("/playbooks"), playbookIndex);
});

test("all six categories contain two distinct playbooks and link to existing Solutions routes", () => {
  assert.equal(playbookIndex.categories.length, 6);
  for (const category of playbookIndex.categories) {
    const categoryPlaybooks = playbooks.filter((page) => page.categoryId === category.id);
    assert.equal(categoryPlaybooks.length, 2, category.id);
    for (const id of category.relatedRoutes) assert.ok(coreRoutes.includes(`/${id}`), `${category.id}: ${id}`);
  }
});

test("Playbook content, canonical URLs, breadcrumbs, links, and noindex state validate", () => {
  assert.equal(playbookIndexSchema.safeParse(playbookIndex).success, true);
  assert.equal(playbooks.every((page) => playbookSchema.safeParse(page).success), true);
  const routeSet = new Set(allRoutes);
  for (const page of playbooks) {
    assert.equal(page.canonicalUrl, `https://solutions.distilledfunding.com${page.route}`);
    assert.equal(page.status, "review");
    assert.equal(page.indexStatus, "noindex");
    assert.equal(page.lastReviewed, null);
    assert.equal(isIndexable(page, true, "production"), false);
    assert.deepEqual(playbookMetadata(page).robots, { index: false, follow: true });
    assert.ok(page.steps.length >= 4);
    assert.ok(page.evidence.length >= 4);
    assert.ok(page.checklist.length >= 4);
    assert.ok(page.decisionCriteria.length >= 3);
    assert.ok(page.failureModes.length >= 3);
    for (const route of page.relatedRoutes) assert.ok(routeSet.has(route), `${page.id}: ${route}`);
    for (const breadcrumb of page.breadcrumbs) assert.ok(routeSet.has(breadcrumb.route.split("#")[0]!), `${page.id}: ${breadcrumb.route}`);
    for (const source of page.sources) assert.equal(new URL(source.href).protocol, "https:");
  }
});

test("generated Playbook output stays derived from catalog copy and checklist export is useful", () => {
  const authored = catalog.playbooks.find((item) => item.id === "13-week-cash-flow-forecast")!;
  const generated = playbooks.find((item) => item.id === authored.id)!;
  assert.equal(generated.summary, authored.summary);
  assert.deepEqual(generated.steps, authored.steps);
  assert.deepEqual(generated.checklist, authored.checklist);
  assert.deepEqual(playbookRecords, [playbookIndex, ...playbooks]);
  const text = formatPlaybookChecklist("Close checklist", ["Tie cash to statements", "Assign open items"], [true, false]);
  assert.equal(text, "Close checklist — working checklist\n[x] Tie cash to statements\n[ ] Assign open items");
});

test("13-week forecast example is explicitly hypothetical and includes a weekly rollforward", () => {
  const page = playbooks.find((item) => item.id === "13-week-cash-flow-forecast")!;
  assert.ok(page.example);
  assert.match(page.example.disclosure, /Illustrative figures only/i);
  assert.match(page.example.rows[0]!.value, /18,000/);
  assert.ok(page.example.rows.some((row) => row.value.includes("$9,000 closing cash")));
});
