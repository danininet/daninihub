const { normalizeArtifact, saveArtifact } = require('../core/artifacts/createArtifact');

const artifact = normalizeArtifact({
  mode: 'STRATEGY_BUILD',
  raw_input: 'Test artifact contract for DaniniHub',
  locale: 'de',
  source: 'cli',
  lead_agent: 'core.meta.commander',
  support_agents: ['core.guard.zero_hallucination', 'core.validator'],
  evidence_used: true,
  evidence_sources: [
    'docs/reference/ustav.txt',
    'docs/reference/AGENT PROTOCOLS (FULL 56).txt'
  ],
  evidence_notes: 'Runtime contract test.',
  summary: 'DaniniHub artifact schema test completed.',
  A_problem: 'System needs stable artifact output.',
  B_evidence: 'Ustav and Agent Protocols are readable.',
  C_plan: 'Normalize every result into one JSON contract.',
  D_execution: 'Created test artifact.',
  E_next: 'Connect controller output to artifact storage.',
  risks: ['Controller still returns legacy JSON in some paths.'],
  next_step: 'Patch controller to optionally save artifacts.',
  validated: true,
  controller_status: 'approved',
  controller_reason: 'Schema-compatible test artifact.'
});

const savedTo = saveArtifact(artifact);

console.log('ARTIFACT_SAVED:', savedTo);
console.log(JSON.stringify(artifact, null, 2));
