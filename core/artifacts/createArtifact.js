'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const MODES = new Set([
  'DEV_FIX',
  'STRATEGY_BUILD',
  'RESEARCH_INTEL',
  'LEGAL_COMPLIANCE',
  'CONTENT_STUDIO',
  'SUPPORT_OPS'
]);

function text(value) {
  if (value === undefined || value === null) return '';
  if (Array.isArray(value)) return value.filter(Boolean).map(String).join('\n');
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value).trim();
}

function list(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(item => String(item).trim()).filter(Boolean);
  const single = text(value);
  return single ? [single] : [];
}

function normalizeArtifact(input = {}) {
  const timestamp = input.timestamp || new Date().toISOString();
  const mode = MODES.has(input.mode) ? input.mode : 'SUPPORT_OPS';
  const locale = ['de', 'sr', 'en'].includes(input.locale) ? input.locale : 'de';
  const runId = text(input.run_id) || `dh_${Date.now()}_${crypto.randomBytes(5).toString('hex')}`;

  return {
    run_id: runId,
    timestamp,
    mode,
    input: {
      raw: text(input.raw_input ?? input.raw),
      locale,
      source: text(input.source) || 'web'
    },
    agent: {
      lead: text(input.lead_agent) || 'daninihub.analysis',
      support: list(input.support_agents)
    },
    evidence: {
      used: Boolean(input.evidence_used),
      sources: list(input.evidence_sources),
      notes: text(input.evidence_notes)
    },
    result: {
      summary: text(input.summary),
      sections: {
        A_problem: text(input.A_problem),
        B_evidence: text(input.B_evidence),
        C_plan: text(input.C_plan),
        D_execution: text(input.D_execution),
        E_next: text(input.E_next)
      },
      decision: ['GO', 'REDEFINE', 'STOP'].includes(input.decision) ? input.decision : 'REDEFINE',
      decision_reason: text(input.decision_reason),
      insights: list(input.insights),
      assumptions: list(input.assumptions)
    },
    risks: list(input.risks),
    next_step: text(input.next_step),
    controller: {
      validated: Boolean(input.validated),
      status: ['approved', 'blocked', 'needs_more_evidence'].includes(input.controller_status)
        ? input.controller_status
        : 'needs_more_evidence',
      reason: text(input.controller_reason)
    }
  };
}

function saveArtifact(artifact, outputDir = 'artifacts/json') {
  if (!artifact || !artifact.run_id) throw new Error('saveArtifact: artifact.run_id nedostaje.');
  const dir = path.isAbsolute(outputDir) ? outputDir : path.join(process.cwd(), outputDir);
  fs.mkdirSync(dir, { recursive: true });
  const target = path.join(dir, `${artifact.run_id}.json`);
  const temp = `${target}.${process.pid}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  fs.renameSync(temp, target);
  return target;
}

module.exports = { normalizeArtifact, saveArtifact };
