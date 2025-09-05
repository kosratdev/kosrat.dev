<script lang="ts">
import { onMount } from "svelte";

import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";
import {
	getCourseUrlBySlug,
	getLessonUrlBySlug,
	getPostUrlBySlug,
} from "../utils/url-utils";

export let categories: string[];
export let sortedContent: ArchiveContentItem[] = [];
export let tags: string[];

const params = new URLSearchParams(window.location.search);
tags = params.has("tag") ? params.getAll("tag") : [];
categories = params.has("category") ? params.getAll("category") : [];
const uncategorized = params.get("uncategorized");

interface ArchiveContentItem {
	slug: string;
	type: "post" | "course" | "lesson";
	data: {
		title: string;
		published: Date;
		tags?: string[];
		category?: string;
		courseTitle?: string;
		sectionTitle?: string;
	};
}

interface Group {
	year: number;
	content: ArchiveContentItem[];
}

let groups: Group[] = [];

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

function formatTag(tagList: string[] = []) {
	return tagList.map((t) => `#${t}`).join(" ");
}

function getContentUrl(item: ArchiveContentItem): string {
	switch (item.type) {
		case "post":
			return getPostUrlBySlug(item.slug);
		case "course":
			return getCourseUrlBySlug(item.slug);
		case "lesson":
			return getLessonUrlBySlug(item.slug);
		default:
			return "#";
	}
}

function getContentTypeLabel(type: string): string {
	switch (type) {
		case "post":
			return "Post";
		case "course":
			return "Course";
		case "lesson":
			return "Lesson";
		default:
			return "";
	}
}

function getContentTypeColor(type: string): string {
	switch (type) {
		case "post":
			return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
		case "course":
			return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
		case "lesson":
			return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
		default:
			return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
	}
}

function getContentCounts(content: ArchiveContentItem[]): string {
	const counts = content.reduce(
		(acc, item) => {
			acc[item.type] = (acc[item.type] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	const parts: string[] = [];
	if (counts.post)
		parts.push(`${counts.post} post${counts.post === 1 ? "" : "s"}`);
	if (counts.course)
		parts.push(`${counts.course} course${counts.course === 1 ? "" : "s"}`);
	if (counts.lesson)
		parts.push(`${counts.lesson} lesson${counts.lesson === 1 ? "" : "s"}`);

	return parts.join(" · ");
}

onMount(async () => {
	let filteredContent: ArchiveContentItem[] = sortedContent;

	if (tags.length > 0) {
		filteredContent = filteredContent.filter(
			(item) =>
				Array.isArray(item.data.tags) &&
				item.data.tags.some((tag) => tags.includes(tag)),
		);
	}

	if (categories.length > 0) {
		filteredContent = filteredContent.filter(
			(item) => item.data.category && categories.includes(item.data.category),
		);
	}

	if (uncategorized) {
		filteredContent = filteredContent.filter((item) => !item.data.category);
	}

	const grouped = filteredContent.reduce(
		(acc, item) => {
			const year = item.data.published.getFullYear();
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(item);
			return acc;
		},
		{} as Record<number, ArchiveContentItem[]>,
	);

	const groupedContentArray = Object.keys(grouped).map((yearStr) => ({
		year: Number.parseInt(yearStr, 10),
		content: grouped[Number.parseInt(yearStr, 10)],
	}));

	groupedContentArray.sort((a, b) => b.year - a.year);

	groups = groupedContentArray;
});
</script>

<div class="card-base px-8 py-6">
    {#each groups as group}
        <div>
            <div class="flex flex-row w-full items-center h-[3.75rem]">
                <div class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75">
                    {group.year}
                </div>
                <div class="w-[15%] md:w-[10%]">
                    <div
                            class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto
                  -outline-offset-[2px] z-50 outline-3"
                    />
                </div>
                <div class="w-[70%] md:w-[80%] transition text-left text-50">
                    {getContentCounts(group.content)}
                </div>
            </div>

      {#each group.content as item}
        <a
          href={getContentUrl(item)}
          aria-label={item.data.title}
          class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]"
        >
          <div class="flex flex-row justify-start items-center h-full">
            <!-- date -->
            <div
              class="w-[15%] md:w-[10%] transition text-sm text-right text-50"
            >
              {formatDate(item.data.published)}
            </div>

                        <!-- dot and line -->
                        <div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                            <div
                                    class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
                       bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)]
                       outline outline-4 z-50
                       outline-[var(--card-bg)]
                       group-hover:outline-[var(--btn-plain-bg-hover)]
                       group-active:outline-[var(--btn-plain-bg-active)]"
                            ></div>
                        </div>

            <!-- content title and type -->
            <div class="w-[70%] md:max-w-[50%] md:w-[50%] text-left font-bold
                        group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)]
                        text-75 pr-4 flex items-center gap-2">
              <span class="px-2 py-1 text-xs rounded-full font-normal flex-shrink-0 {getContentTypeColor(item.type)}">
                {getContentTypeLabel(item.type)}
              </span>
              <span class="whitespace-nowrap overflow-ellipsis overflow-hidden">
                {item.data.title}
              </span>
            </div>

                        <!-- tag list / course info -->
                        <div
                                class="hidden md:block md:w-[30%] text-right text-sm transition
                     whitespace-nowrap overflow-ellipsis overflow-hidden text-30"
                        >
                            {#if item.type === 'lesson' && item.data.courseTitle}
                              <span class="text-xs text-50">
                                {item.data.courseTitle}
                                {#if item.data.sectionTitle}
                                  → {item.data.sectionTitle}
                                {/if}
                              </span>
                            {:else if item.data.tags}
                              {formatTag(item.data.tags)}
                            {/if}
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/each}
</div>