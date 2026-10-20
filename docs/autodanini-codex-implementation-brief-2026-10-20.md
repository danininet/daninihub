# AutoDanini — Codex implementation brief 4.0

**Status:** implementation task; NOT published. **Date:** 2026-10-20.
**Repository:** danininet/daninihub.
**Working branch:** feat/autodanini-premium-platform-20261020.
**Baseline:** main; compare and carefully incorporate any validated changes from Work's reported `fix/autodanini-audit-2026-10-20` if that branch becomes accessible. It was **not found on remote GitHub** on 2026-10-20. Do not assume the changes were merged.
**Preview to audit:** https://auto-danini-import-b2b-p8swk5.v2.appdeploy.ai/

## Mission
Transform the existing prototype into a sophisticated **multi-page, bilingual (Serbian Latin / German) premium automotive sourcing, inspection, live vehicle viewing, import advisory and B2B request platform**. Do not create another one-page brochure. Preserve existing functional features and code that work. Do not invent inventory, prices presented as validated market rates, partner agreements, reviews, testimonials, auction bids, or verifications.

## Source of truth
Read repository first. Then review owner-approved Drive documents:
- AUTODANINI MASTER PRODUCT BLUEPRINT — B2B Sourcing, uvoz i aukcije, 2026-10-20
- AUTODANINI 3.4 — izvršeni audit, ADAC i MVP odluka, 2026-10-20
- DaniniHub i Auto Danini — MIGRACIJA BEZ HOSTINGER OBNOVE, 2026-10-20
- AUTO DANINI — CODEX IMPLEMENTATION BRIEF v4.0, conversation attachment

If Drive content is inaccessible, work from this task and the repo, reporting inaccessible requirements. Never assume source assets have been uploaded if they have not.

## Product and visual design
- Premium automotive editorial language, NOT generic SaaS card-wall. Responsive art direction for desktop, tablet and mobile.
- Palette: graphite `#111820`, warm off-white `#F7F7F4`, petrol/steel and a discreet champagne/bronze `#B79B6A`. Good type scale, whitespace, accessible contrast, detailed premium navigation, persuasive photography and restrained micro-interactions.
- **REMOVE Aura** and any floating sci-fi orb graphics. No stock businessmen and no AI-generated owner face.
- Use only genuine, licensed automotive photography, describing cars as illustrative unless real inventory and publishing rights are verified.
- **Owner's real portrait**: inspect existing assets, including branch `assets/autodanini-business-20261020`; use a photo only if it is the approved authentic portrait and rights are clear. Otherwise clearly report missing asset and provide a well-designed fallback layout without fake people.
- Hero: strong automotive image, two visible entry paths **Privatni kupac** and **Auto-kuća / B2B** plus WhatsApp contact.

## Separate accessible routes (no single scroll page)
`/`: Homepage and two buyer journeys;
`/privatni-kupci`: buyer service;
`/auto-kuce`: dealer B2B sourcing;
`/video-obilazak`: seller-consented live WhatsApp viewing, limits, pricing, travel policy;
`/nezavisni-pregled`: independent ADAC and other inspections, distinction private seller/Händler, ADAC is not our partner;
`/uvoz-kalkulator`: transparent country-specific cost scenarios, unknown ≠ zero;
`/exclusive-classics`: bespoke premium, oldtimer, youngtimer, tuned car research, registration restrictions;
`/auto-tender`: real closed B2B RFQs, no fictitious bids;
`/aukcije`: future concept, **not active** until approved;
`/vodici`: sourced educational SEO guides;
`/o-nama`: verified factual biography and owner portrait only if approved;
`/kontakt`: WhatsApp and functional, safely validated form;
`/impressum`, `/privatnost`, `/uslovi`, `/cookies`: separate legal/compliance pages, placeholders clearly flagged if operator details unavailable.

Internationalization: complete SR Latin and DE, no mixed-language fragments. Search-engine-indexable canonical routes and hreflang. Shared accessible navigation/footer.

## Functional product
- Separate private buyer and B2B workflows; mobile-first RFQ wizard with total-budget, country, model, fuel, year, kilometres, timeline, 1–3 actual listing links, and company fields as applicable.
- Client-side and server-side validation, transparent consent/legal notices. Showing a WhatsApp draft is NOT equal to recording a request.
- Don't display success/reference number until confirmed persistent backend save.
- Preserve safety rule: production backend must fail closed if persistent MySQL unavailable. Verify `/ready` reaches true only with usable durable DB. Never deploy with ephemeral JSON fallback handling production customer requests.
- Future operator dashboard, RBAC, MFA, separate private attachments and durable audit trail must be scoped and tested before being claimed operational.
- No live Stripe/PayPal charges, public auction bidding, buyer deposits, pseudo-escrow or false supplier verification without legal/operator, data-security and commercial approval.

## Inspection / ADAC
Explain the value and limits of an independent written expert report, practical process for private sellers vs licensed dealerships, seller approval, transport of vehicle to inspection, terms, price confirmation and no partnership claim. Video tour is not mechanical inspection. Avoid guarantee of future condition.

## Hosting and deployment constraints
- Assess standalone static/SEO frontend on Cloudflare Pages, Node/Express API and relational DB on appropriately budgeted managed service (e.g. Railway) only after verifying actual compatibility, expected cost, backups and uptime.
- Existing Hostinger subscription expected end 2026-11-04; audit migration, existing data and mail DNS before any switch.
- **Do not change DNS, domain, hosting, existing production site, payments, or merge to main** without explicit owner review. Work on branch, produce preview if available.

## Legal
Separate German Impressum, Datenschutz (GDPR/DSGVO), terms/cancellations, independent inspection disclaimer, cookies if relevant, and SR/DE localization. Real operator, address, company registration, processing vendors, payment rights and consumer rules MUST be verified before live commercialization. Don't make up registered entities, tax IDs, insurers or legal approvals; flag for professional review.

## Delivery and acceptance
1. Audit existing assets/routes/backends, inventory what is real, report missing assets and Work branch discrepancy.
2. Ship high-fidelity UX implementation with real multi-page routing and responsive premium identity.
3. Fully functional and tested B2C/B2B request pathways, real front-to-back persistence only if production security prerequisites met; otherwise mark demo clearly.
4. Build + lint/type checks + smoke tests, 4 screenshot variants (SR mobile, SR desktop, DE mobile, DE desktop); show tested CTA, forms, calculator, privacy links and 404.
5. Security and accessibility review; don't leak credentials or customer PII.
6. Provide reviewed diff/PR **without merging**, preview URL if available, exact DONE / PARTIAL / BLOCKED table, and migration/hosting cost plan.
7. Prioritize honest conversion and first paid sourcing/inspection pilot over speculative open auctions.

**Codex start instruction:** first examine repo, plan focused changes, then implement actual code on this branch and run tests. Do not stop at a textual recommendation.