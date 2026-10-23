# Distilled Solutions architecture

## Visual and interaction direction

Visual thesis: warm paper, black ink, condensed type, and sharp orange/lime signals make the site feel like an operator's decision desk. The console turns an expressed intent into a route through transparent choices; it does not calculate eligibility or store profile data.

Content plan: outcome-led homepage and route console; solution-family hubs; focused guides; evidence and tradeoff sections; canonical Funding, Tools, and Acquire links; final next-step CTA.

Interaction thesis: the command console changes its question and guide choices by selected intent; the mega menu supports keyboard and touch use; focus/hover states and restrained entrance/press motion clarify state. Reduced-motion preferences disable animation.

## Architecture decision

Funding (`_reference/funding-distilled`) is the technical and visual precedent. This app adapts its Next.js App Router, typed Zod records, JSON content, parent-derived breadcrumbs, centralized metadata/index policy, static route generation, design tokens, noindex default, and route validation. Solutions has its own taxonomy, content catalog, relationship model, templates, and interaction. The reference subtree is excluded from TypeScript, lint, and Git; no application import reaches it.

`data/solutions/catalog.json` is the editorial source for the fixed canonical taxonomy and route-specific intent. `npm run generate:manifest` derives the full page, route, navigation, relationship, and text sitemap artifacts. The generated page manifest is the application runtime source. Update the catalog, regenerate artifacts, then validate.

One optional catch-all route renders the root, hubs, and guides. The renderer selects homepage, family-index, or focused-guide composition from page type and relationships. Children, breadcrumbs, related solutions, metadata, JSON-LD and sitemap all resolve from the same page records.

## Ownership boundaries

- Solutions owns business problems, goals, operating questions, and preparation guidance.
- Funding owns money-product education. Only four explicit Funding destinations are deep-linked because the route reference established them.
- Tools owns calculators and assessment tools. Unverified deep routes are not guessed; references use the canonical directory.
- Acquire owns deeper transaction and deal workflows. Solutions supplies contextual guidance and links to the canonical Acquire root.
- Industries URL ownership is unresolved and no Industries destination is fabricated.

## Privacy and indexing

The intent console holds choices in component state and stores or transmits no profile data. The app introduces no database, application submission, analytics vendor, financial credential, lender integration, or external service. All catalog records start `noindex`; indexing requires a reviewed `index` record, a review date, and `ALLOW_INDEXING=true`. Robots permits crawling so page-level directives can be read. Preview sitemap is intentionally empty.
