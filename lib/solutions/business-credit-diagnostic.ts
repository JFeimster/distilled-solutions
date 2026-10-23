import site from "../../data/config/site.json";

export const creditObjectives = [
  { value: "establish", label: "Establish business-credit foundations" },
  { value: "correct", label: "Correct or strengthen existing records" },
  { value: "evaluate", label: "Prepare to evaluate additional credit options" },
  { value: "maintain", label: "Maintain and monitor existing accounts" }
] as const;
export const creditAnswers = [
  { value: "documented", label: "Verified / documented by me" },
  { value: "attention", label: "Needs attention" },
  { value: "unknown", label: "Not sure / needs verification" }
] as const;
export const noAccountsAnswer = { value: "na", label: "No existing credit accounts / not yet applicable" } as const;

export type CreditAnswer = typeof creditAnswers[number]["value"];
export type CreditDimension = "identity" | "consistency" | "visibility" | "payments" | "capacity" | "monitoring";
export type CreditInput = Record<Exclude<CreditDimension, "payments">, CreditAnswer> & {
  payments: CreditAnswer | "na";
  objective: typeof creditObjectives[number]["value"];
};
type Resource = { label: string; href: string };
export type CreditTask = { id: string; title: string; evidence: string; completion: string; guide: Resource };
type DimensionRule = {
  id: CreditDimension; label: string; question: string; hint: string; priority: number;
  guide: Resource; attention: string; unknown: string; evidence: string; completion: string;
};

export const creditDimensions: readonly DimensionRule[] = [
  {
    id: "identity", label: "Business identity and records", priority: 10,
    question: "Can you substantiate the business identity?",
    hint: "Review the legal name, registration details, business identifiers, and applicable source records. Do not enter any identifiers here.",
    guide: { label: "Foundational record verification", href: "/fundability-check" },
    attention: "Reconcile the business identity with source records.",
    unknown: "Verify the business identity before relying on downstream files.",
    evidence: "Compare current registration records and applicable identifier confirmations with the legal name used in business accounts.",
    completion: "Keep a private source-record checklist; mark each item checked, not applicable, or awaiting a correction from the responsible source. Resolve identity discrepancies before relying on linked credit files."
  },
  {
    id: "consistency", label: "Business information consistency", priority: 30,
    question: "Does the business information agree across records?",
    hint: "Compare identifying and contact information across records you control or can review. Note legitimate differences rather than changing accurate information to force a match.",
    guide: { label: "Business-credit roadmap", href: "/business-credit-roadmap" },
    attention: "Resolve inconsistent business information at its source.",
    unknown: "Compare business information across the records you can review.",
    evidence: "Review account profiles, registration information, invoices, and available credit files against current source records.",
    completion: "Document each mismatch, its source, and the person responsible; confirm corrections or explain legitimate differences before reusing the information."
  },
  {
    id: "visibility", label: "Credit-file and reporting visibility", priority: 50,
    question: "Have you checked available credit files and reporting claims?",
    hint: "Review available business-credit reports and written reporting terms for any relevant accounts. A product name or an absent account is not proof of reporting or non-reporting.",
    guide: { label: "Business-credit monitoring", href: "/business-credit-monitoring" },
    attention: "Investigate credit-file gaps and unsupported reporting claims.",
    unknown: "Verify available credit files and account-reporting claims.",
    evidence: "Use the bureau's official access process, current reports where available, and written provider statements identifying the bureau, conditions, and timing of any reporting.",
    completion: "Record what is visible, unavailable, or still unconfirmed. For any discrepancy, retain evidence and the provider or bureau response; do not count an account as reporting without supporting evidence."
  },
  {
    id: "payments", label: "Payment history and obligations", priority: 20,
    question: "Are obligations and payment records under control?",
    hint: "Check statements, due dates, payment confirmation, and any reported inaccuracies. Choose not yet applicable only if there are no existing credit accounts.",
    guide: { label: "Responsible account management", href: "/business-credit-roadmap" },
    attention: "Put existing obligations and payment exceptions in an owned queue.",
    unknown: "Reconcile payment obligations before considering another account.",
    evidence: "Compare current statements, contractual due dates, payment confirmations, and any reported payment entries. An inaccuracy needs investigation, not an assumed delinquency.",
    completion: "List each obligation, due date, and review owner in your own secure records. Resolve unexplained differences with the provider; document any reporting correction request and its follow-up."
  },
  {
    id: "capacity", label: "Financial capacity and controls", priority: 40,
    question: "Can you review cash needs and the cost of an obligation?",
    hint: "Use a practical cash plan and an obligation calendar, including fees and less favorable timing. No balances, bank details, or personal credit information are requested.",
    guide: { label: "Cash-flow forecast", href: "/cash-flow-forecast" },
    attention: "Build a cash and obligation review before adding commitments.",
    unknown: "Verify the cash-review process and full account costs.",
    evidence: "Privately compare expected cash availability with existing obligations, operating needs, and all proposed fees and payment terms; include slower receipts.",
    completion: "Assign a review owner and document whether obligations can be met under the reviewed assumptions. Defer an optional commitment when its cost or payment capacity remains unclear."
  },
  {
    id: "monitoring", label: "Monitoring and correction readiness", priority: 60,
    question: "Is there a process to review files and follow up on errors?",
    hint: "Identify who reviews available reports, records discrepancies, and tracks correction requests through the relevant provider or bureau's current official process.",
    guide: { label: "Monitoring and correction workflow", href: "/business-credit-monitoring" },
    attention: "Create a documented monitoring and correction workflow.",
    unknown: "Confirm how report reviews and correction requests are handled.",
    evidence: "Review the latest available reports, review notes, and any correspondence or reference numbers for open correction requests.",
    completion: "Name a reviewer, choose a cadence suited to account activity, and keep a secure issue log with supporting records, response dates, and a follow-up step. Use the relevant bureau or provider's current instructions."
  }
];

