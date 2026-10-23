# Repository instructions for coding agents

- Inspect the Git root, branch, status, current code, and relevant reference files before editing. Preserve unrelated work.
- Keep the Next.js App Router, one catch-all route, shared renderer, schemas, components, and existing 71-route taxonomy. Do not add a competing route or content registry.
- Treat `data/solutions/catalog.json` as the editorial source. Never edit `solutions.*.manifest.json`, `solutions.relationships.json`, or `CANONICAL-SITEMAP.txt` directly; run `npm run generate:manifest` after source changes and review the derived diff.
- Preserve canonical root-relative routes, parent relationships, breadcrumbs, and the eight solution families. Verify any proposed route change against the approved route reference before implementing it.
- Reuse shared navigation, page templates, design tokens, metadata helpers, and validation. Keep recommendation rules separate from interactive presentation.
- Do not create duplicate schemas, databases, CRM flows, authentication, lead intake, or underwriting systems. Solutions provides guidance; Funding, Tools, Acquire, Industries, and Wix/main-site systems retain their respective ownership. Do not invent unverified deep links or external service destinations.
- Keep funding guidance evidence-based and human-reviewed. Never imply automated eligibility, approval, denial, pricing, lender submission, or guaranteed outcomes. Do not collect or transmit customer records in diagnostics.
- Run `npm run generate:manifest` when the catalog changes, then `npm run check`. For route or SEO changes, run a local production server and `npm run audit:routes`. Report actual outcomes and inspect `git diff --check` plus changed paths.
- No deployment, DNS, Vercel, Wix, or other external-state change without separate user authorization. Do not commit or push unless the user explicitly asks.
