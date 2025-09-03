import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const coursesCollection = defineCollection({
	schema: z.discriminatedUnion("type", [
		z.object({
			type: z.literal("course"),
			title: z.string(),
			description: z.string(),
			image: z.string().optional(),
			level: z.enum(["Beginner", "Intermediate", "Advanced"]),
			category: z.string(),
			published: z.date(),
			updated: z.date().optional(),
			draft: z.boolean().optional().default(false),
		}),
		z.object({
			type: z.literal("section"),
			title: z.string(),
			description: z.string().optional(),
			order: z.number().positive(),
		}),
		z.object({
			type: z.literal("lesson"),
			title: z.string(),
			order: z.number().positive(),
			published: z.date(),
			updated: z.date().optional(),
			draft: z.boolean().optional().default(false),

			/* For internal use */
			prevTitle: z.string().default(""),
			prevSlug: z.string().default(""),
			nextTitle: z.string().default(""),
			nextSlug: z.string().default(""),
		}),
	]),
});
const specCollection = defineCollection({
	schema: z.object({}),
});
export const collections = {
	posts: postsCollection,
	spec: specCollection,
	courses: coursesCollection,
};
