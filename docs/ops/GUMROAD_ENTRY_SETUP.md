# Gumroad ENTRY setup — DaniniHub

Status: MVP checkout before Stripe automation.

## Product

Create one Gumroad product:

- Name: DaniniHub Project Activation — ENTRY
- Price: 7 EUR
- Type: Digital product / membership-style access product
- Delivery mode: manual or semi-automatic activation
- Public promise: activation into DaniniHub Project Mode, not instant success, not income guarantee

## What buyer receives

- ENTRY confirmation
- access instructions for Analyse starten / Project Mode activation
- Gate 0 start guidance
- Project Activation Pack status: validation required until PDF pipeline is fully tested
- email or manual handoff while Brevo/full auth are not validated

## Product description

DaniniHub Project Activation is the paid entry into a structured AI-assisted project clarification process based on the method: Frage KI — KI fragt dich.

For 7 EUR the buyer activates the start of one project analysis path. The process may include a guided test, first project clarification, Gate 0 orientation, and preparation for a Project Activation Pack.

This is not a promise of income, investment success, medical advice, legal advice or financial advice. AI supports the process. The user remains responsible for all decisions.

## Button / CTA

Jetzt Projektmodus für 7 € aktivieren

## After-purchase instructions

Thank you for activating DaniniHub ENTRY.

Next step:
Open the activation page and start your project intake:
https://daninihub.com/analyse-starten

Use the same email address you used for the Gumroad purchase.

During MVP phase, access and artifact delivery may be validated manually or semi-automatically.

## Environment variable

After Gumroad product is created, set on Hostinger / deployment environment:

GUMROAD_ENTRY_URL=<your-gumroad-product-url>

Do not commit real secret keys into GitHub.

## Live rule

Do not claim full automated Stripe, Brevo, PDF or member dashboard delivery until those pipelines pass runtime validation.
