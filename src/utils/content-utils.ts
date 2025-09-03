import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";

// // Retrieve posts and sort them by publication date
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

// Course-specific utility functions
export type CourseCategory = {
	name: string;
	count: number;
	url: string;
};

export async function getCourseCategoryList(): Promise<CourseCategory[]> {
	const allCourses = await getCollection("courses", ({ data }) => {
		return (
			data.type === "course" &&
			(import.meta.env.PROD ? data.draft !== true : true)
		);
	});

	const count: { [key: string]: number } = {};
	allCourses.forEach((course) => {
		// Type guard to ensure we're working with course type
		if (course.data.type !== "course") return;

		if (!course.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof course.data.category === "string"
				? course.data.category.trim()
				: String(course.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: CourseCategory[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: `/courses/?category=${encodeURIComponent(c)}`,
		});
	}
	return ret;
}

export type CourseLevel = {
	name: string;
	count: number;
	url: string;
};

export async function getCourseLevelList(): Promise<CourseLevel[]> {
	const allCourses = await getCollection("courses", ({ data }) => {
		return (
			data.type === "course" &&
			(import.meta.env.PROD ? data.draft !== true : true)
		);
	});

	const count: { [key: string]: number } = {};
	allCourses.forEach((course) => {
		// Type guard to ensure we're working with course type
		if (course.data.type !== "course") return;

		if (!course.data.level) {
			return;
		}

		const levelName =
			typeof course.data.level === "string"
				? course.data.level.trim()
				: String(course.data.level).trim();

		count[levelName] = count[levelName] ? count[levelName] + 1 : 1;
	});

	// Sort levels in a meaningful order: Beginner, Intermediate, Advanced
	const levelOrder = ["Beginner", "Intermediate", "Advanced"];
	const lst = Object.keys(count).sort((a, b) => {
		const indexA = levelOrder.indexOf(a);
		const indexB = levelOrder.indexOf(b);

		if (indexA !== -1 && indexB !== -1) {
			return indexA - indexB;
		}
		if (indexA !== -1) return -1;
		if (indexB !== -1) return 1;
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: CourseLevel[] = [];
	for (const l of lst) {
		ret.push({
			name: l,
			count: count[l],
			url: `/courses/?level=${encodeURIComponent(l)}`,
		});
	}
	return ret;
}
