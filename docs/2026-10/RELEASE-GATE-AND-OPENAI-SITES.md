# DaniniHub — verificiran razvojni kandidat (11.10.2026)

## Jedini cilj
Jedan domen `daninihub.com`; javni identitet Dragan Zdravković / DaniniHub. Ne otvarati drugi sajt. Povezivanje sa OpenAI ChatGPT Sites tek kada je proverena podrška za postojeći backend i domen.

## Izvedene promene u razvojnoj grani
- Originalni portret `public/dragan-original-2026.jpg` i poslovni AI 3×3 vizual `public/dragan-business-grid-3x3.png`.
- Dvojezične početne stranice, SEO H1 popravka i portfolio/Business Support/za auto-kuće/AI-GTM/projekti/CV/Čalije/kontakt = 16 novih SR+DE putanja.
- Postojeće Automotive/ImportOS rute i API nisu namerno brisani ili prepisani.
- WhatsApp i e-mail kontakt; bez lažne kontakt-forme. AI scene su označene kao ilustracije.

## Dokazi testova
- GitHub Actions DANINI ImportOS Core: SUCCESS na SHA `994482023396e6b5b00ca34c900cb564ffb7a051`, run 38175740084.
- GitHub Actions DaniniHub Visual Preview: SUCCESS na istom SHA, run 38175740007.
- Iz CI artefakta `daninihub-founder-preview` (artifact 11715966730) lokalno provereno: 65 HTML datoteka (32 SR + 32 DE + root), 1007 lokalnih linkova i referenci na resurse; **0** nepostojećih lokalnih putanja i **0** nepostojećih #anchor odredišta.
- Na /sr/ i /de/ provereno: tačno po jedan H1; oba portreta i 3×3 slika postoje u paketu; AI/GTM i Projects stranice postoje na oba jezika.
- Rezervna kopija CI zip arhive sačuvana u povezanom Google Drive folderu 01_Web_Codex_i_Skripte (fajl ID `1bFwWRIuv1guJ65kqSwIBbocG1ldLXpGR`).

## Prepreke za produkciju (ne prikazivati kao završeno)
1. OpenAI ChatGPT Sites se konfiguriše u Work/Sites UI; iz trenutnog razgovora ne postoji autorizovana Sites akcija za kreiranje/deploy ili DNS. Nema povezanog OpenAI Site ID-a.
2. OpenAI Sites podržava samo kompatibilne runtime-ove. Postojeći Node/Express + MySQL + Stripe/PayPal + Brevo nisu migrirani niti potvrdjeni E2E na Sites. Ako se ne može podržati postojeći backend, ne prekidati funkcionalan backend radi dizajna.
3. Sandbox naplata → webhook → idempotentna isporuka → PDF/email, admin auth, zaštita podataka i pravna DE/SR dokumentacija nisu ovim proverama dokazani.
4. Pregled mobilnog i desktop prikaza u browseru: nije obavljen u ovom okruženju; direktna navigacija Chromium/Playwright daje `ERR_BLOCKED_BY_ADMINISTRATOR`. Ne izmišljati screenshot rezultate.
5. DNS `daninihub.com`, Hostinger produkcija i GitHub `main` nisu menjani; preusmeriti samo nakon testiranja na kompatibilnom Sites runtime-u i pripremljenog rollback-a.

## Sledeći korak za stvarno OpenAI objavljivanje
U ChatGPT Work / Sites otvoriti **jedan** projekat 'DaniniHub — Dragan Zdravković', koristiti ovaj branch i CI ZIP kao polazne materijale, sačuvati privatni preview. Proveriti podršku za poslovne podatke, postojeće rute i backend. Tek uz dostupne Sites DNS zapise i odobrenje vlasnika povezati postojeći domen. Nije potrebno kupovati novi domen.

Zvanično: https://learn.chatgpt.com/docs/sites
