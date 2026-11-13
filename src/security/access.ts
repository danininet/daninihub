import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Env } from "../lib/env";
import { HttpError, sameOrigin } from "./http";
const sets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
export async function authorizeOwner(request: Request, env: Env) {
  const issuer = env.ACCESS_TEAM_DOMAIN;
  if (
    !issuer ||
    !/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(issuer) ||
    !env.ACCESS_AUD ||
    !env.DIRECTOR_EMAIL
  )
    throw new HttpError(503, "owner_login_not_configured");
  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token || token.length > 16000) throw new HttpError(401, "unauthorized");
  let email: string;
  try {
    let keys = sets.get(issuer);
    if (!keys) {
      keys = createRemoteJWKSet(new URL(issuer + "/cdn-cgi/access/certs"), {
        timeoutDuration: 5000,
      });
      sets.set(issuer, keys);
    }
    const { payload } = await jwtVerify(token, keys, {
      issuer,
      audience: env.ACCESS_AUD,
      algorithms: ["RS256"],
      requiredClaims: ["exp", "iat", "sub", "email"],
    });
    if (
      typeof payload.email !== "string" ||
      payload.email.toLowerCase() !== env.DIRECTOR_EMAIL.toLowerCase()
    )
      throw Error();
    email = payload.email.toLowerCase();
  } catch {
    throw new HttpError(401, "unauthorized");
  }
  if (request.method !== "GET" && request.method !== "HEAD")
    sameOrigin(request, env.SITE_ORIGIN!);
  return email;
}
