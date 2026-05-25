require('dotenv').config();

const { runAgentExecutionTask } = require('./core/agent-execution-layer');

function argValue(name, fallback = '') {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;

  const rest = process.argv.slice(index + 1);
  if (!rest.length) return fallback;

  const nextFlag = rest.findIndex(value => String(value).startsWith('--'));
  return (nextFlag === -1 ? rest : rest.slice(0, nextFlag)).join(' ').trim() || fallback;
}

async function main() {
  const rawTask = argValue('--task', process.argv.slice(2).join(' '));
  const applyChanges = !process.argv.includes('--dry-run');

  if (!rawTask) {
    throw new Error('TASK_REQUIRED. Primer: npm run agent:dev -- "MODE: DEV_FIX\\nOWNER TASK: ..."');
  }

  const result = await runAgentExecutionTask(rawTask, { applyChanges });

  console.log(JSON.stringify(result, null, 2));
}

main().catch(error => {
  console.error('[DANINIHUB_AGENT_EXECUTION_ERROR]', error.message);
  process.exit(1);
});
