# Continuation roadmap

This roadmap prioritizes functional improvements while preserving the [architecture](SOLUTIONS-ARCHITECTURE.md), [content model](SOLUTIONS-CONTENT-MODEL.md), and [canonical route map](SOLUTIONS-ROUTE-MAP.md). Work remains within the existing eight families and 71 routes unless the canonical contract is separately revised.

The approved Playbooks extension is additive: it retains the original eight families and 71 Solutions routes and adds one index plus twelve playbook routes, for 84 total.

## Delivered first milestone: funding workflow diagnostic

The `/funding-workflow-automation` route now has a client-side, deterministic opportunity diagnostic. It turns five broad workflow choices into a first fix, three ordered actions, human-review and privacy controls, related guides, and a copyable plan. Its editorial fields are stored as an optional catalog override and survive regeneration. The parent `/automate-my-funding` route points to it.

## Delivered second milestone: business-credit readiness and action roadmap

The single diagnostic at `/business-credit-readiness#credit-readiness-diagnostic` evaluates six preparation dimensions and an objective using client-side selections. It distinguishes self-reported documentation, needed work, unknown information, and payment history that is not yet applicable. Results include dependency-aware tasks with evidence and completion checks, maintenance practices, account due diligence, canonical guides, official references, and a copyable plan with manual fallback. No identifiers or financial values are collected, and answers are not persisted. Pure recommendations live in `lib/solutions/business-credit-diagnostic.ts`.

Catalog overrides now give `/business-credit-builder`, `/business-credit-readiness`, `/business-credit-roadmap`, and `/fundability-check` distinct guidance and contextual CTAs to the same diagnostic. Family records can use the existing editorial override fields through an optional `editorial` object. The 71-route contract and noindex controls remain unchanged.

## Delivered third milestone: Playbooks v1

The `/playbooks` index and twelve category-organized operator playbooks extend the same catch-all publishing architecture. The catalog remains the editorial source; distinct Playbook Zod records and one reusable renderer provide evidence lists, sequenced actions with completion criteria, decision checks, failure modes, relevant internal/source references, worked hypothetical cash examples, and browser-local copyable checklists. The original route contract is validated separately from the 84-route combined manifest. Every new record starts `review`/`noindex` with no review date.

## Prioritized next batches

1. **Navigation and homepage:** Review the homepage console and header against the route map, improve discovery of the new diagnostic, and check desktop/mobile keyboard paths without expanding the navigation into all 71 links.
2. **Route-specific editorial differentiation:** Replace generic child guidance in the highest-use routes with reviewed catalog overrides. Give each page a distinct problem, evidence checklist, decision owner, and contextual next step. Keep source claims within verified material.
3. **Interactive diagnostics:** Add one bounded, client-side diagnostic at a time where user decisions benefit from structured choices. Reuse the separation between pure recommendation logic and UI; keep outputs advisory and human-reviewed.
4. **Conversion journeys:** Define owner-approved CTAs and handoffs to existing canonical destinations. Validate consent, destination, and data ownership before any lead capture or submission work.
5. **Cross-property integration:** Verify current Funding, Tools, and Acquire deep routes before linking them. Resolve Industries ownership and Wix/main-site handoffs with their owners; avoid duplicate product or service flows in Solutions.
6. **Analytics, privacy, accessibility, performance:** Define a privacy-safe measurement plan, then review keyboard and screen-reader behavior, responsive layouts, reduced motion, Core Web Vitals, and data retention before adding instrumentation.
7. **Canonical domain migration and indexing readiness:** Confirm final host, redirects, route behavior, factual review, metadata, sitemap, and robots directives. Keep the preview noindex gate until domain and content owners authorize activation.

Each batch should include source edits, regenerated artifacts when relevant, tests, a local production build, and a route/browser review. Deployment and indexing are separate release decisions; see [deployment boundaries](DEPLOYMENT.md).
