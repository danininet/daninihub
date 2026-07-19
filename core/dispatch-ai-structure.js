'use strict';

const OpenAI = require('openai');

const clean = (value, max = 5000) => String(value || '').trim().slice(0, max);

function dispatchStructureSchema() {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['facts', 'unknowns', 'risk', 'nextCheck', 'decisionRequired', 'decisionOwner', 'draftMessage'],
    properties: {
      facts: { type: 'array', items: { type: 'string' }, maxItems: 12 },
      unknowns: { type: 'array', items: { type: 'string' }, maxItems: 12 },
      risk: { type: 'string', enum: ['NIZAK', 'SREDNJI', 'VISOK', 'KRITIČAN'] },
      nextCheck: { type: 'string' },
      decisionRequired: { type: 'string' },
      decisionOwner: { type: 'string' },
      draftMessage: { type: 'string' }
    }
  };
}

function dispatchInstructions() {
  return [
    'You structure fictitious transport operations messages for an internal DaniniHub workspace.',
    'Do not make operational decisions and do not execute any external action.',
    'Facts must contain only information explicitly present in the user input.',
    'Anything uncertain, missing, estimated or inferred belongs in unknowns.',
    'Risk is an operational attention level, not an authorization or final decision.',
    'If no next check is explicitly provided, propose a clearly labelled internal check point without claiming it was confirmed.',
    'If no decision owner is named, write NIJE NAVEDENO.',
    'The German draft message must be cautious, factual and non-binding.',
    'The German draft must not confirm a new slot, price, route, driver instruction or legal commitment.',
    'Return only the requested structured object.'
  ].join('\n');
}

function buildDispatchInput(input) {
  return [
    `FICTITIOUS: ${input.fictitious === true ? 'YES' : 'NO'}`,
    `Route context: ${clean(input.route, 300) || 'not provided'}`,
    `Vehicle context: ${clean(input.vehicle, 200) || 'not provided'}`,
    `Raw message:\n${clean(input.rawMessage, 5000)}`
  ].join('\n\n');
}

function normalizeResult(value) {
  const result = value && typeof value === 'object' ? value : {};
  return {
    facts: Array.isArray(result.facts) ? result.facts.map(item => clean(item, 500)).filter(Boolean).slice(0, 12) : [],
    unknowns: Array.isArray(result.unknowns) ? result.unknowns.map(item => clean(item, 500)).filter(Boolean).slice(0, 12) : [],
    risk: ['NIZAK', 'SREDNJI', 'VISOK', 'KRITIČAN'].includes(result.risk) ? result.risk : 'SREDNJI',
    nextCheck: clean(result.nextCheck, 200),
    decisionRequired: clean(result.decisionRequired, 1000),
    decisionOwner: clean(result.decisionOwner, 300) || 'NIJE NAVEDENO',
    draftMessage: clean(result.draftMessage, 3000)
  };
}

async function structureDispatchMessage(input, options = {}) {
  if (!input || input.fictitious !== true) {
    const error = new Error('FICTITIOUS_CASE_REQUIRED');
    error.code = 'FICTITIOUS_CASE_REQUIRED';
    throw error;
  }
  const rawMessage = clean(input.rawMessage, 5000);
  if (!rawMessage) {
    const error = new Error('RAW_MESSAGE_REQUIRED');
    error.code = 'RAW_MESSAGE_REQUIRED';
    throw error;
  }

  const client = options.client || new OpenAI();
  const model = options.model || process.env.OPENAI_DISPATCH_MODEL || process.env.OPENAI_MODEL || 'gpt-5';
  const response = await client.responses.create({
    model,
    input: [
      { role: 'system', content: [{ type: 'input_text', text: dispatchInstructions() }] },
      { role: 'user', content: [{ type: 'input_text', text: buildDispatchInput({ ...input, rawMessage }) }] }
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'dispatch_case_structure',
        strict: true,
        schema: dispatchStructureSchema()
      }
    }
  });

  const outputText = clean(response.output_text, 12000);
  if (!outputText) {
    const error = new Error('DISPATCH_AI_EMPTY_OUTPUT');
    error.code = 'DISPATCH_AI_EMPTY_OUTPUT';
    throw error;
  }

  try {
    return normalizeResult(JSON.parse(outputText));
  } catch {
    const error = new Error('DISPATCH_AI_INVALID_JSON');
    error.code = 'DISPATCH_AI_INVALID_JSON';
    throw error;
  }
}

module.exports = {
  buildDispatchInput,
  dispatchInstructions,
  dispatchStructureSchema,
  normalizeResult,
  structureDispatchMessage
};
