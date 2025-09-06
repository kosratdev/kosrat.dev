/**
 * Course-related content utilities
 */
import { type CollectionEntry, getCollection } from "astro:content";

/**
 * Get all courses sorted by publication date (newest first)
 * @returns Array of course entries sorted by publication date
 */
export async function getSortedCourses(): Promise<
	CollectionEntry<"courses">[]
> {
	const allCourses = await getCollection("courses", ({ data }) => {
		return (
			data.type === "course" &&
			(import.meta.env.PROD ? data.draft !== true : true)
		);
	});

	return allCourses.sort((a, b) => {
		if (a.data.type === "course" && b.data.type === "course") {
			return (
				new Date(b.data.published).getTime() -
				new Date(a.data.published).getTime()
			);
		}
		return 0;
	});
}

/**
 * Get all sections for a specific course sorted by order
 * @param courseSlug - The slug of the course
 * @returns Array of section entries sorted by order
 */
export async function getSortedSections(
	courseSlug: string,
): Promise<CollectionEntry<"courses">[]> {
	const allSections = await getCollection("courses", ({ id, data }) => {
		return data.type === "section" && id.startsWith(courseSlug);
	});

	return allSections.sort((a, b) => {
		if (a.data.type === "section" && b.data.type === "section") {
			return a.data.order - b.data.order;
		}
		return 0;
	});
}

/**
 * Get all lessons for a specific section sorted by order
 * @param sectionSlug - The slug of the section
 * @returns Array of lesson entries sorted by order
 */
export async function getSortedLessons(
	sectionSlug: string,
): Promise<CollectionEntry<"courses">[]> {
	const allLessons = await getCollection("courses", ({ id, data }) => {
		return (
			data.type === "lesson" &&
			id.startsWith(sectionSlug) &&
			("draft" in data
				? import.meta.env.PROD
					? data.draft !== true
					: true
				: true)
		);
	});

	return allLessons.sort((a, b) => {
		if (a.data.type === "lesson" && b.data.type === "lesson") {
			return a.data.order - b.data.order;
		}
		return 0;
	});
}

/**
 * Get all lessons for a course (across all sections) sorted by section and lesson order
 * @param courseSlug - The slug of the course
 * @returns Array of all lesson entries in the course sorted by section and lesson order
 */
export async function getAllCourseLessons(
	courseSlug: string,
): Promise<CollectionEntry<"courses">[]> {
	const allLessons = await getCollection("courses", ({ id, data }) => {
		return (
			data.type === "lesson" &&
			id.startsWith(courseSlug) &&
			("draft" in data
				? import.meta.env.PROD
					? data.draft !== true
					: true
				: true)
		);
	});

	return allLessons.sort((a, b) => {
		if (a.data.type === "lesson" && b.data.type === "lesson") {
			// First sort by section order, then by lesson order
			const sectionA = a.id.split("/")[1];
			const sectionB = b.id.split("/")[1];
			if (sectionA !== sectionB) {
				return sectionA.localeCompare(sectionB);
			}
			return a.data.order - b.data.order;
		}
		return 0;
	});
}

/**
 * Get a specific course by slug
 * @param courseSlug - The slug of the course
 * @returns The course entry or null if not found
 */
export async function getCourseBySlug(
	courseSlug: string,
): Promise<CollectionEntry<"courses"> | null> {
	const courses = await getSortedCourses();
	return courses.find((course) => course.slug === courseSlug) || null;
}

/**
 * Get total lesson count for a course
 * @param courseSlug - The slug of the course
 * @returns Number of lessons in the course
 */
export async function getCourseLessonCount(
	courseSlug: string,
): Promise<number> {
	const lessons = await getAllCourseLessons(courseSlug);
	return lessons.length;
}
