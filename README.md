# Distilled Solutions

Distilled Solutions helps business owners and operators name an operating problem, compare practical paths, and identify the next decision to review. Solutions owns this guidance and its 71 canonical routes. Funding owns funding product education, Tools owns calculators and tools, Acquire owns deeper transaction workflows, and Wix/main-site work stays with its own property. This repository does not own a CRM, lead intake, underwriting, or external service integration.

## Stack and architecture

The app uses Next.js 16 App Router, React 19, TypeScript, Zod, CSS design tokens, and static generation. One optional catch-all route renders the homepage, eight family pages, and 62 child guides through shared components. `data/solutions/catalog.json` is the editorial source. `scripts/generate-solutions-manifest.ts` derives the page, navigation, relationship, route, and text sitemap artifacts. The generated page manifest is read by the application and validated against `schemas/solutions.ts`.

The homepage intent console and the funding workflow and business-credit diagnostics use client state. Both diagnostics make deterministic operational recommendations from broad choices; they do not collect customer records, call an API, persist answers, or make funding decisions.

## Local setup

Use Node.js 22 or newer and npm from the repository root:

```powershell
npm ci
npm run dev
```

Open `http://127.0.0.1:3000`. For a local production pass:

```powershell
npm run generate:manifest
npm run check
npm start
```

While `npm start` is running, use another terminal for `npm run audit:routes`. `AUDIT_ORIGIN` can override the default `http://127.0.0.1:3000` when needed.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Local development server |
| `npm run generate:manifest` | Rebuild derived pages, navigation, relationships, routes, and `CANONICAL-SITEMAP.txt` |
| `npm run validate` | Validate catalog-derived route records and relationships |
| `npm run lint` | Lint application and test source |
| `npm run typecheck` | Generate Next types and check TypeScript |
| `npm test` | Run unit and route-contract tests |
| `npm run build` | Build the production app after validation |
| `npm run check` | Validate, lint, typecheck, test, and build |
| `npm run audit:routes` | Check all 71 pages and preview SEO behavior against a running production server |

## Editing content and routes

Edit `data/solutions/catalog.json`, never the generated manifests directly. Each child is a three-item tuple `[id, title, purpose]`; a fourth optional object can override its headline, summary, problem statement, desired outcome, signals, questions, paths, process, considerations, FAQs, and primary CTA. The generator fills all unspecified fields. Use the existing `/funding-workflow-automation` entry as an example.

A family can use the same optional override fields in an `editorial` object, as shown by `/business-credit-builder`. Existing families and three-item child tuples retain their default behavior.

The route taxonomy is an approved contract: root homepage, eight families, and 62 children, with no `/solutions/` prefix. Any route change requires explicit review of the canonical reference, parent/related links, navigation, breadcrumbs, metadata, and redirect implications. After a catalog edit, run `npm run generate:manifest` and `npm run check`, then inspect the generated diff for unintended drift. The generator must remain the only way to update derived artifacts.

## Design and interaction

The visual system uses warm paper, black ink, orange and lime signals, Barlow Condensed display type, DM Sans body type, and shared tokens in `styles/tokens.css`. The header, footer, editorial page template, and navigation are shared. New interactions should use the existing focus, responsive, and reduced-motion conventions. Recommendation rules for the funding workflow diagnostic live in `lib/solutions/funding-workflow-diagnostic.ts`; its UI lives in `components/solutions/FundingWorkflowDiagnostic.tsx`.

The business-credit preparation diagnostic lives only at `/business-credit-readiness#credit-readiness-diagnostic`. Its six foundation checks and objective produce a self-reported preparation status, evidence register, three immediate tasks, subsequent actions, and a copyable roadmap. Pure rules and text export live in `lib/solutions/business-credit-diagnostic.ts`; the UI is `components/solutions/BusinessCreditDiagnostic.tsx` and extends the shared workflow styles. Answers remain in component memory and clear on leaving or reloading; copying exports the plan to the device clipboard, with a manual-copy fallback. No identifiers, financial values, personal credit data, or uploads are requested. The tool does not access bureau files, calculate credit scores, or determine lender eligibility.

## SEO, environment, and deployment

`data/config/site.json` centralizes the canonical Solutions host and verified cross-property roots. The app currently uses preview `noindex`: every page has `status: "noindex"`, `indexStatus: "noindex"`, and no review date. Indexing requires an editorially reviewed page with both status fields set to `index`, a `lastReviewed` date, and `ALLOW_INDEXING=true` in the target environment. The preview sitemap is empty. Do not change hostnames, indexing policy, Vercel configuration, DNS, or external systems as part of routine content edits.

The app has no required secret or external service dependency. Deployment and environment instructions are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Deeper references: [architecture](docs/SOLUTIONS-ARCHITECTURE.md), [content model](docs/SOLUTIONS-CONTENT-MODEL.md), [route map](docs/SOLUTIONS-ROUTE-MAP.md), and [continuation roadmap](docs/CONTINUATION-ROADMAP.md).
