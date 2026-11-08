# DANINI — production intake activation status
Date: 2026-11-08 (Europe/Berlin)
Status: **NOT ACTIVE — configuration and delivery verification blocked.**

## Actual account changes
- Signed into the existing Brevo account. Added daninihub.com under Senders / Domains.
- Brevo domain authentication check failed: Brevo verification TXT and both DKIM CNAME records are missing/mismatched; existing DMARC has no rua tag requested by Brevo.
- Existing sender list contains only the old NutriLans sender. No DANINI sender was verified, no new API key was created, and no Worker secrets were changed.
- Updated the existing “Obradi novi DaniniHub upit” Gmail automation (no parallel automation). It classifies six requested categories, records category/status using Gmail labels, retains reference/date in original messages, and prepares SR/DE response text for owner review. No autonomous offers, sending, newsletter enrollment or external CRM.
- Created and confirmed nine Gmail labels, reusing the existing DANINI/B2B upiti label. Automation configuration saved, but new-message execution has NOT been end-to-end tested.

## Confirmed inbound mail failure
Public DNS on this date:
- MX priority 5: mx1.hostinger.com.
- MX priority 10: mx2.hostinger.com.
- SPF: v=spf1 include:_spf.mail.hostinger.com ~all
- DMARC: v=DMARC1; p=none
- brevo1._domainkey and brevo2._domainkey: NXDOMAIN.

Read the actual earlier test's delivery-status report in the connected Gmail, including Spam:
Remote-MTA is mx1.hostinger.com; final recipient kontakt@daninihub.com; status 5.7.1; diagnostic “554 5.7.1 ... Relay access denied”.
This confirms mail is routed to Hostinger and refused there. It does not establish whether Hostinger's account expiration, missing mailbox or another internal setting caused the refusal.
No new delivery test was sent because no routing repair could be applied.

## Access blocker
Cloudflare Google sign-in returned “Unable to sign in. Try again or use your email and password.”
A fresh dashboard tab also showed the login screen. No authenticated Cloudflare dashboard was established. DNS, Email Routing, Turnstile and Worker configuration remain unmodified.

## Checks performed
- Existing tests/test-danini-contact-worker.mjs, using current main source: **7/7 passed**. These use mocked Turnstile/Brevo, NOT real email delivery.
- Production GET /api/lead/status: HTTP 200, enabled:false, channel:setup_required, turnstileSiteKey:null.
- Production POST /api/lead with empty JSON and site Origin: HTTP 503, error:not_configured. No fake success.
- All 17 sitemap URLs returned HTTP 200 after redirects.
- All 24 local HTML targets discovered in homepage links returned HTTP 200 after redirects.
- robots.txt, privacy.html, impressum.html and support.html returned HTTP 200.
- Canonicals present on all 17 sitemap pages; SR/DE homepage hreflang pair and SR/DE import guide pair present.
- Verified 301 mappings:
  - /de/autoimport -> /selbstimport.html
  - /sr/uvoz-auta -> /uvoz-vodic.html
  - /sr/kalkulator -> /import.html
  - /de/wissen/provera-oglasa-pre-kapare -> /prepurchase.html
- Browser inspection of contact page: SR and DE content renders; both submit buttons remain disabled with an explicit unavailable message. Desktop view inspected.
- Mobile visual QA, calculator interaction, every internal link and complete release build remain pending; HTTP success alone is not functional QA.
- Contact title still references WhatsApp; editorial cleanup remains pending.

## Form status
| Form | Current result |
|---|---|
| General DANINI contact | Rendered; sending disabled |
| AutoDanini vehicle inquiry | Shared intake backend disabled; contact page RFQ observed disabled |
| B2B | Shared intake backend disabled; page reachable |
| Pre-deposit check | Page reachable; continuation to central form exists; delivery not tested |
| Support | Page reachable; shared intake backend disabled |

## Privacy prerequisites
The existing Impressum explicitly lacks confirmed full business address, legal form, registration and tax details.
The current privacy text marks retention, processor arrangements, responsible parties and international transfers as unconfirmed. It also contains legacy registration/saved-request and AI passages that need reconciliation with deployed behavior.
Do not erase existing legal text or invent owner details. Before enabling, add accurate Gmail/Google and existing AI-assisted inquiry classification disclosures alongside verified Cloudflare/Brevo/Turnstile processing, with confirmed legal basis, retention and processor arrangements. This audit is not a legal-compliance determination.

## Next execution steps
1. Establish authenticated access to the existing Cloudflare account.
2. Review Email Routing and verified Gmail destination; replace only confirmed conflicting mail MX/SPF records with account-provided routing records. Preserve site A/AAAA/CNAME/Worker routes and unrelated TXT records.
3. Apply Brevo's actual domain verification and DKIM records from its authenticated domain page; reconcile the single existing DMARC record without duplicates. Verify sender.
4. Configure Turnstile for both exact domains and securely transfer real API/Turnstile keys to Worker secrets.
5. Complete privacy/operator information. Do not set DANINI_CONTACT_ACTIVE=true prematurely.
6. The present Worker requires the active flag for all real submissions. Arrange a controlled non-public test configuration before public activation; do not pretend the current disabled endpoint can pass an end-to-end send test.
7. Confirm actual inbound routing, Brevo delivery events, owner Gmail receipt, neutral requester acknowledgment, reference correlation and automation classification. Then activate publicly and repeat positive/negative checks.

No payments, auctions, business concept changes or website routing changes were made.
