/**
 * Optimized sorting utilities for content
 * Provides pre-compiled sorting functions to avoid creating new functions on each sort
 */

import type { CollectionEntry } from "astro:content";
import { isCourse, isLesson, isSection } from "./type-guards";

/**
 * Pre-compiled sorting functions for better performance
 */
export const sortingFunctions = {
	/**
	 * Sort courses by publication date (newest first)
	 */
	coursesByDate: (
		a: CollectionEntry<"courses">,
		b: CollectionEntry<"courses">,
	) => {
		if (isCourse(a) && isCourse(b)) {
			return (
				new Date(b.data.published).getTime() -
				new Date(a.data.published).getTime()
			);
		}
		return 0;
	},

	/**
	 * Sort sections by order
	 */
	sectionsByOrder: (
		a: CollectionEntry<"courses">,
		b: CollectionEntry<"courses">,
	) => {
		if (isSection(a) && isSection(b)) {
			return a.data.order - b.data.order;
		}
		return 0;
	},

	/**
	 * Sort lessons by order within a section
	 */
	lessonsByOrder: (
		a: CollectionEntry<"courses">,
		b: CollectionEntry<"courses">,
	) => {
		if (isLesson(a) && isLesson(b)) {
			return a.data.order - b.data.order;
		}
		return 0;
	},

	/**
	 * Sort lessons by section order first, then by lesson order
	 * Provides a global ordering of lessons across all sections in a course
	 */
	lessonsBySectionAndOrder: (
		a: CollectionEntry<"courses">,
		b: CollectionEntry<"courses">,
	) => {
		if (isLesson(a) && isLesson(b)) {
			// First sort by section order, then by lesson order
			const sectionA = a.id.split("/")[1];
			const sectionB = b.id.split("/")[1];
			if (sectionA !== sectionB) {
				return sectionA.localeCompare(sectionB);
			}
			return a.data.order - b.data.order;
		}
		return 0;
	},

	/**
	 * Sort posts by publication date (newest first)
	 */
	postsByDate: (a: CollectionEntry<"posts">, b: CollectionEntry<"posts">) => {
		return (
			new Date(b.data.published).getTime() -
			new Date(a.data.published).getTime()
		);
	},

	/**
	 * Sort by title alphabetically
	 */
	byTitle: (a: { data: { title: string } }, b: { data: { title: string } }) => {
		return a.data.title.localeCompare(b.data.title);
	},
} as const;

/**
 * Optimized sorting helper for large arrays
 * Uses efficient sorting algorithms and caching
 */

// Sort cache for memoization
const sortCache = new Map<string, unknown[]>();

/**
 * Sort array with caching
 * @param items - Array to sort
 * @param sortFn - Sorting function
 * @param cacheKey - Optional cache key for memoization
 */
function sortWithCache<T>(
	items: T[],
	sortFn: (a: T, b: T) => number,
	cacheKey?: string,
): T[] {
	const isProduction = process.env.NODE_ENV === "production";

	if (isProduction && cacheKey && sortCache.has(cacheKey)) {
		return sortCache.get(cacheKey) as T[];
	}

	// For small arrays, use native sort
	if (items.length <= 50) {
		const sorted = [...items].sort(sortFn);
		if (cacheKey) {
			sortCache.set(cacheKey, sorted);
		}
		return sorted;
	}

	// For larger arrays, use more efficient sorting
	const sorted = mergeSort([...items], sortFn);
	if (cacheKey) {
		sortCache.set(cacheKey, sorted);
	}
	return sorted;
}

/**
 * Merge sort implementation for better performance on large arrays
 */
function mergeSort<T>(arr: T[], compare: (a: T, b: T) => number): T[] {
	if (arr.length <= 1) {
		return arr;
	}

	const mid = Math.floor(arr.length / 2);
	const left = arr.slice(0, mid);
	const right = arr.slice(mid);

	return merge(mergeSort(left, compare), mergeSort(right, compare), compare);
}

/**
 * Merge two sorted arrays
 */
function merge<T>(left: T[], right: T[], compare: (a: T, b: T) => number): T[] {
	const result: T[] = [];
	let leftIndex = 0;
	let rightIndex = 0;

	while (leftIndex < left.length && rightIndex < right.length) {
		if (compare(left[leftIndex], right[rightIndex]) <= 0) {
			result.push(left[leftIndex]);
			leftIndex++;
		} else {
			result.push(right[rightIndex]);
			rightIndex++;
		}
	}

	return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

/**
 * Clear the sort cache
 */
export function clearSortCache(): void {
	sortCache.clear();
}

/**
 * Utility functions for common sorting operations
 */
export const sortingUtils = {
	/**
	 * Sort courses efficiently with caching
	 */
	sortCourses: (courses: CollectionEntry<"courses">[], useCache = true) => {
		const cacheKey = useCache ? `courses_${courses.length}` : undefined;
		return sortWithCache(courses, sortingFunctions.coursesByDate, cacheKey);
	},

	/**
	 * Sort sections efficiently with caching
	 */
	sortSections: (
		sections: CollectionEntry<"courses">[],
		courseSlug?: string,
	) => {
		const cacheKey = courseSlug ? `sections_${courseSlug}` : undefined;
		return sortWithCache(sections, sortingFunctions.sectionsByOrder, cacheKey);
	},

	/**
	 * Sort lessons efficiently with caching
	 */
	sortLessons: (
		lessons: CollectionEntry<"courses">[],
		sectionSlug?: string,
	) => {
		const cacheKey = sectionSlug ? `lessons_${sectionSlug}` : undefined;
		return sortWithCache(lessons, sortingFunctions.lessonsByOrder, cacheKey);
	},

	/**
	 * Sort all course lessons with global ordering
	 */
	sortAllCourseLessons: (
		lessons: CollectionEntry<"courses">[],
		courseSlug?: string,
	) => {
		const cacheKey = courseSlug ? `all_lessons_${courseSlug}` : undefined;
		return sortWithCache(
			lessons,
			sortingFunctions.lessonsBySectionAndOrder,
			cacheKey,
		);
	},
};
