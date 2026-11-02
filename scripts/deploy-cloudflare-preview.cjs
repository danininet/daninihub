'use strict';

// Only PR 95's isolated Pages project. No DNS, custom-domain, production or
// main-branch API is called. Credentials never enter the build or its output.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const PROJECT = 'danini-auto-pr95-preview';
const BRANCH = 'cloudflare-danini-auto-preview-20261102';
const REPOSITORY = 'danininet/daninihub';

function config(env = process.env) {
  if (env.GITHUB_REPOSITORY !== REPOSITORY || env.GITHUB_REF !== 'refs/heads/' + BRANCH) {
    throw Error('Deployment is restricted to the existing PR 95 preview branch.');
  }
  const missing = ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID'].filter(k => !env[k]?.trim());
  if (missing.length) throw Error('Cloudflare connection missing in GitHub Actions: ' + missing.join(', ') + '. No deployment or DNS change was attempted.');
  if (!/^[a-f0-9]{32}$/i.test(env.CLOUDFLARE_ACCOUNT_ID.trim())) throw Error('CLOUDFLARE_ACCOUNT_ID must be a 32-character account ID.');
  if (!/^[a-f0-9]{40}$/i.test(env.GITHUB_SHA || '')) throw Error('A full GitHub commit SHA is required.');
  return { account: env.CLOUDFLARE_ACCOUNT_ID.trim(), token: env.CLOUDFLARE_API_TOKEN.trim(), sha: env.GITHUB_SHA };
}

function pagesUrl(value) {
  const u = new URL(value);
  if (u.protocol !== 'https:' || u.port || u.username || u.password ||
      !/^[a-z0-9-]+(?:\.[a-z0-9-]+)*\.pages\.dev$/.test(u.hostname) || u.pathname !== '/' || u.search || u.hash) {
    throw Error('Only an HTTPS pages.dev deployment origin is allowed.');
  }
  return u.origin;
}

function safeProject(project) {
  if (!project || project.name !== PROJECT || project.production_branch !== BRANCH) throw Error('Refusing an unrelated Cloudflare project or production branch.');
  if (!Array.isArray(project.domains)) throw Error('Cloudflare did not report the project domain configuration.');
  if (project.domains.some(d => typeof d !== 'string' || !d.endsWith('.pages.dev'))) throw Error('Refusing a project attached to a custom domain.');
  pagesUrl('https://' + project.subdomain);
  if (project.source && (project.source.type !== 'github' ||
      project.source.config?.owner !== 'danininet' || project.source.config?.repo_name !== 'daninihub')) {
    throw Error('Refusing a project connected to another repository.');
  }
  return project;
}

async function api(settings, suffix, method = 'GET', body) {
  // The only API namespace this helper can access is this account's Pages projects.
  const url = 'https://api.cloudflare.com/client/v4/accounts/' + settings.account + '/pages/projects' + suffix;
  const response = await fetch(url, {
    method, redirect: 'error', signal: AbortSignal.timeout(30000),
    headers: { Authorization: 'Bearer ' + settings.token, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  if (response.status === 404 && method === 'GET' && suffix === '/' + PROJECT) return null;
  const data = await response.json();
  if (!response.ok || data.success !== true) {
    // Do not print response bodies, tokens, account identifiers or request URLs.
    throw Error('Cloudflare Pages API failed (HTTP ' + response.status + '; codes: ' + (data.errors || []).map(e => e.code).filter(c => typeof c === 'number').join(',') + ').');
  }
  return data.result;
}

function summary(text) {
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + '\n');
}

async function verify(origin) {
  origin = pagesUrl(origin);
  const routes = [
    '/sr/', '/de/', '/sr/usluge/', '/de/leistungen/',
    '/sr/kako-radimo/', '/de/ablauf/', '/sr/za-firme/', '/de/unternehmen/',
    '/sr/kontakt/', '/de/kontakt/', '/sr/impressum/', '/de/impressum/',
    '/sr/privatnost/', '/de/datenschutz/', '/sr/uslovi/', '/de/bedingungen/',
    '/sr/kolacici/', '/de/cookies/', '/assets/cloudflare.css', '/robots.txt',
    '/images/DANINI_Dragan_Portret_CLEAN_1200x1200.jpg',
    '/images/DANINI_Dragan_Telefon_CLEAN_1200x1200.jpg',
    '/images/DANINI_Dragan_Pregled_Auta_CLEAN_1200x1200.jpg'
  ];
  for (const route of routes) {
    let response;
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        response = await fetch(origin + route, { redirect: 'error', signal: AbortSignal.timeout(15000) });
        if (response.ok) break;
      } catch (error) {
        if (attempt === 3) throw Error('Preview request failed: ' + route);
      }
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 3000));
    }
    if (!response?.ok) throw Error('Preview returned HTTP ' + response?.status + ': ' + route);
    if (!/noindex/i.test(response.headers.get('x-robots-tag') || '')) throw Error('Missing noindex header: ' + route);
    if (route.endsWith('/')) {
      const html = await response.text();
      if (!/<html/i.test(html)) throw Error('Expected HTML: ' + route);
      if (['/sr/', '/de/', '/sr/usluge/', '/de/leistungen/'].includes(route)) {
        for (const price of ['59 €', '189 €', '349 €']) if (!html.includes(price)) throw Error('Missing preview price: ' + route);
        if (!html.includes('https://wa.me/4915730916621')) throw Error('WhatsApp destination mismatch: ' + route);
      }
    } else if (route === '/robots.txt') {
      if (!/^Disallow:\s*\/$/m.test(await response.text())) throw Error('Preview robots.txt does not block indexing.');
    } else if (route.endsWith('.jpg')) {
      const image = new Uint8Array(await response.arrayBuffer());
      if (image.length < 1000 || image[0] !== 255 || image[1] !== 216) throw Error('Invalid preview image: ' + route);
    } else {
      await response.arrayBuffer();
    }
  }
  return routes.length;
}

