# Canonical domain launch runbook — Batch 7 preparation

Snapshot: 2026-10-31. Recheck connected systems immediately before each owner-authorized gate. This runbook records preparation; it does not approve a domain, page, or indexing change.

## Verified state and open items

- GitHub `main` and the Vercel READY production deployment `dpl_UzTgCs6AfQNp5Mvi2KtEXHDb6KoG` matched `004c8bec9e98e1c6ef0eab982be7314541b85716` at inspection. Project: `distilled-solutions` (`prj_8OWjpegvCvg7iwUyTzzC6WcfazD4`) on team `jason-feimsters-projects`.
- The project domain API listed `distilled-solutions.vercel.app`; the production deployment also had `distilled-solutions-jason-feimsters-projects.vercel.app` and `distilled-solutions-git-main-jason-feimsters-projects.vercel.app` aliases. The short alias returned HTTP 200 without authentication and a canonical tag for `https://solutions.distilledfunding.com/`. There is no current project domain redirect. Generated preview aliases exist and are subject to the configured protection policy.
- Vercel reports SSO protection enabled with `deploymentType: all_except_custom_domains`; password and trusted-IP protection are off. A verified custom production domain would therefore be publicly accessible without Vercel SSO. Confirm this in a private browser session during Gate B; do not treat attachment as a private staging step.
- `solutions.distilledfunding.com` was not attached to this project or another project in the connected team's apex-domain listing. Its DNS lookup failed. The authoritative nameservers for `distilledfunding.com` were `ns10.wixdns.net` and `ns11.wixdns.net`; Wix DNS is the evidenced authoritative DNS service. Account access and any upstream registrar are not verified.
- Vercel's read-only domain configuration recommended a CNAME to `d368d29eada4fe49.vercel-dns-016.com.` (with `cname.vercel-dns.com.` as a secondary recommendation). This is a current recommendation, **not an attachment-issued final instruction**. Re-read the exact record and any TXT ownership challenge after authorized attachment. No ownership challenge, certificate, or HTTPS status can be established for an unattached hostname.
- Vercel's project environment-variable listing returned no configured variables and hidden production count 0. `VERCEL_ENV` is a platform-provided environment signal; `ALLOW_INDEXING` is absent, so the code defaults it to false. Do not expose variable values if this state changes.
- `data/config/site.json` already sets `https://solutions.distilledfunding.com`. The same host drives canonical metadata, Open Graph URLs, sitemap entries, `robots.txt`, and Solutions structured data. No redirect is active in `next.config.ts`. The noncanonical-host `X-Robots-Tag: noindex` rule protects public aliases without changing static rendering; inspect the live response after release.

| Setting | Verified current value | Required value at Gate B | Owner/system |
| --- | --- | --- | --- |
| Domain | Unattached; no DNS answer | `solutions.distilledfunding.com` attached to production | Vercel project owner |
| Vercel project | `distilled-solutions` / `prj_8OWjpegvCvg7iwUyTzzC6WcfazD4` | Same project | Vercel owner |
| DNS provider | Wix authoritative nameservers | Confirm control of Wix DNS zone | Domain owner |
| Record type | No record observed | CNAME if Vercel still instructs it | Vercel then Wix DNS owner |
| Record name | No record observed | `solutions` in `distilledfunding.com` | Vercel then Wix DNS owner |
| Record target | Current Vercel recommendation: `d368d29eada4fe49.vercel-dns-016.com.` | Exact target shown after attachment | Vercel then Wix DNS owner |
| Verification challenge | Not available before attachment | Exact Vercel-issued TXT challenge, if requested | Vercel then DNS owner |
| HTTPS status | No resolving hostname | Valid certificate and HTTPS 200 | Vercel/domain owner |
| Deployment protection | SSO on; custom domains excepted | Confirm intended public access; leave policy unchanged | Vercel owner |

## Alias and indexing safety

The editorial gate remains `VERCEL_ENV=production`, `ALLOW_INDEXING=true`, both page status fields `index`, and a real `lastReviewed` date. The sitemap uses the same gate. Batch 7 does not change any editorial record or the indexing flag. Canonical tags alone do not prevent an indexable duplicate on a public alias. The host-scoped `X-Robots-Tag: noindex` rule covers every noncanonical hostname, including the public short alias, without request-dependent page rendering. Test the header on the deployed short alias, other accessible production aliases, and the canonical host before Gate D. Redirecting the short alias at Vercel to the canonical host is an additional useful cleanup **only after** DNS, TLS, and public routing work; verify Vercel's project-domain redirect support for that alias and avoid trapping reviewers. Protected generated deployment aliases need not be made public to test them. Search activation is blocked if any accessible noncanonical alias serves approved pages without either a working canonical redirect or the noindex header.

