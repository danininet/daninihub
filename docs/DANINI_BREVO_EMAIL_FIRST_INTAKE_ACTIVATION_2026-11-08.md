# DANINI — Brevo email-first lead intake / production activation checklist
**Datum:** 08.11.2026
**Status:** Code prepared; all real sending DISABLED until domain/sender/Cloudflare Turnstile are verified. Do not mark as live without end-to-end tests.

## Final architecture
Visitor (SR/DE) → contact / vehicle RFQ / B2B RFQ / support form → Cloudflare Worker `/api/lead` → **server-side Cloudflare Turnstile validation** → Brevo transactional email → owner's existing Gmail notification (subject begins **DaniniHub**) → optional generic receipt to visitor. The existing DaniniHub Gmail automation can then categorize arrivals. **WhatsApp is direct optional contact only**, useful for Balkan visitors to avoid costly calls; not the main form processor.

Cloudflare Worker serves only `/api/*`; it passes all other requests to the unchanged static asset binding. Existing SEO redirects, pages, and checkout restrictions remain intact.

**No database, CRM account, newsletter enrollment or automatic sales offer is implemented by the Worker.** Transactional email delivery records remain with Brevo; the chosen inbox receives the owner notification once provider delivery is successful.

The public `GET /api/lead/status` returns `{"enabled":false,"channel":"setup_required","turnstileSiteKey":null}` while prerequisites are absent. A public POST returns HTTP 503 when the channel is not configured. The website deliberately disables send buttons. A successful real form returns HTTP 202 with the generated reference ONLY after Brevo accepts the operator notification. Provider acceptance does NOT prove receipt in Gmail.

## Secure Cloudflare settings (NO keys in GitHub or ChatGPT messages)

Use Cloudflare Dashboard → Workers & Pages → existing **daninihub** Worker → Settings → Variables and Secrets (the UI wording can vary). The following names are read only by the Worker:

| Name | Purpose | Secret |
|---|---|---|
| `BREVO_API_KEY` | Existing Brevo transactional API v3 key, never SMTP key | Yes |
| `DANINI_BREVO_SENDER` | verified sender at daninihub.com, e.g. `kontakt@daninihub.com` only if authenticated | Yes (optional visibility, recommended) |
| `DANINI_BREVO_REPLYTO` | tested *receiving* business mailbox for visitor replies | Yes (recommended) |
| `DANINI_NOTIFY_TO` | private/operational Gmail mailbox to receive alerts; never put in HTML | Yes |
| `DANINI_TURNSTILE_SITEKEY` | public Turnstile sitekey for both daninihub.com and www | Public variable |
| `DANINI_TURNSTILE_SECRET` | Turnstile server-side verification key | Yes |
| `DANINI_CONTACT_ACTIVE` | deliberate switch: **false/unset by default**, set literal `true` only after tests and privacy review | Public variable |

**Do not set any value in git, client-side Vite variables, source code or a chat message.** The Cloudflare dashboard is the right place for secrets. The user must authenticate there; the present ChatGPT tools do not provide an authorized Cloudflare dashboard connection.

## Inbox / domain receive path
Existing plan `docs/DANINI_EMAIL_JOBCENTER_PRELAUNCH_2026-11-08.md` indicates Hostinger email service ended while old Hostinger MX may remain. This is NOT proof of email receiving. Use **Cloudflare Email Routing → verified destination Gmail** for `kontakt@daninihub.com` and optionally `support@daninihub.com`; configure the MX records requested by the connected Cloudflare account only after reviewing existing records. Verify an external inbound message reaches the Gmail inbox and that replies are possible. Never add contradictory MX sets. Email Routing is for inbound forwarding, NOT for SMTP sending.

Brevo is the separate outbound sender. Brevo → Senders, Domains, IPs: authenticate **daninihub.com** using the actual tokens/DKIM/DMARC that account supplies, verify the chosen sender, test real transactional delivery. Do not invent DNS record values. Confirm SPF alignment and whether DMARC applies to the chosen sender domain.

Official docs:
- https://developers.cloudflare.com/email-service/get-started/route-emails/
- https://help.brevo.com/hc/en-us/articles/12163873383186-Authenticate-your-domain-with-Brevo-Brevo-code-DKIM-DMARC
- https://developers.brevo.com/docs/send-a-transactional-email
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.cloudflare.com/workers/static-assets/binding/
- https://developers.cloudflare.com/workers/configuration/secrets/

