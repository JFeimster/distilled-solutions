import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canonicalRoutes, getPageByRoute } from "@/lib/solutions/pages";
import { getPlaybookByRoute } from "@/lib/solutions/playbooks";
import { pageMetadata, playbookMetadata } from "@/lib/seo";
import { PageRenderer } from "@/components/solutions/PageRenderer";
import { PlaybookPageRenderer } from "@/components/solutions/PlaybookPageRenderer";

export const dynamicParams = false;
export function generateStaticParams() { return canonicalRoutes.map((route) => ({ slug: route === "/" ? [] : route.slice(1).split("/") })); }
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = slug?.length ? `/${slug.join("/")}` : "/";
  const page = getPageByRoute(route);
  const playbook = getPlaybookByRoute(route);
  return page ? pageMetadata(page) : playbook ? playbookMetadata(playbook) : {};
}
export default async function SolutionRoute({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const route = slug?.length ? `/${slug.join("/")}` : "/";
  const page = getPageByRoute(route);
  const playbook = getPlaybookByRoute(route);
  if (page && page.status !== "draft") return <PageRenderer page={page}/>;
  if (playbook && playbook.status !== "draft") return <PlaybookPageRenderer page={playbook}/>;
  notFound();
}
