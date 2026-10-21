# AutoDanini v12 — provera kompatibilnosti pre integracije
Provereno 21.10.2026 kroz AppDeploy src_read/source snapshot `1792610683309` (aktivan v12).

## Utvrđene činjenice
- `backend/index.ts` ima `export const handler = router({` i osnovne korisničke API rute `/api/my-cases`, `/api/my-profile`, `/api/advice`.
- `src/account.ts` ima `import { api, auth } from '@appdeploy/client'`, prikaz privatnih slučajeva i izraz `actions.append(whatsapp,remove);` na mestu umetanja dugmeta za predaju.
- `vite.config.ts` je multi-page Vite, stranica `admin` trenutno nije uključena.
- `src/styles.css` sadrži `@tailwind utilities;`.
- `tests/tests.json` ima 5 testova koje postojeća skripta zamene očekuje.
- Aktivni izvor ima korisnički sistem, ali NE sadrži objavljeni `backend/admin.ts` niti `admin.html`.
- Izvorni kod dozvoljava ciljani razvojni postupak za PR #59; to nije potvrda uspešnog build-a ili rada u produkciji.

## Bezbedni integracioni koraci
1. U posebnoj kopiji istog AppDeploy v12 snapshota primeniti sadržaj iz `autodanini/appdeploy-admin`.
2. Potvrditi da `privacy.html` sadrži očekivani marker pre pokretanja skripte. Održati vlasničku allowlist praznom dok vlasnik ne potvrdi tačan e-mail korišćen za prijavu.
3. Testirati TypeScript i backend API prema zvaničnoj AppDeploy SDK dokumentaciji; potvrditi ponašanje transakcija i autentifikacije.
4. Ugraditi novu stranicu i korisničko dugme. Proveriti da kupac ne vidi interne nacrte ponuda.
5. Objaviti NA ISTI app id samo kada deployment krediti dozvole i prethodne provere prođu.
6. Posle objave testirati anonimni 401/403, običnog korisnika 403 na admin API, owner inbox, slanje sa eksplicitnom saglasnošću, ponovljeno slanje bez duplikata, bez plaćanja.

Ovaj zapis ne otključava admin pristup, ne aktivira monitoring i ne menja domen ni bazu.
