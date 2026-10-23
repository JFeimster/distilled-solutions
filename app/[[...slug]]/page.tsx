import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pages, getPageByRoute } from "@/lib/solutions/pages";
import { pageMetadata } from "@/lib/seo";
import { PageRenderer } from "@/components/solutions/PageRenderer";

export const dynamicParams = false;
export function generateStaticParams() { return pages.map((page) => ({ slug: page.route === "/" ? [] : page.route.slice(1).split("/") })); }
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageByRoute(slug?.length ? `/${slug.join("/")}` : "/");
  return page ? pageMetadata(page) : {};
}
export default async function SolutionRoute({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const page = getPageByRoute(slug?.length ? `/${slug.join("/")}` : "/");
  if (!page || page.status === "draft") notFound();
  return <PageRenderer page={page}/>;
}
