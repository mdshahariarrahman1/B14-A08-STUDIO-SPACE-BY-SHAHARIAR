import {
  attachBackendAuthCookie,
  BACKEND_AUTH_COOKIE,
  clearBackendAuthCookie,
  createBackendAuthToken,
} from "@/lib/backend-auth";
import { getCurrentUser } from "@/lib/server-auth";

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = await createBackendAuthToken();
    return attachBackendAuthCookie(new Response(null, { status: 204 }), token);
  } catch {
    return Response.json(
      { error: "The secure session could not be prepared." },
      { status: 503 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const response = new Response(null, { status: 204 });
  clearBackendAuthCookie(response);
  return response;
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.redirect(new URL("/login", request.url), 303);
  }

  const requestedCallback = new URL(request.url).searchParams.get("callbackURL");
  const callbackPath =
    requestedCallback?.startsWith("/") &&
    !requestedCallback.startsWith("//") &&
    !requestedCallback.includes("\\")
      ? requestedCallback
      : "/";
  const destination = new URL(callbackPath, request.url);

  try {
    const token = await createBackendAuthToken();
    const response = Response.redirect(destination, 303);
    response.headers.append(
      "Set-Cookie",
      `${BACKEND_AUTH_COOKIE}=${encodeURIComponent(token.value)}; Path=/; Max-Age=${token.maxAge ?? 900}; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
    );
    return response;
  } catch {
    return Response.redirect(new URL("/login?error=session", request.url), 303);
  }
}
