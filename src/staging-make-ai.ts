// Dedicated staging entrypoint. Production still uses src/index.ts.
import worker, { IntakeWorkflow } from "./index";
import { makeAiBridge, type BridgeEnv } from "./api/make-ai-bridge";
export { IntakeWorkflow };
interface StagingEnv extends BridgeEnv {
  MAKE_AI_BRIDGE_APPROVED?: string;
  MAKE_AI_BRIDGE_AI?: BridgeEnv["AI"];
}
export default {
  ...worker,
  async fetch(request: Request, env: StagingEnv): Promise<Response> {
    if (new URL(request.url).pathname !== "/api/internal/make-ai-test")
      return worker.fetch(request, env);
    // Do not enable the existing B2B workflow or its AI processing.
    return makeAiBridge(request, {
      ...env,
      AI_ENABLED: env.MAKE_AI_BRIDGE_APPROVED,
      DANINI_AI_LIVE_APPROVED: env.MAKE_AI_BRIDGE_APPROVED,
      AI: env.MAKE_AI_BRIDGE_AI,
    });
  },
};
