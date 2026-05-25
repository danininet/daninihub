# DaniniHub Project State

## Current status

DaniniHub root is currently a Node.js / CommonJS agent runtime, not a Next.js web application.

The active runtime is composed of:

- `danini.js` — CLI entry point for agent execution
- `core/controller.js` — main controller / verifier / execution layer
- `core/orchestrator.js` — dynamic agent dispatcher
- `agents/` — registered executable agents
- `docs/reference/` — constitution, protocols, strategic references and premium media assets
- `artifacts/` — future structured JSON artifacts
- `outputs/` — generated output files
- `scripts/` — diagnostics and operational tools

## Verified

- Syntax check passes.
- Healthcheck passes.
- `docs/reference/ustav.txt` is readable.
- `docs/reference/AGENT PROTOCOLS (FULL 56).txt` is readable.
- Core modules load successfully.
- Environment variables are present in `.env`.

## Protected sources

The following must not be deleted casually:

- `.env`
- `docs/reference/USTAV.md`
- `docs/reference/ustav.txt`
- `docs/reference/AGENT PROTOCOLS (FULL 56).txt`
- `docs/reference/Analiza USP-a na DACH tržištu.txt`
- `docs/reference/PREMIUM_OUTLINE.md`
- premium video/audio/pdf/pptx reference files inside `docs/reference/`

## Current architectural decision

The engine and the web interface should be separated conceptually.

Recommended next structure:

- root runtime remains responsible for agents, controller, artifacts, PDF, mail, payments and evidence
- web interface should be added as a separate layer later, either:
  - `web/` inside this repo, or
  - separate Next.js repository connected to this runtime

## Immediate next milestone

Create a professional DaniniHub operating plan:

1. Stabilize runtime command interface.
2. Create artifact contract.
3. Create controller output schema.
4. Connect 7 EUR activation flow.
5. Generate PDF artifact.
6. Send result by email.
7. Add web layer.
8. Add legal pages and DACH compliance.
