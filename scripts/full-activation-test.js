require('dotenv').config();

const fs = require('fs');
const controller = require('../core/controller');
const { readLastAudit } = require('../core/audit');

const task =
  process.argv.slice(2).join(' ').trim() ||
  'strategija: izvrši DaniniHub full activation test prema Ustavu za 7 EUR aktivacioni tok. Vrati kratak, strukturisan rezultat.';

async function run() {
  console.log('============================================================');
  console.log('DANINIHUB FULL ACTIVATION TEST');
  console.log('============================================================');
  console.log('TASK:', task);
  console.log('');

  const result = await controller.verifyAndExecute(task, 'de');

  if (!result.success) {
    console.log('STATUS: FAILED');
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  }

  const checks = {
    artifact_path_exists: Boolean(result.artifact_path && fs.existsSync(result.artifact_path)),
    pdf_path_exists: Boolean(result.pdf_path && fs.existsSync(result.pdf_path)),
    email_html_path_exists: Boolean(result.email_html_path && fs.existsSync(result.email_html_path)),
    audit_has_latest_run: readLastAudit(10).some(row => row.run_id === result.artifact?.run_id)
  };

  console.log('STATUS: SUCCESS');
  console.log('');
  console.log(JSON.stringify({
    run_id: result.artifact?.run_id,
    artifact_path: result.artifact_path,
    pdf_path: result.pdf_path,
    email_html_path: result.email_html_path,
    checks
  }, null, 2));

  const failedChecks = Object.entries(checks).filter(([, value]) => !value);

  if (failedChecks.length) {
    console.log('');
    console.log('CHECK_FAILURES:', failedChecks.map(([key]) => key).join(', '));
    process.exit(1);
  }

  console.log('');
  console.log('FULL ACTIVATION TEST PASSED');
}

run().catch(error => {
  console.error('FULL_ACTIVATION_TEST_ERROR:', error.message);
  process.exit(1);
});
