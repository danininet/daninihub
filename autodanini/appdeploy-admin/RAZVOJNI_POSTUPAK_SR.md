# AutoDanini — razvoj bez nepotrebnih AppDeploy objava
Status: razvojna grana, nije nova platforma i ništa nije automatski objavljeno.

1. Kod se menja na zasebnoj GitHub grani i otvara se PR, bez menjanja produkcionog `main` sadržaja.
2. GitHub Actions preflight proverava osnovne zaštitne uslove za pripremljeni admin dodatak. To su statičke kontrole, NISU zamena za TypeScript build, SDK validaciju i end-to-end testove.
3. Kada dobijemo izvornu aplikaciju AppDeploy verzije v12 i dokumentaciju odgovarajućeg SDK-a, spojiti izvoz sa već pripremljenim dodatkom; pokrenuti `npm ci` i `npm run build` samo ako postoje projekat i lockfile; zatim testove autorizacije, obrade zahteva i zaštite privatnih podataka.
4. NIKAD ne menjati `ADMIN_EMAILS=[]` bez izričite potvrde tačne adrese prijavljenog vlasnika. Ne objavljivati servis sa navodnom operativnom admin prijavom bez verifikacije.
5. Tek kad sve prođe, poslati jedan pregledani paket izmena na ISTI AppDeploy app ID. Ne dirati DNS/domen/hosting ili produkcionu bazu.
6. Nakon deploy-a testirati javne stranice, stvarnu prijavu, izolaciju naloga, admin 403 za običnog kupca, identično podnošenje bez dupliranja, nadzor i obaveštenja. Ako testovi nisu kompletni, ostaje razvojna verzija.
7. Nadzor GitHub Actions na svaka dva sata može se aktivirati tek kada je workflow u default grani; proveriti kanal za obaveštenja. Nema garancije da samo workflow šalje SMS.
8. Odvojeni backup baze i restauracija nisu potvrđeni; ne tvrditi da postoje. Rollback koda ne vraća bazu podataka.

Preflight pokreće: `node autodanini/appdeploy-admin/scripts/check-source.mjs`. Ne troši AppDeploy objavne kredite niti poziva AI.
