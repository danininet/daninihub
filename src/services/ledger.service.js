const ledger = [];

function registerUsage(entry) {
  const payload = {
    id: `ledger_${Date.now()}`,
    timestamp: new Date().toISOString(),
    projectId: entry.projectId,
    userId: entry.userId,
    source: entry.source,
    mode: entry.mode,
    systemPowerUsed: entry.systemPowerUsed,
    status: entry.status || 'recorded'
  };

  ledger.push(payload);

  return payload;
}

function getUsageByUser(userId) {
  return ledger.filter((item) => item.userId === userId);
}

module.exports = {
  registerUsage,
  getUsageByUser
};
