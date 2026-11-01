export interface BookingRequest {
  studioId: string;
  date: string;
  startTime: string;
  durationHours: number;
  total: number;
}

export interface BookingResponse {
  message?: string;
  [key: string]: unknown;
}

function extractMessage(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null) return undefined;

  const message = (body as { message?: unknown }).message;

  return typeof message === "string" ? message : undefined;
}

export async function createBooking(
  payload: BookingRequest,
): Promise<BookingResponse> {
  const response = await fetch("http://localhost:5000/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    throw new Error(
      extractMessage(body) ??
        `Failed to create booking: ${response.status} ${response.statusText}`,
    );
  }

  return (body ?? {}) as BookingResponse;
}
