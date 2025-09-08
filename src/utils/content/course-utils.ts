/**
 * Course-related content utilities
 * Provides efficient data fetching with caching to reduce duplicate API calls
 */
import { type CollectionEntry, getCollection } from "astro:content";
import { sortingUtils as optimizedSorting } from "../optimized-sorting";
import { shouldIncludeEntry, validateCourseEntries } from "../type-guards";

// Cache interface
interface ContentCache {
	courses: CollectionEntry<"courses">[] | null;
	courseLessons: Map<string, CollectionEntry<"courses">[]>;
	courseSections: Map<string, CollectionEntry<"courses">[]>;
	sectionLessons: Map<string, CollectionEntry<"courses">[]>;
	lastUpdated: number;
}

// Global cache instance (resets on each build)
const contentCache: ContentCache = {
	courses: null,
	courseLessons: new Map(),
	courseSections: new Map(),
	sectionLessons: new Map(),
	lastUpdated: 0,
};

// Cache TTL in milliseconds (5 minutes for development, infinite for production)
const CACHE_TTL =
	process.env.NODE_ENV === "development"
		? 0 // Disable cache in development
		: Number.POSITIVE_INFINITY;

/**
 * Check if cache is valid
 */
function isCacheValid(): boolean {
	return Date.now() - contentCache.lastUpdated < CACHE_TTL;
}

/**
 * Clear all caches
 */
export function clearContentCache(): void {
	contentCache.courses = null;
	contentCache.courseLessons.clear();
	contentCache.courseSections.clear();
	contentCache.sectionLessons.clear();
	contentCache.lastUpdated = 0;
}

/**
 * Get all courses with caching
 * @returns All course entries
 */
async function getAllCourses(): Promise<CollectionEntry<"courses">[]> {
	if (contentCache.courses && isCacheValid()) {
		return contentCache.courses;
	}

	const allCourses = await getCollection("courses", ({ data }) => {
		return data.type === "course" && shouldIncludeEntry({ data });
	});

	contentCache.courses = validateCourseEntries(allCourses);
	contentCache.lastUpdated = Date.now();

	return contentCache.courses;
}

/**
 * Optimized sorting utilities
 */

/**
 * Get all courses sorted by publication date (newest first) with caching
 * @returns Array of course entries sorted by publication date
 */
export async function getSortedCourses(): Promise<
	CollectionEntry<"courses">[]
> {
	const courses = await getAllCourses();
	return optimizedSorting.sortCourses(courses);
}

/**
 * Get all sections for a specific course sorted by order with caching
 * @param courseSlug - The slug of the course
 * @returns Array of section entries sorted by order
 */
export async function getSortedSections(
	courseSlug: string,
): Promise<CollectionEntry<"courses">[]> {
	// Check cache first
	if (contentCache.courseSections.has(courseSlug) && isCacheValid()) {
		const cachedSections = contentCache.courseSections.get(courseSlug);
		if (cachedSections) {
			return cachedSections;
		}
	}

	const allSections = await getCollection("courses", ({ id, data }) => {
		return data.type === "section" && id.startsWith(courseSlug);
	});

	const validatedSections = validateCourseEntries(allSections);
	const sortedSections = optimizedSorting.sortSections(
		validatedSections,
		courseSlug,
	);

	// Cache the result
	contentCache.courseSections.set(courseSlug, sortedSections);

	return sortedSections;
}

/**
 * Get all lessons for a specific section sorted by order with caching
 * @param sectionSlug - The slug of the section
 * @returns Array of lesson entries sorted by order
 */
