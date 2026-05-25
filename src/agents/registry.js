const AGENTS = Object.freeze({
  META_COMMANDER: {
    id: 'core.meta.commander',
    visibility: 'internal',
    authority: 'Owner alignment and USTAV compliance'
  },
  CORE_ORCHESTRATOR: {
    id: 'core.orchestrator',
    visibility: 'internal',
    authority: 'Route tasks through evidence, method, agent and controller sequence'
  },
  DEV_CTO: {
    id: 'internal.dev.cto',
    visibility: 'internal-only',
    authority: 'Node, Express, Stripe, Brevo, database, PDF, deployment and operational runtime'
  },
  ZERO_HALLUCINATION_GUARD: {
    id: 'core.guard.zero_hallucination',
    visibility: 'internal',
    authority: 'Block unsupported claims, fake tool output and unverified public/system statements'
  },
  VALIDATOR: {
    id: 'core.validator',
    visibility: 'internal',
    authority: 'Final pass/fail before output, file, route or deployment is considered valid'
  }
});

function listAgents() {
  return AGENTS;
}

function getAgent(agentKey) {
  return AGENTS[agentKey] || null;
}

module.exports = {
  AGENTS,
  listAgents,
  getAgent
};
