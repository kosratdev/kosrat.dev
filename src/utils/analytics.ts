/**
 * Google Analytics utility functions for course and lesson tracking
 *
 * This module provides comprehensive tracking for educational content interactions:
 * - Course views and completion
 * - Lesson starts and navigation
 * - User engagement patterns
 * - Progress management
 */

declare global {
	interface Window {
		gtag?: (
			command: "config" | "event" | "js" | "set",
			targetId: string | Date,
			config?: Record<string, unknown>,
		) => void;
	}
}

// Debounce utility to prevent rapid analytics calls
const analyticsDebounce = new Map<string, number>();

function shouldTrackEvent(eventKey: string, debounceMs = 1000): boolean {
	const now = Date.now();
	const lastTracked = analyticsDebounce.get(eventKey) || 0;

	if (now - lastTracked > debounceMs) {
		analyticsDebounce.set(eventKey, now);
		return true;
	}
	return false;
}

// Utility function to safely call gtag with error handling
function safeGtagCall(
	eventName: string,
	eventData: Record<string, unknown>,
	debounceKey?: string,
): void {
	try {
		// Apply debouncing if key provided
		if (debounceKey && !shouldTrackEvent(debounceKey, 1000)) {
			return;
		}

		if (typeof window === "undefined" || !window.gtag) {
			return;
		}

		window.gtag("event", eventName, eventData);
	} catch (error) {
		console.warn(`Analytics tracking failed for event: ${eventName}`, error);
	}
}

/**
 * Track course view event
 */
export function trackCourseView(courseData: {
	courseName: string;
	level: string;
	category: string;
	totalLessons?: number;
}) {
	const eventKey = `course_view_${courseData.courseName}`;
	safeGtagCall(
		"course_view",
		{
			course_name: courseData.courseName,
			course_level: courseData.level,
			course_category: courseData.category,
			total_lessons: courseData.totalLessons || 0,
			event_category: "education",
			event_label: `${courseData.courseName} (${courseData.level})`,
		},
		eventKey,
	);
}

/**
 * Track lesson start event
 */
export function trackLessonStart(lessonData: {
	courseName: string;
	lessonName: string;
	sectionName: string;
	lessonNumber: number;
	courseLevel: string;
	category: string;
}) {
	const eventKey = `lesson_start_${lessonData.courseName}_${lessonData.lessonName}`;
	safeGtagCall(
		"lesson_start",
		{
			course_name: lessonData.courseName,
			lesson_name: lessonData.lessonName,
			section_name: lessonData.sectionName,
			lesson_number: lessonData.lessonNumber,
			course_level: lessonData.courseLevel,
			course_category: lessonData.category,
			event_category: "education",
			event_label: `${lessonData.courseName} - ${lessonData.lessonName}`,
		},
		eventKey,
	);
}

/**
 * Track lesson completion event
 */
export function trackLessonCompletion(completionData: {
	courseName: string;
	lessonName: string;
	sectionName: string;
	lessonNumber: number;
	courseLevel: string;
	category: string;
	actionType: "next" | "finish";
	completionPercentage?: number;
}) {
	const eventKey = `lesson_completion_${completionData.courseName}_${completionData.lessonName}_${completionData.actionType}`;
	safeGtagCall(
		"lesson_completion",
		{
			course_name: completionData.courseName,
			lesson_name: completionData.lessonName,
			section_name: completionData.sectionName,
			lesson_number: completionData.lessonNumber,
			course_level: completionData.courseLevel,
			course_category: completionData.category,
			action_type: completionData.actionType,
			completion_percentage: completionData.completionPercentage || 0,
			event_category: "education",
			event_label: `${completionData.courseName} - ${completionData.lessonName} (${completionData.actionType})`,
		},
		eventKey,
	);
}

/**
 * Track course completion event
 */
export function trackCourseCompletion(courseData: {
	courseName: string;
	level: string;
	category: string;
	totalLessons: number;
	timeToComplete?: number; // in minutes
}) {
	if (typeof window !== "undefined" && window.gtag) {
		window.gtag("event", "course_completion", {
			course_name: courseData.courseName,
			course_level: courseData.level,
			course_category: courseData.category,
			total_lessons: courseData.totalLessons,
			time_to_complete: courseData.timeToComplete || 0,
			event_category: "education",
			event_label: `${courseData.courseName} (${courseData.level}) - Completed`,
		});
	}
}

/**
 * Track lesson navigation events (next/previous)
 */
export function trackLessonNavigation(navigationData: {
	courseName: string;
	fromLesson: string;
	toLesson: string;
	navigationDirection: "next" | "previous" | "jump";
	courseLevel: string;
	category: string;
}) {
	// Don't debounce navigation events as they represent distinct user actions
	safeGtagCall("lesson_navigation", {
		course_name: navigationData.courseName,
		from_lesson: navigationData.fromLesson,
		to_lesson: navigationData.toLesson,
		navigation_direction: navigationData.navigationDirection,
		course_level: navigationData.courseLevel,
		course_category: navigationData.category,
		event_category: "education",
		event_label: `${navigationData.courseName} - ${navigationData.navigationDirection} navigation`,
	});
}

/**
 * Track section expansion/collapse events
 */
