# AutoDanini Admin Desk — implementacija i pregled

Status 21.10.2026: **KOD SAČUVAN NA RAZVOJNOJ GRANI, NIJE OBJAVLJEN NA APPDEPLOY**.

Sadašnja aplikacija radi na: https://auto-danini-import-b2b-p8swk5.v2.appdeploy.ai/

**Razlog blokade objavljivanja:** AppDeploy je za ovaj nalog vratio `CREDITS_USAGE_LIMIT_REACHED` — do dnevnog UTC reseta 22.10.2026 00:00 nije dopušteno novo objavljivanje. Postojeći sajt ostaje netaknut. Ovaj PR se ne sme predstavljati kao objavljen admin panel.

## Sadržaj stvarne implementacije

```
autodanini/appdeploy-admin/
├── admin.html                    # premium privatna admin stranica, noindex
├── src/admin.ts                  # auth, inbox, statusi, nacrti ponuda
├── src/account-submission.ts     # izričito slanje iz korisničkog naloga u obradu
├── backend/admin.ts              # zaštićeni API za predaju, upite i obradu
└── scripts/apply-to-appdeploy.mjs # automatska integracija u izvezeni AppDeploy izvorni projekat
```

**Korisnik**: napravi privatni zapis u `/nalog.html` → samo klikom na `Pošalji u obradu` i dodatnom potvrdom predaje kopiju svom stvarnom AutoDanini timu.

**Vlasnik**: prijavi se u `/admin.html` → server proverava vlasnički nalog → samo vlasnik vidi do 30 poslatih zahteva po stranici, identitet za kontakt, detalje vozila, radnu napomenu, status, nacrt iznosa ponude.

**Nema**: javnog pristupa, aukcijskih ponuda, provere identiteta prodavca, naplate depozita, Stripe integracije, automatskog računa, slanja obaveštenja ili izmišljenih kupoprodajnih potvrda.

Statusi: `new`, `reviewing`, `waiting_on_buyer`, `quote_draft`, `closed`. Quote je ISKLJUČIVO nacrt i ne šalje se korisniku kao konačna cena bez posebne ponude.

## Bezbednosne granice

- AppDeploy `requireAuth()` proverava identitet; admin rute dodatno koriste `requireAdminEmailAllowlist(ADMIN_EMAILS)` na serveru.
- `ADMIN_EMAILS` je **prazna lista** i mora ostati takva dok korisnik eksplicitno ne potvrdi TAČAN e-mail sa kojim se prijavljuje kao vlasnik. Nije bezbedno automatski dodeliti administraciju na osnovu javne kontakt adrese.
- Nema sopstvenog sistema za lozinke, nema `localStorage` tokena i nema klijentske provere admin statusa kao zamene za backend.
- Korisnikov izvorni slučaj dolazi samo iz tabele vezane za verifikovani `ctx.user.userId`. Autorovo izričito odobrenje je obavezno pre objave timu.
- ID predaje je deterministički iz `userId+caseId`: ponovljeni pritisci ne prave novi račun ili drugi zahtev.
- Kontrola konkurentnih izmena statusa proverava i prethodni status i `updatedAt`.
- Input validacija, bezbedan DOM prikaz preko `textContent`, otvaranje oglasa sa `noopener noreferrer`.
- Broj AI analiza (20 dnevno i 400 mesečno) ostaje nepromenjen u postojećem backend-u. Ovaj dodatak ne poziva AI.
- Podaci kupaca u zajedničkom inbox-u zahtevaju pregled i dopunu GDPR/DATENSCHUTZ dokumentacije: davalac usluge, rokovi čuvanja, brisanje, obrada e-pošte, prava pristupa.

## Primena u postojeći AppDeploy kod, a ne na drugi sajt

Trenutni AppDeploy snapshot: `1792610683309`.

Kada AppDeploy dozvoli novo objavljivanje:

