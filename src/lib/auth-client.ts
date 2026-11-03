import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    typeof window === "undefined"
      ? process.env.BETTER_AUTH_URL
      : window.location.origin,
});

export const { signIn, signUp, useSession } = authClient;

export async function syncBackendAuthCookie(): Promise<void> {
  const response = await fetch("/api/auth/backend-cookie", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Your secure session could not be prepared. Please sign in again.");
  }
}

export async function clearBackendAuthCookie(): Promise<void> {
  const response = await fetch("/api/auth/backend-cookie", {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Your secure session could not be cleared. Please try again.");
  }
}