## Testing before activation
1. CI: `node --test tests/test-danini-contact-worker.mjs` simulates Turnstile and Brevo offline, tests success and failure without sending mail; `npm run build` and existing domain tests must pass.
2. Public smoke: all 33 static site paths and existing 301 routes continue working.
3. Worker smoke: `GET https://daninihub.com/api/lead/status` returns **enabled:false** while keys/approval are absent.
4. Confirm Brevo sender (verified), destination Gmail inbound receiving, privacy draft and company responsibilities with actual legal status; no fake business registrations.
5. Add verified Worker settings in Cloudflare dashboard. Set `DANINI_CONTACT_ACTIVE=true` only after all prior conditions and approval.
6. From *your own test email address*, submit one genuine SR/DE contact test (not fictitious sales lead). Test Turnstile, HTTP 202 reference, delivery notification to owner Gmail, neutral customer acknowledgement, Gmail search subject `DaniniHub` and any existing automation. Check Spam/Brevo event logs for delivered, not just accepted.
7. Negative tests: invalid email, incomplete consent, wrong origin, exhausted captcha, failed Brevo sender. No 202 on failure. Ensure messages do not create unsolicited marketing contacts.
8. Confirm a real reply can travel from the tested business mailbox to the requesting address. Only then advertise that email intake is live.

## UI changes
- `contact.html`: general form for all DANINI business areas, separate detailed vehicle RFQ, automatic form readiness status.
- `buyers.html`, `dealers.html`, `exclusive.html`, `tender.html`: shared email-first vehicle inquiry, email address required and anti-spam verification once configured. Native forms use POST; buttons disabled before JS/backend confirmation to prevent URL query leaks.
- `support.html`: same common email channel, no fake ticket or promised SLA.
- Homepage and mobile navigation focus DANINI Business, AutoDanini, digital and AI; CNC not promoted and noindex.
- Privacy page remains an explicitly incomplete legal draft; includes accurate conditional Cloudflare/Brevo/Turnstile processing notes. Legal review and missing operator address/details are outstanding.

## Automation after first end-to-end delivery
**Phase A (immediate after verification):** automatic transactional notification and neutral receipt; Gmail subject `DaniniHub` is compatible with the previously configured Gmail message-analysis automation. The message reference identifies the inquiry for reconciliation, NOT a stored ticket record.

**Phase B (after proper GDPR review and account permission):** store inquiry records in an EU-region CRM, with access roles, consent, audit trail, duplicate detection and 3-step statuses: new → qualified/needs-info → answered/closed. Automated classification and reply **drafts**, no unsolicited sends.

**Phase C:** approved AI agents for supporting product dossiers and reports; publish or charge only after human/legal/business authorization. Do not reactivate payments, auctions, direct vehicle escrow or AI integrations merely by deploying the contact Worker.

## Acceptance criteria
- Zero live secrets in source/repository; script in `.mjs`, not client bundle.
- No sending without real Turnstile server verification and verified sender + owner notification.
- On no credentials: honest disabled UI, reachable existing site, optional direct WhatsApp only.
- Customer data NEVER automatically sent to newsletter lists; customer receipt generic and does not echo untrusted user content.
- Positive 202 means BREVO ACCEPTED owner notification; physical inbox delivery needs separate real test.
- Existing real Cloudflare domains and 301 redirects unmodified; payments and legal status untouched.

## Stvarna provera prijema — 8. novembar 2026.
- Poslat jedan interni test iz povezanog Gmail naloga na `kontakt@daninihub.com` (predmet: `DANINI routing test — 08.11.2026 (technical only)`).
- Gmail je vratio **Delivery Status Notification (Failure)**. SMTP odgovor udaljenog servera: **`554 5.7.1 : Relay access denied`**. Dakle, dolazna pošta trenutno NE RADI; javna adresa ne sme biti označena aktivnom dok novi test ne stigne u sanduče.
- Uzrok sumnjivo zaostalo ili neusaglašeno Hostinger MX/routing podešavanje, ali precizan DNS uzrok zahteva pregled stvarnih Cloudflare DNS i Email Routing pravila. Ne menjati DNS naslepo.
- Cloudflare Workers produkcija: uspešan build. Poslednji javni smoke test: 33/33 stranice, 4/4 SEO 301 i /api/lead/status HTTP 200; e-mail API bez Brevo i Turnstile podešavanja odgovara `enabled:false`.
- Sledeći neophodan potez u potvrđenom Cloudflare nalogu: Email Routing, verifikovan Gmail destination, odgovarajući MX/SPF i pravilo kontakt@ → ciljna adresa. Posle toga poslati novu poruku SA SPOLJNE ADRESE i proveriti Inbox, Spam i zaglavlja.
- Posebno u Brevo: potvrditi domenski sender, DKIM/DMARC i API; postaviti tajne u Workers settings; aktivacioni prekidač ostaviti false dok pravno-obaveštajni i E2E koraci ne prođu.
