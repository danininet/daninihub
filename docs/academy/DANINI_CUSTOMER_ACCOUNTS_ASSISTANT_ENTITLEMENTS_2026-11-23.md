# DANINI — Single customer workspace and shared AI assistant
**Internal implementation and commercial decision record · 2026-11-23 · prices NOT approved · no public paid subscriptions**

## Existing, actually verified code
- `src/academy/auth.mjs`: passwordless email OTP, HMAC-digested user identity, 8-digit 10-minute code, five attempts, hashed session cookie, logout, explicit account deletion. PUBLIC AUTH OFF until `ACADEMY_AUTH_ENABLED=true`, distinct secret, database migrations, privacy/legal and real transaction-email tests.
- `src/academy/workspace.mjs`: owner-scoped D1 projects, six steps, max three projects/customer, export/delete operations; mock Chromium tests are NOT public registration evidence.
- `workers/danini-academy-ai.mjs`: opt-in DE/SR AI, Turnstile, daily shared 8 global and 2/IP buckets, Workers Free allowance. No independent market research, no paid gating.
- `workers/danini-site-assistant.mjs`: new public DE/SR contextual help. Local field hints cost 0 neurons; optional user question shares the **same** Academy quota. Does not read form values or send e-mails; no account needed.
- `src/portal/page.ts` is the private **owner** portal, NOT a customer workspace. Never expose its contents or Access permissions to registered customers.

## Customer experience / user roles
`GUEST` → explore Academy, AutoDanini, Business, get unlimited local step-by-step field help, perform explicit AI-assisted question if daily cap permits, export locally; no e-mail/registration required.
`REGISTERED_FREE` (future, after activation) → e-mail OTP, 3 saved projects maximum, resume across devices, export/delete, see AI limits and support. No payment credential stored by DANINI.
`PAID_INDIVIDUAL` (not on sale) → plan rules defined **only after** approved content, billing, supply capacity and profit margin. Define monthly inference budget and saved project quotas as server-approved entitlements; not a fake unlimited AI promise.
`GUIDED_CLIENT` (individual SOW, not automatic subscription) → customer-visible milestones, requested corrections, delivery and human approval per confirmed service.
`BUSINESS_CLIENT` (future) → separate company workspace, authorized members, roles, audit, invoices and AVV/DPA, only when demonstrated demand and compliance are proven.
`DANINI_OWNER` → existing protected owner portal with distinct Cloudflare Access; never derive from customer session.

## Proposed customer dashboard (not currently public)
Desktop sidebar/top navigation + mobile bottom/accessible menu:
1. **Start / Übersicht**: welcome, active product entitlement, quota actually remaining, next actionable task, security/verification notices.
2. **Moji projekti / Meine Projekte**: 6-phase progress, last modification, create/resume, download, delete; prominent source vs assumption distinction.
3. **AI pomoćnik / KI-Hilfe**: contextual guided help, previous answers only if the customer intentionally saved them, transparent shared usage limits.
4. **Moje narudžbine / Meine Bestellungen**: ONLY verified paid orders belonging to that account, purchase date, invoice/refund/download statuses; no falsely confirmed purchase.
5. **Podrška / Hilfe**: reference-based complaints, correction requests, secure contact without secrets, human escalation.
6. **Nalog i privatnost / Konto & Datenschutz**: language DE/SR, email OTP re-auth, login history (when implemented), export and deletion controls, consent history.
7. **Moj paket / Mein Tarif**: authorized entitlements, next period, total confirmed price, upgrade/downgrade/cancellation only after legal + payments live; nothing auto-billed without valid agreement.

## Entitlements matrix — candidate for validation, not active purchase buttons
| Capability | GUEST / FREE NOW | REGISTERED FREE (future) | PLUS (future paid) | GUIDED (future bespoke) |
|---|---|---|---|---|
| Local DE/SR form instructions/examples | Unlimited | Unlimited | Unlimited | Unlimited |
| AI help calls | Max 2 per IP per UTC day AND max 8 GLOBAL across Academy+site; availability subject to Free quota | Same global capacity; fair use/account cap after auth | Reserved allowance **TBD from actual verified unit cost and limit**, not active on Workers Free | Individual human service, AI optional with consent |
| Save projects | Local tab/export only | 3 D1 projects (core exists, auth OFF) | Proposed higher number after pricing (not implemented) | Case-based deliverable under SOW |
| Downloads | TXT / JSON / browser print/PDF | Same + saved project JSON | Additional verified templates after QA | Secure reviewed delivery per contract |
| Support | General email | General email | Published response time only after staffing | Agreed case scope/turnaround |
| Payment | None | None | **NOT AVAILABLE** | Individual approved offer/payment after legal/QA |

**Do not promise 2 AI calls to every user** as a guaranteed entitlement: the global cap can exhaust before their request. Display actual availability and fallback static help.

## Admission and product-order gates
1. Confirm actual commercial and privacy notices (controller identity, legal basis, retention, Brevo OTP, platform subprocessors, required B2C withdrawal/cancellation and digital content conformity).
2. Apply existing additive Academy D1 migration to production **only** after schema review and backup; verify foreign keys, account segregation and deletion.
3. Configure `ACADEMY_AUTH_SECRET` as a separate secret, allowlist the first test inbox, validate actual Turnstile + Brevo OTP delivery and logout/session ownership. Owner Cloudflare Access stays separate.
4. Customer dashboard only shows data retrieved for authenticated `userId`. Test IDOR, CSRF, session rotation/expiry, race conditions, read/write/delete, export and accessibility; no email address in public analytics.
5. Define `plan_products`, `account_entitlements`, `subscriptions`, `usage_records` with migrations **only** when approved. Enforce limits in Worker/API and D1, not client strings or PayPal button visibility. Existing commerce order status never grants entitlement without verified provider capture.
6. Approve legal terms, product scope, actual versions, gross price and refund procedure; then Sandbox purchase, cancellation/refund and receipts; only later Live activation and real customer.
7. Record source/provider/amount/refund/audit; remove or downgrade rights only in accordance with actual agreements, never by guessing date from an email.

## Commercial unit economics, decision not price
For each tier calculate `gross recognized revenue - applicable VAT - provider fees - AI/hosting usage - human support/delivery labor - refunds/chargebacks - marketing acquisition - required overhead` before calling it profitable.
Inputs missing: actual customers, per-call neuron/latency distribution, processor fees, support tickets, acquisition, tax treatment and legal eligibility. No market-demand or revenue prediction without a sourced pilot.
First validate value of free assistant with anonymous opt-in feedback (no extra personal categories without legal review), then controlled registered-free pilot, and only then propose paid tier with explicit owner sign-off.

## Scope lock
Do not create a second AI engine, CMS, domain, identity provider, CRM or checkout. Reuse the existing Worker, D1, R2, Brevo, Academy OTP core, owner portal separation and PayPal as appropriate. Public site assistant never creates an account, auto-fills another person's PII, sends messages, places orders, updates published pricing or claims independent VIN/market verification.
