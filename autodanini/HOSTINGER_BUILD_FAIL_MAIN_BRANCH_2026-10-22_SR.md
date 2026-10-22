# AutoDanini / Hostinger — konkretna dijagnostika `Build fehlgeschlagen` (22.10.2026, 19:16)

## Podaci potvrđeni u hPanelu od vlasnika
- Web App: `auto.daninihub.com` (Node.js), GitHub povezan sa repozitorijumom `danininet/daninihub`.
- Oba neuspešna Hostinger deployment-a 22.10.2026 u 19:08:51 i 19:16:57 čitala su **Zweig=main** i commit **`eee98ea9d0ed247f27acda770234fc6c4778a9cb`**.
- To NIJE AutoDanini v12 funkcionalna grana. U `main` ne postoje `autodanini/staging-v12` niti `scripts/build-autodanini-hostinger.js`.
- **Tačan razlog build greške nije poznat bez Hostinger Build logs**. Pogrešna grana sprečava objavu nove AutoDanini verzije čak i ako bi build uspeo.

## Testiran ispravan izvor
- `danininet/daninihub` → `feat/autodanini-admin-desk-20261021`.
- `package.json`: build komanda **`npm run build:autodanini-hostinger`**; start komanda **`npm start`** → `node server.js`; project root `.`.
- `scripts/build-autodanini-hostinger.js` sada eksplicitno koristi `npm install --include=dev` unutar frontend foldera: važna zaštita kad Hostinger ima `NODE_ENV=production`, jer je Vite devDependency.
- GitHub Actions na commit `4348acb57cb8212437c03c046af13dadbd9e6d07`: svih pet provjera SUCCESS, uključujući Hostinger visual-parity build sa `NODE_ENV=production`. To nije potvrda Hostinger runtime-a; samo da su kod i frontend build spremni za staging.

## Koraci bez promene aktivnih sajtova
1. `Hostinger → Websites → auto.daninihub.com → Dashboard → Deployments / Einsätze`. Pre promene otvoriti jednu `Build fehlgeschlagen` stavku strelicom `❯` → `Build logs`; sačuvati samo završnih ~40 redova sa greškom, bez ključeva i lozinki. Hostinger dokumentacija: https://www.hostinger.com/support/how-to-troubleshoot-a-failed-node-js-deployment-using-build-logs/
2. Zatim `Einstellungen und erneut bereitstellen` / `Settings & redeploy`. `main` zameniti granom `feat/autodanini-admin-desk-20261021`, bez menjanja repozitorijuma. Ako nema selektora grane u redeploy koraku, pogledati povezani GitHub repozitorijum u Dashboard podešavanjima. Hostinger opisuje promenu repository connection preko Dashboard ⋮ → Change repository i izbor grane u novom povezivanju; uraditi samo na izdvojenoj `auto` Web App, NE na postojećem glavnom `daninihub.com` projektu. Ne brisati Web App.
3. Node.js 22, Express / Other; root `.`. Build script `npm run build:autodanini-hostinger` (ne `npm run build`); start `npm start` ili `node server.js`. Ako hPanel dozvoljava samo izbor sa spiska, skripta postoji u `package.json` nakon izbora prave grane.
4. `Umgebungsvariablen` — privatno kroz hPanel, bez deljenja vrednosti u razgovoru: `NODE_ENV=production`, `AUTODANINI_PREVIEW_ENABLED=true`, `DANINI_PUBLIC_URL=https://auto.daninihub.com`, DB_HOST/DB_USER/DB_NAME/DB_PASSWORD iz odvojene testne MySQL baze; `DANINI_IMPORTOS_CHECKOUT_ENABLED=false`, `DANINI_IMPORTOS_SERVICE_PAYMENTS_ENABLED=false`, `AUTODANINI_AUTH_ENABLED=false`, `AUTODANINI_ADMIN_ENABLED=false`, `AUTODANINI_SUBMISSIONS_ENABLED=false`, `AUTODANINI_AI_ENABLED=false`, `VITE_AUTODANINI_AUTH_ENABLED=false`, `VITE_AUTODANINI_ADMIN_ENABLED=false`, `VITE_AUTODANINI_AI_ENABLED=false`, `VITE_AUTODANINI_SUBMISSIONS_ENABLED=false`. Ne treba kupovati novo e-mail sanduče; postojeći Brevo ostaje netaknut.
5. Pokrenuti `Redeploy` samo na `auto.daninihub.com`; zabeležiti novi commit i status. Ako Build uspe, ali aplikacija ne startuje, otvoriti `Laufzeitprotokolle` i proveriti `/health` — program odbija produkciono pokretanje ako baza nije ispravna (namerno, ne isključivati zaštitu).
6. Nikako ne objavljivati na `daninihub.com`, ne brisati `calije.daninihub.com`, ne menjati MX/SPF/DKIM, ne uključivati Stripe/PayPal ili administratora pre stvarnog testiranja.

## Šta treba proveriti u Build logs
- `npm ERR!` ili `ERESOLVE`: instalacija/zavisnosti.
- `vite: not found`: build devDependencies (izmena `--include=dev` pripremljena).
- `Missing script`: Hostinger koristi pogrešnu granu ili pogrešnu build komandu.
- `ENOENT` / `package.json not found`: pogrešan root.
- `error TS` / `Failed to resolve`: frontend TypeScript/dependency.
- Bez Build logs ne tvrditi da je neko od ovoga stvarni uzrok.