export function trackSectionToggle(sectionData: {
	courseName: string;
	sectionName: string;
	action: "expand" | "collapse";
	courseLevel: string;
	category: string;
}) {
	if (typeof window !== "undefined" && window.gtag) {
		window.gtag("event", "section_toggle", {
			course_name: sectionData.courseName,
			section_name: sectionData.sectionName,
			toggle_action: sectionData.action,
			course_level: sectionData.courseLevel,
			course_category: sectionData.category,
			event_category: "education",
			event_label: `${sectionData.courseName} - ${sectionData.sectionName} (${sectionData.action})`,
		});
	}
}

/**
 * Track progress reset events
 */
export function trackProgressReset(courseData: {
	courseName: string;
	level: string;
	category: string;
	lessonsCompleted: number;
	totalLessons: number;
}) {
	if (typeof window !== "undefined" && window.gtag) {
		window.gtag("event", "progress_reset", {
			course_name: courseData.courseName,
			course_level: courseData.level,
			course_category: courseData.category,
			lessons_completed_before_reset: courseData.lessonsCompleted,
			total_lessons: courseData.totalLessons,
			event_category: "education",
			event_label: `${courseData.courseName} - Progress Reset`,
		});
	}
}

/**
 * Track search query events
 */
export function trackSearchQuery(searchData: {
	query: string;
	resultCount: number;
	searchLocation: "desktop" | "mobile";
}) {
	const eventKey = `search_query_${searchData.query}_${searchData.searchLocation}`;
	safeGtagCall(
		"search",
		{
			search_term: searchData.query,
			result_count: searchData.resultCount,
			search_location: searchData.searchLocation,
			event_category: "search",
			event_label: `Search: ${searchData.query} (${searchData.resultCount} results)`,
		},
		eventKey,
	);
}

/**
 * Track search result clicks
 */
export function trackSearchResultClick(clickData: {
	query: string;
	resultUrl: string;
	resultTitle: string;
	resultPosition: number;
	contentType: string;
	searchLocation: "desktop" | "mobile";
}) {
	// Don't debounce result clicks as each click is a distinct user action
	safeGtagCall("search_result_click", {
		search_term: clickData.query,
		result_url: clickData.resultUrl,
		result_title: clickData.resultTitle,
		result_position: clickData.resultPosition,
		content_type: clickData.contentType,
		search_location: clickData.searchLocation,
		event_category: "search",
		event_label: `Search Click: ${clickData.query} -> ${clickData.resultTitle}`,
	});
}

/**
 * Track content discovery patterns
 */
export function trackContentDiscovery(discoveryData: {
	discoveryMethod: "search" | "navigation" | "direct" | "course_link";
	contentType: "post" | "course" | "lesson";
	contentTitle: string;
	sourceQuery?: string;
	sourceUrl?: string;
}) {
	safeGtagCall("content_discovery", {
		discovery_method: discoveryData.discoveryMethod,
		content_type: discoveryData.contentType,
		content_title: discoveryData.contentTitle,
		source_query: discoveryData.sourceQuery || "",
		source_url: discoveryData.sourceUrl || "",
		event_category: "content_discovery",
		event_label: `${discoveryData.discoveryMethod}: ${discoveryData.contentTitle}`,
	});
}

/**
 * Track course card click events
 */
export function trackCourseCardClick(clickData: {
	courseSlug: string;
	courseTitle: string;
	courseLevel?: string;
	courseCategory?: string;
	totalLessons: number;
	clickLocation: "homepage" | "course_listing" | "sidebar" | "related_content";
	isPinned: boolean;
	actionType: "view_course" | "start_course" | "continue_course";
}) {
	safeGtagCall("course_card_click", {
		course_slug: clickData.courseSlug,
		course_title: clickData.courseTitle,
		course_level: clickData.courseLevel || "",
		course_category: clickData.courseCategory || "",
		total_lessons: clickData.totalLessons,
		click_location: clickData.clickLocation,
		is_pinned: clickData.isPinned,
		action_type: clickData.actionType,
		event_category: "course_discovery",
		event_label: `${clickData.clickLocation}: ${clickData.courseTitle} (${clickData.actionType})`,
	});
}

/**
 * Track course selection patterns and preferences
 */
export function trackCourseSelection(selectionData: {
	courseSlug: string;
	courseTitle: string;
	courseLevel?: string;
	courseCategory?: string;
	selectionRank: number; // Position in list where course was selected
	totalCoursesVisible: number;
	filterCriteria?: string; // Any applied filters
	sortOrder?: string; // How the list was sorted
}) {
	safeGtagCall("course_selection", {
		course_slug: selectionData.courseSlug,
		course_title: selectionData.courseTitle,
		course_level: selectionData.courseLevel || "",
		course_category: selectionData.courseCategory || "",
		selection_rank: selectionData.selectionRank,
		total_courses_visible: selectionData.totalCoursesVisible,
		filter_criteria: selectionData.filterCriteria || "",
		sort_order: selectionData.sortOrder || "default",
		event_category: "course_discovery",
		event_label: `Selection: ${selectionData.courseTitle} (rank ${selectionData.selectionRank}/${selectionData.totalCoursesVisible})`,
	});
}
