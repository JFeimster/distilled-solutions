import { z } from "zod";

export const playbookCategoryIds = ["cash-flow", "business-credit", "automation", "growth", "financial-operations", "acquisitions"] as const;
const linkSchema = z.object({ label: z.string().min(1), href: z.url(), context: z.string().min(1) });
const common = {
  id: z.string().min(1), route: z.string().min(1), canonicalUrl: z.url(), title: z.string().min(1),
  metaTitle: z.string().min(1), metaDescription: z.string().min(40), summary: z.string().min(60),
  status: z.enum(["draft", "review", "index", "noindex"]), indexStatus: z.enum(["draft", "review", "index", "noindex"]),
  lastReviewed: z.iso.date().nullable(), provenance: z.object({ canonicalSource: z.string().min(1), sourceFile: z.string().min(1), treatment: z.enum(["adapted", "derived", "manual"]), notes: z.string().min(1) })
};

export const playbookCategorySchema = z.object({
  id: z.enum(playbookCategoryIds), title: z.string().min(1), description: z.string().min(40), relatedRoutes: z.array(z.string().min(1))
});

export const playbookIndexSchema = z.object({
  ...common, kind: z.literal("index"), categories: z.array(playbookCategorySchema).length(6)
});

export const playbookSchema = z.object({
  ...common, kind: z.literal("playbook"), categoryId: z.enum(playbookCategoryIds), categoryTitle: z.string().min(1),
  audience: z.string().min(40), outcome: z.string().min(50), triggers: z.array(z.string().min(20)).min(3),
  evidence: z.array(z.string().min(20)).min(4),
  steps: z.array(z.object({ title: z.string().min(4), action: z.string().min(80), completeWhen: z.string().min(35) })).min(4),
  decisionCriteria: z.array(z.string().min(25)).min(3), failureModes: z.array(z.string().min(25)).min(3),
  checklist: z.array(z.string().min(15)).min(4), example: z.object({ title: z.string().min(5), disclosure: z.string().min(20), rows: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })).min(2) }).nullable(),
  relatedRoutes: z.array(z.string().min(1)).min(1), sources: z.array(linkSchema),
  breadcrumbs: z.array(z.object({ label: z.string().min(1), route: z.string().min(1) })).min(2)
});

export type PlaybookCategory = z.infer<typeof playbookCategorySchema>;
export type PlaybookIndex = z.infer<typeof playbookIndexSchema>;
export type Playbook = z.infer<typeof playbookSchema>;
export type PlaybookPage = PlaybookIndex | Playbook;
