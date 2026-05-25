const TIERS = Object.freeze({
  START: {
    id: 'START',
    label: 'START',
    activeProjects: 1,
    monthlySystemPower: 100,
    gates: ['0', '1', '2', '3', '4', '5'],
    artifactAccess: ['project_activation_pack'],
    adminReview: false
  },
  BUILDER: {
    id: 'BUILDER',
    label: 'BUILDER',
    activeProjects: 3,
    monthlySystemPower: 500,
    gates: ['0', '1', '2', '3', '4', '5'],
    artifactAccess: ['project_activation_pack', 'gate_outputs', 'launch_notes'],
    adminReview: false
  },
  PRO: {
    id: 'PRO',
    label: 'PRO',
    activeProjects: 10,
    monthlySystemPower: 1500,
    gates: ['0', '1', '2', '3', '4', '5'],
    artifactAccess: ['project_activation_pack', 'gate_outputs', 'launch_notes', 'audit_snapshot'],
    adminReview: true
  },
  ULTIMATE: {
    id: 'ULTIMATE',
    label: 'ULTIMATE',
    activeProjects: 25,
    monthlySystemPower: 5000,
    gates: ['0', '1', '2', '3', '4', '5'],
    artifactAccess: ['project_activation_pack', 'gate_outputs', 'launch_notes', 'audit_snapshot', 'partner_review'],
    adminReview: true
  }
});

function getTier(tierId = 'START') {
  return TIERS[tierId] || TIERS.START;
}

module.exports = { TIERS, getTier };
