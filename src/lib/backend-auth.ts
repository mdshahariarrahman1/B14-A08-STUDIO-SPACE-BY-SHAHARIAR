import "server-only";

import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/lib/server-auth";

export const BACKEND_AUTH_COOKIE = "studio_access_token";

const TOKEN_LIFETIME_SECONDS = 15 * 60;

type BackendAuthToken = {
  value: string;
  refreshed: boolean;
  maxAge?: number;
};

function getTokenExpiry(token: string): number | null {
  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const claims: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    if (
      typeof claims === "object" &&
      claims !== null &&
      "exp" in claims &&
      typeof claims.exp === "number"
    ) {
      return claims.exp;
    }
  } catch {
    return null;
  }

  return null;
}

export async function getBackendAuthToken(
  options: { forceRefresh?: boolean } = {},
): Promise<BackendAuthToken | null> {
  const user = await getCurrentUser();
  if (!user?.id || !user.email) return null;

  const cookieStore = await cookies();
  const existingToken = cookieStore.get(BACKEND_AUTH_COOKIE)?.value;
  const existingExpiry = existingToken ? getTokenExpiry(existingToken) : null;
  const now = Math.floor(Date.now() / 1000);

  if (
    !options.forceRefresh &&
    existingToken &&
    existingExpiry !== null &&
    existingExpiry > now + 30
  ) {
    return { value: existingToken, refreshed: false };
  }

  const result = await auth.api.getToken({ headers: await headers() });
  if (!result.token) {
    throw new Error("The authenticated service token could not be issued.");
  }

  const expiry = getTokenExpiry(result.token);
  return {
    value: result.token,
    refreshed: true,
    maxAge: expiry === null
      ? TOKEN_LIFETIME_SECONDS
      : Math.max(0, expiry - Math.floor(Date.now() / 1000)),
  };
}

function serializeAccessCookie(maxAge: number): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${BACKEND_AUTH_COOKIE}=; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`;
}

export function attachBackendAuthCookie(
  response: Response,
  token: BackendAuthToken,
): Response {
  if (token.refreshed && token.maxAge !== undefined) {
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    response.headers.append(
      "Set-Cookie",
      `${BACKEND_AUTH_COOKIE}=${encodeURIComponent(token.value)}; Path=/; Max-Age=${token.maxAge}; HttpOnly; SameSite=Lax${secure}`,
    );
  }

  return response;
}

export function clearBackendAuthCookie(response: Response): Response {
  response.headers.append(
    "Set-Cookie",
    serializeAccessCookie(0).replace(
      "Max-Age=0",
      "Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    ),
  );
  return response;
}

export function getBackendCookieHeader(token: BackendAuthToken): string {
  return `${BACKEND_AUTH_COOKIE}=${encodeURIComponent(token.value)}`;
}

export async function createBackendAuthToken(): Promise<BackendAuthToken> {
  const result = await auth.api.getToken({ headers: await headers() });
  if (!result.token) {
    throw new Error("The authenticated service token could not be issued.");
  }

  const expiry = getTokenExpiry(result.token);
  return {
    value: result.token,
    refreshed: true,
    maxAge: expiry === null
      ? TOKEN_LIFETIME_SECONDS
      : Math.max(0, expiry - Math.floor(Date.now() / 1000)),
  };
}
