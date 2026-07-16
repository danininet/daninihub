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
