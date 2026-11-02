import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/server-auth";
import { getStudioServiceHeaders } from "@/lib/studio-service";
import { getStudioById } from "@/lib/studios";
import { parseStudioInput } from "@/lib/studio-validation";

type RouteContext = {
  params: Promise<{ studioId: string }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function getOwnedStudio(studioId: string, email: string) {
  try {
    const studio = await getStudioById(studioId);
    if (!studio) return { response: Response.json({ message: "Studio listing not found." }, { status: 404 }) };
    if (studio.ownerEmail?.trim().toLowerCase() !== email.trim().toLowerCase()) {
      return { response: Response.json({ message: "Studio listing not found." }, { status: 404 }) };
    }

    return { studio };
  } catch (error) {
    console.error("Failed to verify studio listing ownership:", error);
    return {
      response: Response.json(
        { message: "The studio service is unavailable. Please try again later." },
        { status: 502 },
      ),
    };
  }
}

async function forwardMutation(
  studioId: string,
  email: string,
  method: "PUT" | "PATCH" | "DELETE",
  body?: string,
) {
  const headers = getStudioServiceHeaders(email);
  if (!headers) {
    console.error("BOOKING_API_SECRET is not configured for studio mutations.");
    return Response.json(
      { message: "The studio service is not configured. Please try again later." },
      { status: 503 },
    );
  }

  let response: Response;
  try {
    response = await fetch(
      `http://localhost:5000/studios/${encodeURIComponent(studioId)}`,
      {
        method,
        headers,
        ...(body ? { body } : {}),
        cache: "no-store",
      },
    );
  } catch (error) {
    console.error(`Failed to ${method.toLowerCase()} studio listing:`, error);
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
        : `Could not ${method.toLowerCase()} studio listing (${response.status} ${response.statusText}).`;
    return Response.json({ message }, { status: response.status });
  }

  if (!isRecord(result)) {
    console.error(`Studio service returned an invalid ${method} response.`);
    return Response.json(
      { message: "The studio service returned an invalid response." },
      { status: 502 },
    );
  }

  revalidatePath("/my-listings");
  return Response.json(result, { status: response.status });
}

async function updateStudio(
  request: Request,
  context: RouteContext,
  method: "PUT" | "PATCH",
) {
  const user = await getCurrentUser();
  if (!user?.email) {
    return Response.json(
      { message: "Please sign in to edit studio listings." },
      { status: 401 },
    );
  }

  const { studioId } = await context.params;
  if (!/^[a-f\d]{24}$/i.test(studioId)) {
    return Response.json(
      { message: "Please provide a valid studio ID." },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { message: "The submitted studio details were not valid JSON." },
      { status: 400 },
    );
  }

  if (!isRecord(body)) {
    return Response.json(
      { message: "Please provide valid studio details." },
      { status: 400 },
    );
  }

  const owned = await getOwnedStudio(studioId, user.email);
  if (owned.response) return owned.response;

  const requiredFields = [
    "title",
    "category",
    "hourlyRate",
    "securityDeposit",
    "maxCapacity",
    "rating",
    "location",
    "imageUrl",
    "amenities",
    "overview",
  ];
  if (
    method === "PUT" &&
    requiredFields.some((field) => !(field in body))
  ) {
    return Response.json(
      { message: "Please provide all required studio details." },
      { status: 400 },
    );
  }

  const studio = parseStudioInput({
    ...owned.studio,
    ...body,
    rating: body.rating ?? owned.studio.rating,
  });
  if (!studio) {
    return Response.json(
      { message: "Please check the studio details and try again." },
      { status: 400 },
    );
  }

  return forwardMutation(studioId, user.email, method, JSON.stringify(studio));
}

export async function PUT(request: Request, context: RouteContext) {
  return updateStudio(request, context, "PUT");
}

export async function PATCH(request: Request, context: RouteContext) {
  return updateStudio(request, context, "PATCH");
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user?.email) {
    return Response.json(
      { message: "Please sign in to delete studio listings." },
      { status: 401 },
    );
  }

  const { studioId } = await context.params;
  if (!/^[a-f\d]{24}$/i.test(studioId)) {
    return Response.json(
      { message: "Please provide a valid studio ID." },
      { status: 400 },
    );
  }

  const owned = await getOwnedStudio(studioId, user.email);
  if (owned.response) return owned.response;

  const response = await forwardMutation(studioId, user.email, "DELETE");
  if (response.ok) {
    revalidatePath("/my-listings");
  }
  return response;
}
