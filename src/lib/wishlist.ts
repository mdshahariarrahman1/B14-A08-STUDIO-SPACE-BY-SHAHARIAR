import type { IStudio } from "@/type";

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

function validateStudioId(studioId: string): string | null {
  const trimmed = studioId.trim();
  if (!trimmed || trimmed.length > 128) return null;
  return trimmed;
}

export async function getWishlist(): Promise<IStudio[]> {
  const response = await fetch("/api/wishlist", { cache: "no-store" });
  const body = await readResponse<{ studios: IStudio[] }>(response);

  return Array.isArray(body.studios) ? body.studios : [];
}

export async function getWishlistStatus(studioId: string): Promise<boolean> {
  const id = validateStudioId(studioId);
  if (!id) return false;

  const response = await fetch(
    `/api/wishlist?studioId=${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  const body = await readResponse<{ saved: boolean }>(response);

  return Boolean(body.saved);
}

export async function addItemToWishlist(studioId: string): Promise<void> {
  const id = validateStudioId(studioId);
  if (!id) throw new Error("The studio could not be identified.");

  const response = await fetch("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studioId: id }),
  });

  await readResponse<{ saved: boolean }>(response);
}

export async function removeItemFromWishlist(
  studioId: string,
): Promise<void> {
  const id = validateStudioId(studioId);
  if (!id) throw new Error("The studio could not be identified.");

  const response = await fetch("/api/wishlist", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studioId: id }),
  });

  await readResponse<{ saved: boolean }>(response);
}
