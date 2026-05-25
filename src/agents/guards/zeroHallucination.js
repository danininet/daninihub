function assertEvidence(task) {
  if (!task || typeof task !== 'object') {
    throw new Error('Task payload missing');
  }

  if (!task.evidence || task.evidence.length === 0) {
    throw new Error('USTAV violation: execution blocked because evidence is missing');
  }

  if (task.simulated === true) {
    throw new Error('USTAV violation: simulated execution is forbidden');
  }

  return true;
}

module.exports = {
  assertEvidence
};
