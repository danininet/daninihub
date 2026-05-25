const fs = require('fs');
const path = require('path');
const { writeAudit } = require('./audit');

const MODE_AGENT_FLOW = {
  DEV_FIX: [
    'core.meta.commander',
    'core.orchestrator',
    'internal.dev.cto',
    'tech.support.diag',
    'core.guard.zero_hallucination',
    'core.validator',
    'core.audit.log'
  ],

  STRATEGY_BUILD: [
    'core.meta.commander',
    'core.orchestrator',
    'monetization.product.manager',
    'content.copywriter',
    'legal.dach.analyst',
    'core.guard.zero_hallucination',
    'core.validator',
    'core.audit.log'
  ],

  LEGAL_COMPLIANCE: [
    'core.meta.commander',
    'core.orchestrator',
    'legal.compliance.gdpr',
    'legal.impressum.gen',
    'legal.privacy.protocol',
    'legal.dach.analyst',
    'core.guard.zero_hallucination',
    'core.validator',
    'core.audit.log'
  ],

  CONTENT_STUDIO: [
    'core.meta.commander',
    'core.orchestrator',
    'content.gen.main',
    'content.structure.v2',
    'content.copywriter',
    'content.ebook.formatter',
    'core.guard.zero_hallucination',
    'core.validator',
    'core.audit.log'
  ],

  RESEARCH_INTEL: [
    'core.meta.commander',
    'core.orchestrator',
    'research.audience.deep',
    'research.intent.analyst',
    'research.intel.competitive',
    'research.seo.main',
    'core.guard.zero_hallucination',
    'core.validator',
    'core.audit.log'
  ],

  SUPPORT_OPS: [
    'core.meta.commander',
    'core.orchestrator',
    'tech.support.diag',
    'tech.db.sync',
    'tech.brevo.sync',
    'monetization.stripe.webhook',
    'core.guard.zero_hallucination',
    'core.validator',
    'core.audit.log'
  ]
};

const LOCAL_AGENT_FILES = {
  'internal.dev.cto': 'agents/dev_cto.js',
  'legal.impressum.gen': 'agents/legal.impressum.gen.js',
  'core.orchestrator': 'agents/orchestrator.js'
};

function readFirstExisting(paths) {
  for (const rel of paths) {
    const full = path.join(process.cwd(), rel);
    if (fs.existsSync(full)) {
      return fs.readFileSync(full, 'utf8');
    }
  }

  return '';
}

function loadDocumentationState() {
  const ustav = readFirstExisting([
    'docs/reference/USTAV.md',
    'docs/reference/ustav.txt'
  ]);

  const protocols = readFirstExisting([
    'docs/reference/AGENT PROTOCOLS (FULL 56).txt'
  ]);

  const premiumOutline = readFirstExisting([
    'docs/reference/PREMIUM_OUTLINE.md'
  ]);

  return {
    ustav_loaded: Boolean(ustav),
    protocols_loaded: Boolean(protocols),
    premium_outline_loaded: Boolean(premiumOutline)
  };
}

function normalizeMode(mode, input = '') {
  const explicit = String(mode || '').trim().toUpperCase();

  if (MODE_AGENT_FLOW[explicit]) {
    return explicit;
  }

  const text = String(input || '').toLowerCase();

  if (/stripe|checkout|webhook|brevo|email|pdf|artifact|activation|success|status|db|database|hostinger/.test(text)) {
    return 'SUPPORT_OPS';
  }

  if (/legal|gdpr|dsgvo|impressum|datenschutz|privacy|cookies|agb|terms|disclaimer/.test(text)) {
    return 'LEGAL_COMPLIANCE';
  }

  if (/ebook|e-book|content|copy|landing|blog|youtube|video|kurs|outline|email sequence|newsletter/.test(text)) {
    return 'CONTENT_STUDIO';
  }

  if (/research|seo|market|markt|tržište|konkurenc|audience|publika|intent|trend/.test(text)) {
    return 'RESEARCH_INTEL';
  }

  if (/strategy|strateg|monetiz|ponuda|offer|cta|price|preis|cena|prodaj/.test(text)) {
    return 'STRATEGY_BUILD';
  }

  return 'DEV_FIX';
}

function resolveAgentFlow(mode, input = '') {
  const selectedMode = normalizeMode(mode, input);
  return {
    mode: selectedMode,
    agent_flow: MODE_AGENT_FLOW[selectedMode]
  };
}

function resolveLocalAgentFiles(agentFlow) {
  return agentFlow.map(agentId => {
    const rel = LOCAL_AGENT_FILES[agentId] || null;
    const exists = rel ? fs.existsSync(path.join(process.cwd(), rel)) : false;

    return {
      agent_id: agentId,
      file: rel,
      exists
    };
  });
}

