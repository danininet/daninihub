# AutoDanini v12 — originalni dizajn + Hostinger test

**Izvorni dizajn, navigacija, stranice i CSS ostaju identični postojećoj AppDeploy v12 verziji.** Na grani `feat/autodanini-admin-desk-20261021` postoji poseban Hostinger adapter; originalni AppDeploy build ga ne koristi.

## Šta je sada tehnički potvrđeno
- GitHub Actions **AutoDanini Hostinger visual-parity build (staging only)**: SUCCESS, run 39772506875 (22.10.2026).
- 23/23 originalnih HTML stranica se izgrade, stroga TypeScript provera prolazi, `@appdeploy/client` nije u izgrađenom JS-u. Skup CSS/HTML nije redizajniran.
- GitHub Actions **AutoDanini Hostinger startup regression tests**: SUCCESS, run 39772507040.
- GitHub Actions **DANINI ImportOS Core**: SUCCESS, run 39772506789.
- Spreman je CI artifact `autodanini-v12-hostinger-staging` (privremen, do 29.10.2026). Build **nije objavljen na javni domen**.
- Probne stranice imaju `noindex`, korisnički nalog/prijava nisu omogućeni, nema stvarne Stripe naplate ni aktivnih aukcija. AI dugme poziva `/api/advice` samo ako naš server obezbedi tu rutu; trenutni backend je nije implementirao, zato AI savetnik nije aktivan.

## Komanda za pripremu na GitHub/Hostinger staging
Iz korena repozitorijuma:
```bash
npm ci
npm run build:autodanini-hostinger
```
Ishod: `autodanini/staging-v12/dist/` sa 23 stranice. Postojeći glavni `npm run build` nije menjan: stari DaniniHub i testovi ostaju bez promene.

U posebnoj testnoj Hostinger Node.js aplikaciji (NIKADA na živom glavnom sajtu) moguće je uključiti `AUTODANINI_PREVIEW_ENABLED=true`. Tada `server.js` isporučuje ovaj statički prikaz umesto starog `mountPublicRuntime`; API i /health ostaju aktivni. Za produkcioni Node režim obavezna je zasebna, funkcionalna MySQL baza, pravilan privremeni `DANINI_PUBLIC_URL=https://<testni-host>`, i oba checkout prekidača `false`. Sve tajne vrednosti unositi isključivo u Hostinger sigurnu konfiguraciju, nikako u GitHub.

**Važno**: Nije testirano na stvarnom Hostinger nalogu niti su prebacivani korisnički podaci. Ne menjati glavni DNS ili čalijski poddomen radi ovog pregleda. Poseban testni host je privremen i nije treći javni projekat.

## Preostale obavezne prepreke pre objavljivanja na daninihub.com
1. Implementirati Hostinger-kompatibilnu prijavu korisnika i administratora sa proverom sesije, ovlašćenja, MFA i vlasništva nad dosijeima; sadašnje privremeno zaključavanje admina ostaje.
2. Bezbedno implementirati `/api/advice` sa server-side autentifikacijom/ograničenjem poziva, troška i zloupotrebe; ili privremeno sakriti funkciju na javnom sajtu bez lažnih obećanja.
3. Završiti Support Center, pravne tekstove, potvrđivanje Stripe naloga i sve poslovne procese pre aktiviranja plaćanja.
4. Napraviti i proveriti kompletan backup sadašnjeg `daninihub.com`, sa bazom, fotografijama, postojećim URL-ovima, SEO preusmerenjima i povratkom na staru verziju.
5. Tek posle punih E2E i bezbednosnih provera ukloniti `noindex`, podesiti canonical/hreflang/sitemap i javno prebaciti `daninihub.com`.
6. `calije.daninihub.com` i njegova pošta/DNS ostaju potpuno netaknuti.

## Važeći domeni
- `daninihub.com` — konačni AutoDanini, **još nije zamenjena živa stranica**.
- `calije.daninihub.com` — Čalije Parking i zakup, ostaje aktivan.
