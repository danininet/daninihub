# DaniniHub Transport — lead, presentation and pilot flow

Status: production workflow, 19 July 2026

## Binding rule

No presentation, price or binding offer is sent with the automatic receipt confirmation. An automated or AI-assisted pre-check may structure information, but it may not approve a prospect, promise a service or trigger a qualified sales message. Dragan Zdravković personally approves or closes every lead.

## Message and presentation sequence

| Stage | Trigger | Client receives | Presentation | Human approval |
|---|---|---|---|---|
| 1. Receipt | General contact or Pilot-Check submitted | Short Brevo receipt with reference; no price and no offer | None | Not required for the receipt |
| 2. General lead verified | Dragan opens the protected review link and approves | Short follow-up inviting the client to complete the structured Pilot-Check | None | Required |
| 3. Pilot-Check verified | Dragan checks company, need, relation, scope, authority and contact data | 30-day pilot proposal email, public operations demo and Pilot Brief/pilot example | `DANINI_PILOT_BRIEF_DE_URL` or `DANINI_PILOT_BRIEF_SR_URL` | Required |
| 4. Fit call completed | Both parties confirm a realistic scope | Written scope, responsibility matrix, price, payment terms and proposed start date | Client-specific offer, not a generic sales deck | Required from both parties |
| 5. Pilot start | Written acceptance and agreed payment condition | Onboarding and working-channel details | Operational runbook only | Required from both parties |
| 6. Day-30 review | Pilot period ends | Results, open risks and a separate continuation proposal | Pilot evaluation | No automatic renewal |

## Standard pilot frame

- Duration: 30 calendar days.
- Scope: one relation or a small, explicitly defined vehicle/case group.
- Work: only the tasks, time windows, systems, contacts and escalation paths agreed in writing.
- Evidence: status and ETA log, deviations, approvals, decisions and shift handovers.
- Boundaries: no autonomous transport order, pricing, route, safety, capacity, customs, legal or Verkehrsleiter decision.
- End: joint evaluation; no membership and no automatic extension.

## Balkan commercial model

The default is a direct B2B sale of a fixed-scope pilot, not membership:

1. qualify the company and decision-maker;
2. verify the client country, business/VAT status and invoicing data;
3. send a written fixed-scope offer or pro forma document;
4. agree invoice and bank-transfer terms before the start;
5. run the 30-day pilot;
6. offer continued monthly support only through a new written agreement.

Do not use a recurring subscription or automatic renewal. Do not hard-code a tax statement into the sales email: cross-border VAT treatment must be checked against the supplier and customer status, place of supply and the client country before invoicing.

## Manual verification checklist

- Is this a real B2B company and is the sender identifiable?
- Is the operational problem specific enough to evaluate?
- Are relation, vehicle/case group and requested time window plausible?
- Is a decision-maker or authorised contact named?
- Are the requested tasks inside the published DaniniHub service boundaries?
- Are price, contract, driver instruction, safety and Verkehrsleiter responsibility left with the client?
- Are country, invoicing data and VAT/business status available before a priced offer?
- Is the correct DE or SR follow-up selected?

The protected email button performs one of two actions only: send the appropriate approved follow-up through Brevo, or close the lead without a follow-up. Repeated sending is blocked by the stored lead status.
