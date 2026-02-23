/**
 * Generates a URL-friendly path for category names.
 * Removes diacritics, non-alphanumeric characters, trims,
 * and converts spaces to hyphens while lowercasing the result.
 */
export function categoryNameToPath(name: string): string {
  return (
    '/' +
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  )
}