`robots.txt` allows crawling and advertises the canonical sitemap. Page metadata and the host header provide noindex while the release gate is off; a robots disallow would interfere with crawler access to that directive. The default sitemap is empty. A later approved sitemap must contain only routes satisfying the complete gate and use their real review dates as `lastModified`.

## Editorial approval matrix

All nine records remain noindex and have no review date. Routes with `READY FOR EDITORIAL APPROVAL` still require a named owner to confirm content ownership, accuracy, links, and the real review date before Gate C can pass. Existing tests cover route contracts, metadata, deterministic diagnostics, and Playbook schemas; they do not constitute independent editorial or complete accessibility review. Browser-local diagnostics use self-reported broad choices and retain human decision ownership. A separate manual keyboard, screen-reader, and deployed UI review remains necessary for the interactive candidates.

| Route | Status | Decision evidence and remaining work |
| --- | --- | --- |
| `/` | NEEDS CONTENT IMPROVEMENT | Clear navigation and canonical metadata, but much of the copy and process use the shared template. Distinguish its search purpose before indexing. |
| `/business-credit-builder` | NEEDS SOURCE VERIFICATION | Family-specific guidance and a direct diagnostic CTA; verify bureau and reporting-process references with current primary sources. |
| `/business-credit-readiness` | NEEDS SOURCE VERIFICATION | Six-check diagnostic, roadmap and privacy/eligibility disclaimers are differentiated. Verify live bureau resource destinations and statements; complete accessibility review. |
| `/funding-workflow-automation` | READY FOR EDITORIAL APPROVAL | Distinct browser-local three-step workflow diagnostic, human controls, related internal guides and clear non-underwriting language. Owner should confirm privacy wording, source basis, and keyboard/screen-reader behavior. |
| `/financial-operations` | READY FOR EDITORIAL APPROVAL | Seven-control audit, control matrix, owners, 7/30-day plan and useful internal links. Owner should confirm that self-reported results are not presented as a formal audit and review keyboard/screen-reader behavior. |
| `/playbooks` | NEEDS CONTENT IMPROVEMENT | Useful category navigation and canonical metadata; as an index it needs a stronger standalone decision purpose before a first search cohort. |
| `/playbooks/cash-flow/diagnose-working-capital-gap` | READY FOR EDITORIAL APPROVAL | Five-step weekly cash-gap procedure, evidence and failure modes are distinct. SBA source is live and relevant for general financial management; owner must confirm the Wix/video references, assumptions and article ownership. |
| `/playbooks/business-credit/evaluate-net-30-reporting` | NEEDS SOURCE VERIFICATION | Strong term/cost/reporting checklist and no guaranteed reporting claim. Experian's business-credit correction page is live, but both Wix references and exact reporting-process claims need owner review. |
| `/playbooks/automation/funding-intake-audit` | NEEDS SOURCE VERIFICATION | Detailed consent, duplicate, exception and human approval controls; verify two Wix articles and video, and obtain privacy/legal owner review of language. |

**First proposed cohort:** `/funding-workflow-automation`, `/financial-operations`, and `/playbooks/cash-flow/diagnose-working-capital-gap`. This is a review queue, not an indexing approval. Add business-credit pages only after current source review. No quota requires more pages.

## Four launch gates

### Gate A — code readiness (Codex)

Run `npm ci`, `npm run generate:manifest`, `npm run check`, `npm audit --omit=dev`, `npm run audit:launch`, `git diff --check`, and a local `npm start` plus `npm run audit:routes`. Confirm the original 71-route and combined 84-route contracts separately. Check canonical metadata, robots, sitemap, noindex header, diagnostics and links. If code changes are released, verify PR checks, preview, merge SHA and automatic production deployment SHA. Record actual results; do not call a READY deployment a completed domain launch.

### Gate B — domain activation (separate owner authorization)

1. Add `solutions.distilledfunding.com` to existing Vercel project `distilled-solutions` as a production domain. Check for a newly reported conflict or ownership challenge.
2. Copy Vercel's **then-current** exact DNS record and any TXT verification challenge into the authoritative Wix DNS zone. Preserve the prior record state for reversal.
3. Wait for DNS verification, valid HTTPS and certificate issuance. Test HTTP-to-HTTPS, root and child routes, and confirm the served production SHA.
4. In an unauthenticated session, verify intended public access under the existing SSO exception. Check the short alias and other accessible aliases for `X-Robots-Tag: noindex`. Only then consider a Vercel domain redirect from the short alias, verifying source, destination, status code and path/query behavior before enabling it.
5. Leave `ALLOW_INDEXING` unset and all editorial records noindex.

