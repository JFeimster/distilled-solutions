# Production and selective-indexing readiness

Reviewed against the repository and connected GitHub/Vercel state on 2026-10-30.

## Current production state

- GitHub `main` was `8f5a827294ecfbb9c80f8c896461ffca19582cde` at inspection; its latest production deployment was `READY` at the same commit.
- The Vercel project is `distilled-solutions`. Its only attached domain is `distilled-solutions.vercel.app`; `solutions.distilledfunding.com` is not attached.
- The deployment URL is account-protected. The Vercel project reports no custom production hostname, so public access at the intended canonical host is not established.
- `data/config/site.json` points canonical metadata at `https://solutions.distilledfunding.com`. This is the intended host, not a verified live custom domain.
- The 71 existing routes use `status: noindex`, `indexStatus: noindex`, and `lastReviewed: null`. The default production sitemap is therefore empty. Preview/local output remains noindex even if `ALLOW_INDEXING=true`, because indexing now also requires `VERCEL_ENV=production` and both page approvals plus a review date.
- Robots allows crawling and advertises the sitemap. Page-level noindex and the empty sitemap prevent search inclusion while indexing is disabled; Vercel deployment protection controls access to the deployment URL separately.

## Editorial review and first candidates

All 71 records have distinct canonical routes and descriptions. A metadata audit found and fixed one duplicate title: the financial-operations hub and guide both previously rendered `Financial operations | Distilled Solutions`. Most non-flagship pages use the shared explanatory template and do not yet contain enough route-specific operating detail or source/review evidence to approve for indexing. No route is approved today.

These routes have the clearest existing differentiated utility and are candidates for a focused editorial/source review. The candidate status is not indexing approval; all remain noindex until their specific review is complete.

| Route | Current readiness | Material work before approval | Intended status |
| --- | --- | --- | --- |
| `/business-credit-builder` | Strong family-specific guidance and a direct path to the diagnostic | Verify every bureau/process reference and finish owner review of the family copy | Review candidate; noindex |
| `/business-credit-readiness` | Interactive six-dimension diagnostic, prioritized actions, evidence checks, and copyable roadmap | Recheck referenced official resource URLs and complete independent editorial review | Review candidate; noindex |
| `/business-credit-roadmap` | Detailed sequence for records, reporting verification, obligations, and follow-up | Verify any external references and complete editorial review | Review candidate; noindex |
| `/fundability-check` | Focused record-verification guidance with a clear non-eligibility boundary | Verify the linked official record-access process references and complete editorial review | Review candidate; noindex |
| `/funding-workflow-automation` | Interactive, deterministic workflow diagnostic with human-review safeguards | Review data/privacy boundaries and verify all linked destinations | Review candidate; noindex |
| `/funding-intake-automation` | Specific intake, consent, exception, and handoff guidance | Add evidence-backed examples and verify any external destinations before review | Review candidate; noindex |

Other priorities from the original route audit, including `/`, `/improve-cash-flow`, `/cash-flow-analysis`, `/funding-readiness`, and `/business-valuation`, currently rely on more of the shared template. They need substantial route-specific procedure and evidence review before joining an initial index cohort. No review dates or approvals have been manufactured.

## Owner actions before public indexing

1. Attach and verify `solutions.distilledfunding.com` to the existing Vercel project and configure DNS at the domain owner/provider. Confirm HTTPS and canonical-host redirects after propagation.
2. Confirm the production site is publicly reachable without Vercel authentication at the intended domain. Decide separately whether deployment protection should remain on preview aliases.
3. Complete and record editorial/source review for each selected page; change only the approved pages to `status: index`, `indexStatus: index`, with a real review date.
4. Only after the domain and review gates are complete, deliberately set `ALLOW_INDEXING=true` in the Vercel Production environment. The code also requires Vercel's production environment, so previews remain noindex.
5. Verify production canonical tags, robots metadata, `robots.txt`, and sitemap output. Then verify the domain in Google Search Console and Bing Webmaster Tools and submit the sitemap. No search-console account was connected and no URLs were submitted during this work.

Do not enable indexing globally or mark the candidates approved as part of the Playbooks release. New Playbooks remain review/noindex by default.
