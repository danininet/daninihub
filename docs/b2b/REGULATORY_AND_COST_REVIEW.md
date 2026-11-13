# Regulatory and cost review — 13 November 2026

Research supports service boundaries, not legal clearance. Public pages avoid numeric thresholds and universal eligibility claims. Final legal text remains a draft.

| Topic | Confirmed scope / implementation consequence | Primary source |
|---|---|---|
| CBAM | Definitive regime from 2026; 50-tonne threshold has exceptions including electricity/hydrogen. Collect CN/TARIC, mass, importer and product information; do not automatically exempt or classify clients. | https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-definitive-regime_en |
| CBAM threshold review | September 2026 assessment still describes the 50-tonne threshold. No invented blanket exemption for every product. | https://taxation-customs.ec.europa.eu/news/cbam-de-minimis-threshold-assessment-2026-09-30_en |
| AI transparency | Article 50 applies from 2 August 2026; limited pre-existing-system marking grace period described in Commission FAQ. Interaction notices, synthetic-content marking and public-interest publication disclosures differ. No universal compliance claim from human review. | https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act |
| DE posting | Reporting depends on covered working conditions and activity; no assertion that A1 alone authorizes work or applies identically to non-EU employers. | https://www.gesetze-im-internet.de/aentg_2009/__18.html |
| AT posting | ZKO3, social insurance and employment authorization requirements depend on the situation. | https://www.bmf.gv.at/themen/betrugsbekaempfung/zentrale-koordinationsstelle.html |
| CH posting | Notification eligibility, eight-day advance notice and sector exceptions are distinct. Non-EU/EFTA cases cannot be treated as automatically eligible. | https://www.sem.admin.ch/de/meldeverfahren |
| PEM | Cumulation depends on the parties, applicable agreements and current matrix. No automatic preferential origin conclusion from a Balkan supplier address. | https://taxation-customs.ec.europa.eu/customs/international-affairs/pan-euro-mediterranean-cumulation-and-pem-convention_en |
| Textile composition | Product-specific fibre labelling rules under Regulation 1007/2011. | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32011R1007 |
| PFHxA | Restrictions have different dates and uses; consumer clothing/footwear provisions include 10 October 2026. Do not label all products compliant from a checklist. | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R2462 |
| ESPR/DPP | Product-specific delegated rules determine passport requirements; no general assertion that every product already needs a DPP. | https://single-market-economy.ec.europa.eu/single-market/digital-product-passport/explore-our-faqs_en |
| GPSR | Applies from 13 December 2024, with scope and roles determined for each product. B2B positioning does not automatically exclude products reaching consumers. | https://ec.europa.eu/safety-gate/screen/pages/productSafetyLegislation |
| Email contact | LG München I, 25 February 2025, 33 O 3721/24 concerns an unsuitable sole impressum email that only sends an automated referral elsewhere. Appellate/finality status was not established. Verify mailbox reception and real replies. | https://www.gesetze-bayern.de/Content/Pdf/Y-300-Z-GRURRS-B-2025-N-3851?all=False |

RDG, StBerG, UZK and ZAG boundaries are reflected in draft service exclusions; individual licensing/representation/payment-law classification has not been cleared. DDG provider details and a deliverable service address need current confirmation. No postbox-only address was proposed.

## Potential monthly infrastructure costs

No new paid product was activated. Existing subscriptions and provider payment fees are excluded from this incremental estimate.

| Component | Free allowance / constraint observed | Estimate |
|---|---|---|
| Static assets + Workers | Free plan request/CPU limits apply to dynamic work | $0 only within limits |
| Workflows | 100,000 daily requests shared with Workers; 3,000 daily steps; 1 GB-month storage; 10 ms CPU per invocation on Free | $0 within limits; workload must be measured |
| D1 | 5 million rows read/day, 100,000 written/day, 5 GB total Free storage | $0 within limits |
| R2 Standard | 10 GB-month, 1 million Class A and 10 million Class B operations monthly | $0 within allowance, but activation/billing terms still require confirmation |
| KV | Account plan/limits must be checked before provisioning | Unconfirmed; not activated |
| AI Gateway / LLM | Gateway does not eliminate model-provider costs; no endpoint/model selected | Not estimated; disabled |
| Brevo | Existing plan and transactional credits apply | No new plan purchased; allowance not revalidated |

Sources: https://developers.cloudflare.com/workers/platform/pricing/ ; https://developers.cloudflare.com/workflows/reference/pricing/ ; https://developers.cloudflare.com/d1/platform/pricing/ ; https://developers.cloudflare.com/r2/pricing/

EU D1 and EU R2 location restrictions do not establish EU-only execution, metadata processing, KV or Workflow processing. EU LLM processing must be established contractually and technically before activation. AI Gateway logging/cache are disabled in the proposed client, but that alone is not a DPA or transfer assessment.

## Dependency security

- body-parser upgraded from 2.3.0 to 2.4.0: https://github.com/advisories/GHSA-27r3-jxmh-p828
- qs override upgraded from 6.16.0 to 6.17.1: https://github.com/advisories/GHSA-6pq8-jhm2-2vcw
- Automated package audit is separate from exploitability assessment and does not prove the entire platform secure.
