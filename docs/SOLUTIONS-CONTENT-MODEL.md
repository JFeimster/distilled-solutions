# Content model

The Zod schema in `schemas/solutions.ts` validates the generated page manifest. Route-specific prose begins in `data/solutions/catalog.json`; family-level diagnostic context is shared only within that outcome family. `scripts/generate-solutions-manifest.ts` builds complete page records with explicit editorial and provenance metadata.

Each record carries identity, route/canonical, page type and family, parent, metadata, hero, problem and outcome, audience, pain signals, questions, solution paths, workflow, considerations, readiness and warning signals, ecosystem relationships, related routes, FAQs, CTAs, breadcrumbs, status/index policy, and provenance.

Status vocabulary: `draft`, `review`, `index`, `noindex`. All records currently use `noindex` and have no review date. `ALLOW_INDEXING=true` is a separate release gate and is honored only when `VERCEL_ENV=production`. Draft pages are not rendered; index eligibility requires the production deployment, explicit release flag, both page status fields set to `index`, and a populated review date. Preview, local, and unrecognized environments remain noindex even if the flag is set.

Do not add provider, underwriting, customer, performance, or guaranteed-outcome claims without verified primary evidence. This content is planning guidance, not an eligibility result or a statement that an advisory service is available.
