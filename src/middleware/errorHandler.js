function errorHandler(error, req, res, next) {
  console.error('[SYSTEM_ERROR]', {
    message: error.message,
    path: req.path,
    timestamp: new Date().toISOString()
  });

  res.status(error.status || 500).json({
    status: 'error',
    message: error.message || 'DaniniHub runtime error'
  });
}

module.exports = {
  errorHandler
};
