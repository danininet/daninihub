# AutoDanini — GO / NO-GO security audit
Datum: 2026-10-22. Cilj: javno objavljivanje Admin + Support dodatka na postojeći AppDeploy app `auto-danini-import-b2b-p8swk5`.

## Odluka: NO-GO za novu verziju
Aktivna v12 je u statusu ready, bez grešaka u prikazanom QA snapshotu. To NE validira novu razvojnu granu. GitHub staging/source checks prolaze, ali nisu SDK build, niti penetracioni ili integracioni test.

### Blokade pre objave
1. **Admin identitet:** `backend/admin.ts` i `backend/support.ts` imaju `ADMIN_EMAILS=[]`. To bezbedno blokira neovlašćene, ali i stvarnog vlasnika. Potrebna izričita potvrda identiteta naloga koji stvarno koristi AppDeploy sign-in. Ne koristiti javnu kontakt adresu po automatizmu.
2. **Support incomplete:** staging `backend/support.ts` ima create/list/admin list, ali nema PUT rutu za status ili odgovor. Korisnički `support.html` i `src/support.ts` nisu prisutni u staging-u. Ne predstavljati support kao funkcionalan.
3. **Podaci:** nema potvrđenih odvojenih backup-a, rutine restore ili GDPR brisanja, retention pravila za support i korisničke zahteve.
4. **Bezbednosni testovi:** nedostaju negativni API testovi anonimni/obični admin, cross-user access, CSRF/abuse/rate limits; integracija nije potvrđena u AppDeploy SDK runtime.
5. **Support data integrity:** postojeća podrška duplira tikete u korisničku i adminsko-inbox tabelu bez definisanog atomskog protokola za promenu statusa i sinhronizaciju odgovora. Nema potvrđene sigurne obrade idempotentnog ponavljanja.
6. **Opservabilnost:** GitHub uptime workflow nije potvrđen aktivnim na default grani; nije verifikovana isporuka upozorenja.
7. **Komercijalne funkcije:** nema potvrđenog platnog provajdera, refundacija, pravne dokumentacije za aukcije i verifikacije prodavaca. Ne uključivati ih u lansiranje.

### Potrebno za GO
- Potvrditi vlasnički login e-mail; allowlist samo potvrđeni identitet.
- Napraviti UI i API za Support; administrativni odgovor i status sa proverom prava; jednotabelni ili pouzdani sinhronizovani tok i paginacija.
- Testovi autentifikacije, izolacije korisnika, dvostrukog slanja, i promene statusa.
- Proveriti AppDeploy build i end-to-end QA, zatim ručno proveriti na test nalogu.
- Sačuvati bezbednu rezervnu kopiju, isprobati vraćanje; dokumentovati GDPR podatke i brisanje.
- Aktivirati i testirati kanal upozorenja o kvarovima.
- Izvršiti jedan kontrolisani deploy na isti app ID, proveriti verziju i 5 glavnih korisničkih tokova.
- Bez promene domena/DNS, online naplate ili aukcija.

Ovaj audit nije bezbednosni sertifikat. Status GO se može dati samo na osnovu izvršenih i zapisanih testova, ne na osnovu samog koda.
