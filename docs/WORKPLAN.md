# DaniniHub Workplan

## Phase 1 — Runtime stabilization

Goal: make the current Node.js agent runtime predictable, testable and safe.

Tasks:

- keep `danini.js` as CLI entry
- keep `core/controller.js` as operational controller
- keep `core/orchestrator.js` as agent dispatcher
- keep `agents/` as executable agent folder
- formalize output JSON
- formalize artifact storage
- add safe command interface
- add healthcheck and syntax check as mandatory gates

## Phase 2 — Artifact system

Goal: every important result becomes a structured artifact.

Planned folders:

- `artifacts/json/` — machine-readable artifacts
- `artifacts/pdf/` — PDF-ready artifacts
- `outputs/pdf/` — generated PDFs
- `outputs/email/` — generated email bodies

Artifact should contain:

- run id
- user input
- mode
- selected agent
- evidence used
- answer
- risks
- next step
- controller validation status
- timestamp

## Phase 3 — 7 EUR activation flow

Goal: paid entry product that activates the DaniniHub method.

Public promise:

- low-risk entry
- guided AI questioning
- structured result
- PDF artifact
- bonus learning material
- upgrade path

Required modules:

- Stripe checkout
- webhook verification
- project/session creation
- artifact generation
- PDF generation
- Brevo email sending
- success page / dashboard handoff

## Phase 4 — Web layer

Goal: create DACH-first premium website.

Recommended routes:

- `/`
- `/de`
- `/sr`
- `/en`
- `/analyse-starten`
- `/success`
- `/dashboard`
- `/impressum`
- `/datenschutz`
- `/agb`
- `/cookies`
- `/affiliate-hinweis`

Homepage sections:

1. Hero — DaniniHub as decision system
2. Method — “Pitaj AI, AI pita tebe”
3. 3-step activation flow
4. 7 EUR PDF artifact offer
5. Trust/legal/compliance
6. Contact / next step

## Phase 5 — DACH compliance

Required:

- Impressum
- Datenschutz
- AGB
- Cookies / CMP if tracking is active
- Affiliate disclosure
- AI transparency
- no medical/legal/financial advice disclaimers
- GDPR-first language
