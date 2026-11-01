import { getCurrentUser } from "@/lib/server-auth";
import { STUDIO_AMENITIES, STUDIO_CATEGORIES } from "@/lib/studio-options";

type NewStudioInput = {
  title: string;
  category: (typeof STUDIO_CATEGORIES)[number];
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
};

function isStudioCategory(
  value: unknown,
): value is (typeof STUDIO_CATEGORIES)[number] {
  return (
    typeof value === "string" &&
    STUDIO_CATEGORIES.some((category) => category === value)
  );
}

function isStudioAmenity(value: unknown): value is string {
  return (
    typeof value === "string" &&
    STUDIO_AMENITIES.some((amenity) => amenity === value)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseNewStudio(value: unknown): NewStudioInput | null {
  if (!isRecord(value)) return null;

  const {
    title,
    category,
    hourlyRate,
    securityDeposit,
    maxCapacity,
    location,
    imageUrl,
    amenities,
    overview,
  } = value;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    title.trim().length > 120 ||
    !isStudioCategory(category) ||
    typeof hourlyRate !== "number" ||
    !Number.isFinite(hourlyRate) ||
    hourlyRate <= 0 ||
    typeof securityDeposit !== "number" ||
    !Number.isFinite(securityDeposit) ||
    securityDeposit < 0 ||
    typeof maxCapacity !== "number" ||
    !Number.isInteger(maxCapacity) ||
    maxCapacity < 1 ||
    typeof location !== "string" ||
    !location.trim() ||
    typeof imageUrl !== "string" ||
    typeof overview !== "string" ||
    !overview.trim() ||
    overview.trim().length > 4000 ||
    !Array.isArray(amenities) ||
    !amenities.every(isStudioAmenity)
  ) {
    return null;
  }

  try {
    const image = new URL(imageUrl);
    if (image.protocol !== "http:" && image.protocol !== "https:") return null;
  } catch {
    return null;
  }

  return {
    title: title.trim(),
    category,
    hourlyRate,
    securityDeposit,
    maxCapacity,
    location: location.trim(),
    imageUrl,
    amenities: [...new Set(amenities)],
    overview: overview.trim(),
  };
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.email) {
    return Response.json({ message: "Please sign in to create a listing." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "The submitted form was not valid JSON." }, { status: 400 });
  }

  const studio = parseNewStudio(body);
  if (!studio) {
    return Response.json({ message: "Please check the studio details and try again." }, { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch("http://localhost:5000/studios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...studio,
        ownerEmail: user.email,
        ownerName: user.name?.trim() || user.email,
        rating: 0,
        reviewCount: 0,
        isAvailable: true,
      }),
      cache: "no-store",
    });
  } catch {
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

  return Response.json(
    isRecord(result) ? result : { message: "Studio listing created." },
    { status: 201 },
  );
}
