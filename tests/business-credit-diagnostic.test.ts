import test from "node:test";
import assert from "node:assert/strict";
import catalog from "../data/solutions/catalog.json";
import { pages, getPage } from "../lib/solutions/pages";
import {
  creditAnswers, creditDimensions, creditObjectives, evaluateBusinessCredit,
  formatCreditActionPlan, type CreditInput
} from "../lib/solutions/business-credit-diagnostic";

const documented: CreditInput = {
  objective: "maintain", identity: "documented", consistency: "documented", visibility: "documented",
  payments: "documented", capacity: "documented", monitoring: "documented"
};

test("new business: identity preparation precedes reliance on unverified reporting", () => {
  const input: CreditInput = { ...documented, objective: "establish", identity: "attention", consistency: "unknown", visibility: "unknown", payments: "na" };
  const result = evaluateBusinessCredit(input);
  assert.equal(result.status, "FOUNDATIONS NEED ATTENTION");
  assert.deepEqual(result.immediate.map((task) => task.id), ["identity", "consistency", "visibility"]);
  assert.equal(result.gaps.length, 3);
  assert.ok(!result.gaps.some((gap) => gap.id === "payments"));
  assert.match(result.rationale, /no records have been independently checked/i);
  assert.match(result.next[0].completion, /does not require buying a tradeline or opening an account/);
});

test("established business: unknown reporting generates verification and monitoring guidance", () => {
  const result = evaluateBusinessCredit({ ...documented, visibility: "unknown" });
  assert.equal(result.status, "RECORDS REQUIRE VERIFICATION");
  assert.equal(result.immediate[0].id, "visibility");
  assert.match(result.immediate[0].title, /Verify/);
  assert.match(result.immediate[0].completion, /do not count an account as reporting without supporting evidence/);
  assert.ok(result.resources.some((resource) => resource.href === "/business-credit-monitoring"));
  assert.match(result.rationale, /Unknown answers are not confirmed defects/);
});

test("existing payment problems: obligations take priority over optional account evaluation", () => {
  const result = evaluateBusinessCredit({ ...documented, objective: "evaluate", payments: "attention", capacity: "attention", visibility: "unknown" });
  assert.deepEqual(result.immediate.map((task) => task.id), ["payments", "capacity", "visibility"]);
  assert.match(result.immediate[0].title, /existing obligations/);
  assert.match(result.immediate[0].completion, /due date/);
  assert.match(result.next.at(-1)!.title, /only after resolving foundation gaps/);
  assert.match(result.next.at(-1)!.completion, /defer the decision; no account purchase is required/);
});

test("documented foundations: maintenance without pressure to expand credit", () => {
  const result = evaluateBusinessCredit(documented);
  assert.equal(result.status, "FOUNDATIONS DOCUMENTED — CONTINUE MONITORING");
  assert.equal(result.gaps.length, 0);
  assert.deepEqual(result.immediate.map((task) => task.id), ["maintain-reports", "maintain-payments", "maintain-records"]);
  assert.match(result.next[0].completion, /no need to add accounts/);
  assert.match(result.immediate[0].completion, /does not prescribe a universal/);
});

test("unknown and not applicable answers are not treated as confirmed failures", () => {
  const input: CreditInput = { objective: "establish", identity: "unknown", consistency: "unknown", visibility: "unknown", payments: "na", capacity: "unknown", monitoring: "unknown" };
  const result = evaluateBusinessCredit(input);
  assert.equal(result.status, "RECORDS REQUIRE VERIFICATION");
  assert.equal(result.gaps.length, 5);
  assert.ok(result.gaps.every((gap) => gap.answer === "unknown"));
  assert.equal(result.evidence.find((item) => item.id === "payments")?.status, "Not yet applicable — no existing credit accounts");
  assert.match(result.rationale, /not confirmed defects/);
  const noAccounts = evaluateBusinessCredit({ ...documented, payments: "na" });
  assert.equal(noAccounts.gaps.length, 0);
  assert.match(noAccounts.immediate[1].completion, /No payment-history defect/);
  assert.match(noAccounts.status, /FOUNDATIONS DOCUMENTED/);
});

test("every material input changes relevant tasks, not just the copied answer labels", () => {
  const base = evaluateBusinessCredit(documented);
  for (const dimension of creditDimensions) {
    for (const answer of ["attention", "unknown"] as const) {
      const result = evaluateBusinessCredit({ ...documented, [dimension.id]: answer });
      assert.notDeepEqual(result.immediate, base.immediate, dimension.id);
      assert.equal(result.immediate[0].id, dimension.id);
      assert.equal(result.evidence.find((item) => item.id === dimension.id)?.answer, answer);
    }
    const attention = evaluateBusinessCredit({ ...documented, [dimension.id]: "attention" });
    const unknown = evaluateBusinessCredit({ ...documented, [dimension.id]: "unknown" });
    assert.notEqual(attention.immediate[0].title, unknown.immediate[0].title);
  }
  const objectiveTasks = creditObjectives.map(({ value }) => evaluateBusinessCredit({ ...documented, objective: value }).next.at(-1)!.title);
  assert.equal(new Set(objectiveTasks).size, 4);
  assert.notDeepEqual(evaluateBusinessCredit({ ...documented, payments: "na" }).immediate, base.immediate);
});

