function requestAudit(req, res, next) {
  req.audit = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip
  };

  console.log('[AUDIT]', JSON.stringify(req.audit));

  next();
}

module.exports = {
  requestAudit
};
