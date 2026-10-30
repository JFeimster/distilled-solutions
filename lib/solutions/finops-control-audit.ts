export const controlAnswers = [
  { value: "documented", label: "Documented and consistent" },
  { value: "partial", label: "Partially implemented" },
  { value: "missing", label: "Missing or unreliable" },
  { value: "unknown", label: "Unsure / verify" },
  { value: "na", label: "Not applicable" }
] as const;

export type ControlAnswer = typeof controlAnswers[number]["value"];
export type ControlId = "close" | "cash" | "payables" | "receivables" | "expenses" | "data" | "automation";
export type ControlObjective = "reduce-errors" | "cash-visibility" | "faster-close" | "safe-automation";
export type ControlInput = Record<ControlId, ControlAnswer> & { objective?: ControlObjective };
export type Guide = { label: string; href: string };
export type ControlAction = {
  id: string; problem: string; correction: string; evidence: string; owner: string;
  completion: string; dependency: string; guide: Guide;
};

type Rule = {
  id: ControlId; label: string; question: string; hint: string; rank: number;
  problem: string; correction: string; evidence: string; owner: string; completion: string;
  dependency: string; guide: Guide; automation?: string; allowsNa?: boolean;
};

export const controlDimensions: readonly Rule[] = [
  { id: "close", label: "Close + reconciliation", question: "Are accounts reconciled on a defined schedule with an owner and reviewer?", hint: "Evidence: close checklist, statements, sign-off, open differences.", rank: 0, problem: "Close or reconciliation is not reliably evidenced.", correction: "Assign a close owner and reviewer; reconcile source accounts and keep an exception log before relying on reports.", evidence: "Recent statements, ledger, reconciliation workpapers, close checklist, and unresolved differences.", owner: "Bookkeeper or finance lead, with an independent reviewer", completion: "Required accounts reconcile to source records; exceptions have owners and dates; reviewer sign-off is retained.", dependency: "Reconciled records should precede reporting changes and automation.", guide: { label: "Month-end FinanceOps checklist", href: "/playbooks/financial-operations/month-end-financeops-checklist" } },
  { id: "cash", label: "Cash visibility", question: "Can you see upcoming obligations, expected receipts, and exceptions?", hint: "Evidence: obligation calendar, receipts view, exception owner.", rank: 3, problem: "Near-term cash commitments and receipts are not reliably visible.", correction: "Maintain a dated view of expected receipts, obligations, and exceptions; compare it with actual activity.", evidence: "Open receivables, approved payables, scheduled obligations, and recent cash activity in your own secure records.", owner: "Finance lead or owner", completion: "The view has an owner, update date, and an explicit follow-up for each material exception.", dependency: "Confirm source records and payable approvals before treating a forecast as settled fact.", guide: { label: "CFO planning guide", href: "/cfo-as-a-service" } },
  { id: "payables", label: "Accounts payable", question: "Are invoices verified and payments authorized before release?", hint: "Evidence: invoice match, approval limits, vendor-change check, duplicate check.", rank: 1, problem: "Invoice verification or payment authorization can fail.", correction: "Document invoice matching, independent payment approval, vendor-change verification, and duplicate-payment checks.", evidence: "Recent invoices, purchase or receipt support, approval trail, vendor changes, and payment-release records.", owner: "AP lead and authorized payment approver", completion: "A sample of payments shows verified invoices, appropriate approvals, duplicate checks, and a separate review of exceptions.", dependency: "Establish authorization before automating payment routing or release.", guide: { label: "Payment operations", href: "/payment-operations" } },
  { id: "receivables", label: "Accounts receivable", question: "Are billing, aging, disputes, and follow-up owned?", hint: "Evidence: invoice log, aging report, dispute queue, collection owner.", rank: 5, problem: "Receivable follow-up and disputes lack a reliable owner.", correction: "Assign billing and collection owners; reconcile the aging report to invoices and track disputes separately.", evidence: "Issued invoices, current aging, payment application, disputed items, and dated follow-up notes.", owner: "Billing or revenue operations lead", completion: "Open items and disputes have an owner, next action, date, and reconciled status.", dependency: "Confirm invoice and payment data before automating reminders.", guide: { label: "Revenue operations", href: "/revenue-operations" }, automation: "Dated reminders for verified, undisputed invoices", allowsNa: true },
  { id: "expenses", label: "Expense controls", question: "Are purchases, receipts, approvals, and categories applied consistently?", hint: "Evidence: policy, receipt samples, limits, coding exceptions.", rank: 4, problem: "Purchases and expenses lack consistent approval or evidence.", correction: "Set practical spending limits, receipt requirements, coding ownership, and exception review.", evidence: "Expense policy, purchase and receipt samples, approvals, and coding corrections.", owner: "Expense owner or finance lead", completion: "Sampled expenses show policy checks, support, authorized approval, and resolved coding exceptions.", dependency: "Set policy and ownership before automating expense coding.", guide: { label: "Expense management", href: "/expense-management" }, automation: "Receipt routing and coding suggestions with human exception review" },
  { id: "data", label: "Financial data + integrations", question: "Are systems of record and cross-system differences reconciled?", hint: "Evidence: system map, field owner, sync log, exception queue.", rank: 2, problem: "Multiple financial systems may contain unreconciled transactions or conflicting records.", correction: "Name each system of record, map data handoffs, and reconcile totals and exceptions to source transactions.", evidence: "System inventory, interface logs, transaction samples, reconciliation workpapers, and unresolved sync errors.", owner: "Finance systems owner with accounting reviewer", completion: "Each critical handoff has a source, owner, reconciliation check, and documented exception resolution.", dependency: "Resolve data ownership and reconciliation before expanding integrations or AI use.", guide: { label: "Financial data operations", href: "/financial-data-operations" }, automation: "Exception alerts for reconciled system handoffs" },
  { id: "automation", label: "Automation + AI safeguards", question: "Do automated steps have scoped access, human approvals, history, and failure handling?", hint: "Evidence: permissions, approval gates, audit trail, rollback and exception plan.", rank: 6, problem: "Automated or AI-assisted finance work lacks defined safeguards.", correction: "Limit permissions, keep approvals with authorized people, log changes, and define failure and rollback handling.", evidence: "Access list, workflow map, approval logs, sample output review, and incident or exception procedure.", owner: "Finance process owner and systems administrator", completion: "A bounded pilot shows correct access, human approval, traceable actions, and a tested failure path.", dependency: "First establish process ownership, reconciled data, and exception handling.", guide: { label: "Financial workflow automation", href: "/financial-workflow-automation" }, automation: "Read-only exception summaries after controls and data checks are stable", allowsNa: true }
];

