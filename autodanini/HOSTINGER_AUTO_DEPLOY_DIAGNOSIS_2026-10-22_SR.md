# AutoDanini — dijagnostika Hostinger auto-deploy-a, 22.10.2026

## Potvrđene činjenice
- `danininet/daninihub` ima default granu `main`.
- Vlasnikov Hostinger ekran za `auto.daninihub.com` pokazuje Node.js Web App sa GitHub integracijom, **Zweig: main**, i failed build za commit `eee98ea9` (19:08 i 19:16 lokalno 22.10).
- Nova AutoDanini V12 + zaštita naloga/admina/23 stranice razvija se na `feat/autodanini-admin-desk-20261021`, koja je u otvorenom PR **#59**, sa 103 promenjena/dodata fajla u odnosu na main. Nije spojena u main; ranije eksplicitno označena da se NE spaja automatski u DaniniHub produkciju zbog privatnosti, staging i nedovršenih E2E testova.
- **Hostingerov bot je 22.10.2026 u komentaru na PR #59 potvrdio automatski preview:** https://github.com/danininet/daninihub/pull/59#issuecomment-6326104426
- Hostingerov prijavljeni preview URL: **https://lemonchiffon-parrot-485572.hostingersite.com/**. Bot kaže: svaki push na feature branch automatski startuje nov build; komentar prikazuje commit **`7a05f37`** sa oznakom **Oct 22, 2026 17:32 UTC**.
- Ovaj preview i `auto.daninihub.com` su **DVA različita Hostinger deployment-a**, iako se oba odnose na isti GitHub repo: preview čita PR branch, a auto.daninihub.com povezan je na main.
- Pokušaji nezavisnog internet read-only učitavanja preview root/admin/health iz ovog AI okruženja nisu bili uspešni (web tool: not accessible, Exa: CRAWL_NOT_FOUND). Zato **ne tvrdimo da preview frontend ili stvarna MySQL prijava trenutno radi u pregledaču**; Hostinger bot potvrđuje automatizovan build i URL, ne E2E SQL/Brevo uspeh.

## Uzrok i bezbedan pristup
Auto deploy **radi**: Hostinger preuzima main, a Hostinger bot automatski pravi preview za PR. Problem je organizacija grana i odvojeni ciljevi objavljivanja, ne prekid GitHub integracije. Stara `main` build komanda je pozivala lokalne HTTP regresione testove pa Hostinger build padao. Popravka `npm run build` / izolovani testovi uvedeni su samo na feature branch i 5/5 GitHub Actions su prošli.

**NIKAD ne mergovati 103 fajla iz PR #59 u `main` samo da bi se naterao automatski deployment.** Main se može koristiti za druga već postojeća produkciona okruženja; bez Hostinger env, MySQL, Brevo, legalnog/cookie/gdpr testa i owner MFA ne smemo napraviti incident. Takođe ne menjati DNS, MX, `daninihub.com`, `calije.daninihub.com`, niti plaćanja.

Korisnik može automatski pogledati Hostinger PR preview bez ručnog GitHub→Hostinger redeploy: https://lemonchiffon-parrot-485572.hostingersite.com/. Ako URL nije dostupan ili pokazuje grešku, proveriti Hostinger preview Build/Runtime logs jer ovde nema prava nad hPanelom.

Za **stalno** prikazivanje te nove verzije na `auto.daninihub.com` biće potrebna **jednokratna, izričito odobrena odluka**: promena branch-a u Hostinger za samo tu web-app sa main na feature, ili bezbedno i odobreno izdanje/merge u main kada bude spremno za sva povezana mesta. Ne vršiti prvu varijantu preko povezane Hostinger Mail app (ne podržava hosting kontrolu); ne raditi drugu bez produkcionog GO.
Hostinger zvanično dokumentuje automatski preview iz PR i automatski build na push: https://www.hostinger.com/support/how-to-use-pull-request-previews-for-node-js-websites-in-hostinger/
