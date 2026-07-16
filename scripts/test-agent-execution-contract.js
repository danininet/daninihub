'use strict';

const assert = require('assert');
const {
  normalizeTask,
  runAgentExecutionTask,
  tokenCostForAgent
} = require('../core/agent-execution-layer');

async function main() {
  const parsed = normalizeTask('MODE: DEV_FIX\nOWNER TASK: Stabilizuj execution layer');
  assert.strictEqual(parsed.mode, 'DEV_FIX');
  assert.strictEqual(parsed.ownerTask, 'Stabilizuj execution layer');

  assert.strictEqual(tokenCostForAgent('unknown.agent'), 5);
  assert.strictEqual(tokenCostForAgent('seo.keyword.master'), 15);
  assert.strictEqual(tokenCostForAgent('pdf_generator'), 50);

  const dryRun = await runAgentExecutionTask(
    'MODE: QA\nOWNER TASK: Proveri ugovor',
    { applyChanges: false }
  );
  assert.strictEqual(dryRun.ok, true);
  assert.strictEqual(dryRun.status, 'dry_run');
  assert.strictEqual(dryRun.result.mutationsApplied, false);

  const blocked = await runAgentExecutionTask('OWNER TASK: Primeni izmene');
  assert.strictEqual(blocked.ok, false);
  assert.strictEqual(blocked.status, 'blocked');
  assert.strictEqual(blocked.error.code, 'EXECUTOR_NOT_CONNECTED');

  const completed = await runAgentExecutionTask(
    'MODE: TEST\nOWNER TASK: Izvrsi test',
    {
      executor: async task => ({ received: task.ownerTask })
    }
  );
  assert.strictEqual(completed.ok, true);
  assert.strictEqual(completed.status, 'completed');
  assert.deepStrictEqual(completed.result, { received: 'Izvrsi test' });

  console.log('Danini OS execution contract: OK');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
