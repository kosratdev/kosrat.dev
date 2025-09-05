// Progress tracking utility functions for course completion
// Uses localStorage to persist progress across browser sessions

interface CourseProgress {
	completedLessons: string[];
	lastViewedLesson?: string;
	startedAt: string;
	lastUpdated: string;
}

const PROGRESS_KEY_PREFIX = "course_progress_";

/**
 * Get completion status for all lessons in a course
 */
export function getCourseProgress(courseSlug: string): CourseProgress {
	const key = PROGRESS_KEY_PREFIX + courseSlug;
	const stored = localStorage.getItem(key);

	if (!stored) {
		return {
			completedLessons: [],
			startedAt: new Date().toISOString(),
			lastUpdated: new Date().toISOString(),
		};
	}

	try {
		return JSON.parse(stored);
	} catch (error) {
		console.error("Error parsing course progress:", error);
		return {
			completedLessons: [],
			startedAt: new Date().toISOString(),
			lastUpdated: new Date().toISOString(),
		};
	}
}

/**
 * Mark a lesson as completed
 */
export function markLessonCompleted(
	courseSlug: string,
	lessonSlug: string,
): void {
	const progress = getCourseProgress(courseSlug);

	// Add lesson to completed list if not already there
	if (!progress.completedLessons.includes(lessonSlug)) {
		progress.completedLessons.push(lessonSlug);
	}

	// Update timestamps
	progress.lastViewedLesson = lessonSlug;
	progress.lastUpdated = new Date().toISOString();

	// Save to localStorage
	const key = PROGRESS_KEY_PREFIX + courseSlug;
	localStorage.setItem(key, JSON.stringify(progress));
}

/**
 * Check if a specific lesson is completed
 */
export function isLessonCompleted(
	courseSlug: string,
	lessonSlug: string,
): boolean {
	const progress = getCourseProgress(courseSlug);
	return progress.completedLessons.includes(lessonSlug);
}

/**
 * Reset all progress for a course
 */
export function resetCourseProgress(courseSlug: string): void {
	const key = PROGRESS_KEY_PREFIX + courseSlug;
	localStorage.removeItem(key);
}

/**
 * Get the last lesson viewed in a course
 */
export function getLastViewedLesson(courseSlug: string): string | null {
	const progress = getCourseProgress(courseSlug);
	return progress.lastViewedLesson || null;
}

/**
 * Get completion percentage for a course
 */
export function getCourseCompletionPercentage(
	courseSlug: string,
	totalLessons: number,
): number {
	const progress = getCourseProgress(courseSlug);
	if (totalLessons === 0) return 0;
	return Math.round((progress.completedLessons.length / totalLessons) * 100);
}

/**
 * Check if a course has been started (has any completed lessons)
 */
export function isCourseStarted(courseSlug: string): boolean {
	const progress = getCourseProgress(courseSlug);
	return progress.completedLessons.length > 0;
}

/**
 * Check if a course is completed (all lessons are completed)
 */
export function isCourseCompleted(
	courseSlug: string,
	totalLessons: number,
): boolean {
	const progress = getCourseProgress(courseSlug);
	return progress.completedLessons.length >= totalLessons && totalLessons > 0;
}

/**
 * Get all courses with progress data
 */
export function getAllCoursesProgress(): Record<string, CourseProgress> {
	const allProgress: Record<string, CourseProgress> = {};

	// Iterate through localStorage to find all course progress entries
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key?.startsWith(PROGRESS_KEY_PREFIX)) {
			const courseSlug = key.replace(PROGRESS_KEY_PREFIX, "");
			allProgress[courseSlug] = getCourseProgress(courseSlug);
		}
	}

	return allProgress;
}
