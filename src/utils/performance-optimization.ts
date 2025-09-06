/**
 * Performance optimization utilities for content preloading
 */

import { getSortedCourses, preloadCourseData } from "./content/course-utils";

/**
 * Preload all course data for the courses page
 * This should be called when the courses page loads to warm the cache
 */
export async function preloadCoursesPageData(): Promise<void> {
	const courses = await getSortedCourses();
	const courseSlugs = courses.map((course) => course.slug);

	// Preload all course data in parallel
	await preloadCourseData(courseSlugs);
}

/**
 * Preload data for a specific course when navigating to course details
 * @param courseSlug - The slug of the course to preload
 */
export async function preloadCourseDetailData(
	courseSlug: string,
): Promise<void> {
	await preloadCourseData([courseSlug]);
}

/**
 * Batch preload data for multiple courses
 * Useful for homepage with pinned courses or archive pages
 * @param courseSlugs - Array of course slugs to preload
 * @param batchSize - Number of courses to preload in parallel (default: 3)
 */
export async function batchPreloadCourseData(
	courseSlugs: string[],
	batchSize = 3,
): Promise<void> {
	// Process in batches to avoid overwhelming the system
	for (let i = 0; i < courseSlugs.length; i += batchSize) {
		const batch = courseSlugs.slice(i, i + batchSize);
		await preloadCourseData(batch);
	}
}

/**
 * Intelligent preloading strategy for the homepage
 * Preloads data for pinned courses and most recent courses
 */
export async function preloadHomepageData(): Promise<void> {
	try {
		const courses = await getSortedCourses();

		// Preload data for the first few courses (most recent)
		const recentCourseSlugs = courses.slice(0, 5).map((course) => course.slug);

		if (recentCourseSlugs.length > 0) {
			await batchPreloadCourseData(recentCourseSlugs, 2);
		}
	} catch (error) {
		console.warn("Failed to preload homepage data:", error);
	}
}

/**
 * Critical path preloading for lesson pages
 * Preloads navigation data for the current course
 * @param courseSlug - The course slug for the lesson being viewed
 */
export async function preloadLessonNavigationData(
	courseSlug: string,
): Promise<void> {
	await preloadCourseData([courseSlug]);
}
