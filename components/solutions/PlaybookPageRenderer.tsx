import Link from "next/link";
import type { Playbook, PlaybookPage } from "@/schemas/playbooks";
import { getPage } from "@/lib/solutions/pages";
import { playbooks } from "@/lib/solutions/playbooks";
import { PlaybookChecklist } from "@/components/solutions/PlaybookChecklist";
import { PlaybooksIndex } from "@/components/solutions/PlaybooksIndex";
import { site } from "@/lib/config";
import { safeJsonLd } from "@/lib/seo";

function StructuredData({ page }: { page: PlaybookPage }) {
  const graph: Record<string, unknown>[] = [
    { "@type": "WebPage", "@id": `${page.canonicalUrl}#webpage`, name: page.title, description: page.metaDescription, url: page.canonicalUrl, isPartOf: { "@id": `${site.siteUrl}/#website` } },
    { "@type": "BreadcrumbList", itemListElement: page.kind === "playbook" ? page.breadcrumbs.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.label, item: item.route.startsWith("/") && item.route !== "/" ? `${site.siteUrl}${item.route.split("#")[0]}` : `${site.siteUrl}/` })) : [{ "@type": "ListItem", position: 1, name: "Home", item: `${site.siteUrl}/` }, { "@type": "ListItem", position: 2, name: "Playbooks", item: page.canonicalUrl }] }
  ];
  if (page.kind === "playbook") graph.push({ "@type": "HowTo", name: page.title, description: page.summary, step: page.steps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, name: step.title, text: step.action })) });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@graph": [{ "@type": "WebSite", "@id": `${site.siteUrl}/#website`, name: site.name, url: site.siteUrl }, ...graph] }) }} />;
}

function PlaybookBreadcrumbs({ page }: { page: Playbook }) {
  return <nav className="breadcrumbs wrap" aria-label="Breadcrumb"><ol>{page.breadcrumbs.map((item, index) => <li key={`${item.label}-${index}`}>{index < page.breadcrumbs.length - 1 ? <Link href={item.route}>{item.label}</Link> : <span aria-current="page">{page.title}</span>}</li>)}</ol></nav>;
}

function Detail({ page }: { page: Playbook }) {
  const related = page.relatedRoutes.map((route) => getPage(route.slice(1))).filter((item) => item !== undefined);
  return <main className="playbook-detail">
    <StructuredData page={page}/><PlaybookBreadcrumbs page={page}/>
    <section className="playbook-detail-hero"><div className="wrap playbook-detail-hero-inner"><div><span className="eyebrow">PLAYBOOK / {page.categoryTitle.toUpperCase()}</span><h1>{page.title}</h1><p>{page.summary}</p><div className="playbook-hero-tags"><span>WORKFLOW</span><span>CHECKLIST</span><span>REVIEW REQUIRED / NOINDEX</span></div></div><aside><span className="mono-label">USE THIS WHEN</span><ul>{page.triggers.slice(0,3).map((trigger) => <li key={trigger}>{trigger}</li>)}</ul></aside></div></section>
    <div className="wrap playbook-detail-content">
      <section className="playbook-section playbook-intro"><span className="eyebrow">THE WORKING OUTCOME</span><h2>{page.outcome}</h2><p><strong>Who this is for:</strong> {page.audience}</p></section>
      <section className="playbook-section"><div className="playbook-section-heading"><span className="eyebrow">01 / GATHER THE RECORDS</span><h2>Start with current evidence.</h2></div><ul className="playbook-evidence-list">{page.evidence.map((item,index)=><li key={item}><span>{String(index+1).padStart(2,"0")}</span><p>{item}</p></li>)}</ul></section>
      <section className="playbook-section"><div className="playbook-section-heading"><span className="eyebrow">02 / OPERATING SEQUENCE</span><h2>Move through the work.</h2><p>Each step names the action and what completion looks like. Record assumptions and unresolved questions as you go.</p></div><ol className="playbook-steps">{page.steps.map((step,index)=><li key={step.title}><div className="playbook-step-number">{String(index+1).padStart(2,"0")}</div><div><h3>{step.title}</h3><p>{step.action}</p><div className="playbook-complete"><span className="mono-label">COMPLETE WHEN</span><p>{step.completeWhen}</p></div></div></li>)}</ol></section>
      {page.example && <section className="playbook-section playbook-example"><span className="eyebrow">ILLUSTRATIVE EXAMPLE</span><h2>{page.example.title}</h2><p>{page.example.disclosure}</p><dl>{page.example.rows.map((row)=><div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl></section>}
      <section className="playbook-section playbook-decision-grid"><div><span className="eyebrow">03 / DECISION CHECKS</span><h2>What changes the next move?</h2><ul>{page.decisionCriteria.map((item)=><li key={item}>{item}</li>)}</ul></div><div><span className="eyebrow">COMMON FAILURE POINTS</span><h2>Keep these visible.</h2><ul>{page.failureModes.map((item)=><li key={item}>{item}</li>)}</ul></div></section>
      <section className="playbook-section"><div className="playbook-section-heading"><span className="eyebrow">04 / TAKE IT INTO THE WORK</span><h2>Check, assign, and continue.</h2></div><PlaybookChecklist title={page.title} items={page.checklist}/></section>
      {page.sources.length > 0 && <section className="playbook-section playbook-sources"><span className="eyebrow">SOURCE REFERENCES</span><h2>Check the current source.</h2><ul>{page.sources.map((source)=><li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label} ↗</a><p>{source.context}</p></li>)}</ul></section>}
      {related.length > 0 && <section className="playbook-section playbook-related"><span className="eyebrow">RELATED SOLUTIONS</span><h2>Continue with the relevant guide.</h2><div>{related.map((item)=><Link href={item.route} key={item.id}><span className="mono-label">{item.eyebrow}</span><strong>{item.shortTitle}</strong><span aria-hidden="true">↗</span></Link>)}</div></section>}
      {page.id === "diagnose-working-capital-gap" && <section className="playbook-section playbook-related"><span className="eyebrow">NEXT / CASH FLOW METHOD</span><h2>Inspect the low point by week.</h2><div><Link href="/playbooks/cash-flow/13-week-cash-flow-forecast"><span className="mono-label">RELATED PLAYBOOK</span><strong>Build a 13-week cash flow forecast</strong><span aria-hidden="true">↗</span></Link></div></section>}
      <section className="playbook-disclaimer"><p>This playbook is general operating guidance. It does not verify records, replace qualified professional advice, determine eligibility, or guarantee a financial outcome. Review current contracts, source records, and applicable requirements with the responsible professional.</p><Link href="/playbooks">← Back to all playbooks</Link></section>
    </div>
  </main>;
}

export function PlaybookPageRenderer({ page }: { page: PlaybookPage }) {
  if (page.kind === "index") {
    const categories = page.categories.map((category) => ({ ...category, solutionLinks: category.relatedRoutes.map((id) => getPage(id)).filter((item) => item !== undefined).map((item) => ({ route: item.route, title: item.shortTitle })) }));
    return <><StructuredData page={page}/><PlaybooksIndex page={page} categories={categories} items={playbooks}/></>;
  }
  return <Detail page={page as Playbook}/>;
}
