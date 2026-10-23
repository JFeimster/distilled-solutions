import test from "node:test";
import assert from "node:assert/strict";
import catalog from "../data/solutions/catalog.json";
import { getPage } from "../lib/solutions/pages";
import { evaluateFundingWorkflow, formatActionPlan, type DiagnosticInput } from "../lib/solutions/funding-workflow-diagnostic";

const base: DiagnosticInput = {
  bottleneck: "intake", process: "manual", workload: "moderate", risk: "missing", system: "spreadsheet"
};

test("intake, document, and follow-up profiles receive distinct first fixes and guides", () => {
  const intake = evaluateFundingWorkflow(base);
  const documents = evaluateFundingWorkflow({ ...base, bottleneck: "documents" });
  const followUp = evaluateFundingWorkflow({ ...base, bottleneck: "follow-up" });
  assert.equal(new Set([intake.firstFix, documents.firstFix, followUp.firstFix]).size, 3);
  assert.deepEqual([intake.nextStep.href, documents.nextStep.href, followUp.nextStep.href], [
    "/funding-intake-automation", "/document-collection-automation", "/funding-follow-up-automation"
  ]);
  for (const result of [intake, documents, followUp]) {
    assert.equal(result.actions.length, 3);
    assert.equal(result.humanControls.length, 2);
    assert.equal(result.dataControls.length, 2);
  }
});

test("recommendations are deterministic and every answer affects the plan", () => {
  assert.deepEqual(evaluateFundingWorkflow(base), evaluateFundingWorkflow({ ...base }));
  const original = formatActionPlan(base);
  const variations: DiagnosticInput[] = [
    { ...base, bottleneck: "routing" },
    { ...base, process: "inconsistent" },
    { ...base, workload: "high" },
    { ...base, risk: "sensitive" },
    { ...base, system: "multiple" }
  ];
  for (const variant of variations) assert.notEqual(formatActionPlan(variant), original);
});

test("copyable action plan contains all decisions, three numbered actions, safeguards, and links", () => {
  const text = formatActionPlan({ ...base, bottleneck: "documents", risk: "decisions" });
  assert.match(text, /FUNDING WORKFLOW ACTION PLAN/);
  assert.match(text, /Main bottleneck: Document collection/);
  assert.match(text, /First fix: Track document requests/);
  assert.match(text, /1\..*\n2\..*\n3\./);
  assert.match(text, /HUMAN REVIEW/);
  assert.match(text, /DATA OWNERSHIP & PRIVACY/);
  assert.match(text, /\/document-collection-automation/);
  assert.match(text, /makes no eligibility, credit, underwriting/i);
});

test("flagship editorial override survives generated manifest and CTA targets the diagnostic", () => {
  const family = catalog.families.find((item) => item.id === "automate-my-funding")!;
  const child = family.children.find((item) => item[0] === "funding-workflow-automation")!;
  assert.equal(child.length, 4);
  const editorial = child[3] as {
    headline: string; summary: string; problemStatement: string; desiredOutcome: string;
    questions: string[]; signals: string[]; paths: string[]; process: string[];
    considerations: string[]; FAQs: { question: string; answer: string }[];
    CTA: { label: string; href: string; kind: string };
  };
  const page = getPage("funding-workflow-automation")!;
  assert.equal(page.hero.headline, editorial.headline);
  assert.equal(page.hero.summary, editorial.summary);
  assert.equal(page.problemStatement, editorial.problemStatement);
  assert.equal(page.desiredOutcome, editorial.desiredOutcome);
  assert.deepEqual(page.keyQuestions, editorial.questions);
  assert.deepEqual(page.pains, editorial.signals);
  assert.deepEqual(page.solutionPaths, editorial.paths);
  assert.deepEqual(page.process, editorial.process);
  assert.deepEqual(page.considerations, editorial.considerations);
  assert.deepEqual(page.FAQs, editorial.FAQs);
  assert.deepEqual(page.CTAs[0], editorial.CTA);
  assert.equal(page.CTAs[0]?.href, "#workflow-diagnostic");
  assert.equal(getPage("automate-my-funding")!.CTAs[0]?.href, page.route);
  assert.equal(getPage("funding-intake-automation")!.hero.headline, "Funding intake automation");
  assert.deepEqual(getPage("automate-my-funding")!.breadcrumbs, ["home", "automate-my-funding"]);
});
