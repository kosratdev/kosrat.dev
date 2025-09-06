import type { CollectionEntry } from "astro:content";
import { profileConfig, siteConfig } from "../../config";
import { isCourse, isLesson, isSection } from "../type-guards";

/**
 * Factory class for creating structured data objects
 */
export class StructuredDataFactory {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
	}

	/**
	 * Generate structured data for Course pages
	 */
	generateCourseStructuredData(
		course: CollectionEntry<"courses">,
		totalLessons: number,
		sections: CollectionEntry<"courses">[],
	): Record<string, unknown> {
		if (!isCourse(course)) {
			throw new Error("Expected course entry");
		}

		const courseUrl = `${this.baseUrl}/courses/${course.slug}/`;

		const structuredData: Record<string, unknown> = {
			"@context": "https://schema.org",
			"@type": "Course",
			name: course.data.title,
			description: course.data.description,
			provider: this.createOrganizationObject(),
			author: this.createPersonObject(),
			url: courseUrl,
			courseCode: course.slug,
			educationalLevel: course.data.level,
			about: course.data.category,
			numberOfCredits: totalLessons,
			hasCourseInstance: {
				"@type": "CourseInstance",
				courseMode: "online",
				instructor: this.createPersonObject(),
			},
			coursePrerequisites:
				course.data.level === "Beginner"
					? "None"
					: "Basic programming knowledge",
			syllabusSections: this.createSyllabusSections(
				sections,
				course.data.title,
			),
		};

		// Add optional fields
		this.addOptionalImageField(structuredData, course.data.image);
		this.addOptionalDateField(
			structuredData,
			"datePublished",
			course.data.published,
		);

		return structuredData;
	}

	/**
	 * Generate structured data for Lesson pages
	 */
	generateLessonStructuredData(
		lesson: CollectionEntry<"courses">,
		course: CollectionEntry<"courses">,
		section?: CollectionEntry<"courses">,
	): Record<string, unknown> {
		if (!isLesson(lesson)) {
			throw new Error("Expected lesson entry");
		}
		if (!isCourse(course)) {
			throw new Error("Expected course entry");
		}
		if (section && !isSection(section)) {
			throw new Error("Expected section entry");
		}

		const lessonUrl = `${this.baseUrl}${lesson.slug}/`;
		const courseUrl = `${this.baseUrl}/courses/${course.slug}/`;

		const structuredData: Record<string, unknown> = {
			"@context": "https://schema.org",
			"@type": "LearningResource",
			name: lesson.data.title,
			description: `${lesson.data.title} - Part of ${course.data.title}`,
			author: this.createPersonObject(),
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
		};

		// Add section information if available
		if (section) {
			structuredData.hasPart = {
				"@type": "Article",
				name: lesson.data.title,
				articleSection: section.data.title,
			};
		}

		// Add optional fields
		this.addOptionalImageField(
			structuredData,
			lesson.data.image || course.data.image,
		);
		this.addOptionalDateField(
			structuredData,
			"datePublished",
			lesson.data.published,
		);

		return structuredData;
	}

	/**
	 * Generate structured data for Course listing page
	 */
	generateCourseListingStructuredData(
		courses: CollectionEntry<"courses">[],
	): Record<string, unknown> {
		const courseEntries = courses.filter(isCourse);

		return {
			"@context": "https://schema.org",
			"@type": "ItemList",
			name: "Software Development Courses",
			description: "A collection of software development courses and tutorials",
			url: `${this.baseUrl}/courses/`,
			numberOfItems: courseEntries.length,
			itemListElement: courseEntries.map((course, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Course",
					name: course.data.title,
					description: course.data.description,
					url: `${this.baseUrl}/courses/${course.slug}/`,
					educationalLevel: course.data.level,
					about: course.data.category,
					provider: this.createOrganizationObject(),
				},
			})),
		};
	}

	/**
	 * Create a reusable Organization object
	 */
	private createOrganizationObject(): Record<string, unknown> {
		return {
			"@type": "Organization",
			name: siteConfig.title,
			url: this.baseUrl,
		};
	}

	/**
	 * Create a reusable Person object
	 */
	private createPersonObject(): Record<string, unknown> {
		return {
			"@type": "Person",
			name: profileConfig.name,
			url: this.baseUrl,
		};
	}

	/**
	 * Create syllabus sections array
	 */
	private createSyllabusSections(
		sections: CollectionEntry<"courses">[],
		courseTitle: string,
	): Record<string, unknown>[] {
		return sections.filter(isSection).map((section, index) => ({
			"@type": "Syllabus",
			name: section.data.title,
			description:
				section.data.description || `Section ${index + 1} of ${courseTitle}`,
			position: index + 1,
		}));
	}

	/**
	 * Add optional image field if image exists
	 */
	private addOptionalImageField(
		structuredData: Record<string, unknown>,
		image?: string,
	): void {
		if (image) {
			structuredData.image = image;
		}
	}

	/**
	 * Add optional date field if date exists
	 */
	private addOptionalDateField(
		structuredData: Record<string, unknown>,
		fieldName: string,
		date?: Date,
	): void {
		if (date) {
			structuredData[fieldName] = date.toISOString();
		}
	}
}

// Export convenience functions that maintain backward compatibility
export function generateCourseStructuredData(
	course: CollectionEntry<"courses">,
	totalLessons: number,
	sections: CollectionEntry<"courses">[],
	baseUrl: string,
): Record<string, unknown> {
	const factory = new StructuredDataFactory(baseUrl);
	return factory.generateCourseStructuredData(course, totalLessons, sections);
}

export function generateLessonStructuredData(
	lesson: CollectionEntry<"courses">,
	course: CollectionEntry<"courses">,
	section: CollectionEntry<"courses">,
	baseUrl: string,
): Record<string, unknown> {
	const factory = new StructuredDataFactory(baseUrl);
	return factory.generateLessonStructuredData(lesson, course, section);
}

export function generateCourseListingStructuredData(
	courses: CollectionEntry<"courses">[],
	baseUrl: string,
): Record<string, unknown> {
	const factory = new StructuredDataFactory(baseUrl);
	return factory.generateCourseListingStructuredData(courses);
}
