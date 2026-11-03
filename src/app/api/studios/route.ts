import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentUser } from "@/lib/server-auth";
import {
  attachBackendAuthCookie,
  getBackendAuthToken,
  getBackendCookieHeader,
} from "@/lib/backend-auth";
import { STUDIOS_CACHE_TAG } from "@/lib/studios-server";
import { parseStudioInput } from "@/lib/studio-validation";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.email) {
    return Response.json(
      { message: "Please sign in to create a listing." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { message: "The submitted form was not valid JSON." },
      { status: 400 },
    );
  }

  const studio = parseStudioInput(body);
  if (!studio) {
    return Response.json(
      { message: "Please check the studio details and try again." },
      { status: 400 },
    );
  }

  let backendAuth;
  try {
    backendAuth = await getBackendAuthToken();
  } catch {
    return Response.json(
      { message: "Your secure session could not be prepared. Please sign in again." },
      { status: 503 },
    );
  }
  if (!backendAuth) {
    return Response.json({ message: "Please sign in to create a listing." }, { status: 401 });
  }

  let response: Response;
  try {
    response = await fetch(`${process.env.BACKEND_URL}/studios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: getBackendCookieHeader(backendAuth),
      },
      body: JSON.stringify(studio),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to create studio listing:", error);
    return attachBackendAuthCookie(Response.json(
      { message: "The studio service is unavailable. Please try again later." },
      { status: 502 },
    ), backendAuth);
  }

  let result: unknown = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    const message =
      isRecord(result) && typeof result.message === "string"
        ? result.message
        : `Could not create listing (${response.status} ${response.statusText}).`;
    return attachBackendAuthCookie(
      Response.json({ message }, { status: response.status }),
      backendAuth,
    );
  }

  if (!isRecord(result)) {
    console.error("Studio service returned an invalid create response.");
    return attachBackendAuthCookie(Response.json(
      { message: "The studio service returned an invalid response." },
      { status: 502 },
    ), backendAuth);
  }

  revalidateTag(STUDIOS_CACHE_TAG, { expire: 0 });
  revalidatePath("/my-listings");
  return attachBackendAuthCookie(
    Response.json(result, { status: 201 }),
    backendAuth,
  );
}
