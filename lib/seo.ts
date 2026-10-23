import type { Metadata } from "next";
import { site } from "@/lib/config";
import { getBreadcrumbs } from "@/lib/solutions/pages";
import type { SolutionPage } from "@/schemas/solutions";

export function isIndexable(page: SolutionPage, enabled = process.env.ALLOW_INDEXING === "true") {
  return enabled && page.status === "index" && page.indexStatus === "index" && page.lastReviewed !== null;
}
export function pageMetadata(page: SolutionPage): Metadata {
  const indexable = isIndexable(page);
  return {
    title: { absolute: page.metaTitle }, description: page.metaDescription,
    alternates: { canonical: page.canonicalUrl }, robots: { index: indexable, follow: true },
    openGraph: { type: "website", siteName: site.name, title: page.metaTitle, description: page.metaDescription, url: page.canonicalUrl, images: [{ url: `${site.siteUrl}/opengraph-image`, width: 1200, height: 630, alt: "Distilled Solutions — operator decision guides" }] },
    twitter: { card: "summary_large_image", title: page.metaTitle, description: page.metaDescription, images: [`${site.siteUrl}/opengraph-image`] }
  };
}
export function structuredData(page: SolutionPage) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${site.siteUrl}/#website`, name: site.name, url: site.siteUrl },
      { "@type": "WebPage", "@id": `${page.canonicalUrl}#webpage`, name: page.title, description: page.metaDescription, url: page.canonicalUrl, isPartOf: { "@id": `${site.siteUrl}/#website` } },
      { "@type": "BreadcrumbList", itemListElement: getBreadcrumbs(page).map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.shortTitle, item: item.canonicalUrl })) },
      ...(page.structuredData.service ? [{ "@type": "Service", name: page.shortTitle, description: page.metaDescription, provider: { "@type": "Organization", name: site.name } }] : []),
      ...(page.structuredData.includeFaq && page.FAQs.length ? [{ "@type": "FAQPage", mainEntity: page.FAQs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }] : [])
    ]
  };
}
export function safeJsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c"); }
