# Danini OS — production environment

Required Hostinger environment variables for the sellable `Die KI fragt nach` workflow.

```env
DANINI_PUBLIC_URL=https://daninihub.com
DANINI_SESSION_SECRET=<random-secret-minimum-32-characters>
DANINI_ACTIVATION_SECRET=<random-internal-activation-secret>

GEMINI_API_KEY=<gemini-api-key>

GUMROAD_ENTRY_URL=<published-gumroad-product-url>
GUMROAD_PING_SECRET=<random-gumroad-ping-secret>
GUMROAD_PRODUCT_ID=<gumroad-product-id>
# Alternative to GUMROAD_PRODUCT_ID:
# GUMROAD_PRODUCT_PERMALINK=<gumroad-product-permalink>

BREVO_API_KEY=<brevo-api-key>
BREVO_SENDER_EMAIL=info@daninihub.com
BREVO_SENDER_NAME=DaniniHub

# Transport lead review and manually approved Brevo follow-up
DANINI_ADMIN_SECRET=<random-secret-minimum-32-characters>

# Optional: published DE/SR Pilot Brief. Until configured, the public pilot example is used.
DANINI_PILOT_BRIEF_DE_URL=https://daninihub.com/de/pilot-beispiel
DANINI_PILOT_BRIEF_SR_URL=https://daninihub.com/sr/primer-pilota

# Durable lead storage. Without a complete DB configuration, the runtime uses a local private file.
DB_HOST=<mysql-host>
DB_PORT=3306
DB_USER=<mysql-user>
DB_PASSWORD=<mysql-password>
DB_NAME=<mysql-database>
```

Gumroad Ping endpoint:

```text
https://daninihub.com/webhooks/gumroad/ping?secret=<GUMROAD_PING_SECRET>
```

Production readiness endpoint:

```text
https://daninihub.com/health
```

Required `health` values:

- `guidedAnalysis.sessionSecurityConfigured: true`
- `guidedAnalysis.modelConfigured: true`
- `gumroad.checkoutConfigured: true`
- `gumroad.pingSecretConfigured: true`
- `gumroad.productConfigured: true`
- `gumroad.deliveryConfigured: true`
