import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { IStudio } from "@/type";

export const STUDIOS_CACHE_TAG = "studios";

export async function getStudios(): Promise<IStudio[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(STUDIOS_CACHE_TAG);

  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    throw new Error("BACKEND_URL is required to load studios.");
  }

  const response = await fetch(`${backendUrl}/studios`);

  if (!response.ok) {
    throw new Error(
      `Failed to load studios: ${response.status} ${response.statusText}`,
    );
  }

  const studios: unknown = await response.json();

  if (!Array.isArray(studios)) {
    throw new Error("Failed to load studios: the API response was not a list.");
  }

  return studios as IStudio[];
}

export async function getStudioById(id: string): Promise<IStudio | null> {
  const studios = await getStudios();
  return studios.find((studio) => studio._id === id) ?? null;
}
