import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentUser } from "@/lib/server-auth";
import {
  attachBackendAuthCookie,
  getBackendAuthToken,
  getBackendCookieHeader,
} from "@/lib/backend-auth";
import { STUDIOS_CACHE_TAG } from "@/lib/studios-server";
import { getStudioServiceHeaders } from "@/lib/studio-service";
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

  const serviceHeaders = getStudioServiceHeaders(user.email);
  if (!serviceHeaders) {
    return Response.json(
      { message: "Studio listing changes are not configured on this server." },
      { status: 503 },
    );
  }

  let backendAuth;
  try {
    backendAuth = await getBackendAuthToken();
  } catch (error) {
    console.error("Failed to prepare studio listing authentication:", error);
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
        ...serviceHeaders,
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

  if (response.status === 401) {
    let refreshedAuth;
    try {
      refreshedAuth = await getBackendAuthToken({ forceRefresh: true });
    } catch (error) {
      console.error("Failed to refresh studio listing authentication:", error);
      return Response.json(
        { message: "Your secure session could not be refreshed. Please sign in again." },
        { status: 503 },
      );
    }

    if (refreshedAuth) {
      backendAuth = refreshedAuth;
      try {
        response = await fetch(`${process.env.BACKEND_URL}/studios`, {
          method: "POST",
          headers: {
            ...serviceHeaders,
            Cookie: getBackendCookieHeader(backendAuth),
          },
          body: JSON.stringify(studio),
          cache: "no-store",
        });
      } catch (error) {
        console.error("Failed to retry studio listing creation:", error);
        return attachBackendAuthCookie(Response.json(
          { message: "The studio service is unavailable. Please try again later." },
          { status: 502 },
        ), backendAuth);
      }
    }
  }

  let result: unknown = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    const message =
      isRecord(result) &&
      typeof (result.message ?? result.error) === "string"
        ? String(result.message ?? result.error)
        : `Could not create listing (${response.status} ${response.statusText}).`;
    if (response.status === 401) {
      console.error("Studio service rejected the refreshed listing token.");
    } else if (response.status >= 500) {
      console.error("Studio service rejected listing creation:", {
        status: response.status,
        message,
      });
    }
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
