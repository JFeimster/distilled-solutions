# Canonical route map

`CANONICAL-SITEMAP.txt` and `data/solutions/solutions.routes.manifest.json` are generated from the structured catalog. `solutions.core-routes.manifest.json` preserves and validates the original 71 Solutions routes; the combined route contract adds the Playbooks index and twelve playbooks. The approved navigation intentionally links hubs and a limited set of primary children plus one Playbooks entry; it does not list every route.

| Family | Hub | Children |
|---|---|---:|
| Buy or sell a business | `/buy-or-sell-a-business` | 10 |
| Automate my funding | `/automate-my-funding` | 8 |
| Build business credit | `/business-credit-builder` | 8 |
| Improve cash flow | `/improve-cash-flow` | 8 |
| Finance business growth | `/finance-business-growth` | 7 |
| CFO as a service | `/cfo-as-a-service` | 7 |
| FinOps as a service | `/finops-as-a-service` | 7 |
| Funding readiness | `/funding-readiness` | 7 |

## Additive Playbooks extension

| Category | Routes |
|---|---|
| Index | `/playbooks` |
| Cash Flow | `/playbooks/cash-flow/diagnose-working-capital-gap`, `/playbooks/cash-flow/13-week-cash-flow-forecast` |
| Business Credit | `/playbooks/business-credit/verify-business-credit-records`, `/playbooks/business-credit/evaluate-net-30-reporting` |
| Automation | `/playbooks/automation/funding-intake-audit`, `/playbooks/automation/funding-follow-up-workflow` |
| Growth | `/playbooks/growth/inventory-cash-gap-plan`, `/playbooks/growth/expansion-funding-readiness` |
| Financial Operations | `/playbooks/financial-operations/month-end-financeops-checklist`, `/playbooks/financial-operations/financial-controls-for-small-business` |
| Acquisitions | `/playbooks/acquisitions/buyer-readiness-checklist`, `/playbooks/acquisitions/seller-due-diligence-prep` |

Total: 84 routes (71 original Solutions routes plus one index and twelve playbooks). The original eight-family taxonomy is unchanged. All routes are canonical root-relative paths; Solutions routes have no `/solutions/` prefix.
