import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import type { IStudio } from "@/type";

export const STUDIOS_CACHE_TAG = "studios";

export type StudiosResult =
  | { ok: true; studios: IStudio[] }
  | { ok: false; message: string };

export async function getStudiosResult(): Promise<StudiosResult> {
  "use cache";
  cacheLife("minutes");
  cacheTag(STUDIOS_CACHE_TAG);

  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    cacheLife("seconds");
    const message = "BACKEND_URL is required to load studios.";
    console.error(message);
    return { ok: false, message };
  }

  try {
    const response = await fetch(
      `${backendUrl.replace(/\/+$/, "")}/studios`,
    );

    if (!response.ok) {
      cacheLife("seconds");
      const message = `Failed to load studios: ${response.status} ${response.statusText}`;
      return { ok: false, message };
    }

    const studios: unknown = await response.json();

    if (!Array.isArray(studios)) {
      cacheLife("seconds");
      const message = "Failed to load studios: the API response was not a list.";
      console.error(message);
      return { ok: false, message };
    }

    return { ok: true, studios: studios as IStudio[] };
  } catch (error) {
    unstable_rethrow(error);
    cacheLife("seconds");
    console.error("Failed to reach the studio service:", error);
    return {
      ok: false,
      message: "Failed to load studios: the studio service could not be reached.",
    };
  }
}

export async function getStudios(): Promise<IStudio[]> {
  const result = await getStudiosResult();
  if (!result.ok) {
    throw new Error(result.message);
  }
  return result.studios;
}

export async function getStudioById(id: string): Promise<IStudio | null> {
  const studios = await getStudios();
  return studios.find((studio) => studio._id === id) ?? null;
}
