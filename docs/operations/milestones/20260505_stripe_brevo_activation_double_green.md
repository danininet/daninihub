# DaniniHub Stripe + Brevo Activation Double Green

Date: 2026-05-05

## Status

DOUBLE GREEN.

## Latest verified run

- run_id: dh_1777988507648_85f92f
- artifact_path: artifacts/json/dh_1777988507648_85f92f.json
- pdf_path: outputs/pdf/dh_1777988507648_85f92f.pdf
- email_html_path: outputs/email/dh_1777988507648_85f92f.html
- brevo_message_id: <202605051341.55541344624@smtp-relay.mailin.fr>

## Verified chain

- checkout.session.completed received
- activation started
- controller_success
- artifact generated
- PDF generated
- email HTML generated
- Brevo transactional email sent
- webhook fulfilled
- processed event written to logs/stripe_processed

## Production next checks

1. Real checkout session from site button.
2. Success page with session_id.
3. PDF download button from success page.
4. Real recipient email instead of stripe@example.com.
5. Production webhook endpoint after deployment.
