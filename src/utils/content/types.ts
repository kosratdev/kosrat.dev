/**
 * Shared types for content utilities
 */
import type { CollectionEntry } from "astro:content";

// Post-related types
export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};

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

// Archive page content type
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

// Tag and category types
export type Tag = {
	name: string;
	count: number;
};

export type Category = {
	name: string;
	count: number;
	url: string;
};
