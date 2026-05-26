const ledger = [];

function assertLedgerEntry(entry = {}) {
  if (!entry.projectId || !entry.userId || !entry.source || !entry.mode) {
    const error = new Error('Ledger entry requires projectId, userId, source and mode.');
    error.status = 422;
    throw error;
  }

  const power = Number(entry.systemPowerUsed || 0);

  if (!Number.isFinite(power) || power < 0) {
    const error = new Error('systemPowerUsed must be a non-negative number.');
    error.status = 422;
    throw error;
  }

  return power;
}

function registerUsage(entry = {}) {
  const systemPowerUsed = assertLedgerEntry(entry);

  const payload = {
    id: `ledger_${Date.now()}_${ledger.length + 1}`,
    timestamp: new Date().toISOString(),
    projectId: entry.projectId,
    userId: entry.userId,
    source: entry.source,
    mode: entry.mode,
    systemPowerUsed,
    status: entry.status || 'recorded'
  };

  ledger.push(payload);

  return payload;
}

function getUsageByUser(userId) {
  return ledger.filter((item) => item.userId === userId);
}

function getLedgerSnapshot() {
  return {
    entries: ledger,
    totalEntries: ledger.length,
    unit: 'SYSTEM_POWER'
  };
}

module.exports = {
  registerUsage,
  getUsageByUser,
  getLedgerSnapshot
};