const evidenceLabels = {
  documented: "Confirmed by you — self-reported",
  attention: "Needs work — reported by you",
  unknown: "Needs independent verification",
  na: "Not yet applicable — no existing credit accounts"
} as const;

export const accountVerification = [
  "Obtain current written account terms, including fees, payment obligations, and any minimum purchases.",
  "Check any personal guarantee and who is responsible for the obligation; do not assume a business account removes personal liability.",
  "Ask which business bureaus receive reporting, what is reported, and whether timing or reporting depends on account status or other conditions.",
  "Review cancellation, renewal, and changes to terms before committing.",
  "Review capacity to meet the full obligation alongside existing costs, including slower receipts. A purchase or new account is not a required credit-building step."
];

const objectiveTasks: Record<CreditInput["objective"], CreditTask> = {
  establish: {
    id: "objective-establish", title: "Assemble a reusable foundation checklist.",
    evidence: "Use the verified identity sources, information comparison, and file-review notes from this plan.",
    completion: "Keep dated references in your own secure records and identify the next unresolved item. Establishing foundations does not require buying a tradeline or opening an account.",
    guide: { label: "Business-credit foundations", href: "/business-credit-builder" }
  },
  correct: {
    id: "objective-correct", title: "Close the loop on each record correction.",
    evidence: "Match the specific disputed entry to source evidence and the relevant provider or bureau's current correction instructions.",
    completion: "Save request and response records securely, then review the affected record again. Keep unresolved items visible; a submitted request is not proof of correction.",
    guide: { label: "Record verification guide", href: "/fundability-check" }
  },
  evaluate: {
    id: "objective-evaluate", title: "Compare an optional account only after resolving foundation gaps.",
    evidence: "Use current written terms, total costs, any guarantees, reporting conditions, and a cash plan alongside the option of keeping existing arrangements.",
    completion: "Document the business purpose and tradeoffs. If a reporting claim or payment capacity is unresolved, defer the decision; no account purchase is required.",
    guide: { label: "Vendor due diligence", href: "/business-credit-vendors" }
  },
  maintain: {
    id: "objective-maintain", title: "Maintain the records and accounts already serving the business.",
    evidence: "Compare current account use, fees, terms, review notes, and open issues with the business's actual needs.",
    completion: "Assign the next review and retain useful records. Reassess an account when its purpose or terms change; there is no need to add accounts merely to complete this plan.",
    guide: { label: "Ongoing business-credit monitoring", href: "/business-credit-monitoring" }
  }
};

function maintenanceTasks(input: CreditInput): CreditTask[] {
  return [
    {
      id: "maintain-reports", title: "Schedule the next available-file review.",
      evidence: "Use the latest available business-credit reports, provider statements, and any unresolved correction requests.",
      completion: "Choose a review date based on account activity and known issues; record who will compare changes. This plan does not prescribe a universal bureau or legal review frequency.",
      guide: { label: "Business-credit monitoring", href: "/business-credit-monitoring" }
    },
    {
      id: "maintain-payments", title: input.payments === "na" ? "Prepare payment controls before any future obligation." : "Keep the payment calendar reconciled.",
      evidence: input.payments === "na" ? "Use a simple checklist for reviewing terms, due dates, costs, and payment ownership if an account is ever needed." : "Compare current statements, scheduled payments, cash timing, and payment confirmations.",
      completion: input.payments === "na" ? "Have a review process ready without opening an account. No payment-history defect is inferred from having no accounts." : "Assign the next reconciliation and a backup owner; investigate unexplained differences before relying on reported history.",
      guide: { label: "Account-management roadmap", href: "/business-credit-roadmap" }
    },
    {
      id: "maintain-records", title: "Keep source records and costs current.",
      evidence: "Review changes to business information, account terms, fees, and the cash-review process.",
      completion: "Update the private checklist when records or obligations change and retain the supporting source. Documented answers remain your own assessment, not an independent verification.",
      guide: { label: "Foundational record verification", href: "/fundability-check" }
    }
  ];
}

