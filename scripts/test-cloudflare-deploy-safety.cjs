'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { config, safeProject, pagesUrl, PROJECT, BRANCH, REPOSITORY } = require('./deploy-cloudflare-preview.cjs');
const environment = () => ({ GITHUB_REPOSITORY: REPOSITORY, GITHUB_REF: 'refs/heads/' + BRANCH, GITHUB_SHA: 'a'.repeat(40), CLOUDFLARE_ACCOUNT_ID: 'b'.repeat(32), CLOUDFLARE_API_TOKEN: 'test-only-not-a-credential' });
const project = () => ({ name: PROJECT, production_branch: BRANCH, domains: [PROJECT + '.pages.dev'], subdomain: PROJECT + '.pages.dev' });

test('refuses main and any other repository before network access', () => {
  assert.throws(() => config({ ...environment(), GITHUB_REF: 'refs/heads/main' }), /restricted/);
  assert.throws(() => config({ ...environment(), GITHUB_REPOSITORY: 'other/project' }), /restricted/);
});
test('missing authorization names the missing configuration without disclosing values', () => {
  assert.throws(() => config({ ...environment(), CLOUDFLARE_API_TOKEN: '' }), /connection missing.*CLOUDFLARE_API_TOKEN/);
  assert.throws(() => config({ ...environment(), CLOUDFLARE_ACCOUNT_ID: 'invalid' }), /32-character/);
  assert.equal(config(environment()).sha, 'a'.repeat(40));
});
test('refuses a Pages project attached to daninihub.com or another custom domain', () => {
  for (const domain of ['daninihub.com', 'auto.daninihub.com', 'example.com']) {
    assert.throws(() => safeProject({ ...project(), domains: [domain] }), /custom domain/);
  }
  assert.throws(() => safeProject({ ...project(), domains: undefined }), /did not report/);
  assert.throws(() => safeProject({ ...project(), production_branch: 'main' }), /unrelated/);
  assert.throws(() => safeProject({ ...project(), name: 'daninihub' }), /unrelated/);
});
test('refuses another repository and accepts only the isolated preview project', () => {
  assert.throws(() => safeProject({ ...project(), source: { type: 'github', config: { owner: 'other', repo_name: 'project' } } }), /another repository/);
  assert.equal(safeProject(project()).name, PROJECT);
});
test('public verification cannot follow a custom origin or credential-bearing URL', () => {
  for (const url of ['https://daninihub.com/', 'http://test.pages.dev/', 'https://test.pages.dev.evil.example/', 'https://test.pages.dev:444/', 'https://secret@test.pages.dev/', 'https://test.pages.dev/?token=secret']) {
    assert.throws(() => pagesUrl(url), /Only an HTTPS/);
  }
  assert.equal(pagesUrl('https://123abc.' + PROJECT + '.pages.dev/'), 'https://123abc.' + PROJECT + '.pages.dev');
});