const statusLabels: Record<ControlAnswer, string> = {
  documented: "Reported documented", partial: "Partly implemented", missing: "Needs foundational work",
  unknown: "Needs verification", na: "Not applicable"
};

export type ControlResult = {
  classification: string; explanation: string; matrix: { id: ControlId; label: string; answer: ControlAnswer; status: string }[];
  priorities: ControlAction[]; firstWorkflow: string; firstSevenDays: string[]; nextThirtyDays: string[];
  rhythm: string[]; automation: string[]; guides: Guide[];
};

export function evaluateFinopsControls(input: ControlInput): ControlResult {
  for (const rule of controlDimensions) {
    const answer = input[rule.id];
    if (!controlAnswers.some((option) => option.value === answer) || (answer === "na" && !rule.allowsNa)) {
      throw new Error(`Invalid answer for ${rule.id}`);
    }
  }
  const gaps = controlDimensions.filter((rule) => input[rule.id] !== "documented" && input[rule.id] !== "na");
  const failures = gaps.filter((rule) => input[rule.id] === "missing" || input[rule.id] === "partial");
  const foundational = failures.some((rule) => rule.rank <= 2);
  const classification = foundational ? "Controls need foundational work" : failures.length > 0 ? "Key workflows require stabilization" : gaps.length > 0 ? "Control evidence needs verification" : "Core processes documented — optimize execution";
  const explanation = "This is a self-reported control map, not a verified audit opinion. Unknown answers call for evidence checks, not a finding of failure.";
  const weight = (rule: Rule) => {
    const answer = input[rule.id];
    const severity = answer === "missing" ? 0 : answer === "partial" ? 1 : 2;
    const objectiveMatch = (input.objective === "faster-close" && rule.id === "close") ||
      (input.objective === "cash-visibility" && rule.id === "cash") ||
      (input.objective === "safe-automation" && rule.id === "automation") ||
      (input.objective === "reduce-errors" && (rule.id === "payables" || rule.id === "data"));
    return severity * 20 + rule.rank * 2 - (objectiveMatch ? 1 : 0);
  };
  // Foundation order takes precedence over severity when payments, records, or data are exposed.
  const ordered = [...gaps].sort((a, b) => (a.rank <= 2 ? 0 : 1) - (b.rank <= 2 ? 0 : 1) || weight(a) - weight(b) || a.rank - b.rank);
  const actions: ControlAction[] = ordered.map((rule) => ({
    id: rule.id, problem: input[rule.id] === "unknown" ? `${rule.label} has not been verified.` : rule.problem,
    correction: input[rule.id] === "unknown" ? `Verify the current process and evidence. If the control is absent, ${rule.correction.charAt(0).toLowerCase()}${rule.correction.slice(1)}` : rule.correction,
    evidence: rule.evidence, owner: rule.owner, completion: rule.completion, dependency: rule.dependency, guide: rule.guide
  }));
  const maintenance: ControlAction[] = [
    { id: "review-close", problem: "Documented controls still need periodic evidence.", correction: "Review a recent close and its exception log.", evidence: controlDimensions[0]!.evidence, owner: "Finance lead and reviewer", completion: "Sign-off and unresolved items are recorded.", dependency: "Maintain reconciliation before changing reporting.", guide: controlDimensions[0]!.guide },
    { id: "review-payments", problem: "Payment authority can drift as roles change.", correction: "Sample approvals and vendor changes against current authority.", evidence: controlDimensions[2]!.evidence, owner: "Authorized payment approver", completion: "Exceptions are assigned and access is current.", dependency: "Keep approvals ahead of payment automation.", guide: { label: "Financial controls playbook", href: "/playbooks/financial-operations/financial-controls-for-small-business" } },
    { id: "review-data", problem: "Integrations can develop new differences.", correction: "Review cross-system exceptions and reconciliation evidence.", evidence: controlDimensions[5]!.evidence, owner: "Finance systems owner", completion: "Open differences have owners and resolution dates.", dependency: "Confirm data quality before further automation.", guide: controlDimensions[5]!.guide }
  ];
  const priorities = [...actions, ...maintenance.filter((item) => !actions.some((action) => action.id === item.id.replace("review-", "")))].slice(0, 3);
  const firstWorkflow = priorities[0]!.correction;
  const firstSevenDays = [
    `Day 1–2: Name an owner and reviewer for ${priorities[0]!.id.replaceAll("-", " ")}; gather the listed source evidence.`,
    `Day 3–4: Check a recent sample and record missing approvals, mismatches, or unknowns in an exception log.`,
    `Day 5–7: Apply the first correction, assign each open exception, and agree on a review date.`
  ];
  const nextThirtyDays = [
    `Weeks 2–3: Complete the first workflow's evidence and completion check; then address ${priorities[1]!.id.replaceAll("-", " ")}.`,
    `Weeks 3–4: Stabilize ${priorities[2]!.id.replaceAll("-", " ")}; test the handoffs against source records.`,
    "By day 30: Review exceptions and approvals, update the procedure, and decide whether a bounded automation pilot is justified."
  ];
  const rhythm = [
    "At each close: reconcile relevant accounts, retain reviewer sign-off, and carry forward owned differences.",
    "At a cadence suited to transaction volume: review payment, receivable, and integration exceptions with an owner and due date.",
    "Periodically: refresh the cash view, access permissions, approval limits, and control evidence."
  ];
  const automation = foundational || failures.some((rule) => rule.id === "data" || rule.id === "automation") || input.data === "unknown" || input.automation === "unknown"
    ? ["Defer automation of payment release or ledger posting until ownership, approval, reconciliation, and exception handling are evidenced.", "A later pilot can route exceptions or draft summaries; a person must review decisions, changes, and failed runs."]
    : ["Consider bounded exception alerts, receipt routing, and verified invoice reminders after validating source data and owner sign-off.", "Keep human review for payment release, record changes, disputed items, and AI-generated recommendations."];
  const guides = [...new Map([...priorities.map((item) => item.guide),
    { label: "Financial operations", href: "/finops-as-a-service" },
    { label: "Financial controls playbook", href: "/playbooks/financial-operations/financial-controls-for-small-business" },
    { label: "CFO planning guide", href: "/cfo-as-a-service" },
    { label: "Financial workflow automation", href: "/financial-workflow-automation" }
  ].map((guide) => [guide.href, guide])).values()];
  return { classification, explanation, matrix: controlDimensions.map((rule) => ({ id: rule.id, label: rule.label, answer: input[rule.id], status: statusLabels[input[rule.id]] })), priorities, firstWorkflow, firstSevenDays, nextThirtyDays, rhythm, automation, guides };
}

