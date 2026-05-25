# DaniniHub Email Delivery Layer

## Current stage

Email sending is intentionally split into two phases:

1. Generate HTML email body from artifact.
2. Send email later through Brevo only after body is verified.

## Files

- `core/email/createEmailBody.js`
- `scripts/test-email-body.js`
- `outputs/email/*.html`

## Flow

Artifact JSON + PDF path → HTML email body → reviewed output.

Later:

HTML email body + PDF link/attachment → Brevo transactional email.
