function validateExecution(task) {
  const allowedModes = [
    'DEV_FIX',
    'STRATEGY_BUILD',
    'RESEARCH_INTEL',
    'LEGAL_COMPLIANCE',
    'CONTENT_STUDIO',
    'SUPPORT_OPS'
  ];

  if (!allowedModes.includes(task.mode)) {
    throw new Error(`USTAV violation: unsupported execution mode ${task.mode}`);
  }

  return {
    status: 'PASS',
    summary: {
      mode: task.mode,
      evidenceCount: task.evidence.length,
      validatedAt: new Date().toISOString()
    }
  };
}

module.exports = {
  validateExecution
};
