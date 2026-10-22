# AutoDanini — Hosting decision and project handoff, 2026-10-22

## Zaključak
NE kupovati novi hosting niti produžavati Hostinger bez provere tačnog postojećeg paketa i termina obnove. Ne plaćati AppDeploy Plus kao trajnu obavezu dok ne uporedimo punu migracionu cenu. Hostinger je prvi kandidat jer već postoji daninihub.com i prethodni hosting. Za buduću platformu sa aukcijama, agentima i stalnim procesima preporuka je razmatranje Hostinger KVM 2 (2 vCPU, 8 GB RAM, 100 GB NVMe), uz odgovorno održavanje. Kao rezervna opcija Hetzner CX33 (4 vCPU, 8 GB RAM). Ako su osnovne funkcije važnije od real-time aukcija, proveriti mogućnost Hostinger Business/Cloud Node.js.
## Verifikovana javna cena (22.10.2026, menja se)
Hostinger HR VPS KVM 2: 7,99 €/mes. promo uz unapred plaćen period; obnova 14,99 €/mes. Izvor https://www.hostinger.com/hr/vps-hosting
Hetzner CX33: 8,49 €/mes. bez PDV i IPv4. Izvor https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/
Hostinger web/cloud Node.js podržava GitHub deploy, ali ne prihvata inbound WebSockets i kontinuirane workers. Izvor https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/
Brevo Free: 300 e-mailova dnevno. Izvor https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan
Brevo inbound parsing/webhooks postoji, ali nije automatski mailbox. Izvor https://developers.brevo.com/docs/inbound-parse-webhooks

## Korisničke odluke / važeća ograničenja
- Želi najniži dugoročni ukupni trošak, profesionalnu AutoDanini platformu: korisnici, prodavci, oglasi, admin, Support, aukcije, AI agenti, rezervacije i buduća naplata.
- Postojeći domen daninihub.com kod Hostinger-a. Korisnik ranije naveo oko 140 EUR obnovu hostinga i termin oko 04.11.2026. TAJ IZNOS NIJE NEZAVISNO PROVEREN I NE ZNA SE TAČAN PLAN, DATUM NI PERIOD; proveriti fakturu/panel pre finansijske odluke.
- Brevo + API već postoje: ne nabavljati dodatni servis za outbound e-mail. Posebno rešiti inbound mailbox/reply, SPF/DKIM/DMARC, zasebne API ključeve i limitiranje slanja.
- Ne kupovati AppDeploy plus niti menjati DNS/host dok ne postoji plan migracije i backup. Ne vezivati nove korisnike na nezavršeni sistem.
- Novi domen autodanini.com: dostupnost i konačna cena tek kod registratora; kupovina isključivo po izričitoj korisničkoj radnji.
- Sam VPS zahteva održavanje, firewall, SSL, PostgreSQL + migracije, offsite encrypted backups i test vraćanja, monitoring, rate limit, transakcione uplate samo preko PCI payment provajdera. Hosting VPS cena ne uključuje AI API tokene ni payment fees.

## Dokle smo stigli tehnički
AppDeploy app_id auto-danini-import-b2b-p8swk5, aktivni v12 snapshot 1792610683309, URL https://auto-danini-import-b2b-p8swk5.v2.appdeploy.ai/
GitHub danininet/daninihub, grana feat/autodanini-admin-desk-20261021, PR #59, pripremljena razvojna kopija autodanini/staging-v12.
GitHub preflight i structural audit prošli nakon ispravke unsupported @appdeploy/client lokalnog Vite build-a; NISU dokaz da je SDK build/e2e prošao.
Admin routes i submisije postoje samo u razvojnoj grani. ADMIN_EMAILS = [] (fail-closed); vlasnički sign-in nije potvrđen. Support API je nepotpun, Support HTML i frontend nisu završeni. Backup/restore, GDPR i stvarni integracioni/bezbednosni testovi nisu potvrđeni.
Pokušaj deploymenta admin+support prethodno blokiran platformskim sigurnosnim proverama. Ne pokušavati zaobilaženje.
Security GO/NO-GO lista: autodanini/staging-v12/SECURITY_GO_NO_GO_2026-10-22.md. ODLUKA NO-GO za novu javnu verziju.
Produkcioni DNS se NE menja bez migracionih testova i posebne korisničke saglasnosti.

## Naredni konkretni koraci
1. Proveriti preko Hostinger naloga ili korisnikove fakture: naziv aktivnog paketa, server/Node podrška, cena i period obnove, datum isteka, broj aktivnih domena/sajtova, opcije upgrade/migracije i popust na postojeću uslugu. Ne ponavljati pitanja ako račun/odgovor već dostupan.
2. Izmeriti migracione troškove AppDeploy SDK: auth, database, AI i upload, i odlučiti između zadržavanja do prvih kupaca i prelaska na Hostinger VPS. Ne predstavljati copy-paste kao moguću migraciju.
3. Definisati troškovne plafone po korisniku i agentu, broj korisnika/bidova, DB ograničenja, zaštitu od abuse i B2B/buyer first flow; prvo plaćena ekspertiza, potom aukcija.
4. Za support završiti server + frontend + admin odgovore + bezbednosne testove, i obaviti end-to-end QA; owner allowlist uneti tek nakon autentifikovanog identiteta.
5. Pripremiti rizično neutralnu marketinšku kampanju najave; bez tvrdnje da nepostojeća aukcija radi.

Korisnik je tražio: 'sačuvaj dosadašnji rad i zapamti gde smo stali.' Ovaj fajl predstavlja operativni handoff u GitHub-u.
