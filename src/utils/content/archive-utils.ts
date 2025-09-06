/**
 * Archive page utilities for combining different content types
 */
import { siteConfig } from "../../config";
import {
	getAllCourseLessons,
	getSortedCourses,
	getSortedLessons,
	getSortedSections,
} from "./course-utils";
import { getRawSortedPosts, getSortedPostsList } from "./post-utils";
import type { ArchiveContentItem, PostOrCourse } from "./types";

/**
 * Get sorted posts with optional pinned course at the top
 * Used for the home page to show mixed content
 * @returns Array of posts and optionally a pinned course
 */
export async function getSortedPostsWithPinnedCourse(): Promise<
	PostOrCourse[]
> {
	const posts = await getRawSortedPosts();
	const result: PostOrCourse[] = [];

	// Add pinned course at the top if enabled and configured
	if (siteConfig.pinnedCourse?.enable && siteConfig.pinnedCourse?.courseSlug) {
		try {
			const courses = await getSortedCourses();
			const pinnedCourse = courses.find(
				(course) => course.slug === siteConfig.pinnedCourse?.courseSlug,
			);

			if (pinnedCourse && pinnedCourse.data.type === "course") {
				// Get total lessons for the course
				const allLessons = await getAllCourseLessons(pinnedCourse.slug);

				result.push({
					type: "course",
					entry: pinnedCourse,
					slug: pinnedCourse.slug,
					data: {
						title: pinnedCourse.data.title,
						published: pinnedCourse.data.published,
						updated: pinnedCourse.data.updated,
						category: pinnedCourse.data.category,
						description: pinnedCourse.data.description,
						image: pinnedCourse.data.image,
						draft: pinnedCourse.data.draft,
						level: pinnedCourse.data.level,
						totalLessons: allLessons.length,
					},
				});
			}
		} catch (error) {
			console.warn("Failed to load pinned course:", error);
		}
	}

	// Add all posts
	posts.forEach((post) => {
		result.push({
			type: "post",
			entry: post,
			slug: post.slug,
			data: {
				title: post.data.title,
				published: post.data.published,
				updated: post.data.updated,
				tags: post.data.tags,
				category: post.data.category || undefined,
				description: post.data.description,
				image: post.data.image,
				draft: post.data.draft,
			},
		});
	});

	return result;
}

/**
 * Get combined content for archive page (posts, courses, and lessons)
 * @returns Array of all content types sorted by publication date
 */
export async function getCombinedArchiveContent(): Promise<
	ArchiveContentItem[]
> {
	const posts = await getSortedPostsList();
	const courses = await getSortedCourses();

	const combinedContent: ArchiveContentItem[] = [];

	// Add posts
	posts.forEach((post) => {
		combinedContent.push({
			slug: post.slug,
			type: "post",
			data: {
				title: post.data.title,
				published: post.data.published,
				tags: post.data.tags,
				category: post.data.category || undefined,
			},
		});
	});

	// Add courses
	courses.forEach((course) => {
		if (course.data.type === "course") {
			combinedContent.push({
				slug: course.slug,
				type: "course",
				data: {
					title: course.data.title,
					published: course.data.published,
					category: course.data.category,
				},
			});
		}
	});

	// Add lessons
	for (const course of courses) {
		if (course.data.type === "course") {
			const sections = await getSortedSections(course.slug);
			for (const section of sections) {
				const lessons = await getSortedLessons(section.slug);
				lessons.forEach((lesson) => {
					if (lesson.data.type === "lesson") {
						combinedContent.push({
							slug: lesson.slug,
							type: "lesson",
							data: {
								title: lesson.data.title,
								published: lesson.data.published,
								courseTitle: course.data.title,
								sectionTitle: section.data.title,
							},
						});
					}
				});
			}
		}
	}

	// Sort by publication date (newest first)
	combinedContent.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});

	return combinedContent;
}
