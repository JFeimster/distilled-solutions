export const bottleneckOptions = [
  { value: "intake", label: "Intake" },
  { value: "review", label: "Qualification / review handoffs" },
  { value: "documents", label: "Document collection" },
  { value: "routing", label: "Routing" },
  { value: "follow-up", label: "Follow-up" },
  { value: "crm", label: "CRM / data duplication" }
] as const;
export const processOptions = [
  { value: "manual", label: "Primarily manual" },
  { value: "partial", label: "Partially automated" },
  { value: "inconsistent", label: "Automated but inconsistent" }
] as const;
export const workloadOptions = [
  { value: "low", label: "Low" }, { value: "moderate", label: "Moderate" }, { value: "high", label: "High" }
] as const;
export const riskOptions = [
  { value: "missing", label: "Missing information" },
  { value: "owner", label: "No clear owner" },
  { value: "reentry", label: "Repeated entry" },
  { value: "missed", label: "Missed follow-up" },
  { value: "sensitive", label: "Sensitive-data handling" },
  { value: "decisions", label: "Unreviewed decisions" }
] as const;
export const systemOptions = [
  { value: "spreadsheet", label: "Spreadsheet" },
  { value: "crm", label: "CRM" },
  { value: "form", label: "Form / intake tool" },
  { value: "multiple", label: "Multiple disconnected systems" },
  { value: "none", label: "No established system" }
] as const;

type Value<T extends readonly { value: string }[]> = T[number]["value"];
export type DiagnosticInput = {
  bottleneck: Value<typeof bottleneckOptions>;
  process: Value<typeof processOptions>;
  workload: Value<typeof workloadOptions>;
  risk: Value<typeof riskOptions>;
  system: Value<typeof systemOptions>;
};
type Guide = { label: string; href: string };
export type DiagnosticResult = {
  bottleneck: string;
  firstFix: string;
  reasoning: string;
  actions: [string, string, string];
  humanControls: [string, string];
  dataControls: [string, string];
  relatedGuides: [Guide, Guide];
  nextStep: Guide;
};

const byBottleneck: Record<DiagnosticInput["bottleneck"], {
  firstFix: string; reasoning: string; action: string; guide: Guide; review: string;
}> = {
  intake: {
    firstFix: "Standardize the intake checklist and create an incomplete-submission queue.",
    reasoning: "A reliable first handoff needs required fields, consent, and a named person to resolve gaps.",
    action: "List the minimum intake fields, consent check, and owner for incomplete submissions.",
    guide: { label: "Funding intake automation", href: "/funding-intake-automation" },
    review: "A person reviews incomplete or conflicting intake before it advances."
  },
  review: {
    firstFix: "Create a visible review queue with evidence and decision ownership.",
    reasoning: "Status automation can organize review work, while authorized people retain qualification and credit decisions.",
    action: "Record the evidence needed at each review handoff and name the authorized reviewer.",
    guide: { label: "Funding qualification automation", href: "/funding-qualification-automation" },
    review: "An authorized person makes and records every eligibility, credit, and underwriting decision."
  },
  documents: {
    firstFix: "Track document requests and versions in a controlled checklist.",
    reasoning: "A shared status and owner can reduce repeated requests without moving sensitive files into ordinary messages.",
    action: "Define each requested record, its version/status, secure location, and follow-up owner.",
    guide: { label: "Document collection automation", href: "/document-collection-automation" },
    review: "A person confirms document completeness and resolves mismatches against source records."
  },
  routing: {
    firstFix: "Document routing criteria and send exceptions to a named reviewer.",
    reasoning: "A transparent routing rule can move work to the right queue without deciding a funding outcome.",
    action: "Write the purpose, product-scope, geography, and exception rules used to assign a review queue.",
    guide: { label: "Funding routing automation", href: "/funding-routing-automation" },
    review: "A person checks routing exceptions and all lender or product suitability judgments."
  },
  "follow-up": {
    firstFix: "Create an owned follow-up queue with timing and consent rules.",
    reasoning: "Visible tasks and opt-out handling reduce missed contact without sending unreviewed messages.",
    action: "Define the next-contact trigger, owner, due date, channel preference, and opt-out handling.",
    guide: { label: "Funding follow-up automation", href: "/funding-follow-up-automation" },
    review: "A person approves message content and reviews exceptions, consent, and opt-outs."
  },
  crm: {
    firstFix: "Choose the owner and source of truth for each duplicated field.",
    reasoning: "Field ownership and exception handling need to be clear before any system sync is useful.",
    action: "List duplicated fields, their source systems, update events, and conflict owner.",
    guide: { label: "CRM automation", href: "/crm-automation" },
    review: "A person resolves conflicting records and reviews proposed changes to the system of record."
  }
};
const byProcess: Record<DiagnosticInput["process"], string> = {
  manual: "Write the current manual steps before creating a single task or status rule.",
  partial: "Compare existing automations with the documented handoff and remove duplicate triggers.",
  inconsistent: "Audit current triggers and pause rules that move work without a clear owner or source record."
};
const byWorkload: Record<DiagnosticInput["workload"], string> = {
  low: "Use a few recent cases to check the proposed handoff before expanding it.",
  moderate: "Pilot with a bounded queue and review a sample of completed cases.",
  high: "Pilot on a limited segment with capacity, exception volume, and rollback checkpoints."
};
const byRisk: Record<DiagnosticInput["risk"], { action: string; control: string }> = {
  missing: { action: "Block progression when required information is missing and show the gap to its owner.", control: "Require a reviewer to resolve missing or conflicting evidence before progression." },
  owner: { action: "Assign one accountable owner and a backup for every open exception.", control: "Escalate unowned work to a named human queue." },
  reentry: { action: "Reconcile duplicate fields before syncing any data between tools.", control: "Have a person review field conflicts and failed updates." },
  missed: { action: "Set a due date and visible escalation for overdue follow-up tasks.", control: "Have a person review overdue tasks and consent before contact." },
  sensitive: { action: "Limit access and retention to the minimum approved for this handoff.", control: "Require an authorized privacy review before expanding access or moving records." },
  decisions: { action: "Stop automated progression at the decision gate and present source evidence to a reviewer.", control: "An authorized person approves, denies, prices, and submits; the workflow only records status." }
};
const bySystem: Record<DiagnosticInput["system"], { action: string; privacy: string }> = {
  spreadsheet: { action: "Mark which spreadsheet is authoritative and record who can edit it.", privacy: "Keep sensitive rows access-limited and define an approved retention location." },
  crm: { action: "Name the CRM record owner and map field updates before adding automations.", privacy: "Use CRM roles and audit history to limit and trace access." },
  form: { action: "Map form fields to the approved record and define what happens on a failed transfer.", privacy: "Confirm form consent, secure transfer, and retention before collecting records." },
  multiple: { action: "Choose one system of record per field and an owner for sync conflicts.", privacy: "Document data flows, access, and deletion across each connected system." },
  none: { action: "Establish a simple approved record and task owner before choosing software.", privacy: "Define access, consent, and retention before moving information into a new tool." }
};

