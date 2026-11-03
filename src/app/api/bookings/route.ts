import { getCurrentUser } from "@/lib/server-auth";
import { mongoDb } from "@/lib/mongodb";
import {
  attachBackendAuthCookie,
  getBackendAuthToken,
  getBackendCookieHeader,
} from "@/lib/backend-auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.email) {
    return Response.json({ message: "Please sign in to view your bookings." }, { status: 401 });
  }

  try {
    const bookings = await mongoDb
      .collection("bookings")
      .find({
        $or: [
          { "user.email": user.email.trim().toLowerCase() },
          { userEmail: user.email.trim().toLowerCase() },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      bookings: bookings.map((booking) => ({
        ...booking,
        id: booking._id.toString(),
        _id: undefined,
        createdAt:
          booking.createdAt instanceof Date
            ? booking.createdAt.toISOString()
            : booking.createdAt,
        updatedAt:
          booking.updatedAt instanceof Date
            ? booking.updatedAt.toISOString()
            : booking.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Failed to load bookings:", error);
    return Response.json(
      { message: "Bookings could not be loaded. Please try again." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.email) {
    return Response.json({ message: "Please sign in before booking a studio." }, { status: 401 });
  }

  let booking: unknown;
  try {
    booking = await request.json();
  } catch {
    return Response.json({ message: "The submitted booking was not valid JSON." }, { status: 400 });
  }

  if (
    typeof booking !== "object" ||
    booking === null ||
    Array.isArray(booking)
  ) {
    return Response.json({ message: "Please provide a valid booking." }, { status: 400 });
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
    return Response.json({ message: "Please sign in before booking a studio." }, { status: 401 });
  }

  let response: Response;
  try {
    response = await fetch(`${process.env.BACKEND_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: getBackendCookieHeader(backendAuth),
      },
      body: JSON.stringify(booking),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to create booking through the studio service:", error);
    return attachBackendAuthCookie(
      Response.json(
        { message: "The studio service is unavailable. Please try again later." },
        { status: 502 },
      ),
      backendAuth,
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
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : "The booking could not be saved. Please try again.";
    return attachBackendAuthCookie(
      Response.json({ message }, { status: response.status }),
      backendAuth,
    );
  }

  if (typeof result !== "object" || result === null || Array.isArray(result)) {
    console.error("The studio service returned an invalid booking response.");
    return attachBackendAuthCookie(
      Response.json(
        { message: "The studio service returned an invalid response." },
        { status: 502 },
      ),
      backendAuth,
    );
  }

  return attachBackendAuthCookie(
    Response.json(result, { status: response.status }),
    backendAuth,
  );
}
