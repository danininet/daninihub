# DaniniHub Release Gate

Branch: ustav-runtime-core
Target: main only after review

## Release rule

No live deployment is valid until the runtime passes these checks.

## Required checks

- `npm install`
- `npm run build`
- `npm run build:front`
- `npm run check:runtime`

## Runtime endpoints to verify

- `/api/health`
- `/api/system`
- `/api/orchestrator`
- `/api/legal`
- `/api/localization`
- `/api/seo`
- `/api/trust`
- `/api/entry/7-eur`
- `/api/addons`
- `/api/gates`
- `/api/artifacts`
- `/api/reviewbook/moderation-queue`
- `/api/usage`

## Must remain blocked before production integrations

- Stripe checkout
- Stripe webhook
- Brevo email delivery
- Database persistence
- Auth/member access
- PDF artifact delivery
- Public review publishing
- AI-generated gate outputs

## Public launch requirements

- Impressum
- Datenschutz
- KI Transparenz
- Haftungsausschluss
- Affiliate Offenlegung when affiliate links exist
- Visible AI disclosure
- Visible no-guarantee disclaimer
- Human review requirement
- DACH-first German public copy

## Forbidden before launch

- Fake dashboards
- Fake testimonials
- Fake urgency
- Fake metrics
- Fake checkout
- Simulated PDF delivery
- Simulated email delivery
- Hidden API key exposure
- Public claims without validation