function buildExecutionContext({ input, mode, locale = 'sr', source = 'controller' }) {
  const resolved = resolveAgentFlow(mode, input);
  const documentation = loadDocumentationState();
  const local_agent_files = resolveLocalAgentFiles(resolved.agent_flow);

  const task = [
    'DANINIHUB USTAVNI EXECUTION CONTEXT',
    '',
    `Mode: ${resolved.mode}`,
    `Locale: ${locale}`,
    `Source: ${source}`,
    '',
    'Authority chain:',
    'Owner (Dragan) -> core.meta.commander -> core.orchestrator -> operativni agenti -> core.guard.zero_hallucination -> core.validator -> core.audit.log',
    '',
    'Active documented agent flow:',
    ...resolved.agent_flow.map((agentId, index) => `${index + 1}. ${agentId}`),
    '',
    'Local agent files:',
    ...local_agent_files.map(item => `- ${item.agent_id}: ${item.file || 'documentation-defined'}${item.exists ? ' [exists]' : ''}`),
    '',
    'Hard rules:',
    '- Ne izmišljaj agente.',
    '- Ne izmišljaj fajlove.',
    '- Ne izmišljaj rute.',
    '- Ne izmišljaj frontend.',
    '- Koristi samo postojeću dokumentaciju i stvarnu strukturu.',
    '- Internal agents are not user-facing.',
    '- Customer-facing output must not expose internal agent IDs, token logic or Node implementation.',
    '- Evidence-first.',
    '- No skeleton output.',
    '',
    `USTAV loaded: ${documentation.ustav_loaded ? 'YES' : 'NO'}`,
    `AGENT PROTOCOLS loaded: ${documentation.protocols_loaded ? 'YES' : 'NO'}`,
    `PREMIUM OUTLINE loaded: ${documentation.premium_outline_loaded ? 'YES' : 'NO'}`,
    '',
    'Owner task:',
    String(input || '').trim()
  ].join('\n');

  return {
    mode: resolved.mode,
    agent_flow: resolved.agent_flow,
    local_agent_files,
    documentation,
    task
  };
}

function orchestrate({ input, mode, locale = 'sr', source = 'controller' }) {
  const context = buildExecutionContext({ input, mode, locale, source });

  writeAudit({
    event: 'orchestrator_route_selected',
    mode: context.mode,
    locale,
    source,
    input_summary: String(input || '').slice(0, 700),
    agent_flow: context.agent_flow,
    local_agent_files: context.local_agent_files,
    documentation: context.documentation
  });

  return context;
}

module.exports = {
  MODE_AGENT_FLOW,
  normalizeMode,
  resolveAgentFlow,
  resolveLocalAgentFiles,
  loadDocumentationState,
  buildExecutionContext,
  orchestrate
};


function resolveAgentFlowForMode(mode) {
  const flows = {
    DEV_FIX: ['core.meta.commander', 'core.orchestrator', 'internal.dev.cto', 'tech.support.diag', 'core.guard.zero_hallucination', 'core.validator', 'core.audit.log'],
    SUPPORT_OPS: ['core.meta.commander', 'core.orchestrator', 'tech.support.diag', 'tech.db.sync', 'tech.brevo.sync', 'monetization.stripe.webhook', 'core.guard.zero_hallucination', 'core.validator', 'core.audit.log'],
    CONTENT_STUDIO: ['core.meta.commander', 'core.orchestrator', 'content.gen.main', 'content.structure.v2', 'content.copywriter', 'content.ebook.formatter', 'core.guard.zero_hallucination', 'core.validator', 'core.audit.log'],
    STRATEGY_BUILD: ['core.meta.commander', 'core.orchestrator', 'monetization.product.manager', 'content.copywriter', 'legal.dach.analyst', 'core.guard.zero_hallucination', 'core.validator', 'core.audit.log'],
    LEGAL_COMPLIANCE: ['core.meta.commander', 'core.orchestrator', 'legal.compliance.gdpr', 'legal.impressum.gen', 'legal.privacy.protocol', 'legal.dach.analyst', 'core.guard.zero_hallucination', 'core.validator', 'core.audit.log'],
    RESEARCH_INTEL: ['core.meta.commander', 'core.orchestrator', 'research.audience.deep', 'research.intent.analyst', 'research.intel.competitive', 'research.seo.main', 'core.guard.zero_hallucination', 'core.validator', 'core.audit.log']
  };

  return flows[String(mode || '').toUpperCase()] || flows.DEV_FIX;
}

module.exports.resolveAgentFlowForMode = resolveAgentFlowForMode;
