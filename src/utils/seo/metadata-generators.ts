import type { CollectionEntry } from "astro:content";
import { siteConfig } from "../../config";
import { isCourse, isLesson } from "../type-guards";

/**
 * Metadata generation utilities for SEO optimization
 */
export class MetadataGenerator {
	/**
	 * Generate optimized page title for courses
	 */
	generateCoursePageTitle(
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
	 * Generate optimized page title for posts
	 */
	generatePostPageTitle(post: CollectionEntry<"posts">): string {
		return `${post.data.title} | ${siteConfig.title}`;
	}

	/**
	 * Generate optimized meta description for courses
	 */
	generateCourseMetaDescription(
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

	/**
	 * Generate optimized meta description for posts
	 */
	generatePostMetaDescription(
		post: CollectionEntry<"posts">,
		maxLength = 160,
	): string {
		const description = post.data.description;

		if (description.length <= maxLength) {
			return description;
		}

		// Truncate at word boundary
		const truncated = description.substring(0, maxLength);
		const lastSpaceIndex = truncated.lastIndexOf(" ");

		return lastSpaceIndex > 0
			? truncated.substring(0, lastSpaceIndex) + "..."
			: truncated + "...";
	}

	/**
	 * Generate canonical URL for content
	 */
	generateCanonicalUrl(baseUrl: string, path: string): string {
		const cleanBaseUrl = baseUrl.replace(/\/$/, "");
		const cleanPath = path.startsWith("/") ? path : `/${path}`;
		return `${cleanBaseUrl}${cleanPath}`;
	}

	/**
	 * Generate Open Graph data for courses
	 */
	generateCourseOpenGraphData(
		course: CollectionEntry<"courses">,
		lesson?: CollectionEntry<"courses">,
		baseUrl?: string,
	): Record<string, string> {
		if (!isCourse(course)) {
			throw new Error("Expected course entry");
		}

		const title = this.generateCoursePageTitle(course, lesson);
		const description = this.generateCourseMetaDescription(course, lesson);

		const ogData: Record<string, string> = {
			"og:type": "article",
			"og:title": title,
			"og:description": description,
			"og:site_name": siteConfig.title,
		};

		// Add URL if baseUrl provided
		if (baseUrl) {
			const path = lesson ? `${lesson.slug}/` : `/courses/${course.slug}/`;
			ogData["og:url"] = this.generateCanonicalUrl(baseUrl, path);
		}

		// Add image if available
		const courseImage = isCourse(course) ? course.data.image : undefined;
		const lessonImage =
			lesson && isLesson(lesson) ? lesson.data.image : undefined;
		const image = lessonImage || courseImage;
		if (image) {
			ogData["og:image"] = image;
		}

		return ogData;
	}

	/**
	 * Generate Open Graph data for posts
	 */
	generatePostOpenGraphData(
		post: CollectionEntry<"posts">,
		baseUrl?: string,
	): Record<string, string> {
		const title = this.generatePostPageTitle(post);
		const description = this.generatePostMetaDescription(post);

		const ogData: Record<string, string> = {
			"og:type": "article",
			"og:title": title,
			"og:description": description,
			"og:site_name": siteConfig.title,
		};

		// Add URL if baseUrl provided
		if (baseUrl) {
			ogData["og:url"] = this.generateCanonicalUrl(
				baseUrl,
				`/posts/${post.slug}/`,
			);
		}

		// Add image if available
		if (post.data.image) {
			ogData["og:image"] = post.data.image;
		}

		// Add article-specific data
		ogData["article:published_time"] = post.data.published.toISOString();

		if (post.data.updated) {
			ogData["article:modified_time"] = post.data.updated.toISOString();
		}

		if (post.data.category) {
			ogData["article:section"] = post.data.category;
		}

		if (post.data.tags && post.data.tags.length > 0) {
			// Add first few tags
			post.data.tags.slice(0, 3).forEach((tag) => {
				ogData["article:tag"] = tag;
			});
		}

		return ogData;
	}

	/**
	 * Generate Twitter Card data
	 */
	generateTwitterCardData(
		title: string,
		description: string,
		image?: string,
	): Record<string, string> {
		const twitterData: Record<string, string> = {
			"twitter:card": image ? "summary_large_image" : "summary",
			"twitter:title": title,
			"twitter:description": description,
		};

		if (image) {
			twitterData["twitter:image"] = image;
		}

		return twitterData;
	}

	/**
	 * Generate breadcrumb data for courses
	 */
	generateCourseBreadcrumbData(
		course: CollectionEntry<"courses">,
		section?: CollectionEntry<"courses">,
		lesson?: CollectionEntry<"courses">,
		baseUrl?: string,
	): Record<string, unknown> {
		if (!isCourse(course)) {
			throw new Error("Expected course entry");
		}

		const breadcrumbItems: Record<string, unknown>[] = [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: baseUrl || "/",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Courses",
				item: baseUrl ? `${baseUrl}/courses/` : "/courses/",
			},
			{
				"@type": "ListItem",
				position: 3,
				name: course.data.title,
				item: baseUrl
					? `${baseUrl}/courses/${course.slug}/`
					: `/courses/${course.slug}/`,
			},
		];

		let position = 4;

		if (section) {
			breadcrumbItems.push({
				"@type": "ListItem",
				position: position++,
				name: section.data.title,
			});
		}

		if (lesson && isLesson(lesson)) {
			breadcrumbItems.push({
				"@type": "ListItem",
				position: position,
				name: lesson.data.title,
			});
		}

		return {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: breadcrumbItems,
		};
	}
}

// Export convenience functions for backward compatibility
const metadataGenerator = new MetadataGenerator();

export function generateCoursePageTitle(
	course: CollectionEntry<"courses">,
	lesson?: CollectionEntry<"courses">,
): string {
	return metadataGenerator.generateCoursePageTitle(course, lesson);
}

export function generateMetaDescription(
	course: CollectionEntry<"courses">,
	lesson?: CollectionEntry<"courses">,
): string {
	return metadataGenerator.generateCourseMetaDescription(course, lesson);
}
