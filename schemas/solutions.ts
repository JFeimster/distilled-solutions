import { z } from "zod";

export const solutionFamilies = [
  "buy-or-sell-a-business", "automate-my-funding", "business-credit-builder", "improve-cash-flow",
  "finance-business-growth", "cfo-as-a-service", "finops-as-a-service", "funding-readiness"
] as const;
export const pageTypes = ["home", "hub", "outcome", "service", "assessment", "acquisition"] as const;
export const contentStatus = ["draft", "review", "index", "noindex"] as const;
const textList = z.array(z.string().min(1));
const linkSchema = z.object({ label: z.string().min(1), href: z.url(), context: z.string().min(1) });
export const pageSchema = z.object({
  id: z.string().min(1), slug: z.string().min(1), route: z.string().min(1), canonicalUrl: z.url(),
  pageType: z.enum(pageTypes), solutionFamily: z.enum(solutionFamilies).nullable(), parent: z.string().nullable(),
  eyebrow: z.string().min(1), title: z.string().min(1), shortTitle: z.string().min(1),
  metaTitle: z.string().min(1), metaDescription: z.string().min(40),
  hero: z.object({ headline: z.string().min(1), summary: z.string().min(40) }),
  problemStatement: z.string().min(40), desiredOutcome: z.string().min(40), audience: z.string().min(20),
  pains: textList.min(2), goals: textList.min(2), overview: z.string().min(80), keyQuestions: textList.min(2),
  solutionPaths: textList.min(2), process: textList.min(2), benefits: textList.min(2), considerations: textList.min(2),
  readinessSignals: textList.min(1), warningSignals: textList.min(1),
  fundingConnections: z.array(linkSchema), toolConnections: z.array(linkSchema), acquireConnections: z.array(linkSchema),
  relatedSolutions: textList, FAQs: z.array(z.object({ question: z.string().min(5), answer: z.string().min(30) })).min(1),
  CTAs: z.array(z.object({ label: z.string().min(2), href: z.string().min(1), kind: z.enum(["internal", "external"]) })).min(1),
  breadcrumbs: textList, internalLinks: textList, structuredData: z.object({ includeFaq: z.boolean(), service: z.boolean() }),
  indexStatus: z.enum(contentStatus), status: z.enum(contentStatus), lastReviewed: z.iso.date().nullable(),
  provenance: z.object({ canonicalSource: z.string().min(1), sourceFile: z.string().min(1), treatment: z.enum(["adapted", "derived", "manual"]), notes: z.string().min(1) })
});
export type SolutionPage = z.infer<typeof pageSchema>;