export function formatFinopsActionPlan(input: ControlInput, result: ControlResult): string {
  return [
    "FINANCIAL OPERATIONS / CONTROL ACTION PLAN", result.classification, result.explanation,
    `Objective: ${input.objective ?? "Not specified"}`, "", "CONTROL OVERVIEW",
    ...result.matrix.map((item) => `- ${item.label}: ${item.status}`), "", `FIRST WORKFLOW: ${result.firstWorkflow}`,
    "", "PRIORITY ACTIONS", ...result.priorities.flatMap((action, index) => [
      `${index + 1}. ${action.problem}`, `   Correct: ${action.correction}`, `   Evidence: ${action.evidence}`,
      `   Owner: ${action.owner}`, `   Complete when: ${action.completion}`, `   Dependency: ${action.dependency}`,
      `   Guide: ${action.guide.href}`
    ]), "", "FIRST 7 DAYS", ...result.firstSevenDays.map((item) => `- ${item}`),
    "", "NEXT 30 DAYS", ...result.nextThirtyDays.map((item) => `- ${item}`),
    "", "OPERATING RHYTHM", ...result.rhythm.map((item) => `- ${item}`),
    "", "AUTOMATION", ...result.automation.map((item) => `- ${item}`),
    "", "RELEVANT GUIDES", ...result.guides.map((guide) => `- ${guide.label}: ${guide.href}`),
    "", "Planning guidance from self-reported answers. Confirm against source records with the responsible people. No information was submitted."
  ].join("\n");
}
