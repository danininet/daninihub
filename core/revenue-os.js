const APPROVAL_ACTIONS = new Set([
  'spend_money',
  'accept_contract',
  'legal_commitment',
  'payment',
  'refund',
  'change_credentials',
  'change_permissions',
  'delete_data',
  'delete_site',
  'publish_regulated_claim',
  'change_base_price',
  'send_sensitive_data'
]);

const AUTO_ACTIONS = new Set([
  'market_research',
  'competitor_research',
  'public_prospect_research',
  'lead_scoring',
  'draft_offer',
  'draft_message',
  'create_landing_draft',
  'crm_update',
  'analytics_read',
  'performance_analysis',
  'followup_preapproved_campaign',
  'prepare_report'
]);

const STAGES = Object.freeze([
  'SIGNAL',
  'OFFER',
  'SELL',
  'EXECUTE',
  'EVIDENCE',
  'DECIDE'
]);

function approvalFor(action, context = {}) {
  const key = String(action || '').trim().toLowerCase();

  if (APPROVAL_ACTIONS.has(key)) {
    return {
      required: true,
      reason: 'Owner approval required for monetary, legal, destructive, permission or sensitive action.'
    };
  }

  if (key === 'send_external_message') {
    return context.preapproved_campaign === true
      ? { required: false, reason: 'Message is inside an owner-approved campaign and template boundary.' }
      : { required: true, reason: 'First external outreach requires owner approval until campaign boundaries are approved.' };
  }

  if (key === 'publish_public') {
    return context.preapproved_claims === true
      ? { required: false, reason: 'Publishing is inside pre-approved claims and brand boundaries.' }
      : { required: true, reason: 'Public publishing requires approval until claims and campaign are approved.' };
  }

  if (AUTO_ACTIONS.has(key)) {
    return { required: false, reason: 'Low-risk reversible operating action.' };
  }

  return {
    required: true,
    reason: 'Unknown action defaults to approval-required.'
  };
}

function evaluateMarketTest(metrics = {}, thresholds = {}) {
  const cfg = {
    min_targeted_contacts: thresholds.min_targeted_contacts ?? 50,
    min_positive_replies: thresholds.min_positive_replies ?? 3,
    min_qualified_conversations: thresholds.min_qualified_conversations ?? 2,
    min_paid_customers: thresholds.min_paid_customers ?? 1
  };

  const m = {
    targeted_contacts: Number(metrics.targeted_contacts || 0),
    positive_replies: Number(metrics.positive_replies || 0),
    qualified_conversations: Number(metrics.qualified_conversations || 0),
    paid_customers: Number(metrics.paid_customers || 0)
  };

  if (m.paid_customers >= cfg.min_paid_customers) {
    return { decision: 'SCALE', evidence: m, thresholds: cfg, reason: 'Paid-customer threshold reached.' };
  }

  if (
    m.targeted_contacts >= cfg.min_targeted_contacts &&
    m.positive_replies < cfg.min_positive_replies &&
    m.qualified_conversations < cfg.min_qualified_conversations
  ) {
    return { decision: 'KILL_OR_REDEFINE', evidence: m, thresholds: cfg, reason: 'Enough market exposure without sufficient buyer signal.' };
  }

  return { decision: 'CONTINUE_TEST', evidence: m, thresholds: cfg, reason: 'Evidence is not yet sufficient for scale or kill.' };
}

function createRun(input = {}) {
  return {
    version: 'revenue-os-v1',
    stage: 'SIGNAL',
    market: input.market || null,
    segment: input.segment || null,
    problem: input.problem || null,
    offer: input.offer || null,
    evidence: [],
    approvals: [],
    metrics: {
      targeted_contacts: 0,
      positive_replies: 0,
      qualified_conversations: 0,
      paid_customers: 0,
      mrr_eur: 0
    },
    owner_role: 'controller',
    operating_rule: 'No success claim without measurable market evidence.'
  };
}

module.exports = {
  APPROVAL_ACTIONS,
  AUTO_ACTIONS,
  STAGES,
  approvalFor,
  evaluateMarketTest,
  createRun
};
