import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentUser } from "@/lib/server-auth";
import { getStudioServiceHeaders } from "@/lib/studio-service";
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

  const headers = getStudioServiceHeaders(user.email);
  if (!headers) {
    console.error("BOOKING_API_SECRET is not configured for studio mutations.");
    return Response.json(
      { message: "The studio service is not configured. Please try again later." },
      { status: 503 },
    );
  }

  let response: Response;
  try {
    response = await fetch(`${process.env.BACKEND_URL}/studios`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...studio,
        ownerName: user.name?.trim() || user.email,
      }),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to create studio listing:", error);
    return Response.json(
      { message: "The studio service is unavailable. Please try again later." },
      { status: 502 },
    );
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
    return Response.json({ message }, { status: response.status });
  }

  if (!isRecord(result)) {
    console.error("Studio service returned an invalid create response.");
    return Response.json(
      { message: "The studio service returned an invalid response." },
      { status: 502 },
    );
  }

  revalidateTag(STUDIOS_CACHE_TAG, { expire: 0 });
  revalidatePath("/my-listings");
  return Response.json(result, { status: 201 });
}
