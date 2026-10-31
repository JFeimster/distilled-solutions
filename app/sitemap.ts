import type { MetadataRoute } from "next";
import { pages } from "@/lib/solutions/pages";
import { playbookPages } from "@/lib/solutions/playbooks";
import { indexableSitemapEntries } from "@/lib/seo";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return indexableSitemapEntries([...pages, ...playbookPages]);
}