### Gate C — editorial approval (separate owner/editorial authorization)

For each selected route, verify factual and source accuracy, content ownership, canonical and related links, lending/privacy language, CTA destination and accessibility. Record the actual reviewer and date. Approve only that route's indexing fields. Do not infer approval from this matrix or a green build.

### Gate D — selective indexing (separate owner authorization)

After Gates A–C, change only approved records to `status: index`, `indexStatus: index`, and their actual `lastReviewed` date. Regenerate derived manifests and validate the diff. Set `ALLOW_INDEXING=true` for Vercel **Production only** and deploy through the normal GitHub integration. Confirm canonical-host metadata, robots, sitemap and the noncanonical alias header/redirect on live responses. Verify the canonical host using supported Search Console and Bing Webmaster Tools workflows and submit the sitemap only when appropriate. Monitor the initial cohort before expanding it.

## Rollback order

| Trigger | Responsible system | Reversal order | Expected state and verification |
| --- | --- | --- | --- |
| Wrong DNS or ownership challenge | Wix DNS, then Vercel | Restore the recorded previous DNS record or remove the new erroneous record; leave the Vercel project and Git integration intact. Recheck authoritative answers and Vercel verification. | Existing `.vercel.app` production remains available; custom host may stop resolving until corrected. |
| TLS/certificate failure | Vercel domain, Wix DNS | Keep indexing off; repair DNS/verification first, then recheck certificate. If exposure is unacceptable, detach only the custom domain after confirming alias access. | HTTPS succeeds before restoring public launch; aliases still point to production. |
| Wrong alias redirect or reviewer trap | Vercel project domains | Remove the newly added redirect first, then verify aliases and canonical host separately. | Previously working alias behavior returns; no redirect loop. |
| Unintended public access | Vercel protection/domain | Keep indexing off; remove or adjust the custom-domain attachment only with owner direction, or change protection by separate authorization. | Unauthenticated requests match the intended policy; preview aliases remain protected. |
| Accidental indexing or sitemap contents | Vercel Production env, then Git catalog | Set `ALLOW_INDEXING=false` or remove it immediately; redeploy if the platform requires it. Correct approved record fields/review data, regenerate and release. Recheck live page robots, alias `X-Robots-Tag`, and empty or corrected sitemap. | No route is newly eligible; search-engine removal is not immediate and requires separate console follow-up if pages were discovered. |
| Deployment regression | GitHub/Vercel | Restore the prior known-good production deployment through the normal supported rollback, then fix forward in a scoped PR. Check the production SHA, 84 routes and headers. | Established alias and project integration remain intact. |

## ChatGPT handoffs

### Prompt A — domain activation

> With connected Vercel and the authoritative Wix DNS zone, and only after my separate authorization, attach `solutions.distilledfunding.com` to Vercel project `distilled-solutions` on team `jason-feimsters-projects`. Recheck project/domain conflicts and use the exact Vercel-issued DNS target and any ownership challenge at attachment time. Record previous DNS values, apply the required records, verify DNS, HTTPS, root and child routing, production SHA, unauthenticated public access under the current custom-domain SSO exception, and noncanonical alias noindex behavior. Add a provider-level alias redirect only after the canonical host works and only if its behavior is verified. Leave indexing off. If verification, TLS, routing or public-access policy fails, restore the recorded DNS and redirect state, retaining the existing Vercel project, Git integration and aliases. Report verified facts and pending owner actions.

### Prompt B — selective indexing activation

> After separate authorization, verify that `https://solutions.distilledfunding.com` is live over HTTPS, serves the intended production SHA, and that each selected route has explicit named editorial approval, accurate sources, content ownership and a real review date. Change only those routes' catalog indexing fields, regenerate manifests, run checks and route audit, and release through the existing GitHub/Vercel integration. Set `ALLOW_INDEXING=true` for Production only. Verify canonical tags, robots metadata, `robots.txt`, sitemap URLs and `lastModified`, and confirm all accessible noncanonical aliases either redirect to the canonical host or return `X-Robots-Tag: noindex` on approved pages. Complete supported Search Console/Bing verification and sitemap submission only when those accounts and permissions are available. If any issue appears, disable production indexing first, correct fields/metadata or redirects, redeploy if required, and recheck; report search-engine removal as delayed rather than immediate.
