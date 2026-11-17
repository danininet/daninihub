# DANINI P0 — Inventar pravnih tekstova i odobrenja (17.11.2026)

**Status: radni audit, nije pravna revizija.** Ovaj dokument ne menja javne pravne stranice.

## Postojeće pravne putanje za proveru nakon deploy-a
- DE/SR Impressum: `/de/impressum/`, `/sr/impressum/`
- DE/SR Datenschutz: `/de/datenschutz/`, `/sr/datenschutz/`
- DE/SR AGB: `/de/agb/`, `/sr/agb/`
- Istorijske AutoDanini putanje: `/impressum`, `/privacy`, kao i ranije `.html` varijante. Status i aktuelni sadržaj tih stranica moraju se zasebno potvrditi HTTP/browser testom.

## Materijali pripremljeni u PR #237
- Šest različitih modela dokumenata, svaki na DE/SR, pod `/de|sr/wissen/dokumente/<slug>/`; svi su označeni kao neodobreni radni nacrti i imaju `noindex`.
- AutoDanini usluga se odnosi na dostupne podatke, a ne na kupoprodajni ugovor između kupca i prodavca ili tehnički pregled vozila.
- DANINI Business SOW sadrži predmet, isporuke, faze, testiranje, uslove prihvatanja i ljudsko odobrenje.

## Obavezna pravna kontrola pre stvarnog ugovaranja
1. Potvrditi identitet, registrovani status, poslovnu adresu i obavezne Impressum podatke. Ne dodavati nepostojeći Handelsregister ili USt-IdNr.
2. Validirati detalje usluge, ukupnu cenu, fakturisanje, obim odgovornosti, reklamacije i pravila raskida.
3. Za B2C ugovore posebno proveriti pravo na odustanak (Widerruf), obaveštavanje i eventualne uslove početka izvršenja digitalne usluge; ne pretpostavljati automatski gubitak prava.
4. Za B2B obradu ličnih podataka klasifikovati uloge (Auftragsverarbeiter/Verantwortlicher), proveriti da li je potreban AVV prema čl. 28 DSGVO, kategorije podataka, podizvođače, rokove čuvanja, pristup i brisanje.
5. Proveriti postojeći javni Datenschutz u odnosu na stvarno korišćene Cloudflare, Brevo, Gmail i AI tokove. Evidencija iz 09.11. ne dokazuje status 17.11.
6. AGB tek nakon finalne pravne provere; ne preneti generičke formulacije kao obavezujuće uslove.
7. Potvrditi jezičku i pravnu konzistentnost DE/SR primeraka, prava potrošača i važeće nemačke propise.

**Odobrenje potrebno:** pojedinačna sadržinska potvrda konačne verzije ugovornih nacrta i po potrebi stručni pravni pregled. Opšte odobrenje tehničkog deploy-a ne zamenjuje stručni pregled pravnih obaveza.

**Kontrolni izvori:** [DDG](https://www.gesetze-im-internet.de/ddg/), [BGB](https://www.gesetze-im-internet.de/bgb/), [DSGVO](https://eur-lex.europa.eu/eli/reg/2016/679/oj).
