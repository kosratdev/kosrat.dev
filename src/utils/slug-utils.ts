/**
 * Slug manipulation utilities for consistent handling across the application
 */

/**
 * Remove numeric prefixes from slugs (e.g., "01-intro" -> "intro")
 * This is commonly used for course sections and lessons that have ordering prefixes
 *
 * @param slug - The slug to clean
 * @returns The slug without numeric prefix
 *
 * @example
 * cleanSlug("01-introduction") // "introduction"
 * cleanSlug("02-basic-concepts") // "basic-concepts"
 * cleanSlug("intro") // "intro" (no change if no prefix)
 */
export function cleanSlug(slug: string): string {
	return slug.replace(/^\d+-/, "");
}

/**
 * Extract and clean slug parts from a full content slug path
 * Handles the common pattern: "course-slug/section-slug/lesson-slug"
 *
 * @param fullSlug - The full slug path (e.g., "flutter-ship/01-intro/01-overview")
 * @returns Object with extracted and cleaned slug parts
 *
 * @example
 * extractSlugParts("flutter-ship/01-intro/01-overview")
 * // { course: "flutter-ship", section: "intro", lesson: "overview" }
 *
 * extractSlugParts("flutter-ship/01-intro")
 * // { course: "flutter-ship", section: "intro", lesson: null }
 */
export function extractSlugParts(fullSlug: string): {
	course: string | null;
	section: string | null;
	lesson: string | null;
} {
	const parts = fullSlug.split("/");

	return {
		course: parts[0] || null,
		section: parts[1] ? cleanSlug(parts[1]) : null,
		lesson: parts[2] ? cleanSlug(parts[2]) : null,
	};
}

/**
 * Extract the last part of a slug path and clean it
 * Useful for getting the final identifier from nested content paths
 *
 * @param fullSlug - The full slug path
 * @returns The cleaned final part of the slug
 *
 * @example
 * extractCleanedLastPart("course/01-section/02-lesson") // "lesson"
 * extractCleanedLastPart("01-introduction") // "introduction"
 */
export function extractCleanedLastPart(fullSlug: string): string {
	const parts = fullSlug.split("/");
	const lastPart = parts[parts.length - 1] || fullSlug;
	return cleanSlug(lastPart);
}

/**
 * Build a clean URL path from slug parts
 * Ensures consistent URL structure for course content
 *
 * @param parts - Object containing course, section, and optionally lesson slugs
 * @returns Clean URL path
 *
 * @example
 * buildCleanPath({ course: "flutter-ship", section: "01-intro", lesson: "01-overview" })
 * // "flutter-ship/intro/overview"
 *
 * buildCleanPath({ course: "flutter-ship", section: "01-intro" })
 * // "flutter-ship/intro"
 */
export function buildCleanPath(parts: {
	course: string;
	section?: string;
	lesson?: string;
}): string {
	const pathParts = [parts.course];

	if (parts.section) {
		pathParts.push(cleanSlug(parts.section));
	}

	if (parts.lesson) {
		pathParts.push(cleanSlug(parts.lesson));
	}

	return pathParts.join("/");
}

/**
 * Check if a slug has a numeric prefix
 *
 * @param slug - The slug to check
 * @returns True if the slug starts with digits followed by a hyphen
 *
 * @example
 * hasNumericPrefix("01-intro") // true
 * hasNumericPrefix("intro") // false
 */
export function hasNumericPrefix(slug: string): boolean {
	return /^\d+-/.test(slug);
}
