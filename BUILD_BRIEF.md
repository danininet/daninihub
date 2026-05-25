# DaniniHub Constitutional Build Brief

Status: CLEAN BASELINE
Mode: STRATEGY_BUILD
Repository: danininet/daninihub
Primary market: DACH
Primary language: German
Owner: Dragan / Danini Net

## 1. Non-negotiable identity

DaniniHub is not a course, not a chatbot, not a prompt marketplace, not a generic affiliate website and not a donation project.

DaniniHub is a cognitive decision infrastructure and Project Mode system.

Core method: Pitaj AI — AI pita tebe.

The system does not produce endless output. It leads the user through structured questions toward a documented decision.

Decision states:
- GO
- REDEFINE
- STOP

STOP is valid system discipline, not failure.

## 2. Authority hierarchy

Owner -> Meta Commander -> Core Orchestrator -> Operational Agents -> Controller / Zero-Hallucination Guard.

No public claim, file, copy, code or route is valid without passing this hierarchy.

## 3. Triad principle

Every function must support:
- Health
- Income
- Intelligence

If a module does not support at least one of these, it is rejected.
If a module harms one of these, it is blocked.

## 4. DACH rule

DACH is the primary market.
German is the binding system, legal and public authority language.
Serbian is the owner working language.
English is the technical/integration language.

Public tone:
- calm
- professional
- evidence-based
- non-aggressive
- no guru marketing
- no hype
- no quick-money language

## 5. Required public website areas

Public routes:
- /
- /methode
- /projektmodus
- /preise
- /faq
- /reviewbook
- /partner
- /news-recht
- /impressum
- /datenschutz
- /cookies
- /ki-transparenz
- /affiliate-hinweis
- /widerruf
- /agb
- /disclaimer

## 6. Required member area

Member routes:
- /login
- /dashboard
- /project-mode
- /project-mode/gate-0
- /project-mode/gate-1
- /project-mode/gate-2
- /project-mode/gate-3
- /project-mode/gate-4
- /project-mode/gate-5
- /artifacts
- /usage
- /membership

## 7. Required admin area

Admin routes:
- /admin
- /admin/users
- /admin/projects
- /admin/payments
- /admin/usage-ledger
- /admin/artifacts
- /admin/reviewbook
- /admin/content-control
- /admin/audit-log

## 8. Required integrations

Runtime: Express / Node.js.

Initial backend must support:
- health check
- environment validation
- Stripe checkout and webhook later
- Brevo email delivery later
- database connection later
- OpenAI and Gemini only through backend later
- PDF artifact generation later
- usage ledger later
- audit log later

No frontend API key exposure.
No fake integration status.
No simulated payments.
No simulated email delivery.

## 9. ENTRY definition

Operational owner decision for this build: ENTRY 7 EUR.

ENTRY activates:
- one active project
- Gate 0-5 cycle
- Project Activation Pack
- email delivery
- project mode access
- usage ledger record

No income guarantee.
No legal advice.
No financial advice.
No medical advice.
No investment advice.

## 10. DaniniNet and Calije boundaries

DaniniHub = system, method, agents, Project Mode.
DaniniNet = public marketing, sales, affiliate and product channel.
Calije Park Residence = case study / artifact proof.

Do not merge these identities.
Do not make Calije the identity of DaniniHub.
Do not make DaniniNet the core platform.

## 11. Build order

Phase 0: clean repo baseline.
Phase 1: Express backend baseline.
Phase 2: env validation and /api/health.
Phase 3: database schema.
Phase 4: Stripe ENTRY 7 EUR.
Phase 5: Brevo email.
Phase 6: login and member dashboard.
Phase 7: Gate 0-5 workflow.
Phase 8: artifacts and PDF.
Phase 9: usage ledger and admin.
Phase 10: public premium frontend.

No public design before backend baseline.

## 12. Commit discipline

Every commit must include:
- problem
- evidence
- patch
- test command
- expected result

No large multi-module changes.
No generic copy.
No placeholders unless explicitly marked as non-functional route shell.
No hidden risks.

## 13. First valid implementation commit after this brief

Only these files:
- package.json
- server.js
- src/config/env.js
- src/routes/health.routes.js
- .gitignore

Purpose:
- Express starts
- /api/health works
- env status is visible without exposing secrets
- Hostinger can deploy a real Node app

No frontend yet.
