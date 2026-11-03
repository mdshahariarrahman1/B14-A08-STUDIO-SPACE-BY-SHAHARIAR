export function normalizeStudioCategory(category: string): string {
  return category.trim().replace(/\s+/g, " ").toLowerCase();
}
