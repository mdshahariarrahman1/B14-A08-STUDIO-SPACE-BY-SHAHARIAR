export function getStudioServiceHeaders(ownerEmail: string): HeadersInit | null {
  const secret = process.env.BOOKING_API_SECRET;
  if (!secret) return null;

  return {
    "Content-Type": "application/json",
    "x-booking-api-secret": secret,
    "x-studio-owner-email": ownerEmail.trim().toLowerCase(),
  };
}