1. Potvrditi e-mail vlasničkog naloga i dodati ga u `backend/admin.ts` → `ADMIN_EMAILS`. **Bez potvrde nema vlasničkog pristupa.**
2. U izvezenom projektu iste verzije pokrenuti:
   `node scripts/apply-to-appdeploy.mjs /putanja/do/izvezenog/AutoDanini`
   (skripta je u ovom folderu `scripts/` i automatski kopira server, HTML i TS i menja postojeću konfiguraciju i tekst privatnosti).
3. Isti izmenjeni fajlovi koriste se kao ulaz u `mcp__AppDeploy__deploy_app`, `app_id=auto-danini-import-b2b-p8swk5`, `app_type=frontend+backend`, uz obavezne AppDeploy instrukcije i API dokumentaciju.
4. Ne menjati `daninihub.com`, `autodanini.com`, Hostinger, Cloudflare ili DNS bez posebnog odobrenja.
5. Proveriti prijavu pravog administratora, odbijanje anonimnog/običnog naloga, kontrolu tuđih zahteva, idempotentno slanje, status/ponudu, GDPR, izvoz i ručno brisanje.

**Napomena o API-u:** admin UI koristi `api.put` na `PUT /api/admin/requests/:id`, usaglašeno sa dostupnim `@appdeploy/client` tipovima. Prijava korisnika koristi postojeće `auth.signIn()`.

## Minimalni prihvatni testovi pre javnog rada

| Test | Očekivani rezultat |
|---|---|
| Neregistrovani posećuje admin.html | Nema pristup ili podatke o korisnicima |
| Kupac pokušava GET /api/admin/requests | 403, bez curenja podataka |
| Vlasnik bez potvrđene adrese | 403 (sigurnosna blokada) |
| Vlasnik sa potvrđenom adresom | Samo on vidi inbox i menja statuse |
| Kupac sačuva zahtev | Zahtev ostaje privatan |
| Kupac izričito preda zahtev | Jedan zapis u inbox-u |
| Ponovi predaju istog zahteva | Isti id, bez duplikata |
| Administrator promeni status | Konkurentna izmena se odbija ako je status/timestamp zastareo |
| Plaćanje, depozit, ponuda na aukciji | Nema funkcionalnosti ili lažne potvrde |
| GDPR | Pre komercijalnog rada pravna provera i pravila brisanja |

## Sledeće funkcije, nakon admin modula

- Provera prodavaca i listing moderation; bez lažne verifikacije.
- Autorizovan B2B portal i log transakcija, audit trail, notifikacije.
- Naplata usluge odvojenim platnim servisom tek posle pravne i poreske provere.
- Aukcijski mehanizam kao deterministički transakcioni servis (AI pomaže da prepozna rizike, ne bira pobednika).

Ovaj PR je razvojni paket za postojeću AutoDanini aplikaciju. **Ne mergovati ga automatski u produkcioni DaniniHub**; postojeća GitHub `main` grana nije ista stvar kao sadašnja AppDeploy instalacija.

## Održavanje i hitni postupci za vlasnika

- [Operativni priručnik na srpskom](./OPERATIVNI_PRIRUCNIK_SR.md): kako prijaviti kvar bez programiranja, prioriteti, AI trošak, backup, rollback i bezbednost.
- [Skripta za javni uptime test](./scripts/check-public-sites.mjs): samo GET javnih stranica; ne troši AI tokene i ne obrađuje lične podatke.
- [Predlog GitHub Actions monitoringa](../../.github/workflows/autodanini-public-health.yml): pokreće se na 2 sata **tek posle merge-a u default granu**. Upozorenja GitHub-a moraju biti uključena; nije garantovan automatski e-mail/SMS.
- [Otvorene bezbednosne obaveze](https://github.com/danininet/daninihub/issues/60): kontrolna lista pre produkcionog lansiranja.
- Verzije aplikacije postoje u AppDeploy; 21.10.2026 aktivna je v12. Sama verzija aplikacije nije rezervna kopija korisničke baze.
