"use client";
import Link from "next/link";
import { PropertyLink } from "@/components/solutions/PropertyLink";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/config";
import navigation from "@/data/solutions/solutions.navigation.manifest.json";

const groups = navigation.menus;

export function SiteHeader() {
  const [active, setActive] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const header = useRef<HTMLElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) { setActive(null); setMobile(false); } };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);
  const close = () => { setActive(null); setMobile(false); };
  return <header className="site-header" ref={header} onKeyDown={(event) => { if (event.key === "Escape") { if (mobile) mobileTrigger.current?.focus(); else if (active !== null) triggers.current[active]?.focus(); close(); } }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}>
    <div className="utility-bar"><div className="wrap utility-inner"><span>OPERATOR DECISION DESK</span><span>PROBLEMS → PATHS → NEXT STEPS</span></div></div>
    <div className="header-main wrap">
      <Link href="/" className="brand" aria-label="Distilled Solutions home" onClick={close}><span className="brand-mark" aria-hidden="true">d<span>s</span></span><span>DISTILLED<span>SOLUTIONS</span></span></Link>
      <nav id="primary-navigation" className={`primary-nav ${mobile ? "mobile-open" : ""}`} aria-label="Primary navigation">
        {groups.map((group, index) => <div className="nav-group" key={group.label}>
          <button ref={(node) => { triggers.current[index] = node; }} className="nav-trigger" aria-expanded={active === index} aria-controls={`nav-${index}`} onClick={() => setActive(active === index ? null : index)}>{group.label}<span aria-hidden="true">{active === index ? "−" : "+"}</span></button>
          <div className="mega-menu" id={`nav-${index}`} hidden={active !== index}><div className="wrap mega-inner"><div className="mega-intro"><span className="eyebrow">ROUTE BY OUTCOME / 0{index + 1}</span><p>Start with the business decision. See the questions and practical paths behind it.</p></div><ul>{group.links.map((link) => <li key={link.id}><Link href={link.route} onClick={close}>{link.title}<span aria-hidden="true">↗</span></Link></li>)}</ul></div></div>
        </div>)}
        <Link href="/playbooks" className="nav-playbooks" onClick={close}>Playbooks <span aria-hidden="true">↗</span></Link>
      </nav>
      <div className="ecosystem-links"><PropertyLink href={site.fundingSite}>Funding preview <span aria-hidden="true">↗</span></PropertyLink><PropertyLink href={site.toolsSite}>Tools <span aria-hidden="true">↗</span></PropertyLink><PropertyLink href={site.acquireSite}>Acquire preview <span aria-hidden="true">↗</span></PropertyLink></div>
      <Link href="/funding-readiness" className="button button-orange header-cta" onClick={close}>Check readiness <span aria-hidden="true">↗</span></Link>
      <button className="mobile-toggle" ref={mobileTrigger} aria-label={mobile ? "Close navigation" : "Open navigation"} aria-expanded={mobile} aria-controls="primary-navigation" onClick={() => { setMobile(!mobile); setActive(null); }}>{mobile ? "×" : "☰"}</button>
    </div>
  </header>;
}
