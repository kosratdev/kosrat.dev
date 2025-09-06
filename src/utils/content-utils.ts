import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";
import { siteConfig } from "../config";

// Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}

// Mixed content type for home page with pinned course
export type PostOrCourse = {
	type: "post" | "course";
	entry: CollectionEntry<"posts"> | CollectionEntry<"courses">;
	slug: string;
	data: {
		title: string;
		published: Date;
		updated?: Date;
		tags?: string[];
		category?: string;
		description?: string;
		image?: string;
		draft?: boolean;
		// Course specific fields
		level?: string;
		totalLessons?: number;
	};
};

export async function getSortedPostsWithPinnedCourse(): Promise<PostOrCourse[]> {
	const posts = await getRawSortedPosts();
	const result: PostOrCourse[] = [];

	// Add pinned course at the top if enabled and configured
	if (siteConfig.pinnedCourse?.enable && siteConfig.pinnedCourse?.courseSlug) {
		try {
			const courses = await getCollection("courses", ({ data }) => {
				return data.type === "course" && (import.meta.env.PROD ? data.draft !== true : true);
			});
			
			const pinnedCourse = courses.find(course => course.slug === siteConfig.pinnedCourse?.courseSlug);
			
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
	posts.forEach(post => {
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

export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));

	return sortedPostsList;
}

// Combined content type for Archive page
export type ArchiveContentItem = {
	slug: string;
	type: "post" | "course" | "lesson";
	data: {
		title: string;
		published: Date;
		tags?: string[];
		category?: string;
		courseTitle?: string; // For lessons
		sectionTitle?: string; // For lessons
	};
};

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

export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}

// Course-related utilities
export async function getSortedCourses() {
	const allCourses = await getCollection("courses", ({ data }) => {
		return (
			data.type === "course" &&
			(import.meta.env.PROD ? data.draft !== true : true)
		);
	});

	return allCourses.sort((a, b) => {
		if (a.data.type === "course" && b.data.type === "course") {
			return (
				new Date(b.data.published).getTime() -
				new Date(a.data.published).getTime()
			);
		}
		return 0;
	});
}

export async function getSortedSections(courseSlug: string) {
	const allSections = await getCollection("courses", ({ id, data }) => {
		return data.type === "section" && id.startsWith(courseSlug);
	});

	return allSections.sort((a, b) => {
		if (a.data.type === "section" && b.data.type === "section") {
			return a.data.order - b.data.order;
		}
		return 0;
	});
}

export async function getSortedLessons(sectionSlug: string) {
	const allLessons = await getCollection("courses", ({ id, data }) => {
		return (
			data.type === "lesson" &&
			id.startsWith(sectionSlug) &&
			("draft" in data
				? import.meta.env.PROD
					? data.draft !== true
					: true
				: true)
		);
	});

	return allLessons.sort((a, b) => {
		if (a.data.type === "lesson" && b.data.type === "lesson") {
			return a.data.order - b.data.order;
		}
		return 0;
	});
}

export async function getAllCourseLessons(courseSlug: string) {
	const allLessons = await getCollection("courses", ({ id, data }) => {
		return (
			data.type === "lesson" &&
			id.startsWith(courseSlug) &&
			("draft" in data
				? import.meta.env.PROD
					? data.draft !== true
					: true
				: true)
		);
	});

	return allLessons.sort((a, b) => {
		if (a.data.type === "lesson" && b.data.type === "lesson") {
			// First sort by section order, then by lesson order
			const sectionA = a.id.split("/")[1];
			const sectionB = b.id.split("/")[1];
			if (sectionA !== sectionB) {
				return sectionA.localeCompare(sectionB);
			}
			return a.data.order - b.data.order;
		}
		return 0;
	});
}
