# AutoDanini — AI savetnik pod kontrolom troškova (2026-10-22)

## Promena napravljena danas
Na istoj razvojnoj grani PR #59 dodat je bezbedan **Hostinger Node.js** AI endpoint:
- `core/autodanini-ai-advice.js`: `POST /api/advice` se montira samo u odvojenom AutoDanini preview režimu.
- API se može koristiti isključivo kada važe **svi**: `NODE_ENV=production`, `AUTODANINI_PREVIEW_ENABLED=true`, `AUTODANINI_AI_ENABLED=true`, privatni `OPENAI_API_KEY`, stvarna MySQL baza i ispravan `DANINI_PUBLIC_URL`.
- Stroga kontrola Origin-a (isključivo naša domen/adresa). Potrebna izričita `consent=true` saglasnost iz postojećeg obrasca sa checkboxom.
- Ulaz 30–1000 znakova; tri režima `buyer/import/dealer`. Blokira česte oblike e-mail adresa, telefona i VIN identifikatora. To nije savršena DLP zaštita za sve formate ličnih podataka.
- Korišćen samo odabrani model `gpt-4.1-mini` (opciono `gpt-4o-mini`), **najviše 450 izlaznih tokena po odgovoru**.
- OpenAI Responses API, `store:false`, bez alata/web pretraživanja ili dodatnih agent poziva. Nikakva kupovina ili licitacija se ne izvršava automatski. Podaci korisničkog upita se ne čuvaju u našoj bazi; traženje odgovora od AI servisa podrazumeva prenos pitanja AI provajderu samo po saglasnosti.
- **Globalno 20 poziva na dan / 400 mesečno** za sve korisnike zajedno, atomarna kvota uz MySQL InnoDB `SELECT ... FOR UPDATE` i transakcije. Poseban javni per-IP limiter već postoji. Kvota se rezerviše *pre* slanja ka AI-u i **ne vraća se** pri grešci, kako kvarovi ne bi proizveli neočekivan trošak.
- Ukoliko DB ne radi ili je limit potrošen, **AI se odbija** i nijedan OpenAI poziv se ne pokreće. Naše `MAX_OUTPUT_TOKENS` ograničava output, ali trošak inputa i fiksnog sistemskog prompta i dalje postoji.
- `server.js` učitava `makeAIAdvice()` u Hostinger preview aplikaciji; postojeći backend i dva aktivna domena se ne menjaju.
- `autodanini/staging-v12/src/hostinger-client.ts` prikazuje **„AI savetnik u pripremi“** i onemogućava dugme dok `VITE_AUTODANINI_AI_ENABLED` nije eksplicitno true u odobrenom staging buildu. Layout i izvorni AppDeploy v12 dizajn ostaju isti.
- `tests/test-autodanini-ai-advice.cjs`: backend off-by-default, validacija pitanja, privatnost, UTC dan/mesec, paralelni pozivi pri granici 20, granica meseca 400, OpenAI `store:false`, token cap, pravi HTTP requesti sa simuliranom bazom, odbijanje stranog Origin-a i odbijanje naplate nakon 20 poziva.

## Nije uključeno
- `AUTODANINI_AI_ENABLED` je isključeno po podrazumevanom podešavanju. Nije podešen ili otkriven pravi OpenAI API ključ niti je obavljen naplatni AI poziv.
- Korisnik je na ChatGPT Plus; OpenAI API naplata je **posebna** od ChatGPT pretplate. Kodni kvotni limiti nisu zamena za dodatni API spend cap u OpenAI konzoli.
- Nije obavljena stvarna provera Hostinger MySQL/Brevo/HTTPS, backup-restore ili vizuelni screenshot parity na Hostingeru. Nije aktivirana produkcija niti DNS.
- Admin sa individualnom verifikacijom i MFA i dalje blokira javno puštanje. Nekoliko postojećih javnih endpoints treba dodatno testirati na hostingu.
- `calije.daninihub.com`, `kontakt@calije.daninihub.com`, `kontakt@daninihub.com` i postojeći Brevo ostaju neizmenjeni.

## Sledeći tehnički korak
Sledeće ozbiljno usko grlo je stvarno Hostinger hPanel staging okruženje sa zasebnim HTTPS probnim poddomenom, pravom MySQL bazom, privatnim env secrets i testovima koji imaju realnu Brevo dostavu i funkcionalne integracije. Bez pristupa hPanel operacijama ne tvrditi da je objavljeno.
