"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Playbook, PlaybookCategory, PlaybookIndex } from "@/schemas/playbooks";

type CategoryWithSolutions = PlaybookCategory & { solutionLinks: { route: string; title: string }[] };
export function PlaybooksIndex({ page, categories, items }: { page: PlaybookIndex; categories: CategoryWithSolutions[]; items: Playbook[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const visible = useMemo(() => items.filter((item) => {
    const categoryMatch = activeCategory === "all" || item.categoryId === activeCategory;
    const searchMatch = `${item.title} ${item.summary} ${item.categoryTitle}`.toLowerCase().includes(query.trim().toLowerCase());
    return categoryMatch && searchMatch;
  }), [activeCategory, items, query]);
  return <main className="playbooks-index">
    <nav className="breadcrumbs wrap" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li><span aria-current="page">Playbooks</span></li></ol></nav>
    <section className="playbooks-index-hero"><div className="wrap playbooks-index-hero-inner"><div><span className="eyebrow">DISTILLED SOLUTIONS / FIELD PLAYBOOKS</span><h1>{page.title}</h1><p>{page.summary}</p><a className="button button-lime" href="#playbook-library">Browse the library <span aria-hidden="true">↓</span></a></div><div className="playbooks-index-mark" aria-hidden="true"><span>12</span><small>OPERATOR<br/>WORKFLOWS</small><i>DS / 01</i></div></div></section>
    <section className="playbooks-library wrap" id="playbook-library">
      <div className="playbooks-library-head"><div><span className="eyebrow">01 / FIND A WORKFLOW</span><h2>Choose the work<br/>in front of you.</h2></div><p>Each playbook gives you a sequence, a record list, decision checks, and a clear completion test. Use it as a working note with your team.</p></div>
      <div className="playbooks-controls"><label htmlFor="playbook-search">Search playbooks</label><input id="playbook-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try cash forecast, reporting, close…"/><div className="playbook-category-tabs" role="group" aria-label="Filter playbooks by category"><button type="button" aria-pressed={activeCategory === "all"} onClick={() => setActiveCategory("all")}>All 12</button>{categories.map((category) => <button type="button" key={category.id} aria-pressed={activeCategory === category.id} onClick={() => setActiveCategory(category.id)}>{category.title}</button>)}</div></div>
      <p className="playbook-result-count" aria-live="polite">Showing {visible.length} of 12 playbooks</p>
      <div className="playbook-category-list">{categories.map((category, categoryIndex) => {
        const categoryItems = visible.filter((item) => item.categoryId === category.id);
        if (!categoryItems.length) return null;
        return <section className="playbook-category" id={category.id} key={category.id}>
          <div className="playbook-category-heading"><span className="mono-label">CATEGORY / {String(categoryIndex + 1).padStart(2,"0")}</span><h3>{category.title}</h3><p>{category.description}</p><div className="playbook-solution-links"><span>RELATED SOLUTIONS</span>{category.solutionLinks.map((link) => <Link href={link.route} key={link.route}>{link.title} ↗</Link>)}</div></div>
          <div className="playbook-resource-list">{categoryItems.map((item, itemIndex) => <Link className="playbook-resource" href={item.route} key={item.id}><span className="playbook-resource-number">{String(itemIndex + 1).padStart(2,"0")}</span><span className="playbook-resource-copy"><span className="mono-label">{item.categoryTitle.toUpperCase()}</span><strong>{item.title}</strong><small>{item.summary}</small><span className="playbook-card-action">OPEN PLAYBOOK <b aria-hidden="true">↗</b></span></span></Link>)}</div>
        </section>;
      })}</div>
      {visible.length === 0 && <p className="playbook-empty-result">No playbooks match that search. Try another term or choose “All 12.”</p>}
    </section>
    <section className="playbooks-index-final"><div className="wrap"><span className="eyebrow">02 / KEEP THE NEXT MOVE CLEAR</span><h2>Start with the evidence.<br/><em>Then assign the action.</em></h2><p>Explore the existing Solutions guides and diagnostics when the work needs a deeper decision path.</p><div className="hero-actions"><Link className="button button-lime" href="/business-credit-readiness#credit-readiness-diagnostic">Business credit diagnostic <span aria-hidden="true">↗</span></Link><Link className="button button-outline-light" href="/funding-workflow-automation">Funding workflow diagnostic <span aria-hidden="true">↗</span></Link></div></div></section>
  </main>;
}