test("all 3,888 valid profiles are deterministic with stable priorities, complete gap coverage, and valid links", () => {
  let count = 0;
  const routes = new Set(pages.map((page) => page.route));
  const visit = (index: number, input: CreditInput) => {
    if (index < creditDimensions.length) {
      const dimension = creditDimensions[index];
      const values = dimension.id === "payments" ? [...creditAnswers.map((answer) => answer.value), "na" as const] : creditAnswers.map((answer) => answer.value);
      for (const value of values) visit(index + 1, { ...input, [dimension.id]: value });
      return;
    }
    count++;
    const result = evaluateBusinessCredit(input);
    assert.deepEqual(result, evaluateBusinessCredit({ ...input }));
    assert.equal(result.immediate.length, 3);
    assert.equal(result.evidence.length, 6);
    const allTasks = [...result.immediate, ...result.next];
    assert.equal(new Set(allTasks.map((task) => task.id)).size, allTasks.length);
    const expectedGaps = [...creditDimensions].filter(({ id }) => input[id] === "attention" || input[id] === "unknown").sort((a, b) => a.priority - b.priority);
    assert.deepEqual(allTasks.filter((task) => expectedGaps.some(({ id }) => id === task.id)).map((task) => task.id), expectedGaps.map(({ id }) => id));
    for (const task of allTasks) {
      assert.ok(task.title && task.evidence && task.completion);
      assert.ok(routes.has(task.guide.href), task.guide.href);
    }
    for (const resource of result.resources) {
      if (resource.href.startsWith("/")) assert.ok(routes.has(resource.href));
      else assert.equal(new URL(resource.href).origin, "https://www.experian.com");
    }
    assert.equal(new Set(result.resources.map((resource) => resource.href)).size, result.resources.length);
  };
  for (const objective of creditObjectives) visit(0, { ...documented, objective: objective.value });
  assert.equal(count, 3888);
});

test("copyable roadmap stands alone with evidence, completion checks, resources, and limitations", () => {
  const input: CreditInput = { ...documented, objective: "correct", payments: "attention", visibility: "unknown" };
  const text = formatCreditActionPlan(input);
  for (const label of ["CURRENT PREPARATION STATUS", "PRIORITY GAPS", "IMMEDIATE ACTIONS", "NEXT ACTIONS", "ONGOING PRACTICES", "IF YOU CHOOSE TO EVALUATE", "RELEVANT RESOURCES", "Review:", "Complete when:"]) assert.ok(text.includes(label), label);
  for (const evidence of evaluateBusinessCredit(input).evidence) assert.ok(text.includes(`${evidence.label}: ${evidence.status}`));
  assert.match(text, /Objective: Correct or strengthen/);
  assert.match(text, /https:\/\/solutions\.distilledfunding\.com\/business-credit-roadmap/);
  assert.match(text, /https:\/\/www\.experian\.com/);
  assert.match(text, /no credit-score, eligibility, underwriting, approval, or financing prediction/);
  assert.doesNotMatch(text, /undefined|NaN|\[object Object\]/);
});

test("all four business-credit editorial overrides survive generation and route CTAs point to the single diagnostic", () => {
  const family = catalog.families.find((item) => item.id === "business-credit-builder")!;
  type Editorial = { headline?: string; summary?: string; problemStatement?: string; desiredOutcome?: string; questions?: string[]; signals?: string[]; paths?: string[]; process?: string[]; considerations?: string[]; FAQs?: { question: string; answer: string }[]; CTA: { label: string; href: string; kind: string } };
  const overrides: [string, Editorial][] = [
    [family.id, family.editorial as Editorial],
    ...family.children.filter((child) => ["business-credit-readiness", "business-credit-roadmap", "fundability-check"].includes(child[0] as string)).map((child) => [child[0], child[3]] as [string, Editorial])
  ];
  assert.equal(overrides.length, 4);
  for (const [id, editorial] of overrides) {
    const page = getPage(id)!;
    const expected = {
      headline: page.hero.headline, summary: page.hero.summary, problemStatement: page.problemStatement,
      desiredOutcome: page.desiredOutcome, questions: page.keyQuestions, signals: page.pains, paths: page.solutionPaths,
      process: page.process, considerations: page.considerations, FAQs: page.FAQs, CTA: page.CTAs[0]
    };
    for (const [key, value] of Object.entries(editorial)) assert.deepEqual(expected[key as keyof typeof expected], value, `${id}: ${key}`);
    assert.equal(page.CTAs[0].href, id === "business-credit-readiness" ? "#credit-readiness-diagnostic" : "/business-credit-readiness#credit-readiness-diagnostic");
    assert.deepEqual(page.breadcrumbs, id === family.id ? ["home", family.id] : ["home", family.id, id]);
  }
  assert.equal(getPage(family.id)!.CTAs[0].label, "CHECK BUSINESS CREDIT READINESS");
  assert.equal(getPage("business-credit-readiness")!.CTAs[0].label, "BUILD MY ACTION ROADMAP");
  assert.equal(getPage("business-credit-vendors")!.hero.headline, "Business credit vendors");
  assert.equal(pages.length, 71);
  assert.ok(pages.every((page) => page.status === "noindex" && page.indexStatus === "noindex" && page.lastReviewed === null));
});
