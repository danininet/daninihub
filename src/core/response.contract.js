const SYSTEM_ID = 'daninihub';

function now() {
  return new Date().toISOString();
}

function ok(data = {}) {
  return {
    system: SYSTEM_ID,
    status: 'ok',
    timestamp: now(),
    ...data
  };
}

function blocked(moduleName, reason, data = {}) {
  return {
    system: SYSTEM_ID,
    status: 'blocked',
    module: moduleName,
    reason,
    timestamp: now(),
    ...data
  };
}

function validationError(message, data = {}) {
  return {
    system: SYSTEM_ID,
    status: 'validation_error',
    message,
    timestamp: now(),
    ...data
  };
}

module.exports = {
  ok,
  blocked,
  validationError
};
