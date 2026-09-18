const assert = require('assert');
const { approvalFor, evaluateMarketTest, createRun } = require('../core/revenue-os');

assert.equal(approvalFor('market_research').required, false);
assert.equal(approvalFor('spend_money').required, true);
assert.equal(approvalFor('send_external_message', { preapproved_campaign: false }).required, true);
assert.equal(approvalFor('send_external_message', { preapproved_campaign: true }).required, false);

const run = createRun({ market: 'DACH', segment: 'local-services' });
assert.equal(run.stage, 'SIGNAL');
assert.equal(run.owner_role, 'controller');

const early = evaluateMarketTest({ targeted_contacts: 10, positive_replies: 0, paid_customers: 0 });
assert.equal(early.decision, 'CONTINUE_TEST');

const bad = evaluateMarketTest({ targeted_contacts: 50, positive_replies: 0, qualified_conversations: 0, paid_customers: 0 });
assert.equal(bad.decision, 'KILL_OR_REDEFINE');

const paid = evaluateMarketTest({ targeted_contacts: 15, positive_replies: 2, qualified_conversations: 1, paid_customers: 1 });
assert.equal(paid.decision, 'SCALE');

console.log('Revenue OS policy tests passed.');
