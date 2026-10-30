import records from "@/data/solutions/solutions.pages.manifest.json";
import { pageSchema, type SolutionPage } from "@/schemas/solutions";
import routes from "@/data/solutions/solutions.routes.manifest.json";

export const pages: SolutionPage[] = records.map((record) => pageSchema.parse(record));
export const canonicalRoutes: string[] = routes;
const byId = new Map(pages.map((page) => [page.id, page]));
const byRoute = new Map(pages.map((page) => [page.route, page]));
export const getPage = (id: string) => byId.get(id);
export const getPageByRoute = (route: string) => byRoute.get(route);
export const getChildren = (page: SolutionPage) => pages.filter((item) => item.parent === page.id && item.status !== "draft");
export const getParent = (page: SolutionPage) => page.parent ? byId.get(page.parent) : undefined;
export function getBreadcrumbs(page: SolutionPage): SolutionPage[] {
  const trail: SolutionPage[] = [];
  const seen = new Set<string>();
  let current: SolutionPage | undefined = page;
  while (current) {
    if (seen.has(current.id)) throw new Error(`Parent cycle at ${current.id}`);
    seen.add(current.id); trail.unshift(current); current = getParent(current);
  }
  return trail;
}
export function getRelatedPages(page: SolutionPage) {
  return page.relatedSolutions.map((id) => byId.get(id)).filter((item): item is SolutionPage => !!item && item.status !== "draft");
}