export async function getSortedLessons(
	sectionSlug: string,
): Promise<CollectionEntry<"courses">[]> {
	// Check cache first
	if (contentCache.sectionLessons.has(sectionSlug) && isCacheValid()) {
		const cachedLessons = contentCache.sectionLessons.get(sectionSlug);
		if (cachedLessons) {
			return cachedLessons;
		}
	}

	const allLessons = await getCollection("courses", ({ id, data }) => {
		return (
			data.type === "lesson" &&
			id.startsWith(sectionSlug) &&
			shouldIncludeEntry({ data })
		);
	});

	const validatedLessons = validateCourseEntries(allLessons);
	const sortedLessons = optimizedSorting.sortLessons(
		validatedLessons,
		sectionSlug,
	);

	// Cache the result
	contentCache.sectionLessons.set(sectionSlug, sortedLessons);

	return sortedLessons;
}

/**
 * Get all lessons for a course (across all sections) sorted by section and lesson order with caching
 * @param courseSlug - The slug of the course
 * @returns Array of all lesson entries in the course sorted by section and lesson order
 */
export async function getAllCourseLessons(
	courseSlug: string,
): Promise<CollectionEntry<"courses">[]> {
	// Check cache first
	if (contentCache.courseLessons.has(courseSlug) && isCacheValid()) {
		const cachedLessons = contentCache.courseLessons.get(courseSlug);
		if (cachedLessons) {
			return cachedLessons;
		}
	}

	const allLessons = await getCollection("courses", ({ id, data }) => {
		return (
			data.type === "lesson" &&
			id.startsWith(courseSlug) &&
			shouldIncludeEntry({ data })
		);
	});

	const validatedLessons = validateCourseEntries(allLessons);
	const sortedLessons = optimizedSorting.sortAllCourseLessons(
		validatedLessons,
		courseSlug,
	);

	// Cache the result
	contentCache.courseLessons.set(courseSlug, sortedLessons);

	return sortedLessons;
}

/**
 * Get a specific course by slug with caching
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
 * Get total lesson count for a course (optimized - uses cached data)
 * @param courseSlug - The slug of the course
 * @returns Number of lessons in the course
 */
export async function getCourseLessonCount(
	courseSlug: string,
): Promise<number> {
	const lessons = await getAllCourseLessons(courseSlug);
	return lessons.length;
}

/**
 * Preload course data for multiple courses to optimize performance
 * @param courseSlugs - Array of course slugs to preload
 * @returns Promise that resolves when all data is preloaded
 */
export async function preloadCourseData(courseSlugs: string[]): Promise<void> {
	// Preload all course data in parallel
	const preloadPromises = courseSlugs.map(async (courseSlug) => {
		// Preload lessons and sections for each course
		await Promise.all([
			getAllCourseLessons(courseSlug),
			getSortedSections(courseSlug),
		]);
	});

	await Promise.all(preloadPromises);
}

/**
 * Get course data bundle - optimized function that returns commonly needed data together
 * @param courseSlug - The slug of the course
 * @returns Object containing course, sections, lessons, and metadata
 */
export async function getCourseDataBundle(courseSlug: string) {
	// Use Promise.all to fetch all data in parallel, but leverage caching
	const [course, sections, lessons] = await Promise.all([
		getCourseBySlug(courseSlug),
		getSortedSections(courseSlug),
		getAllCourseLessons(courseSlug),
	]);

	if (!course) {
		return null;
	}

	return {
		course,
		sections,
		lessons,
		totalLessons: lessons.length,
		totalSections: sections.length,
	};
}

/**
 * Get lesson navigation data efficiently
 * @param courseSlug - The slug of the course
 * @param currentLessonSlug - The slug of the current lesson
 * @returns Navigation data for the lesson
 */
export async function getLessonNavigation(
	courseSlug: string,
	currentLessonSlug: string,
) {
	const lessons = await getAllCourseLessons(courseSlug);
	const currentIndex = lessons.findIndex(
		(lesson) => lesson.slug === currentLessonSlug,
	);

	if (currentIndex === -1) {
		return null;
	}

	return {
		currentLesson: lessons[currentIndex],
		previousLesson: currentIndex > 0 ? lessons[currentIndex - 1] : null,
		nextLesson:
			currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null,
		currentIndex,
		totalLessons: lessons.length,
		isFirst: currentIndex === 0,
		isLast: currentIndex === lessons.length - 1,
	};
}
