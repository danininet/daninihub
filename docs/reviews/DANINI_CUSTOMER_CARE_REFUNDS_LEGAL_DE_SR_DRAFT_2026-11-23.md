# DANINI — Pre-contract, support, complaints and refunds: DE/SR review draft
**INTERNAL WORKING DRAFT ONLY • NOT PUBLIC TERMS OR LEGAL ADVICE • 23.11.2026.**
Current public `src/lib/legal.ts` covers largely B2B GTC and generic privacy, NOT adequate finalized B2C digital PDF and AutoDanini consumer purchase flow. Existing legal drafts from 23 Oct and 17/23 Nov are historical, not automatic approved terms. Finalize with German lawyer/tax expert and owner; preserve statutory rights.

## Product classification — review each contract
- **Free local-only tools:** no payment, no contractually guaranteed AI accuracy, right to stop/exit; browser-local data lost at tab closure, own download/export. Errors reported via contact.
- **B2C paid digital content not supplied on physical medium (PDF/CSV):** precontract digital characteristics, language, compatibility, update requirements if applicable, total gross price and taxes, payment, access, correction/remedy, cancellation and withdrawal information. Applicable §356(5) BGB requires precise separate prior express agreement and confirmation of awareness of loss of withdrawal on starting performance, plus compliant confirmation on durable medium; do not assume blanket no-refund.
- **B2C custom remote service (AutoDanini consumer):** separately identify withdrawal rights, whether performance begins during withdrawal period and payment consequences on lawful request, and conditions for loss upon complete service. Do not copy digital-content exception verbatim to services.
- **B2B custom services:** approved SOW governs delivery and invoice, VAT, scope and revisions, DPA/AVV if processing for client, complaints, partial/nonperformance and termination; no blanket “no refunds” or automatic consumer regime.
- **Cross-border:** determine B2C customer country and mandatory law, VAT/OSS issues and language; DE business address does not automatically override nonwaivable consumer rules.

## DE — Entwurf für Kundeninformation VOR einem zulässigen Kauf
**Anbieter und Vertragspartner:** Die zum Zeitpunkt des Angebots gesetzlich bestätigten Daten aus dem aktuellen Impressum; Rechtsform und steuerlicher Status sind vor dem Verkauf verbindlich zu prüfen.
**Leistungsbeschreibung:** Produktbezeichnung, Ausgabe/Versionsdatum, PDF-/CSV-Format, Sprache, Inhalte, Seitenzahl, erforderliche Software (PDF-Leser), Nutzungsumfang, gegebenenfalls Barrierefreiheit und klar beschriebene Ausschlüsse werden vor dem zahlungspflichtigen Bestellschritt angezeigt.
**Preis und Bestellung:** Vollständiger Endpreis einschließlich aller anwendbaren Steuern und obligatorischen Gebühren. Vor Zahlung kann der Kunde die Angaben korrigieren. Eine unverbindliche Anfrage löst keine Zahlung aus. Bestellbestätigung und die rechtlich erforderlichen Vertragsinformationen werden auf einem dauerhaften Datenträger bereitgestellt.
**Digitale Bereitstellung:** Nach serverseitig bestätigter Zahlung wird der tatsächlich geprüfte Inhalt über einen geschützten Download zur Verfügung gestellt. Funktioniert die Bereitstellung nicht, erfolgt zuerst eine kostenlose Abhilfe; weitere gesetzliche Rechte bleiben bestehen.
**Widerruf:** Soweit dem Verbraucher ein Widerrufsrecht zusteht, gelten die gesetzlichen Fristen und Informationspflichten. Ein vorzeitiges Erlöschen bei nicht auf körperlichem Datenträger gelieferten digitalen Inhalten darf nur angenommen werden, wenn sämtliche gesetzlichen Voraussetzungen (u.a. ausdrückliche vorherige Zustimmung, bestätigte Kenntnisnahme und Vertragsbestätigung) erfüllt sind. Eine allgemeine AGB-Klausel oder ein vorangekreuztes Kästchen ersetzt dies nicht. Je nach Vertragsart kann eine gesetzlich vorgeschriebene elektronische Widerrufsfunktion erforderlich sein; gesondert prüfen.
**Mängel, Erstattung und Hilfe:** Gesetzliche Mängelrechte für digitale Produkte und Dienstleistungen bleiben unberührt. Bei defektem Link, falscher Datei, unvollständigem Inhalt oder wesentlicher Abweichung von der Beschreibung wenden Sie sich mit der Bestellreferenz an info@daninihub.com; keine Passwörter, Kartendaten oder OTP. Wir protokollieren die Meldung, prüfen den Kauf, stellen eine funktionsfähige Datei bereit oder bearbeiten die gesetzlich bzw. vertraglich erforderliche Erstattung auf dem zulässigen Zahlungsweg. Eine freiwillige Kulanzregel kann separat vereinbart werden, darf gesetzliche Ansprüche nicht einschränken.
**Grenzen:** DANINI liefert strukturierte Informations- und Arbeitsunterlagen, keine individuelle Rechts-, Steuer- oder Zollberatung, keine garantierte Fahrzeugprüfung und keine Garantie für geschäftlichen Erfolg.

