# DaniniHub Runtime Map

## Active entry points

### `danini.js`

CLI entry point. Loads `.env`, selects agent/model and sends task to AI provider.

### `core/controller.js`

Main execution and validation layer. Supports:

- LIST
- READ
- CMD with allowlist
- SQL SELECT only
- Gemini JSON response flow
- Brevo artifact sending

### `core/orchestrator.js`

Loads agents dynamically from `/agents` and dispatches by agent id.

### `agents/orchestrator.js`

Thin wrapper around `core/controller.verifyAndExecute`.

## Active agents

- `dev_cto`
- `legal.impressum.gen`

## Core services

- `core/db.js` — MySQL pool
- `core/tools.js` — file, command and DB tools
- `core/memory.js` — loads constitution
- `core/mailer.js` — Brevo transactional email
- `core/pdf_generator.js` — PDFKit output
- `core/language_engine.js` — basic locale dictionary
- `core/guard.js` — evidence guard

## Known issues to address later

- `danini.js` reads only Agent Protocols as system context, not full Ustav plus protocols.
- `core/controller.js` has its own Gemini call path separate from `danini.js`.
- `core/pdf_generator.js` is minimal and not premium enough.
- `core/language_engine.js` is currently too small.
- Agent registry is implicit by folder scan; later should be formalized.
