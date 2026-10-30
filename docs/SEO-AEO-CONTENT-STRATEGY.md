# SEO, AEO, and content operations

This is the operating reference for publishing and measuring Distilled Solutions content. It extends the current Next.js catalog workflow; it does not create a second CMS, database, roadmap, or analytics vendor.

## Ownership and canonical publishing

| Content | Owner | Solutions may do |
| --- | --- | --- |
| Business problems, operator guidance, playbooks, and preparation workflows | Solutions | Publish original guidance from `data/solutions/catalog.json`; link to verified specialist destinations. |
| Lending products, financing education, offers, and applications | Funding | Explain operating context and link to a verified Funding page. Do not republish product pages or article bodies. |
| Calculators and specialist tools | Tools or the tool's verified owning property | Explain the question and assumptions; link only to a live, owner-approved destination. |
| Acquisition valuation and transaction workflows | Acquire | Explain preparation; send valuation and transaction work to a verified Acquire destination. |
| Existing blog articles, newsletter excerpts, and retained editorial | Wix / Distilled Funding | Keep the article URL canonical. Solutions may cite the source with a short contextual link, not a copied article. |
| Industry intelligence | Owner to be confirmed per property | Do not invent an Industries URL or route. |

The Solutions catalog owns its authored page copy and metadata. The catalog generates manifests and route files. Wix remains the canonical owner of existing Wix articles. Notion is an internal discovery and planning source; a Notion page or `Deployed` label does not establish a public destination.

## Content quality and source rules

Every substantial page should state the operator's question and a direct answer early, then explain the evidence to gather, the sequence of work, decision conditions, likely failure points, and a practical next step. Use original examples only when assumptions are explicit. Keep explanatory text in rendered HTML.

For each external factual claim, cite the primary source closest to the claim and say what the source does and does not establish. Use dates only when verified. Do not convert a monitoring range, survey statistic, vendor marketing claim, or illustrative number into a guarantee. Credit, lending, or funding copy must not imply automated eligibility, approval, denial, pricing, lender submission, or guaranteed outcomes.

Before adding an external resource, record its exact URL, canonical owner, current public availability, intended reader action, and verification date. If a destination cannot be verified or is private, do not link it. Do not publish private Notion materials, unpublished drafts, lead magnets, templates, credentials, applicant data, or signed file URLs.

## Editorial workflow

1. Start with an operator problem already represented in the eight-family Solutions taxonomy or an approved Playbook route.
2. Review the catalog and existing page renderer before proposing a new field, component, or route. Reuse existing source-reference, related-route, checklist, metadata, and review fields where they fit.
3. Inspect existing Wix, Notion, Funding, Tools, and Acquire assets. Record source status and permission before selecting reuse.
4. Draft useful original guidance in `data/solutions/catalog.json`. Link to the original source when it owns the detailed article or tool.
5. Run `npm run generate:manifest`, `npm run check`, and the route audit for route or SEO changes. Inspect the generated diff; never hand-edit generated manifests or sitemap files.
6. Keep new or unverified content at `review` / `noindex`. Complete source verification, editorial review, domain readiness, and production checks before any page approval.

Do not add publishing families or routes without checking the canonical route reference. The approved contract is the original 71 Solutions routes plus `/playbooks` and its twelve detail pages, for 84 routes.

## Useful next steps and resource links

Use a contextual source reference when a canonical article gives deeper background. Use an internal related-route card for the next Solutions guide. Add a diagnostic, template, video, or application link only after its public status, owner, and destination are confirmed. Existing source references and related Solutions cards already provide this presentation; add a reusable resource component only if a verified use case exceeds them.

Cross-property destinations must remain root-relative to their owning site and verified against that site's current route contract. Do not invent a Funding `/guides`, Acquire `/research`, calculator slug, custom hostname, or public Notion URL. Do not append financial answers, applicant details, or other sensitive information to links or campaign parameters.

## SEO, AEO, and indexing controls

Use conventional search fundamentals: crawlable HTML, one clear page purpose, descriptive title and summary, meaningful headings, accurate canonical URL, useful internal links, source attribution, and valid structured data that describes visible content. Structured data is descriptive, not a shortcut to search features or AI citations. `llms.txt` or Markdown mirrors are optional experiments, not substitutes for useful HTML.

Selective indexing is fail-closed. Pages remain noindex unless the deployment is production, `ALLOW_INDEXING=true`, both editorial status fields are `index`, and a real review date is present. Preview and local environments remain noindex. Sitemap inclusion uses the same gate. Do not change the environment variable, domain, DNS, or robots behavior as part of ordinary content editing.

Before a public launch, the owner must verify the custom domain, HTTPS, redirects, public access, canonical metadata, robots output, sitemap, reviewed page content, and Search Console / Bing Webmaster Tools properties. Domain activation, editorial approval, and public indexing are separate owner decisions.

## Measurement and privacy contract

No analytics SDK, tag manager, or site-level event tracker is present in this app. Until an approved privacy-aware analytics abstraction is selected, this contract is documentation only; it does not send events or create an external account.

| Event | Trigger | Allowed payload |
| --- | --- | --- |
| `playbook_opened` | A playbook route is loaded | `route`, `category`, `content_version` |
| `checklist_interacted` | A checklist item is checked or unchecked | `route`, `item_index`, `checked` |
| `checklist_copied` | The checklist copy action succeeds | `route`, `item_count` |
| `diagnostic_started` | A diagnostic is deliberately started | `diagnostic_id`, `route` |
| `diagnostic_completed` | A diagnostic result is displayed | `diagnostic_id`, `route`, `result_category` only when non-sensitive and pre-defined |
| `related_resource_clicked` | An article, tool, template, video, or app link is selected | `source_route`, `resource_type`, `destination_host`, `resource_id` |
| `cross_property_cta_selected` | A verified Funding, Acquire, or other property CTA is selected | `source_route`, `destination_property`, `cta_id` |

Never include answers, financial values, business identifiers, names, email addresses, uploaded content, or free-text in event payloads. Do not log copied checklist contents. If implementation is later approved, extend the existing abstraction if one is added to the app; require consent where applicable, test payload allowlists, and document retention and ownership first.

Campaign attribution may preserve only non-sensitive, approved campaign fields already present in the URL. Do not add user-entered answers or financial details to query strings. Do not invent cross-domain cookie behavior. Report Search Console and Bing discovery separately from on-site clicks and business conversions; AI citation counts do not establish clicks or business impact.

## Operating measures

Once the public canonical domain and owner accounts are ready, review:

- Index eligibility and valid sitemap coverage by approved route.
- Search impressions, queries, clicks, and click-through rate by page in Search Console and Bing Webmaster Tools.
- AI citation visibility where a source exposes it, identified separately from search ranking and traffic.
- Useful actions per content entry: checklist use, diagnostic completion, verified resource clicks, and cross-property CTA selection.
- Editorial quality: pages with current source checks, named owner, review date, and no unresolved high-risk claims.

Do not report ranking, citation, or conversion improvement without a connected measurement source and a date range. Keep the preview and unreviewed catalog noindex while those owner prerequisites remain incomplete.
