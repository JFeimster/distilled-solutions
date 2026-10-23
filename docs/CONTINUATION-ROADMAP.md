# Continuation roadmap

This roadmap prioritizes functional improvements while preserving the [architecture](SOLUTIONS-ARCHITECTURE.md), [content model](SOLUTIONS-CONTENT-MODEL.md), and [canonical route map](SOLUTIONS-ROUTE-MAP.md). Work remains within the existing eight families and 71 routes unless the canonical contract is separately revised.

## Delivered first milestone: funding workflow diagnostic

The `/funding-workflow-automation` route now has a client-side, deterministic opportunity diagnostic. It turns five broad workflow choices into a first fix, three ordered actions, human-review and privacy controls, related guides, and a copyable plan. Its editorial fields are stored as an optional catalog override and survive regeneration. The parent `/automate-my-funding` route points to it.

## Prioritized next batches

1. **Navigation and homepage:** Review the homepage console and header against the route map, improve discovery of the new diagnostic, and check desktop/mobile keyboard paths without expanding the navigation into all 71 links.
2. **Route-specific editorial differentiation:** Replace generic child guidance in the highest-use routes with reviewed catalog overrides. Give each page a distinct problem, evidence checklist, decision owner, and contextual next step. Keep source claims within verified material.
3. **Interactive diagnostics:** Add one bounded, client-side diagnostic at a time where user decisions benefit from structured choices. Reuse the separation between pure recommendation logic and UI; keep outputs advisory and human-reviewed.
4. **Conversion journeys:** Define owner-approved CTAs and handoffs to existing canonical destinations. Validate consent, destination, and data ownership before any lead capture or submission work.
5. **Cross-property integration:** Verify current Funding, Tools, and Acquire deep routes before linking them. Resolve Industries ownership and Wix/main-site handoffs with their owners; avoid duplicate product or service flows in Solutions.
6. **Analytics, privacy, accessibility, performance:** Define a privacy-safe measurement plan, then review keyboard and screen-reader behavior, responsive layouts, reduced motion, Core Web Vitals, and data retention before adding instrumentation.
7. **Canonical domain migration and indexing readiness:** Confirm final host, redirects, route behavior, factual review, metadata, sitemap, and robots directives. Keep the preview noindex gate until domain and content owners authorize activation.

Each batch should include source edits, regenerated artifacts when relevant, tests, a local production build, and a route/browser review. Deployment and indexing are separate release decisions; see [deployment boundaries](DEPLOYMENT.md).
