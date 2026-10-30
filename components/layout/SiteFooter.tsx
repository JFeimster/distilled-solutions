import Link from "next/link";
import { PropertyLink } from "@/components/solutions/PropertyLink";
import { site } from "@/lib/config";
export function SiteFooter() {
  return <footer className="site-footer"><div className="wrap footer-top"><div><Link href="/" className="brand footer-brand"><span className="brand-mark" aria-hidden="true">d<span>s</span></span><span>DISTILLED<span>SOLUTIONS</span></span></Link><p>Business decisions, made more legible.</p></div><div><span className="eyebrow">DISTILLED NETWORK</span><ul><li><PropertyLink href={site.fundingSite}>Funding preview ↗</PropertyLink></li><li><PropertyLink href={site.toolsSite}>Tools ↗</PropertyLink></li><li><PropertyLink href={site.acquireSite}>Acquire preview ↗</PropertyLink></li></ul></div><div><span className="eyebrow">HOW TO USE THIS SITE</span><p>Guidance and preparation resources. Not an offer, eligibility decision, or guarantee. Verify terms and claims with the responsible provider or qualified professional.</p></div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Distilled Funding</span><span>PREVIEW CONTENT / REVIEW BEFORE RELIANCE</span></div></footer>;
}
