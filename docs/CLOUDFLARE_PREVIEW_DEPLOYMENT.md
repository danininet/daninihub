# PR 95: Cloudflare preview deployment from GitHub Actions

This is an alternative to Cloudflare's dashboard Git integration. It uses the
existing `danininet/daninihub` repository and only the
`cloudflare-danini-auto-preview-20261102` branch. It does not merge PR 95 or
modify `main`, `daninihub.com`, DNS, custom domains, legal text or pricing.

## Connection

The workflow uses the repository's existing GitHub Actions settings:

- Secret `CLOUDFLARE_API_TOKEN`: a token scoped to the intended Cloudflare
  account with **Account / Cloudflare Pages / Edit** permission.
- Secret or variable `CLOUDFLARE_ACCOUNT_ID`: that account's ID.

Values must be entered through GitHub's settings, never committed or pasted
into a conversation. The workflow does not request DNS permission and never
prints credentials. Missing settings stop the run before any Cloudflare
network request, build or deployment. A successful browser login alone does
not configure these GitHub settings.

## Behavior

On a matching push, the workflow tests its deployment safeguards, checks the
connection settings, builds the existing static preview and runs its smoke
tests. It then creates or reuses only `danini-auto-pr95-preview` and publishes
the built output with Wrangler. The source commit and branch are recorded.

A newly created project uses **Direct Upload with GitHub Actions**, rather
than Cloudflare's native Git integration. Cloudflare does not support
converting a Direct Upload project to native Git integration in place; native
integration would require a separate project. No existing Pages project is
converted. A reused project must have the expected preview branch, no custom
domains and, if it has a source integration, this same repository.

The workflow reads the real deployment URL from Cloudflare and verifies 23
resources on that exact `pages.dev` origin: SR/DE pages, legal pages, original
photos, CSS and robots.txt. It also checks the preview prices, WhatsApp target
and noindex headers. Redirects to other origins are refused. A success summary
with the actual URL appears only after verification succeeds.

The workflow is intentionally confined to the PR branch. After adding missing
settings, rerun the failed workflow in GitHub Actions. The `workflow_dispatch`
declaration does not imply that GitHub displays a Run workflow button while
the workflow exists only on this branch. Do not merge merely to expose that button.

## Local safety checks

```sh
node --check scripts/deploy-cloudflare-preview.cjs
node --test scripts/test-cloudflare-deploy-safety.cjs
```

Official reference:
https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/

This workflow does not turn the static preview into the original full-stack
application: payments, database, AI endpoints and automatic PDF delivery remain
outside the preview described in PR 95.
