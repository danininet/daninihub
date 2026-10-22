# AutoDanini + DaniniHub — provider comparison, 22 October 2026

User priority: total long-term cost, not promotional price. Two domains/projects, AutoDanini marketplace with seller identity, listings, bidding/auctions later, customer/admin/Support, Stripe payments (currently connected Stripe Buymeacoffee TEST MODE only), Brevo existing API, future AI workers; DaniniHub plots rental site. Existing Hostinger Business renewal ~140 EUR (user provided), deadline ~4 Nov. 2026; do not request this again.

## October 2026 official/public price evidence (verify checkout and availability)
| Provider SKU | vCPU | RAM | storage | advertised cost | source |
| Hetzner CX33 | 4 | 8 GB | 80 GB | 8.49 EUR/month excluding VAT, + IPv4 fee | https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/ |
| Hetzner CX23 | 2 | 4 GB | 40 GB | 5.49 EUR/month excluding VAT, + IPv4 | same |
| Hetzner CX43 | 8 | 16 GB | 160 GB | 15.99 EUR/month excluding VAT, + IPv4 | same |
| Contabo Cloud VPS 4 | 4 | 8 GB | 100 GB SSD | $5.28/mo listed incl VAT for promotional conditions; verify region, term, setup | https://contabo.com/en/pricing/ |
| Netcup VPS 1000 G12.5 | 4 | 8 GB | 128 GB SSD | 14.50 EUR/mo ex VAT 12-month contract | https://www.netcup.com/en/server/vps |
| IONOS VPS L+ | 4 | 8 GB | 240 GB | $8/mo FIRST THREE MONTHS on one-year term (non-promo listed $25/mo); US quote not Serbia/Germany quote | https://www.ionos.com/servers/vps.html |
| DigitalOcean Basic 4vCPU/8GiB | 4 | 8GB | 160GiB | $48/mo | https://www.digitalocean.com/pricing/droplets |
| Railway Hobby | usage based | usage based | usage based | $5 minimum monthly usage, resources metered; not a flat 8GB VPS | https://railway.com/pricing |
| Hostinger KVM 2 | 2 | 8GB | 100 GB NVMe | advertised promo pricing may depend on region/term, renewal substantially more, verify cart | https://www.hostinger.com/vps-hosting |

Hetzner CX33 is tentative price/performance recommendation but some recent reports said CX stock could be unavailable; confirm stock. Contabo best *advertised price* but check fair-use performance, billing and support; Netcup good fallback, more expensive. DO and Railway more expensive for always-on workload, but could reduce complexity if choosing PaaS. Never claim infrastructure cost covers full platform.

## Detailed hosting choice
Candidate 1: Hetzner CX33 + self-hosted Coolify (free/open source), Dockerized Node app, PostgreSQL, Redis/worker, reverse proxy/TLS, secrets, offsite backups; supports multiple domains and full software architecture. Coolify supplies deployment and management tools but NOT security patching, tested backups, legal compliance or app development. Source https://coolify.io/docs/core/what-is-coolify
Candidate 2: Hostinger KVM2 + Coolify, smoother existing vendor relationship but less CPU and higher renewal potential.
Candidate 3: Contabo Cloud VPS4 + Coolify lower cost if reliable performance tested; netcup alternative.
Run own CPU and disk tests before moving customer traffic.
2026 Hetzner CX33 base annual ~101.88 EUR excl VAT/IPv4; if 19% German VAT applied ~121.24 EUR + IPv4 and backups (actual tax based on billing country). Additional .com domain and AI API separately. Initial migration and operating labor can outweigh yearly hosting savings.

## Architecture and compliance
- Domain registration remains independent, preserve daninihub.com at Hostinger while site runs elsewhere, buy autodanini.com separately if free.
- ONE VPS can host both sites during pilot. Separate app containers, databases/users, secrets and rate limits. Start 8GB RAM and resize based on metrics.
- Existing AppDeploy v12 preview isn't portable by copying code alone; proprietary auth, db and AI SDK need adapters/migration. GitHub PR #59 staging is not production; Security NO-GO.
- Do not switch DNS before full testing, backup and restore, SPF DKIM DMARC preserved, staged cutover.
- Stripe 'Buymeacoffee' connected account livemode=false, cannot assume production checkout. Brevo API already exists; no extra SMTP provider required for outbound. Inbound customer replies need mailbox (Hostinger mailbox kontakt@calije.daninihub.com exists).
- Auctions require transactional persistence, buyer/seller verification, bidding concurrency, dispute workflows, logs and legal terms. Do not ship before tests.
- AI agents: quotas/token budgets, separate asynchronous workers, alerts on abuse and retries.
- Operational responsibility for Linux updates, alerting, offsite encrypted backups + restoring cannot be skipped because owner isn't programmer.

## Resume / next work
Compare Hetzner stock/order final incl VAT/IPv4/backups vs Hostinger Business renewal ~140/year and Hostinger KVM2 final, Contabo/Netcup alternatives. Audit DaniniHub source/database, prepare containerized local staging with security gates. Complete admin/support before advertising production feature. The user requested durable project status, so this file is the current recommendation.
