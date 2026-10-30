import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import catalog from "../data/solutions/catalog.json";
import site from "../data/config/site.json";
import { pageSchema, type SolutionPage } from "../schemas/solutions";
import { playbookIndexSchema, playbookSchema, type Playbook, type PlaybookIndex } from "../schemas/playbooks";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
type Family = {
  id: string; title: string; shortTitle: string; eyebrow: string; pageType: string; summary: string;
  problem: string; goal: string; signals: string[]; questions: string[]; paths: string[];
  editorial?: ChildEditorial;
  children: [string, string, string, ChildEditorial?][];
};
type ChildEditorial = {
  headline?: string; summary?: string; problemStatement?: string; desiredOutcome?: string;
  questions?: string[]; signals?: string[]; paths?: string[]; process?: string[];
  considerations?: string[]; FAQs?: { question: string; answer: string }[];
  CTA?: { label: string; href: string; kind: "internal" | "external" };
};
type PlaybookCategoryInput = { id: string; title: string; description: string; relatedRoutes: string[] };
type PlaybookInput = {
  id: string; route: string; categoryId: string; categoryTitle: string; title: string; summary: string; audience: string; outcome: string;
  triggers: string[]; evidence: string[]; steps: { title: string; action: string; completeWhen: string }[];
  decisionCriteria: string[]; failureModes: string[]; checklist: string[];
  example: { title: string; disclosure: string; rows: { label: string; value: string }[] } | null;
  relatedRoutes: string[]; sources: { label: string; href: string; context: string }[];
};
const source = catalog as unknown as {
  home: { route: string; title: string; summary: string };
  families: Family[];
  playbookIndex: { title: string; summary: string; categories: PlaybookCategoryInput[] };
  playbooks: PlaybookInput[];
};
const familyLinks: Record<string, { label: string; href: string; context: string }[]> = {
  "buy-or-sell-a-business": [{ label: "Acquire", href: site.acquireSite, context: "Continue to the canonical destination for deeper acquisition workflows and deal tools." }],
  "business-acquisition-financing": [{ label: "Acquisition financing", href: `${site.fundingSite}/acquisition-financing`, context: "Review the canonical Funding overview for acquisition financing." }],
  "working-capital-gap": [{ label: "Working capital", href: `${site.fundingSite}/working-capital`, context: "Compare the canonical Funding overview after sizing the operating cash gap." }],
  "finance-equipment": [{ label: "Equipment financing", href: `${site.fundingSite}/equipment-financing`, context: "Review the canonical Funding overview after defining equipment cost and useful life." }],
  "accounts-receivable-cash-flow": [{ label: "Invoice financing", href: `${site.fundingSite}/invoice-financing`, context: "Review the canonical Funding overview alongside collection and receivables options." }]
};
const toolRelevant = new Set(["cash-flow-analysis", "cash-flow-forecast", "working-capital-gap", "fundability-check", "fundability-assessment", "business-valuation", "deal-analysis"]);
const acquireRelevant = new Set(["buy-or-sell-a-business", "buy-a-business", "sell-a-business", "business-valuation", "business-acquisition-readiness", "seller-readiness", "deal-analysis", "due-diligence", "deal-structure", "business-acquisition-financing", "exit-planning"]);
const ctaLabels: Record<string, string> = {
  "buy-or-sell-a-business": "MAP THE TRANSACTION", "automate-my-funding": "MAP MY FUNDING WORKFLOW",
  "business-credit-builder": "BUILD MY CREDIT ROADMAP", "improve-cash-flow": "FIND THE CASH-FLOW BOTTLENECK",
  "finance-business-growth": "PLAN THE CAPITAL MOVE", "cfo-as-a-service": "BUILD THE FINANCIAL PLAN",
  "finops-as-a-service": "MAP THE FINANCE WORKFLOW", "funding-readiness": "CHECK FUNDING READINESS"
};
const ctaTargets: Record<string, string> = {
  "buy-or-sell-a-business": "/deal-analysis", "automate-my-funding": "/funding-workflow-automation",
  "business-credit-builder": "/business-credit-roadmap", "improve-cash-flow": "/cash-flow-analysis",
  "finance-business-growth": "/capital-planning", "cfo-as-a-service": "/financial-planning",
  "finops-as-a-service": "/financial-operations", "funding-readiness": "/funding-readiness-plan"
};
const menuGroups = [
  { label: "BUY OR SELL", ids: ["buy-or-sell-a-business", "business-valuation", "deal-analysis", "exit-planning"] },
  { label: "OPTIMIZE", ids: ["automate-my-funding", "business-credit-builder", "improve-cash-flow", "funding-readiness"] },
  { label: "OPERATE", ids: ["cfo-as-a-service", "finops-as-a-service", "finance-business-growth"] }
];
const neighbors: Record<string, string[]> = {
  "buy-or-sell-a-business": ["funding-readiness", "finance-business-growth"], "automate-my-funding": ["finops-as-a-service", "funding-readiness"],
  "business-credit-builder": ["funding-readiness", "improve-cash-flow"], "improve-cash-flow": ["cfo-as-a-service", "finance-business-growth"],
  "finance-business-growth": ["cfo-as-a-service", "improve-cash-flow"], "cfo-as-a-service": ["finops-as-a-service", "finance-business-growth"],
  "finops-as-a-service": ["automate-my-funding", "cfo-as-a-service"], "funding-readiness": ["business-credit-builder", "improve-cash-flow"]
};
const pages: Record<string, unknown>[] = [];
const makePage = (options: {
  id: string; route: string; title: string; shortTitle: string; eyebrow: string; pageType: string;
  family: Family | null; parent: string | null; summary: string; problem: string; goal: string;
  signals: string[]; questions: string[]; paths: string[]; editorial?: ChildEditorial;
}) => {
  const { id, route, title, shortTitle, eyebrow, pageType, family, parent, editorial } = options;
  const summary = editorial?.summary ?? options.summary;
  const problem = editorial?.problemStatement ?? options.problem;
  const goal = editorial?.desiredOutcome ?? options.goal;
  const signals = editorial?.signals ?? options.signals;
  const questions = editorial?.questions ?? options.questions;
  const paths = editorial?.paths ?? options.paths;
  const hub = family?.id ?? id;
  const canonicalUrl = `${site.siteUrl}${route === "/" ? "" : route}`;
  const isHome = route === "/";
  const acquire = acquireRelevant.has(id);
  const funding = familyLinks[id] ?? [];
  const tools = toolRelevant.has(id) ? [{ label: "Tools directory", href: site.toolsSite, context: "Open the canonical Tools directory to find available calculators and preparation resources." }] : [];
  const acquires = acquire ? [{ label: "Acquire", href: site.acquireSite, context: "Continue to the canonical Acquire destination for deeper transaction workflows and tools." }] : [];
  const related = isHome ? source.families.map(item => item.id) : pageType === "hub" ? (family?.children ?? []).slice(0, 6).map(item => item[0]) : [hub, ...(neighbors[hub] ?? [])];
  const breadcrumbIds = isHome ? ["home"] : parent === "home" ? ["home", id] : ["home", ...(parent ? [parent, id] : [id])];
  const benefits = paths.slice(0, 3);
  const question = questions[0] ?? "What evidence and constraints should be reviewed before choosing a next step?";
  const answer = `${goal} Start with current records, make assumptions explicit, and involve qualified professionals when a decision depends on legal, tax, credit, or financing terms.`;
  return {
    id, slug: isHome ? "home" : route.slice(1), route, canonicalUrl, pageType, solutionFamily: family?.id ?? null, parent,
    eyebrow, title, shortTitle, metaTitle: `${isHome ? shortTitle : title} | Distilled Solutions`,
    metaDescription: summary.length > 155 ? `${summary.slice(0, 151).trimEnd()}…` : summary,
    hero: { headline: editorial?.headline ?? title, summary }, problemStatement: problem, desiredOutcome: goal,
    audience: isHome ? "Owners and operators deciding what to improve, build, buy, automate, or prepare next." : `${family?.title ?? "Business operators"} planning ${shortTitle.toLowerCase()} with practical records and clear decision ownership.`,
    pains: signals, goals: paths, overview: `${problem} ${goal} A useful first step is to make the current facts, timing, and decision owner visible. From there, compare operating changes, professional guidance, and any relevant financing or tool resources against the same assumptions.`,
    keyQuestions: questions, solutionPaths: paths,
    process: editorial?.process ?? ["Define the decision, the people responsible, and the date by which it must be made.", "Gather current source records and mark assumptions that still need verification.", "Compare options, risks, and next actions; update the plan when actual results differ."],
    benefits, considerations: editorial?.considerations ?? ["The right path depends on current records, timing, operating capacity, and the specific terms available.", "Model downside cases and ongoing costs before committing cash or taking on a new obligation.", "Confirm legal, tax, credit, privacy, and financing questions with the qualified professional responsible for that decision."],
    readinessSignals: signals.slice(0, 3), warningSignals: ["A promised score, approval, savings, or timeline cannot be tied to verified evidence.", "A proposed option has unclear fees, ownership, data access, or exception handling."],
    fundingConnections: funding, toolConnections: tools, acquireConnections: acquires,
    relatedSolutions: [...new Set(related.filter(item => item !== id))],
    FAQs: editorial?.FAQs ?? [
      { question: `What should I review first for ${shortTitle.toLowerCase()}?`, answer: `${question} ${answer}` },
      { question: `Does this page determine eligibility or guarantee an outcome?`, answer: "No. This guide organizes questions and next steps. It does not make underwriting, eligibility, approval, or service-availability decisions." }
    ],
    CTAs: [editorial?.CTA ?? { label: ctaLabels[hub] ?? ctaLabels[family?.id ?? ""] ?? "EXPLORE THE NEXT STEP", href: pageType === "hub" ? `/${family?.children[0]?.[0] ?? hub}` : (ctaTargets[hub] ?? (route === "/" ? `/${source.families[0]!.id}` : `/${hub}`)), kind: "internal" }, ...(acquire ? [{ label: "OPEN ACQUIRE", href: site.acquireSite, kind: "external" as const }] : [])],
    breadcrumbs: breadcrumbIds, internalLinks: [...new Set([...(parent ? [parent] : []), ...related])],
    structuredData: { includeFaq: true, service: false },
    indexStatus: "noindex", status: "noindex", lastReviewed: null,
    provenance: { canonicalSource: "Solutions — Complete Header Menu Page.txt", sourceFile: "data/solutions/catalog.json", treatment: "derived", notes: "Taxonomy follows the approved route reference. Explanatory content is editorial guidance and requires owner review before indexing." }
  };
};

