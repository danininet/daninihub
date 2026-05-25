const controller = require('../core/controller');

async function executeOrchestrator(input, locale) {
    // Pozivamo metodu iz kontrolera
    return await controller.verifyAndExecute(input, locale);
}

module.exports = { executeOrchestrator };
