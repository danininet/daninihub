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


## Marketing campaign drafts created in Brevo (NO SEND / NO RECIPIENTS)

| Purpose | Language | Brevo campaign ID | Status |
| --- | --- | ---: | --- |
| DANINI general | DE | 34 | draft, no recipients |
| DANINI general | SR | 35 | draft, no recipients |
| DANINI Auto | DE | 36 | draft, no recipients |
| DANINI Auto | SR | 37 | draft, no recipients |

These drafts include `{{ unsubscribe }}` and should not be sent until language-specific unsubscribe pages, verified opt-in recipients, complete/imprint footer details and display sender name are checked. No existing contacts were subscribed or contacted. Account has two legacy contacts and four older lists; do not repurpose those lists for DANINI without valid consent. Brevo 300 email/day free-plan send limit was observed.

## SMS activation obstacle (2026-11-08)

Brevo refused creation of both intended DE/SR SMS campaign drafts with `402 account_under_validation`, message: `Your account is under validation. You can not create another campaign.`
No SMS campaign was created, no SMS was sent, no SMS credits were purchased. After Brevo account approval, verify country-specific Sender ID registration, SMS credits, explicit SMS opt-in and a legal opt-out path before sending. This integration currently has no tool to configure transactional SMS workflows or create contact attributes.

## Outbound and branding still pending

- All eight verified Cloudflare aliases forward inbound to business Gmail according to user, but only `kontakt@` and `auto@` were individually delivery-tested.
- Brevo sender display names exist for all eight senders. Four draft marketing campaigns returned `[DEFAULT_FROM_NAME]` in their sender record: inspect display name before sending.
- Existing Brevo Brand Kit references an old website; do not overwrite before verifying the real DANINI logo, colour palette, and social account links.
- Existing Cloudflare Worker has an opt-in template feature flag and still needs QA of delivered notifications, Reply-To and the 4 DE/SR paths. The branch has not been merged.
- `LANGUAGE` custom contact attribute for future subscription segmentation is absent; `_DETECTED_LANGUAGE` is not equivalent to explicit customer preference.
- Gmail Send-as SMTP and DE/SR signatures require separate Gmail settings verification. Brevo sender setup alone does not make Gmail Send-as work.

## Business decision: SMS deferred until revenue (2026-11-08)

Owner explicitly decided: **do not pursue SMS now**. No SMS marketing, transactional SMS, Sender ID registration, SMS credit purchases, paid SMS subscription or retrying SMS setup. Resume only after DANINI starts generating revenue and the owner explicitly authorizes it. For now concentrate on the existing no-extra-cost Brevo email / Cloudflare routes, German and Serbian acknowledgments, and first customers. This overrides the earlier SMS activation checklist as a present priority.

## Logo remediation and final asset mapping (2026-11-08)

The current live-site code refers to `public/importos-mark.svg`. That existing site symbol was converted to an email-safe 128×128 PNG, stored at `public/danini-email-mark-128.png` on this PR branch and referenced via the public immutable GitHub raw URL at commit `4a474636a9dc95d2f757b885dd8fca60f7f8b9bf`. No unrelated historical DaniniHub/Property Promotion logo was used.

**FINAL production-candidate Brevo templates with actual image logo:**

| Purpose | DE | SR |
| --- | ---: | ---: |
| Contact | 38 | 39 |
| Vehicle inquiry | 40 | 41 |
| Support | 42 | 43 |
| Information | 44 | 45 |
| Invoice inquiry | 46 | 47 |
| B2B | 48 | 49 |
| Partner | 50 | 51 |
| Privacy | 52 | 53 |

Old IDs 18–33 remain in Brevo for backwards compatibility and are **superseded**. No existing templates were overwritten. Worker mapping on this branch has been changed to final IDs for the four real form kinds. `DANINI_BREVO_TEMPLATES_ACTIVE` remains OFF until staging/production QA. Logo image delivery is referenced from public GitHub, not an embedded SVG.

**FINAL logo-branded marketing drafts:** general DE 54, general SR 55, Auto DE 56, Auto SR 57. They have no recipient lists, are not scheduled, and have not been sent. Previous draft campaigns 34–37 are superseded and remain in Brevo because this connector has no update/archive/delete action. Their sender name may still appear as `[DEFAULT_FROM_NAME]` in the API response and must be checked/selected in Brevo before sending. Unsubscribe page and consent verification remain required.

Brevo rendered final transactional template 39 with and without sample `REFERENCE` successfully with an existing eligible contact; the logo URL and reference appeared in rendered HTML. **This verifies template rendering only; no live customer mail delivery has been established.**

**Brevo connector limitations:** `branding_update_brand`, `branding_update_brand_website`, `templates_update_smtp_template`, create contact attribute, automation workflow management, campaign update/archive and transactional send-event inspection are unavailable. The old account Brand Kit remains unchanged (old website, no logo), so *do not claim the global Brand Kit was repaired*. Manual action in Brevo is needed for brand identity, sender name and GDPR/consent-based automations. Gmail send-as and DKIM/domain testing are separate.

**SMS deferred until DANINI earns revenue** per explicit owner decision; no credits, setup, campaign, sender registration or paid feature.


## QA update — 2026-11-08 evening

- GitHub CI for PR #118 at commit 922562fad801d921272cb851ea46a075d39a6fa7: three workflows PASSED (DANINI ImportOS Core, DANINI Cloudflare full-site live QA, AutoDanini existing-root readiness).
- Brevo template #39 (SR contact, logo-final) rendered in Brevo successfully with an existing contact; immutable logo URL and sample `REFERENCE` both present in the rendered HTML.
- Attempted Brevo template **test send** of #39 to `danininet@gmail.com`, explicitly the business test inbox agreed by owner. Brevo **rejected** it with HTTP 400 `invalid_parameter` / `Test emails cannot be sent to non-existent/blacklisted/without-contact-list users`. Confirmed `danininet@gmail.com` is an existing, unblacklisted Brevo contact with no list memberships. **No test email was queued or delivered.**
- Blocker: In Brevo UI create a new INTERNAL TEST list named `DANINI – Interni test`, add the existing `danininet@gmail.com` contact to that list. Do not subscribe it to DANINI marketing or change old lists. After list membership is confirmed, re-attempt test #39 and #38 with the same confirmed target and verify actual delivery and reply-to.
- Do not turn on `DANINI_BREVO_TEMPLATES_ACTIVE` or `DANINI_CONTACT_ACTIVE` before real end-to-end verification. No merge to production has been performed.
