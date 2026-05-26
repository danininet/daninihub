const AGENTS = Object.freeze([
  { id: 'core.meta.commander', sector: 'CORE_ORCHESTRATION', role: 'Supreme constitutional authority', status: 'registered' },
  { id: 'internal.dev.cto', sector: 'CORE_ORCHESTRATION', role: 'Node Stripe Brevo WP technical authority', status: 'registered' },
  { id: 'core.orchestrator', sector: 'CORE_ORCHESTRATION', role: 'Agent sequence director', status: 'registered_runtime_shell' },
  { id: 'core.guard.zero_hallucination', sector: 'CORE_ORCHESTRATION', role: 'Output truth control', status: 'registered' },
  { id: 'core.method.engine', sector: 'CORE_ORCHESTRATION', role: 'Cycle-lock method execution', status: 'registered' },
  { id: 'core.registry', sector: 'CORE_ORCHESTRATION', role: 'Agent catalog and permission model', status: 'active' },
  { id: 'core.artifact.system', sector: 'CORE_ORCHESTRATION', role: 'Artifact metadata standardization', status: 'registered' },
  { id: 'core.artifact.store', sector: 'CORE_ORCHESTRATION', role: 'Artifact versioning and rollback', status: 'blocked_database_not_connected' },
  { id: 'core.audit.log', sector: 'CORE_ORCHESTRATION', role: 'Decision and request audit log', status: 'active_memory_runtime' },
  { id: 'core.validator', sector: 'CORE_ORCHESTRATION', role: 'Final validation gate', status: 'registered_runtime_shell' },

  { id: 'monetization.product.manager', sector: 'MONETIZATION_FINANCE', role: 'Membership and offer levels', status: 'registered' },
  { id: 'monetization.system_power.engine', sector: 'MONETIZATION_FINANCE', role: 'System Power usage and limits', status: 'active_memory_runtime' },
  { id: 'monetization.stripe.webhook', sector: 'MONETIZATION_FINANCE', role: 'Stripe payment activation', status: 'blocked_stripe_not_configured' },
  { id: 'monetization.affiliate.scout', sector: 'MONETIZATION_FINANCE', role: 'Evergreen affiliate discovery', status: 'registered' },
  { id: 'monetization.partner.verifier', sector: 'MONETIZATION_FINANCE', role: 'Affiliate integrity verification', status: 'registered' },
  { id: 'monetization.evergreen.finder', sector: 'MONETIZATION_FINANCE', role: 'Long-term product viability', status: 'registered' },
  { id: 'monetization.disclosure.guard', sector: 'MONETIZATION_FINANCE', role: 'Affiliate legal disclosure guard', status: 'registered' },
  { id: 'monetization.link.hygiene', sector: 'MONETIZATION_FINANCE', role: 'Link health and commission tracking', status: 'blocked_database_not_connected' },
  { id: 'monetization.donation.module', sector: 'MONETIZATION_FINANCE', role: 'Support and donations module', status: 'disabled_not_primary' },

  { id: 'legal.linguistic.de', sector: 'DACH_LEGAL', role: 'Business German language layer', status: 'registered' },
  { id: 'legal.compliance.gdpr', sector: 'DACH_LEGAL', role: 'DSGVO compliance', status: 'registered' },
  { id: 'legal.impressum.gen', sector: 'DACH_LEGAL', role: 'Impressum and Datenschutz generation', status: 'registered' },
  { id: 'legal.privacy.protocol', sector: 'DACH_LEGAL', role: 'User data privacy protocol', status: 'registered' },
  { id: 'legal.dach.analyst', sector: 'DACH_LEGAL', role: 'DACH skepticism and market fit', status: 'registered' },
  { id: 'legal.belastbarkeit.auditor', sector: 'DACH_LEGAL', role: 'Business model stress audit', status: 'registered' },

  { id: 'content.gen.main', sector: 'CONTENT_VIDEO_EDUCATION', role: 'Fact-based pages and articles', status: 'registered' },
  { id: 'content.structure.v2', sector: 'CONTENT_VIDEO_EDUCATION', role: 'PDF and content structure', status: 'registered' },
  { id: 'content.copywriter', sector: 'CONTENT_VIDEO_EDUCATION', role: 'Responsible conversion copy', status: 'registered' },
  { id: 'content.script.video', sector: 'CONTENT_VIDEO_EDUCATION', role: 'Video and audio scripts', status: 'registered' },
  { id: 'content.course.architect', sector: 'CONTENT_VIDEO_EDUCATION', role: 'Educational module sequence', status: 'registered' },
  { id: 'content.ebook.formatter', sector: 'CONTENT_VIDEO_EDUCATION', role: 'Premium PDF formatting', status: 'registered' },
  { id: 'content.template.library', sector: 'CONTENT_VIDEO_EDUCATION', role: 'Website template library', status: 'registered' },
  { id: 'content.landing.blocks', sector: 'CONTENT_VIDEO_EDUCATION', role: 'Landing section blocks', status: 'registered' },

  { id: 'research.audience.deep', sector: 'ANALYTICS_RESEARCH', role: 'Audience pain research', status: 'registered' },
  { id: 'research.seo.main', sector: 'ANALYTICS_RESEARCH', role: 'SEO and WDF IDF analysis', status: 'registered' },
  { id: 'research.intel.competitive', sector: 'ANALYTICS_RESEARCH', role: 'Competitor analysis', status: 'registered' },
  { id: 'research.analytics.gsc', sector: 'ANALYTICS_RESEARCH', role: 'Google Search Console strategy', status: 'blocked_gsc_not_connected' },
  { id: 'research.trend.scout', sector: 'ANALYTICS_RESEARCH', role: 'AI innovation scouting', status: 'registered' },
  { id: 'research.intent.analyst', sector: 'ANALYTICS_RESEARCH', role: 'Intent analysis', status: 'registered' },

  { id: 'tech.support.diag', sector: 'TECH_SUPPORT', role: 'Code and SEO diagnostics', status: 'registered' },
  { id: 'tech.qa.console', sector: 'TECH_SUPPORT', role: 'Quality console', status: 'registered' },
  { id: 'tech.brevo.sync', sector: 'TECH_SUPPORT', role: 'Brevo email automation', status: 'blocked_brevo_not_configured' },
  { id: 'tech.db.sync', sector: 'TECH_SUPPORT', role: 'Hostinger database sync', status: 'blocked_database_not_connected' },
  { id: 'tech.env.config', sector: 'TECH_SUPPORT', role: 'Secret and env guard', status: 'active_snapshot_only' },
  { id: 'tech.api.fallback', sector: 'TECH_SUPPORT', role: 'Provider fallback', status: 'blocked_ai_provider_not_connected' },
  { id: 'internal.dev.frontend', sector: 'TECH_SUPPORT', role: 'Dashboard and UI', status: 'registered' },
  { id: 'internal.dev.backend', sector: 'TECH_SUPPORT', role: 'Database and API routes', status: 'registered_runtime_shell' },
  { id: 'internal.security.auditor', sector: 'TECH_SUPPORT', role: 'Security audit', status: 'registered' },

  { id: 'special.activation.app', sector: 'SPECIAL_OPS', role: 'System activation parameters', status: 'registered' },
  { id: 'special.runner', sector: 'SPECIAL_OPS', role: 'Console command runner', status: 'blocked_no_remote_shell' },
  { id: 'special.snapshot', sector: 'SPECIAL_OPS', role: 'System snapshot', status: 'registered' },
  { id: 'special.vertiefung', sector: 'SPECIAL_OPS', role: 'Deep topic research', status: 'registered' },
  { id: 'special.risk.sim', sector: 'SPECIAL_OPS', role: 'Failure simulation', status: 'registered' },
  { id: 'special.logic.clash', sector: 'SPECIAL_OPS', role: 'Logic clash detection', status: 'registered' },
  { id: 'special.clarity.eval', sector: 'SPECIAL_OPS', role: 'Sentence clarity evaluation', status: 'registered' },
  { id: 'special.feedback.loop', sector: 'SPECIAL_OPS', role: 'Correction memory and system improvement', status: 'registered' }
]);

function getAgents() {
  return AGENTS;
}

function getAgent(agentId) {
  return AGENTS.find((agent) => agent.id === agentId) || null;
}

module.exports = {
  AGENTS,
  getAgents,
  getAgent
};
