import type { MetadataRoute } from "next";
import { pages } from "@/lib/solutions/pages";
import { isIndexable } from "@/lib/seo";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.filter((page) => isIndexable(page)).map((page) => ({ url: page.canonicalUrl, ...(page.lastReviewed ? { lastModified: page.lastReviewed } : {}) }));
}
