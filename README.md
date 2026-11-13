# DANINI Automotive Import Intelligence

Clean production repository for the DANINI automotive import system.

**DECIDE · VERIFY · EXECUTE**

Current production runtime contains only:
- server-rendered DE/SR public website,
- Import Passport / SafeBuy / Model DNA engine,
- FieldCheck and Pro Mechanic flow,
- Original Parts Desk,
- driver / trailer / truck service requests,
- Stripe + PayPal authorization/capture,
- Import Base Čalije connection,
- Knowledge Garage,
- protected owner quote desk,
- durable ImportOS store,
- tests and deployment workflow.

No React/Vite frontend is used in production.
Historical code is not present in the working tree.

## DANINI B2B isolated implementation

The Astro migration is on a separate build path: `npm run build:platform`.
The current production build and `wrangler.jsonc` remain unchanged pending review.
See [implementation status and release blockers](docs/b2b/READINESS.md) and
[regulatory/cost evidence](docs/b2b/REGULATORY_AND_COST_REVIEW.md).