## SR — Nacrt obaveštenja kupcu PRE eventualne kupovine
**Pružalac i ugovorna strana:** Prikazati stvarno potvrđen pravni identitet, adresu, kontakt i poreski režim. Ne pretpostavljati Gewerbe ili PDV status.
**Šta se dobija:** Naziv, izdanje, datum, jezik, pregled poglavlja, broj strana, format i tehnički uslovi, pristupačnost, dozvoljena individualna upotreba i jasna ograničenja.
**Cena i naručivanje:** Kupcu pre potvrde pokazati ukupnu cenu sa primenljivim porezima i obaveznim naknadama. Upit sam po sebi nije narudžbina. Nakon kupovine izdaje se odgovarajuća potvrda ugovora i dokumentacija na trajnom nosaču.
**Digitalna isporuka:** Tek nakon serverski potvrđene uplate otvara se zaštićen pristup **revidiranom i odobrenom** fajlu. Kod pogrešnog/nepotpunog fajla ili problema sa preuzimanjem, kupac može zatražiti otklanjanje nedostatka, novu isporuku ili primenljive zakonske pravne lekove.
**Odustajanje:** Pravo potrošača u relevantnom roku i izuzetak za digitalni sadržaj zavise od ispunjenih zakonskih uslova i pravilnog prethodnog obaveštavanja. Nije dozvoljeno automatski izjaviti da kupac nema pravo na povraćaj čim preuzme PDF, niti zameniti zasebnu saglasnost opštim uslovima.
**Reklamacije i povraćaj:** Kontakt info@daninihub.com sa referencom narudžbine, opisom problema i datumom; bez PIN-a, lozinki ili kartica. DANINI evidentira problem, proverava isporuku i nudi ispravku/ponovnu dostavu, a kada je to propisano ili ugovoreno sprovodi povraćaj odgovarajućim platnim putem. Ne obećavati fiksni rok odgovora bez operativnog kapaciteta.
**Granice:** Metodologija, šabloni i AI nacrti nisu sertifikati, poresko/carinsko mišljenje, dokaz potražnje ili garancija finansijskog rezultata.

## Internal mandatory complaint / refund process (NOT a customer-facing guarantee)
1. **RECEIVED**: generate case ID, timestamp, order/contract reference, B2B/B2C and country, language, source, complaint type; never request secret payment credentials.
2. **TRIAGE**: immediate priority if charged but undelivered, duplicate charge, privacy exposure, wrong content, unlawful claim. Acknowledge receipt by a real monitored channel; target next internal review within 2 working days (not an SLA promise).
3. **VERIFY**: correlate PayPal transaction/capture/refund history with D1 order and Brevo sent status; record factual delivery event and copy of applicable accepted terms/consent version, order timestamp and source edition. Never infer receipt merely from email provider “accepted”.
4. **REMEDY**: resend functional secure link, replace nonconforming file, correct report with human sign-off, or issue required contractual/statutory refund. Distinguish goodwill from legal entitlement. Provide a human escalation.
5. **REFUND**: authorized person initiates provider refund to original payment method, verifies provider refund ID/status and D1/accounting reconciliation. Partial refund only where lawful and agreed; no duplicate refund via retry.
6. **CLOSE**: customer notified, proof recorded, GDPR retention and tax/accounting evidence observed, feedback classified; reopen if unresolved.
7. **LEARN**: weekly aggregate complaint themes, delivery reliability, refunds, clarity and support burden; never publish fabricated testimonials/satisfaction statistics.

## Essential system fields before first paid order
`order_ref,sku,edition_sha256,contract_type,country,consumer_status,displayed_total_currency,tax_treatment,precontract_text_version,terms_version,withdrawal_notice_version,separate_digital_consent_and_awareness_timestamps,contract_confirmation_delivery,receipt_id,payment_provider_order_id,capture_id,payment_status,delivery_status,download_success,complaint_id,complaint_category,remedy,refund_id,refund_status,refund_amount,approved_by,retention_class`.
**These are design requirements, NOT claims that they already exist in D1.** Collect only data necessary under a lawful basis and agreed retention; don't modify the schema without a migration plan.

## Before a legal/payment go-live, verify
1. Legal contracting identity and §5 DDG; Gewerbe/Handelsregister and VAT status where legally relevant. Correct invoice and cross-border VAT.
2. B2C vs B2B rights; §312j BGB payment button, precontract Art. 246a EGBGB disclosures, §356(5) BGB conditions for digital withdrawal, §356a BGB online cancellation function applicability, §§327 ff. BGB digital-product remedies, §357 BGB reimbursement, VSBG §§36–37 statement if applicable.
3. Art. 13 DSGVO disclosures, legitimate grounds, AVV Art. 28, DPA subprocessors/cross-border transfers, rights, retention of D1/R2/Cloudflare/Brevo/Gmail, data minimization, no blanket claim EU-only.
4. Cloudflare AI provenance/labeling and Art. 50 EU AI Act where applicable, no unproven success statistics.
5. Accessibility/e-commerce applicability under BFSG (including microenterprise services exception where appropriate) and 2026 withdrawal-button changes; browser keyboard/screenreader/contrast/PDF tags.
6. Provider refund/chargeback role, PayPal merchant confirmation, settlement/fee reconciliation, idempotency, abuse/fraud response and customer service ownership.

Official source starting points (jurist must verify current texts and applicability):
https://www.gesetze-im-internet.de/bgb/__312j.html
https://www.gesetze-im-internet.de/bgb/__356.html
https://www.gesetze-im-internet.de/bgb/__356a.html
https://www.gesetze-im-internet.de/bgb/__357.html
https://www.gesetze-im-internet.de/bgb/__327.html
https://www.gesetze-im-internet.de/ddg/__5.html
https://www.gesetze-im-internet.de/vsbg/__36.html
https://eur-lex.europa.eu/eli/reg/2016/679/oj
https://eur-lex.europa.eu/eli/reg/2024/1689/oj
https://www.gesetze-im-internet.de/bfsg/
