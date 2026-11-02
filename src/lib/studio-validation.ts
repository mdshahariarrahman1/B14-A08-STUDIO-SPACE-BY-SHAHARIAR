import { STUDIO_AMENITIES, STUDIO_CATEGORIES } from "@/lib/studio-options";

export type StudioInput = {
  title: string;
  category: (typeof STUDIO_CATEGORIES)[number];
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  rating: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStudioCategory(
  value: unknown,
): value is StudioInput["category"] {
  return (
    typeof value === "string" &&
    STUDIO_CATEGORIES.some((option) => option === value)
  );
}

function isStudioAmenity(value: unknown): value is string {
  return (
    typeof value === "string" &&
    STUDIO_AMENITIES.some((option) => option === value)
  );
}

export function parseStudioInput(value: unknown): StudioInput | null {
  if (!isRecord(value)) return null;

  const {
    title,
    category,
    hourlyRate,
    securityDeposit,
    maxCapacity,
    rating,
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
    typeof rating !== "number" ||
    !Number.isFinite(rating) ||
    rating < 0 ||
    rating > 5 ||
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
    rating,
    location: location.trim(),
    imageUrl: imageUrl.trim(),
    amenities: [...new Set(amenities)],
    overview: overview.trim(),
  };
}