export function evaluateBusinessCredit(input: CreditInput) {
  const evidence = creditDimensions.map((dimension) => ({
    id: dimension.id, label: dimension.label, answer: input[dimension.id],
    status: evidenceLabels[input[dimension.id]]
  }));
  const gaps = evidence.filter((item) => item.answer === "attention" || item.answer === "unknown");
  const needsWork = gaps.filter((item) => item.answer === "attention");
  const unverified = gaps.filter((item) => item.answer === "unknown");
  const status = needsWork.length ? "FOUNDATIONS NEED ATTENTION" : unverified.length ? "RECORDS REQUIRE VERIFICATION" : "FOUNDATIONS DOCUMENTED — CONTINUE MONITORING";
  const rationale = [
    needsWork.length ? `You reported work needed in: ${needsWork.map((item) => item.label.toLowerCase()).join("; ")}.` : "You did not report an area needing correction.",
    unverified.length ? `Verification remains open for: ${unverified.map((item) => item.label.toLowerCase()).join("; ")}. Unknown answers are not confirmed defects.` : needsWork.length ? "The actions below address the preparation gaps you identified." : "You reported documentation for the applicable areas.",
    input.payments === "na" ? "Payment history is not yet applicable because you reported no existing credit accounts." : "",
    "This status describes your self-reported preparation. No records have been independently checked, and it is not a credit score or lender eligibility decision."
  ].filter(Boolean).join(" ");
  const gapTasks: CreditTask[] = [...creditDimensions]
    .filter((dimension) => input[dimension.id] === "attention" || input[dimension.id] === "unknown")
    .sort((a, b) => a.priority - b.priority)
    .map((dimension) => ({
      id: dimension.id, title: dimension[input[dimension.id] as "attention" | "unknown"],
      evidence: dimension.evidence, completion: dimension.completion, guide: dimension.guide
    }));
  const immediate = [...gapTasks, ...maintenanceTasks(input)].slice(0, 3);
  const next = [...gapTasks.slice(3), objectiveTasks[input.objective]];
  const ongoing = [
    input.payments === "na" ? "If obligations are added later, assign payment ownership and review dates before accepting terms; no existing payment failure is assumed." : "Reconcile obligations and payment confirmations against current statements; investigate unexplained reported payment entries with supporting records.",
    "Revisit available files after material business-information changes or correction responses, and at a cadence suited to your accounts and activity.",
    "Retain source records and correction correspondence securely. Recheck account costs and cash commitments when terms or operations change."
  ];
  const resourceCandidates: Resource[] = [
    ...gapTasks.map((task) => task.guide), objectiveTasks[input.objective].guide,
    { label: "Business-credit roadmap", href: "/business-credit-roadmap" },
    { label: "Business-credit monitoring", href: "/business-credit-monitoring" },
    ...(input.objective === "evaluate" ? [
      { label: "Trade-credit terms and reporting", href: "/net-30-vendors" },
      { label: "Card costs and guarantees", href: "/business-credit-cards" }
    ] : []),
    { label: "Experian: business-credit basics (official)", href: "https://www.experian.com/small-business/business-credit-basics" },
    { label: "Experian: correcting business report information (official)", href: "https://www.experian.com/small-business/business-credit-information" }
  ];
  const resources = resourceCandidates.filter((resource, index, all) => all.findIndex((item) => item.href === resource.href) === index);
  return { status, rationale, evidence, gaps, immediate, next, ongoing, accountVerification, resources };
}
export type CreditResult = ReturnType<typeof evaluateBusinessCredit>;

export function formatCreditActionPlan(input: CreditInput, result = evaluateBusinessCredit(input)): string {
  const taskText = (task: CreditTask, index: number) => `${index + 1}. ${task.title}\n   Review: ${task.evidence}\n   Complete when: ${task.completion}\n   Guide: ${site.siteUrl}${task.guide.href}`;
  return [
    "DISTILLED SOLUTIONS / BUSINESS-CREDIT ACTION PLAN",
    `Diagnostic: ${site.siteUrl}/business-credit-readiness#credit-readiness-diagnostic`,
    `Objective: ${creditObjectives.find((item) => item.value === input.objective)!.label}`,
    "", "CURRENT PREPARATION STATUS", result.status, result.rationale,
    "", "PRIORITY GAPS / SELF-REPORTED EVIDENCE",
    ...result.evidence.map((item) => `- ${item.label}: ${item.status}`),
    ...(result.gaps.length ? [] : ["No preparation gaps reported. Continue the documented controls below."]),
    "", "IMMEDIATE ACTIONS — NOW", ...result.immediate.map(taskText),
    "", "NEXT ACTIONS — AFTER FOUNDATIONS", ...result.next.map(taskText),
    "", "ONGOING PRACTICES", ...result.ongoing.map((item) => `- ${item}`),
    "", "IF YOU CHOOSE TO EVALUATE A CREDIT ACCOUNT", ...result.accountVerification.map((item) => `- ${item}`),
    "", "RELEVANT RESOURCES", ...result.resources.map((item) => `- ${item.label}: ${item.href.startsWith("/") ? site.siteUrl + item.href : item.href}`),
    "", "Educational preparation only. This plan makes no credit-score, eligibility, underwriting, approval, or financing prediction. Answers stay in component memory until the page is left or reloaded; copying exports the plan to your clipboard."
  ].join("\n");
}
