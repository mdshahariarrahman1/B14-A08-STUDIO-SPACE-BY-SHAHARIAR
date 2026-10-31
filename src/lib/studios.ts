import type { IStudio } from "@/type";

export function normalizeStudioCategory(category: string): string {
  return category.trim().replace(/\s+/g, " ").toLowerCase();
}

export async function getStudios(): Promise<IStudio[]> {
  const response = await fetch("http://localhost:5000/studios", {
    cache: "no-store",
  });

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
