# DANINI — Brand architecture and low-cost web structure

Decision memo: 2026-11-08. Status: recommendation for execution, NOT a request to migrate or change production URLs.

## Brand architecture: endorsed master brand

- One umbrella brand: **DANINI**, the trust identity for business communication and company contacts.
- Active line: **AutoDanini** (or `DANINI Auto` in an email sender label), presented as an endorsed service: `AutoDanini — by DANINI`.
- Other future lines (only when actually offered and validated): DANINI Business, DANINI Digital, future products or software. Do not buy domains/create logos or launch imaginary lines in advance.
- The **umbrella DANINI logo stays at the left** of global email headers/website. **Only the relevant division's wordmark or small logo** appears at the right, not all eight mailbox addresses and not all future businesses. On mobile stack below instead of squeezing two logos.
- Avoid using the current `ImportOS` orange-stripe shield as the *permanent umbrella* visual identity without approval: it was obtained from the automobile project's current site assets (`public/importos-mark.svg`). It is already included in the existing Brevo logo-final drafts, pending approval of a neutral master DANINI wordmark. Source asset: `public/danini-email-mark-128.png` on PR #118.
- No personal photo in system notifications; optional portrait in personally authored B2B email signatures.

## Web information architecture

Initial low-cost default:
`daninihub.com/` — umbrella overview;
`daninihub.com/auto/` — AutoDanini;
`daninihub.com/business/` — B2B DE/Balkan;
`daninihub.com/digital/` — digital products and services;
`daninihub.com/kontakt/` — global contact;
equivalent DE/SR locale routes in the existing site convention (final paths must be checked against actual routes; examples are not yet live).

**Do not rewrite or redirect the current production root or any existing /de or /sr routes without routing, SEO and canonical review.** Google Search explicitly states no universal ranking preference between subdirectories and subdomains: choose by ease of management.

Switch to a subdomain only for a genuinely separate application with distinct deployment/login/backend, e.g. `app.daninihub.com`, if required. A brand-new domain becomes justified only after a validated product has independent customers and meaningful positioning, and its separate brand value exceeds SEO, legal, maintenance and marketing overhead. No new domain purchases now.

## Brevo email identity

- Brevo one common account Brand Library: DANINI master wordmark/logo, approved neutral brand colors, active site link `https://daninihub.com`, only verified DANINI social channels. Be aware older NutriLans designs exist in same Brevo account; review side effects before changing the shared library.
- Layout: master logo/wordmark left, division label or small division logo right only where the corresponding service triggered the email; body copy in the user's explicit DE/SR language.
- Eight verified domain senders and 16 DE/SR transactional logo templates exist. The current image inside logo-final templates is the ImportOS mark pending final neutral master brand sign-off; do not label a master-brand decision as completed.
- Mailing list subscription language must be explicitly `de`/`sr`; do not infer from country. Separate marketing opt-in/DOI, unsubscribe, segmentation and contacts from transactional enquiries.
- No paid SMS until business revenue and explicit owner permission.
- Existing Brevo Brand Kit is outdated and has no logo. Connector lacks kit update; manual Brevo: Marketing campaign or email template -> Design -> Style -> Setup brand (or Edit in brand library) -> manually upload approved logo, set colors/fonts and approved links -> Save & apply brand. Do not import old social links without checking.
- 4 logo-branded newsletter drafts (#54-57) remain unsent; confirm sender display names, legal footer, unsubscribe pages and GDPR opt-in.
- Email QA: internal Brevo list #20 `DANINI – Interni test` exists; as of this memo `danininet@gmail.com` has `listIds: []` and must be **added to list 20** manually before Brevo allows template test sending. Do not put it on marketing lists. After test membership, user has previously approved using it as the internal test recipient; re-confirm before any new test send as needed. Cloudflare Worker must remain protected until real delivery checks.
