export const BOOKING_START_SLOTS = [
  "09:00",
  "11:00",
  "13:00",
  "15:00",
  "17:00",
  "19:00",
] as const;

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface BookingRequest {
  studioId: string;
  date: string;
  startTime: string;
  durationHours: number;
}

export interface StudioBookingSnapshot {
  id: string;
  title: string;
  category: string;
  location: string;
  imageUrl: string;
  hourlyRate: number;
  securityDeposit: number;
}

export interface BookingRecord {
  id: string;
  bookingId?: string;
  studioId: string;
  studioTitle?: string;
  studioImage?: string;
  studioCategory?: string;
  studio: StudioBookingSnapshot;
  date: string;
  bookingDate?: string;
  startTime: string;
  bookingTimeSlot?: {
    startTime: string;
    endTime: string;
    durationHours: number;
  };
  durationHours: number;
  hourlyRate: number;
  securityDeposit: number;
  total: number;
  totalPrice?: number;
  status: BookingStatus;
  bookingStatus?: BookingStatus;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  userName?: string;
  userEmail?: string;
  userImage?: string;
  createdAt: string;
  updatedAt: string;
}

async function readResponse<T>(response: Response): Promise<T> {
  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : `Request failed: ${response.status} ${response.statusText}`;

    throw new Error(message);
  }

  return body as T;
}

export async function createBooking(
  payload: BookingRequest,
): Promise<BookingRecord> {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return readResponse<BookingRecord>(response);
}

export async function getMyBookings(): Promise<BookingRecord[]> {
  const response = await fetch("/api/bookings", { cache: "no-store" });
  const body = await readResponse<{ bookings: BookingRecord[] }>(response);

  return body.bookings;
}

export async function cancelBooking(bookingId: string): Promise<BookingRecord> {
  const response = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Cancelled" }),
  });

  return readResponse<BookingRecord>(response);
}

export async function deleteBooking(
  bookingId: string,
): Promise<{ message: string; availabilityUpdated?: boolean }> {
  const response = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
    method: "DELETE",
  });

  return readResponse<{ message: string; availabilityUpdated?: boolean }>(
    response,
  );
}
