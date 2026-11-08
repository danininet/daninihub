# DANINI — Brevo DE/SR transactional templates (2026-11-08)

Status: 16 active Brevo templates CREATED in the connected Brevo account. The public website/Worker are NOT automatically deployed or activated by template creation. This branch introduces an opt-in feature flag.

## Account infrastructure confirmed

- Domain `daninihub.com`: verified and authenticated in Brevo.
- All eight senders: present and active.
- Cloudflare Email Routing: user confirmed successful inbound test for `kontakt@` and `auto@`, both forwarded to `danininet@gmail.com`.
- Existing NutriLans templates are NOT modified.
- Brand Kit remains unchanged until original DANINI logo and approved up-to-date social links are available. The new templates use a plain DANINI wordmark (no unverified external image).

## Template inventory — 8 functions × 2 languages

| Purpose | Sender | DE | SR | Active trigger |
| --- | --- | ---: | ---: | --- |
| Contact | kontakt@daninihub.com | 18 | 19 | existing `general` intake when flag enabled |
| Vehicle inquiry | auto@daninihub.com | 20 | 21 | existing `vehicle` intake when flag enabled |
| Support | support@daninihub.com | 22 | 23 | existing `support` intake when flag enabled |
| Information inquiry | info@daninihub.com | 24 | 25 | not yet wired |
| Invoice/payment inquiry | rechnung@daninihub.com | 26 | 27 | not yet wired: NOT an invoice/payment receipt |
| B2B inquiry | business@daninihub.com | 28 | 29 | existing `business` intake when flag enabled |
| Partner inquiry | partner@daninihub.com | 30 | 31 | not yet wired |
| Privacy inquiry | datenschutz@daninihub.com | 32 | 33 | not yet wired |

All template Reply-To headers are their matching business sender.
All 16 have DE/SR text, a text-based DANINI header, reference parameter `{{ params.REFERENCE }}`, website, and an explicit non-binding confirmation notice.

## Current intake behavior

`workers/danini-intake.mjs` already validates `body.language` as `de` or `sr`, and sends an operator notification before any customer acknowledgement. It is fail-closed until `DANINI_CONTACT_ACTIVE=true`, Brevo settings and Turnstile are present.

New code uses the template IDs for the four form kinds ONLY when `DANINI_BREVO_TEMPLATES_ACTIVE=true`. When missing or false, original plain-text acknowledgement remains unchanged. A failed acknowledgement does not falsely mark a successful receipt; `receiptAccepted` reports API acceptance only, not final mail delivery.

## Production acceptance checklist (NOT YET VERIFIED)

1. Review/merge the feature branch only after code/CI review. No change to DNS or existing legal pages.
2. In Cloudflare Worker environment (not GitHub), verify existing secrets/vars: `BREVO_API_KEY`, `DANINI_BREVO_SENDER` (validated sender), `DANINI_NOTIFY_TO`, `DANINI_BREVO_REPLYTO`, `DANINI_TURNSTILE_SITEKEY`, `DANINI_TURNSTILE_SECRET`; never put secrets into code or chat.
3. First verify the existing `/api/lead/status` and test the current flow. Do not enable `DANINI_CONTACT_ACTIVE` until end-to-end validation.
4. For staged test, set `DANINI_BREVO_TEMPLATES_ACTIVE=true` in the Worker environment **after code is deployed**, and confirm both language branches and each of the four form kinds through a Turnstile-valid browser request. Ensure references render in actual delivered emails.
5. Confirm internal operator receipt, customer reply-to, bounce handling and no duplicate notifications. Only then enable production website contact forms and monitor.
6. Newsletter is a separate opt-in process: use an explicit `LANGUAGE` custom contact attribute with `de`/`sr` values; cannot rely on `_DETECTED_LANGUAGE`. DOI unsubscribe requirements still apply. No marketing subscription is created by lead intake.
7. Cloudflare Email Routing receives messages, but Gmail Send-as must be configured separately to reply from the business addresses. Brevo SMTP may support this after validating credentials and provider restrictions.

## Known remaining limitations

- Brevo's template preview tool returned HTTP 400 'Contact not found' with supplied test params; live delivery is unverified.
- These templates do NOT establish reply automation for arbitrary incoming emails, purchases or payments, and do not automatically detect email language from mailbox contents.
- Do not use one generic autoresponder for privacy requests or invoice/payment events without matching validated triggers.
- Full logo in template and brand kit awaits approved original asset.
