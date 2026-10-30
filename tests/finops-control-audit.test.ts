import test from "node:test";
import assert from "node:assert/strict";
import routes from "../data/solutions/solutions.routes.manifest.json";
import { controlDimensions, evaluateFinopsControls, formatFinopsActionPlan, type ControlInput } from "../lib/solutions/finops-control-audit";

const documented: ControlInput = { close: "documented", cash: "documented", payables: "documented", receivables: "documented", expenses: "documented", data: "documented", automation: "documented" };

test("missing close controls produce a foundational first action", () => {
  const result = evaluateFinopsControls({ ...documented, close: "missing" });
  assert.equal(result.classification, "Controls need foundational work");
  assert.equal(result.priorities[0]?.id, "close");
  assert.match(result.priorities[0]!.completion, /reconcile to source records/i);
});

test("payment authorization and invoice verification take precedence over automation", () => {
  const result = evaluateFinopsControls({ ...documented, payables: "missing", automation: "missing" });
  assert.equal(result.priorities[0]?.id, "payables");
  assert.match(result.priorities[0]!.correction, /invoice matching.*independent payment approval/i);
  assert.match(result.automation[0]!, /Defer automation/i);
});

test("strong manual controls and weak automation safeguards focus on scoped access", () => {
  const result = evaluateFinopsControls({ ...documented, automation: "missing", objective: "safe-automation" });
  assert.equal(result.priorities[0]?.id, "automation");
  assert.match(result.priorities[0]!.correction, /Limit permissions/);
  assert.equal(result.classification, "Key workflows require stabilization");
});

test("unreconciled data across systems is prioritized before automation", () => {
  const result = evaluateFinopsControls({ ...documented, data: "missing", automation: "partial" });
  assert.equal(result.priorities[0]?.id, "data");
  assert.match(result.priorities[0]!.evidence, /interface logs/);
  assert.match(result.priorities[0]!.dependency, /before expanding integrations/);
});

test("well-documented operations get maintenance rather than fabricated failures", () => {
  const result = evaluateFinopsControls(documented);
  assert.equal(result.classification, "Core processes documented — optimize execution");
  assert.deepEqual(result.priorities.map((item) => item.id), ["review-close", "review-payments", "review-data"]);
  assert.ok(result.matrix.every((item) => item.status === "Reported documented"));
});

test("unknown and not-applicable answers do not become confirmed failures", () => {
  const result = evaluateFinopsControls({ ...documented, close: "unknown", receivables: "na", automation: "na" });
  assert.equal(result.classification, "Control evidence needs verification");
  assert.equal(result.priorities[0]?.id, "close");
  assert.match(result.priorities[0]!.problem, /not been verified/);
  assert.equal(result.matrix.find((item) => item.id === "receivables")?.status, "Not applicable");
  assert.throws(() => evaluateFinopsControls({ ...documented, close: "na" }));
});

test("output is deterministic and each reported gap changes its relevant action", () => {
  const input = { ...documented, cash: "partial" as const };
  assert.deepEqual(evaluateFinopsControls(input), evaluateFinopsControls(input));
  for (const dimension of controlDimensions) {
    const result = evaluateFinopsControls({ ...documented, [dimension.id]: "missing" });
    assert.equal(result.priorities[0]?.id, dimension.id);
  }
});

test("dependency-aware order puts reconciliation, payment control, and data before advanced automation", () => {
  const result = evaluateFinopsControls({ ...documented, close: "partial", payables: "missing", data: "partial", automation: "missing" });
  assert.deepEqual(result.priorities.map((item) => item.id), ["payables", "close", "data"]);
  assert.ok(result.nextThirtyDays.at(-1)?.includes("automation pilot"));
});

test("all contextual links are canonical routes", () => {
  const allowed = new Set(routes);
  const required = ["/finops-as-a-service", "/cfo-as-a-service", "/financial-workflow-automation", "/payment-operations", "/expense-management", "/revenue-operations", "/financial-data-operations", "/playbooks/financial-operations/month-end-financeops-checklist", "/playbooks/financial-operations/financial-controls-for-small-business"];
  for (const route of required) assert.ok(allowed.has(route), route);
  for (const dimension of controlDimensions) assert.ok(allowed.has(dimension.guide.href), dimension.guide.href);
  for (const guide of evaluateFinopsControls(documented).guides) assert.ok(allowed.has(guide.href), guide.href);
});

test("plain-text report includes personalized priorities and copyable sections", () => {
  const input = { ...documented, payables: "missing" as const };
  const report = formatFinopsActionPlan(input, evaluateFinopsControls(input));
  assert.match(report, /FINANCIAL OPERATIONS \/ CONTROL ACTION PLAN/);
  assert.match(report, /Invoice verification or payment authorization can fail/);
  assert.match(report, /FIRST 7 DAYS[\s\S]*NEXT 30 DAYS[\s\S]*OPERATING RHYTHM[\s\S]*AUTOMATION/);
  assert.match(report, /Owner: AP lead/);
  assert.doesNotMatch(report, /financial-health score/i);
});
