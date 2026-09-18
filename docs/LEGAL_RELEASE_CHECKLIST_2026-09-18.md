# DaniniHub Legal Release Checklist — DACH / 2026-09-18

This file is an internal release gate. It is not legal advice and is not a public legal page.

## Confirm before first paid B2B order
- [ ] Exact business status of the provider is confirmed (individual / sole trader / other legal form).
- [ ] Gewerbeanmeldung or other required registration is confirmed for the actual activity before invoicing if applicable.
- [ ] If a Handelsregister or other register entry exists, add register and number to Impressum.
- [ ] If a USt-IdNr. or Wirtschafts-IdNr. exists and must be published, add it to Impressum.
- [ ] Confirm whether any chamber, professional title or supervisory authority information is legally required.
- [ ] Confirm tax treatment before publishing binding prices or invoices. Public site must not imply gross/net tax treatment that has not been confirmed.

## Website / privacy
- [x] Impressum route exists in DE/SR.
- [x] Privacy route exists in DE/SR.
- [x] Cookie/local-storage route exists in DE/SR.
- [x] AI transparency route exists in DE/SR.
- [x] B2B service framework route exists in DE/SR.
- [x] Contact-form checkbox is acknowledgement of privacy notice, not marketing consent.
- [x] Public intake does not create a contract automatically.
- [x] Public intake does not make a solely automated legally significant decision.
- [x] Current public intake is not automatically sent to an external AI model provider.
- [x] Honeypot anti-spam field is enforced server-side.
- [ ] Verify actual Hostinger DPA and Brevo DPA accepted for the account.
- [ ] If analytics, ad pixels, embedded video, social widgets or other non-essential end-device access is enabled later, implement consent BEFORE activation and update cookie/privacy pages.
- [ ] If a public AI chat or voice agent is enabled, disclose AI interaction at the beginning where required and update privacy/recipient disclosures before launch.
- [ ] If external AI providers receive customer data, document provider, purpose, legal basis, retention, DPA/subprocessors and third-country safeguards before launch.

## DACH scope
- Germany: provider-information requirements are based on § 5 DDG; privacy information must satisfy GDPR Art. 13; non-essential end-device storage/access requires consent under § 25 TDDDG unless an exception applies.
- Austria: if an Austrian establishment or locally applicable information duty becomes relevant, verify § 5 ECG and any additional local obligations. Current operator remains Germany-based.
- Switzerland: if Swiss FADP/DSG applies to targeted processing, maintain Art. 19 information about controller, purpose, recipients and foreign disclosure.

## Consumer / B2C gate
Current public Revenue OS offer is B2B only.
Before enabling consumer checkout, consumer subscriptions or B2C digital products:
- [ ] Re-check price-display rules, distance-contract information and withdrawal/cancellation duties.
- [ ] Re-check VSBG information duties and any applicable consumer arbitration statement.
- [ ] Do NOT add an old EU ODR-platform link. Regulation (EU) 2024/3228 discontinued the ODR platform; the old platform was shut down in 2025.
- [ ] Re-check Austria/Switzerland consumer-law requirements if B2C is actively targeted there.

## Legacy URL policy
- Equivalent old opportunity pages -> 308 redirect to current Revenue OS.
- Old broad disclaimer -> 308 redirect to current AI transparency page.
- Obsolete transport products/demos -> 410 Gone with a link to the current Revenue OS.
- Old DaniniNet host -> permanent redirect to https://daninihub.com/ instead of preserving stale paths.
- Čalije remains a separate live Case 01 and is not part of the obsolete-route cleanup.

## Release rule
No page may claim "fully compliant", "approved", "certified", guaranteed revenue, guaranteed legal outcome or guaranteed market success without evidence.
