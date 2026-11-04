# Catalog reconciliation technical pilot

This branch adds an isolated, deterministic supplier-versus-catalog comparison. It does not mount a route in `server.js`, change the production site, call AI providers, accept payments, send email, or write to a customer store.

## Runnable components

- `npm run test:catalog` — parser, reconciliation, export safety, persistence, authorization, approval, concurrency and HTTP journey tests.
- `npm run build:catalog` — browser-local preview in `catalog-pilot-dist/`.
- `npm run pilot:catalog` — optional isolated loopback API, with a separately configured `DANINI_PILOT_ADMIN_SECRET` of at least 32 characters. Never expose that secret to the browser. The command uses an isolated file store, not production database credentials.

The preview processes two CSV strings locally. It is not connected to the optional server API. Saving in this browser is opt-in. A page reload resumes and revalidates the saved input and result. Downloaded project JSON is a backup artifact; importing backups is not implemented. Local project expiry is checked when opening the page; it is not background deletion.

## Contract

Both files must provide `sku,title,price,currency,stock`, explicit comma/semicolon delimiter and decimal mark, at most 500 data rows and 256,000 characters per input. Commercial scope is a separate decision; the technical cap is not an offer. Extra columns are ignored. Values are trimmed on ingestion; change records compare trimmed values. Currency validation checks three uppercase letters, not membership in ISO 4217. Duplicate SKUs, unmatched target SKUs and invalid/ambiguous source records never enter the draft. Source-only products are reported, not silently inserted. Every target row is reconciled to a draft or an exclusion. Numerically equivalent but differently formatted values are included in the change log. CSV exports neutralize formula prefixes, so a reviewer must check intended literal values before any import.

Source authorization and real-world accuracy are customer assertions. This tool does not establish truth, legal compliance, supplier reliability or successful import into Shopify/WooCommerce. The five-column draft is a review artifact, not a platform-specific import file. There are no translations, images, variants, legal claims or automatic publication.

## Execution and evidence

The API reuses `ImportOSStore`, case-token hashing and timing-safe verification:

`QUEUED -> VALIDATED -> REVIEW_REQUIRED -> READY -> DELIVERED`

Each step records a versioned event; compare-and-swap prevents conflicting updates. Approval binds the current version, result hash and a nonempty reviewer note. A project capability token gates reads and download. Creating, advancing, approving and listing jobs require the owner secret. Restart resumes persisted state. Delivery is idempotent and checks result integrity. `DELIVERED` means download prepared; it does **not** prove receipt, customer acceptance or payment. Payment is always `NOT_CHARGED`.

## Boundaries before a paid multi-user release

The API is a development pilot, not a hosted service. Its file adapter is only safe for this single-process scenario. Project tokens are not authenticated user accounts or complete tenant isolation. Admin access is a shared-secret API, not a production admin panel. The browser preview has no server identity and its local approval is not an authenticated signature.

Still required: authenticated users and tenant-scoped database authorization; fail-closed durable database configuration; authenticated admin UI and reviewer roles; a durable job runner with retry/lease/error ledger; actual payment-provider sandbox and webhook verification; deduplicated transactional email and private delivery; retention deletion job; encrypted backup and tested restoration; observability, abuse limits and privacy/legal review. Seven-day API access expiry is enforced, but automatic deletion of stored records is not implemented. There is no autonomous background execution in the browser.

Current model calls, input tokens, output tokens and API spend are exactly zero. A future language-model mentor must preserve the constitution's decision/utility/governance distinction and must not fabricate tool completion. The retrieved master collection specifies four decision cycles, while later references mention a different limit; confirm the canonical policy version before enabling public decision sessions. Do not count a deterministic stage as an active LLM agent.

## Validation

15 dedicated tests pass locally, alongside the existing nine regression commands and existing build. The HTTP test creates only synthetic records and verifies that checkout returns `PAYMENTS_DISABLED`. This is **not** a Stripe or PayPal sandbox transaction. The browser demo is explicitly synthetic.

A separate owner-private static preview may be prepared from this source. It contains no customer data, business records, credentials or production API connection. Production deployment and merging remain outside this change.
