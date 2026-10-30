# Distilled Solutions architecture

## Visual and interaction direction

Visual thesis: warm paper, black ink, condensed type, and sharp orange/lime signals make the site feel like an operator's decision desk. The console turns an expressed intent into a route through transparent choices; it does not calculate eligibility or store profile data.

Content plan: outcome-led homepage and route console; solution-family hubs; focused guides; evidence and tradeoff sections; canonical Funding, Tools, and Acquire links; final next-step CTA.

Interaction thesis: the command console changes its question and guide choices by selected intent; the mega menu supports keyboard and touch use; focus/hover states and restrained entrance/press motion clarify state. Reduced-motion preferences disable animation.

## Architecture decision

Funding (`_reference/funding-distilled`) is the technical and visual precedent. This app adapts its Next.js App Router, typed Zod records, JSON content, parent-derived breadcrumbs, centralized metadata/index policy, static route generation, design tokens, noindex default, and route validation. Solutions has its own taxonomy, content catalog, relationship model, templates, and interaction. The reference subtree is excluded from TypeScript, lint, and Git; no application import reaches it.

`data/solutions/catalog.json` is the editorial source for the fixed 71-route Solutions taxonomy and the additive Playbooks index and twelve workflow records. `npm run generate:manifest` derives Solutions pages, Playbooks pages, the original core route set, the combined route set, navigation, relationships, and text sitemap artifacts. The generated manifests are application runtime sources. Update the catalog, regenerate artifacts, then validate.

One optional catch-all route renders the root, hubs, guides, Playbooks index, and playbooks. Solutions and Playbooks use separate Zod schemas and renderers while sharing the route, canonical metadata, noindex, and sitemap gates. Playbooks have a six-category discovery index, one reusable step/checklist renderer, copyable local checklists, and HowTo structured data. The original eight-family taxonomy remains unchanged; the combined publishing architecture has 84 routes.

## Ownership boundaries

- Solutions owns business problems, goals, operating questions, and preparation guidance.
- Funding owns money-product education. Only four explicit Funding destinations are deep-linked because the route reference established them.
- Tools owns calculators and assessment tools. Unverified deep routes are not guessed; references use the canonical directory.
- Acquire owns deeper transaction and deal workflows. Solutions supplies contextual guidance and links to the canonical Acquire root.
- Industries URL ownership is unresolved and no Industries destination is fabricated.

## Privacy and indexing

The intent console and Playbook checklist hold choices in component state and transmit or persist no profile data. The app introduces no database, application submission, analytics vendor, financial credential, lender integration, or external service. Existing Solutions records remain noindex; new Playbooks start `review`/`noindex` without review dates. Indexing requires production `VERCEL_ENV`, `ALLOW_INDEXING=true`, both editorial status fields set to `index`, and a review date. Robots permits crawling so page-level directives can be read. The sitemap remains empty until eligible pages are explicitly approved.