const home = makePage({ id: "home", route: "/", title: source.home.title, shortTitle: "Solutions", eyebrow: "DISTILLED SOLUTIONS / OPERATOR DESK", pageType: "home", family: null, parent: null, summary: source.home.summary, problem: "A business goal can touch cash, people, systems, records, and timing at once. Starting with a product or tool can leave the underlying constraint unclear.", goal: "Name the outcome, see what needs to be understood, and choose a grounded next action.", signals: ["The desired outcome is clear but the first constraint is not.", "Several initiatives compete for the same cash or team capacity.", "The next step depends on records or decisions that are not yet organized."], questions: ["What are you trying to improve, build, buy, automate, or prepare?", "What is the current constraint: timing, information, workflow, or capital?", "Which facts need to be verified before a commitment?"], paths: ["Start with the outcome and identify the operating constraint.", "Use a relevant guide, tool, or qualified professional to test the assumptions.", "Move to the canonical Funding, Tools, or Acquire property when that deeper experience is needed."] });
pages.push(home);
for (const family of source.families) {
  pages.push(makePage({ id: family.id, route: `/${family.id}`, title: family.title, shortTitle: family.shortTitle, eyebrow: family.eyebrow, pageType: family.pageType, family, parent: "home", summary: family.summary, problem: family.problem, goal: family.goal, signals: family.signals, questions: family.questions, paths: family.paths, editorial: family.editorial }));
  for (const [id, title, purpose, editorial] of family.children) {
    const pageType = acquireRelevant.has(id) ? "acquisition" : /readiness|check|assessment|qualification|fundability/.test(id) ? "assessment" : "outcome";
    const titleSentence = purpose.endsWith(".") ? purpose : `${purpose}.`;
    pages.push(makePage({ id, route: `/${id}`, title, shortTitle: title, eyebrow: `${family.eyebrow.split(" /")[0]} / FIELD GUIDE`, pageType, family, parent: family.id, summary: titleSentence, problem: `${purpose} Without a defined scope, current evidence, and a clear decision owner, the next action can address the wrong constraint.`, goal: `Use ${title.toLowerCase()} to clarify the decision, information needed, tradeoffs, and an appropriate next step.`, signals: [purpose, `The people involved do not yet share the same assumptions or timing for ${title.toLowerCase()}.`, "The decision depends on information that has not been checked against current source records."], questions: [`What would need to be true for ${title.toLowerCase()} to solve the stated problem?`, "Which information is verified, and which assumptions could materially change the decision?", "Who owns the next review and how will the result be checked?"], paths: [purpose, "Compare an operational change, professional guidance, and a relevant external resource against the same facts.", "Document the decision, owner, timing, costs, risks, and conditions that would trigger another review."], editorial }));
  }
}
const errors = pages.flatMap((page, index) => { const result = pageSchema.safeParse(page); return result.success ? [] : [`Record ${index} (${String((page as { id?: string }).id)}): ${result.error.message}`]; });
if (errors.length) throw new Error(errors.join("\n"));
const out = path.join(root, "data", "solutions");
const typedPages = pages as SolutionPage[];
const playbookCanonical = (route: string) => `${site.siteUrl}${route}`;
const playbookProvenance = { canonicalSource: "Solutions Playbooks v1", sourceFile: "data/solutions/catalog.json", treatment: "manual" as const, notes: "New editorial content is review-required and noindex until source and editorial approval are recorded." };
const playbookIndex: PlaybookIndex = playbookIndexSchema.parse({
  id: "playbooks-index", route: "/playbooks", canonicalUrl: playbookCanonical("/playbooks"), kind: "index",
  title: source.playbookIndex.title, metaTitle: "Business Playbooks | Distilled Solutions",
  metaDescription: "Practical business playbooks with sequenced workflows, evidence checklists, decision criteria, and examples for operators.",
  summary: source.playbookIndex.summary, categories: source.playbookIndex.categories,
  status: "review", indexStatus: "noindex", lastReviewed: null, provenance: playbookProvenance
});
const playbooks: Playbook[] = source.playbooks.map((item) => playbookSchema.parse({
  ...item, kind: "playbook", canonicalUrl: playbookCanonical(item.route),
  metaTitle: `${item.title} | Distilled Solutions`, metaDescription: item.summary.length > 155 ? `${item.summary.slice(0, 151).trimEnd()}…` : item.summary,
  breadcrumbs: [
    { label: "Home", route: "/" },
    { label: "Playbooks", route: "/playbooks" },
    { label: item.categoryTitle, route: `/playbooks#${item.categoryId}` }
  ],
  status: "review", indexStatus: "noindex", lastReviewed: null, provenance: playbookProvenance
}));
const playbookRecords = [playbookIndex, ...playbooks];
const playbookErrors = playbookRecords.flatMap((record, index) => {
  const result = record.kind === "index" ? playbookIndexSchema.safeParse(record) : playbookSchema.safeParse(record);
  return result.success ? [] : [`Playbook record ${index} (${record.id}): ${result.error.message}`];
});
if (playbookErrors.length) throw new Error(playbookErrors.join("\n"));
if (new Set(playbookRecords.map((record) => record.route)).size !== 13) throw new Error("Playbooks must contain one index and twelve unique routes.");
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "solutions.pages.manifest.json"), `${JSON.stringify(pages, null, 2)}\n`);
fs.writeFileSync(path.join(out, "solutions.playbooks.manifest.json"), `${JSON.stringify(playbookRecords, null, 2)}\n`);
const familyNavigation = source.families.map(({ id, title, shortTitle, eyebrow, children }) => ({ id, title, shortTitle, eyebrow, route: `/${id}`, links: children.map(([childId, childTitle]) => ({ id: childId, title: childTitle, route: `/${childId}` })) }));
const navigationManifest = {
  menus: menuGroups.map((group) => ({ label: group.label, links: group.ids.map((id) => familyNavigation.find((family) => family.id === id) ?? familyNavigation.flatMap((family) => family.links).find((link) => link.id === id)).filter(Boolean).map((link) => ({ id: link!.id, title: link!.id === familyNavigation.find((family) => family.id === link!.id)?.id ? familyNavigation.find((family) => family.id === link!.id)!.shortTitle : link!.title, route: link!.route })) })),
  families: familyNavigation
};
fs.writeFileSync(path.join(out, "solutions.navigation.manifest.json"), `${JSON.stringify(navigationManifest, null, 2)}\n`);
fs.writeFileSync(path.join(out, "solutions.relationships.json"), `${JSON.stringify(typedPages.map((page) => ({ id: page.id, parent: page.parent, related: page.relatedSolutions, funding: page.fundingConnections, tools: page.toolConnections, acquire: page.acquireConnections })), null, 2)}\n`);
const coreRoutes = typedPages.map((page) => page.route);
const playbookRoutes = playbookRecords.map((page) => page.route);
const allRoutes = [...coreRoutes, ...playbookRoutes];
fs.writeFileSync(path.join(out, "solutions.core-routes.manifest.json"), `${JSON.stringify(coreRoutes, null, 2)}\n`);
fs.writeFileSync(path.join(out, "solutions.routes.manifest.json"), `${JSON.stringify(allRoutes, null, 2)}\n`);
fs.writeFileSync(path.join(root, "CANONICAL-SITEMAP.txt"), `${allRoutes.join("\n")}\n`);
console.log(`Generated ${pages.length} Solutions pages, ${playbookRecords.length} review/noindex Playbook pages, and ${allRoutes.length} unique canonical routes.`);
