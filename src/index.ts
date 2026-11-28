import type { Env } from "./lib/env";
import { handleRequest } from "./request-handler";
import { cleanup } from "./security/retention";

export { IntakeWorkflow } from "./workflows/intake";

export default {
  fetch: handleRequest,

  async scheduled(
    _event: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ) {
    ctx.waitUntil(cleanup(env));
  },
};