async function main(mode) {
  if (!['check', 'deploy'].includes(mode)) throw Error('Usage: deploy-cloudflare-preview.cjs check|deploy');
  const settings = config();
  if (mode === 'check') {
    console.log('Cloudflare deployment settings are present. Values are not displayed.');
    return;
  }
  const output = path.resolve(__dirname, '../cloudflare-preview-dist');
  if (!/noindex, nofollow/.test(fs.readFileSync(path.join(output, '_headers'), 'utf8'))) throw Error('Preview noindex headers are required before publishing.');
  if (fs.existsSync(path.join(output, '_worker.js'))) throw Error('Only the static preview can be deployed.');
  let project = await api(settings, '/' + PROJECT);
  if (!project) project = await api(settings, '', 'POST', { name: PROJECT, production_branch: BRANCH });
  safeProject(project);
  const deployment = spawnSync('npx', ['--yes', 'wrangler@4', 'pages', 'deploy', output,
    '--project-name=' + PROJECT, '--branch=' + BRANCH, '--commit-hash=' + settings.sha, '--commit-dirty=false'],
    { cwd: output, env: process.env, encoding: 'utf8', timeout: 300000 });
  if (deployment.status !== 0) throw Error('Wrangler could not publish the preview (exit ' + deployment.status + ').');
  // Retrieve the actual URL from Cloudflare; never manufacture a deployment address.
  const deployments = await api(settings, '/' + PROJECT + '/deployments');
  const current = Array.isArray(deployments) && deployments.find(d =>
    d.deployment_trigger?.metadata?.commit_hash === settings.sha &&
    d.deployment_trigger?.metadata?.branch === BRANCH && d.latest_stage?.status === 'success');
  if (!current?.url) throw Error('Cloudflare did not confirm a successful deployment of this exact commit.');
  const url = pagesUrl(current.url);
  const checked = await verify(url);
  safeProject(await api(settings, '/' + PROJECT));
  console.log('Verified Cloudflare preview: ' + url);
  console.log('Verified resources: ' + checked + '. No custom domains or DNS were changed.');
  summary('## DANINI preview published and checked\n\n' + url + '\n\nCommit: `' + settings.sha + '`\n\n' + checked + ' resources checked, including SR/DE pages, legal pages, original photos, prices, WhatsApp and noindex.\n\nNo main-branch, custom-domain or DNS changes.');
}

module.exports = { config, pagesUrl, safeProject, verify, PROJECT, BRANCH, REPOSITORY };
if (require.main === module) main(process.argv[2]).catch(error => {
  const message = String(error.message).split(/[\r\n]/)[0];
  console.error('::error::' + message);
  summary('## DANINI preview not confirmed\n\n' + message + '\n\nDo not report a published pages.dev site until the deployment and public checks succeed.');
  process.exitCode = 1;
});
