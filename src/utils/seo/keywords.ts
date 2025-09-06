import type { CollectionEntry } from "astro:content";
import { siteConfig } from "../../config";
import { isCourse, isLesson } from "../type-guards";

/**
 * Keyword generation utilities for SEO optimization
 */
export class KeywordGenerator {
	private baseKeywords: string[];

	constructor() {
		this.baseKeywords = [
			"programming",
			"tutorial",
			"coding",
			"development",
			"learn",
			siteConfig.title.toLowerCase(),
		];
	}

	/**
	 * Generate keywords array for SEO meta tags
	 */
	generateKeywords(
		course?: CollectionEntry<"courses">,
		lesson?: CollectionEntry<"courses">,
		additionalKeywords: string[] = [],
	): string[] {
		const keywords = [...this.baseKeywords];

		// Add course-specific keywords
		if (course && isCourse(course)) {
			keywords.push(...this.extractCourseKeywords(course));
		}

		// Add lesson-specific keywords
		if (lesson && isLesson(lesson)) {
			keywords.push(...this.extractLessonKeywords(lesson));
		}

		// Add additional keywords
		keywords.push(...additionalKeywords.map((k) => k.toLowerCase()));

		// Remove duplicates and return
		return this.deduplicateKeywords(keywords);
	}

	/**
	 * Generate keywords for course content
	 */
	generateCourseKeywords(
		course: CollectionEntry<"courses">,
		additionalKeywords: string[] = [],
	): string[] {
		if (!isCourse(course)) {
			throw new Error("Expected course entry");
		}

		return this.generateKeywords(course, undefined, additionalKeywords);
	}

	/**
	 * Generate keywords for lesson content
	 */
	generateLessonKeywords(
		course: CollectionEntry<"courses">,
		lesson: CollectionEntry<"courses">,
		additionalKeywords: string[] = [],
	): string[] {
		if (!isCourse(course)) {
			throw new Error("Expected course entry");
		}
		if (!isLesson(lesson)) {
			throw new Error("Expected lesson entry");
		}

		return this.generateKeywords(course, lesson, additionalKeywords);
	}

	/**
	 * Generate topic-specific keywords
	 */
	generateTopicKeywords(
		topics: string[],
		additionalKeywords: string[] = [],
	): string[] {
		const keywords = [...this.baseKeywords];

		// Add topic keywords
		keywords.push(...topics.map((topic) => topic.toLowerCase()));

		// Add additional keywords
		keywords.push(...additionalKeywords.map((k) => k.toLowerCase()));

		return this.deduplicateKeywords(keywords);
	}

	/**
	 * Extract keywords from course data
	 */
	private extractCourseKeywords(course: CollectionEntry<"courses">): string[] {
		const keywords: string[] = [];

		// Add course title words
		keywords.push(...this.extractWordsFromTitle(course.data.title));

		// Only access level and category if this is actually a course
		if (isCourse(course)) {
			// Add level and category
			keywords.push(
				course.data.level.toLowerCase(),
				course.data.category.toLowerCase(),
			);

			// Add technology-specific keywords based on category
			keywords.push(...this.getTechnologyKeywords(course.data.category));
		}

		return keywords;
	}

	/**
	 * Extract keywords from lesson data
	 */
	private extractLessonKeywords(lesson: CollectionEntry<"courses">): string[] {
		const keywords: string[] = [];

		// Add lesson title words
		keywords.push(...this.extractWordsFromTitle(lesson.data.title));

		return keywords;
	}

	/**
	 * Extract meaningful words from title
	 */
	private extractWordsFromTitle(title: string): string[] {
		// Common stop words to exclude
		const stopWords = new Set([
			"a",
			"an",
			"and",
			"are",
			"as",
			"at",
			"be",
			"by",
			"for",
			"from",
			"has",
			"he",
			"in",
			"is",
			"it",
			"its",
			"of",
			"on",
			"that",
			"the",
			"to",
			"was",
			"with",
			"will",
		]);

		return title
			.toLowerCase()
			.replace(/[^\w\s]/g, " ") // Replace special characters with spaces
			.split(/\s+/) // Split on whitespace
			.filter((word) => word.length > 2 && !stopWords.has(word)) // Filter short words and stop words
			.filter(Boolean); // Remove empty strings
	}

	/**
	 * Get technology-specific keywords based on category
	 */
	private getTechnologyKeywords(category: string): string[] {
		const categoryKeywords: Record<string, string[]> = {
			flutter: [
				"mobile development",
				"cross-platform",
				"dart",
				"ios",
				"android",
				"mobile app",
				"app development",
				"widget",
				"framework",
			],
			"react native": [
				"mobile development",
				"javascript",
				"react",
				"ios",
				"android",
				"mobile app",
				"cross-platform",
				"native",
				"expo",
			],
			javascript: [
				"web development",
				"frontend",
				"backend",
				"node.js",
				"es6",
				"modern javascript",
				"programming language",
				"web",
			],
			typescript: [
				"javascript",
				"types",
				"static typing",
				"web development",
				"frontend",
				"backend",
				"type safety",
			],
			"web development": [
				"html",
				"css",
				"javascript",
				"frontend",
				"backend",
				"responsive",
				"website",
				"web app",
			],
		};

		const categoryLower = category.toLowerCase();

		// Find matching category keywords
		for (const [key, keywords] of Object.entries(categoryKeywords)) {
			if (categoryLower.includes(key)) {
				return keywords;
			}
		}

		return [];
	}

	/**
	 * Remove duplicate keywords while preserving order
	 */
	private deduplicateKeywords(keywords: string[]): string[] {
		return [...new Set(keywords)];
	}
}

// Export convenience functions for backward compatibility
const keywordGenerator = new KeywordGenerator();

export function generateKeywords(
	course?: CollectionEntry<"courses">,
	lesson?: CollectionEntry<"courses">,
	additionalKeywords: string[] = [],
): string[] {
	return keywordGenerator.generateKeywords(course, lesson, additionalKeywords);
}