function optionLabel<T extends readonly { value: string; label: string }[]>(options: T, value: T[number]["value"]) {
  return options.find((item) => item.value === value)!.label;
}

export function evaluateFundingWorkflow(input: DiagnosticInput): DiagnosticResult {
  const bottleneck = byBottleneck[input.bottleneck];
  const risk = byRisk[input.risk];
  const system = bySystem[input.system];
  return {
    bottleneck: optionLabel(bottleneckOptions, input.bottleneck),
    firstFix: bottleneck.firstFix,
    reasoning: bottleneck.reasoning,
    actions: [
      bottleneck.action,
      `${byProcess[input.process]} ${byWorkload[input.workload]}`,
      `${system.action} ${risk.action}`
    ],
    humanControls: [bottleneck.review, risk.control],
    dataControls: [system.privacy, "Keep customer records and credentials out of this diagnostic; use only approved systems and minimum necessary access."],
    relatedGuides: [bottleneck.guide, { label: "Automate funding operations", href: "/automate-my-funding" }],
    nextStep: { label: `Read the ${bottleneck.guide.label} guide`, href: bottleneck.guide.href }
  };
}

export function formatActionPlan(input: DiagnosticInput, result = evaluateFundingWorkflow(input)): string {
  return [
    "FUNDING WORKFLOW ACTION PLAN",
    `Main bottleneck: ${result.bottleneck}`,
    `Current process: ${optionLabel(processOptions, input.process)}`,
    `Workload: ${optionLabel(workloadOptions, input.workload)}`,
    `Principal risk: ${optionLabel(riskOptions, input.risk)}`,
    `System context: ${optionLabel(systemOptions, input.system)}`,
    "",
    `First fix: ${result.firstFix}`,
    `Why: ${result.reasoning}`,
    "",
    "PRIORITIZED ACTIONS",
    ...result.actions.map((action, index) => `${index + 1}. ${action}`),
    "",
    "HUMAN REVIEW",
    ...result.humanControls.map((control) => `- ${control}`),
    "",
    "DATA OWNERSHIP & PRIVACY",
    ...result.dataControls.map((control) => `- ${control}`),
    "",
    "RELATED GUIDES",
    ...result.relatedGuides.map((guide) => `- ${guide.label}: ${guide.href}`),
    "",
    "This plan is operational guidance. It makes no eligibility, credit, underwriting, approval, or financing decision."
  ].join("\n");
}
