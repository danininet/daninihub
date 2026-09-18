'use strict';

const fs = require('fs');
const path = require('path');
const { REVENUE_UNIT_01 } = require('./core/revenue-unit-01');

const STATE_FILE = path.join(process.cwd(), 'runtime', 'revenue-campaign-state.json');

function defaultState() {
  return {
    campaignId: REVENUE_UNIT_01.id,
    status: 'DRAFT',
    mode: 'CONSENT_FIRST',
    approvedAt: null,
    pausedAt: null,
    note: '',
    boundaries: {
      market: REVENUE_UNIT_01.phase1Market,
      region: REVENUE_UNIT_01.phase1Region,
      maxInitialProspects: REVENUE_UNIT_01.marketTest.maxInitialProspects,
      allowedAfterApproval: [
        'reply_to_inbound_leads',
        'respond_to_explicit_service_requests',
        'follow_up_on_referred_leads_with_contact_expectation',
        'publish_organic_non_deceptive_content',
        'prepare_paid_search_for_separate_budget_approval'
      ],
      alwaysBlocked: [
        'cold_bulk_email',
        'automated_cold_calls',
        'binding_quotes_without_owner_approval',
        'spend_money_without_owner_approval',
        'sensitive_data_to_external_ai_without_disclosure_and_legal_basis'
      ]
    },
    updatedAt: new Date().toISOString()
  };
}

function ensureState() {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  if (!fs.existsSync(STATE_FILE)) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(defaultState(), null, 2) + '\n', { mode: 0o600 });
  }
}

function getCampaignState() {
  ensureState();
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    const state = defaultState();
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n', { mode: 0o600 });
    return state;
  }
}

function writeState(next) {
  ensureState();
  const state = { ...next, updatedAt: new Date().toISOString() };
  const tmp = STATE_FILE + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2) + '\n', { mode: 0o600 });
  fs.renameSync(tmp, STATE_FILE);
  return state;
}

function approveCampaign(note = '') {
  const current = getCampaignState();
  return writeState({
    ...current,
    status: 'APPROVED',
    approvedAt: new Date().toISOString(),
    pausedAt: null,
    note: String(note || '').slice(0, 2000)
  });
}

function pauseCampaign(note = '') {
  const current = getCampaignState();
  return writeState({
    ...current,
    status: 'PAUSED',
    pausedAt: new Date().toISOString(),
    note: String(note || '').slice(0, 2000)
  });
}

function resetCampaign(note = '') {
  const state = defaultState();
  state.note = String(note || '').slice(0, 2000);
  return writeState(state);
}

module.exports = { getCampaignState, approveCampaign, pauseCampaign, resetCampaign };
