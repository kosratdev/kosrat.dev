import type { CollectionEntry } from "astro:content";
import { profileConfig, siteConfig } from "../config";
import { isCourse, isLesson, isSection } from "./type-guards";

/**
 * Generate structured data for Course pages
 */
export function generateCourseStructuredData(
	course: CollectionEntry<"courses">,
	totalLessons: number,
	sections: CollectionEntry<"courses">[],
	baseUrl: string,
) {
	if (!isCourse(course)) {
		throw new Error("Expected course entry");
	}

	const courseUrl = `${baseUrl}/courses/${course.slug}/`;

	const structuredData: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@type": "Course",
		name: course.data.title,
		description: course.data.description,
		provider: {
			"@type": "Organization",
			name: siteConfig.title,
			url: baseUrl,
		},
		author: {
			"@type": "Person",
			name: profileConfig.name,
			url: baseUrl,
		},
		url: courseUrl,
		courseCode: course.slug,
		educationalLevel: course.data.level,
		about: course.data.category,
		numberOfCredits: totalLessons,
		hasCourseInstance: {
			"@type": "CourseInstance",
			courseMode: "online",
			instructor: {
				"@type": "Person",
				name: profileConfig.name,
			},
		},
		coursePrerequisites:
			course.data.level === "Beginner" ? "None" : "Basic programming knowledge",
		syllabusSections: sections.filter(isSection).map((section, index) => ({
			"@type": "Syllabus",
			name: section.data.title,
			description:
				section.data.description ||
				`Section ${index + 1} of ${course.data.title}`,
			position: index + 1,
		})),
	};

	// Add image if available
	if (course.data.image) {
		structuredData.image = course.data.image;
	}

	// Add publication date if available
	if (course.data.published) {
		structuredData.datePublished = course.data.published.toISOString();
	}

	return structuredData;
}

/**
 * Generate structured data for Lesson pages
 */
export function generateLessonStructuredData(
	lesson: CollectionEntry<"courses">,
	course: CollectionEntry<"courses">,
	section: CollectionEntry<"courses">,
	baseUrl: string,
) {
	if (!isLesson(lesson)) {
		throw new Error("Expected lesson entry");
	}
	if (!isCourse(course)) {
		throw new Error("Expected course entry");
	}
	if (!isSection(section)) {
		throw new Error("Expected section entry");
	}

	const lessonUrl = `${baseUrl}${lesson.slug}/`;
	const courseUrl = `${baseUrl}/courses/${course.slug}/`;

	const structuredData: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@type": "LearningResource",
		name: lesson.data.title,
		description: `${lesson.data.title} - Part of ${course.data.title}`,
		author: {
			"@type": "Person",
			name: profileConfig.name,
			url: baseUrl,
		},
		url: lessonUrl,
		isPartOf: {
			"@type": "Course",
			name: course.data.title,
			url: courseUrl,
		},
		educationalLevel: course.data.level,
		about: course.data.category,
		learningResourceType: "lesson",
		interactivityType: "expositive",
		educationalUse: "instruction",
		hasPart: {
			"@type": "Article",
			name: lesson.data.title,
			articleSection: section.data.title,
		},
	};

	// Add image if available
	if (lesson.data.image || course.data.image) {
		structuredData.image = lesson.data.image || course.data.image;
	}

	// Add publication date if available
	if (lesson.data.published) {
		structuredData.datePublished = lesson.data.published.toISOString();
	}

	return structuredData;
}

/**
 * Generate structured data for Course listing page
 */
export function generateCourseListingStructuredData(
	courses: CollectionEntry<"courses">[],
	baseUrl: string,
) {
	const courseEntries = courses.filter(isCourse);

	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Software Development Courses",
		description: "A collection of software development courses and tutorials",
		url: `${baseUrl}/courses/`,
		numberOfItems: courseEntries.length,
		itemListElement: courseEntries.map((course, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "Course",
				name: course.data.title,
				description: course.data.description,
				url: `${baseUrl}/courses/${course.slug}/`,
				educationalLevel: course.data.level,
				about: course.data.category,
				provider: {
					"@type": "Organization",
					name: siteConfig.title,
					url: baseUrl,
				},
			},
		})),
	};
}

/**
 * Generate keywords array for SEO meta tags
 */
export function generateKeywords(
	course?: CollectionEntry<"courses">,
	lesson?: CollectionEntry<"courses">,
	additionalKeywords: string[] = [],
): string[] {
	const baseKeywords = [
		"programming",
		"tutorial",
		"coding",
		"development",
		"learn",
		siteConfig.title.toLowerCase(),
	];

	const keywords = [...baseKeywords];

	if (course && isCourse(course)) {
		keywords.push(
			course.data.title.toLowerCase(),
			course.data.level.toLowerCase(),
			course.data.category.toLowerCase(),
		);
	}

	if (lesson && isLesson(lesson)) {
		keywords.push(lesson.data.title.toLowerCase());
	}

	keywords.push(...additionalKeywords.map((k) => k.toLowerCase()));

	// Remove duplicates and return
	return [...new Set(keywords)];
}

/**
 * Generate optimized page title for courses
 */
export function generateCoursePageTitle(
	course: CollectionEntry<"courses">,
	lesson?: CollectionEntry<"courses">,
): string {
	if (!isCourse(course)) {
		throw new Error("Expected course entry");
	}

	if (lesson && isLesson(lesson)) {
		return `${lesson.data.title} - ${course.data.title} | ${siteConfig.title}`;
	}
	return `${course.data.title} - ${course.data.level} Course | ${siteConfig.title}`;
}

/**
 * Generate optimized meta description
 */
export function generateMetaDescription(
	course: CollectionEntry<"courses">,
	lesson?: CollectionEntry<"courses">,
): string {
	if (!isCourse(course)) {
		throw new Error("Expected course entry");
	}

	if (lesson && isLesson(lesson)) {
		return `${lesson.data.title} - ${course.data.description}`;
	}

	return `${course.data.description} ${course.data.level} level course with hands-on tutorials and examples.`;
}
