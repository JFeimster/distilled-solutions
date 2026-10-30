# Content model

The Zod schema in `schemas/solutions.ts` validates the original Solutions page manifest. `schemas/playbooks.ts` validates the additive Playbooks index and detail records. Both authored sources live in `data/solutions/catalog.json`; `scripts/generate-solutions-manifest.ts` builds their runtime manifests and canonical route files.

Solutions records carry identity, route/canonical, page type and family, parent, metadata, hero, problem and outcome, audience, pain signals, questions, solution paths, workflow, considerations, readiness and warning signals, ecosystem relationships, related routes, FAQs, CTAs, breadcrumbs, status/index policy, and provenance.

Playbook records use a separate editorial contract: category, intended audience, practical outcome, triggers, evidence to gather, sequenced actions with completion checks, decision criteria, failure modes, checklist, optional explicitly hypothetical example, related Solutions routes, source references, breadcrumbs, and provenance. The reusable renderer presents each workflow and provides a local-only checkable/copyable checklist. Playbooks do not inherit the SolutionPage schema's unrelated financing and family fields.

Status vocabulary: `draft`, `review`, `index`, `noindex`. Existing Solution records remain `noindex` with no review date. New Playbook records start `status: review`, `indexStatus: noindex`, and no review date. Draft pages are not rendered. Index eligibility requires a production deployment, `ALLOW_INDEXING=true`, both page status fields set to `index`, and a populated review date. Preview, local, and unrecognized environments remain noindex even if the flag is set. Sitemap entries use the same eligibility function as page robots metadata.

Do not add provider, underwriting, customer, performance, or guaranteed-outcome claims without verified primary evidence. This content is planning guidance, not an eligibility result or a statement that an advisory service is available.
