const GATES = Object.freeze([
  {
    id: 0,
    code: 'GATE_0',
    name: 'Fit Check',
    purpose: 'Protect user focus, capacity and triad alignment before project work begins.',
    requiredDecision: ['GO', 'REDEFINE', 'STOP'],
    systemPowerCost: 10
  },
  {
    id: 1,
    code: 'GATE_1',
    name: 'Problem Definition',
    purpose: 'Define the real problem, target user and measurable output.',
    requiredDecision: ['GO', 'REDEFINE', 'STOP'],
    systemPowerCost: 15
  },
  {
    id: 2,
    code: 'GATE_2',
    name: 'Market Reality',
    purpose: 'Separate assumptions from evidence, demand, competition and legal constraints.',
    requiredDecision: ['GO', 'REDEFINE', 'STOP'],
    systemPowerCost: 20
  },
  {
    id: 3,
    code: 'GATE_3',
    name: 'Offer Blueprint',
    purpose: 'Convert project logic into a responsible offer, artifact or service structure.',
    requiredDecision: ['GO', 'REDEFINE', 'STOP'],
    systemPowerCost: 25
  },
  {
    id: 4,
    code: 'GATE_4',
    name: 'Build Protocol',
    purpose: 'Define build sequence, integrations, legal boundaries, support and delivery.',
    requiredDecision: ['GO', 'REDEFINE', 'STOP'],
    systemPowerCost: 30
  },
  {
    id: 5,
    code: 'GATE_5',
    name: 'Launch & Feedback',
    purpose: 'Prepare public release, moderation, feedback, reviewbook and monetization loop.',
    requiredDecision: ['GO', 'REDEFINE', 'STOP'],
    systemPowerCost: 35
  }
]);

function getGate(gateId) {
  const id = Number(gateId);
  return GATES.find((gate) => gate.id === id) || null;
}

module.exports = { GATES, getGate };
