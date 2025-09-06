/**
 * Type guards and runtime type validation utilities
 *
 * This module centralizes all type checking logic to improve type safety
 * and provide consistent validation across the application.
 */

import type { CollectionEntry } from "astro:content";

// ===== Content Entry Type Guards =====

/**
 * Type guard to check if an entry is a post
 */
export function isPostEntry(
	entry: CollectionEntry<"posts"> | CollectionEntry<"courses">,
): entry is CollectionEntry<"posts"> {
	return "slug" in entry && !("type" in entry.data);
}

/**
 * Type guard to check if an entry is a course entry
 */
export function isCourseEntry(
	entry: CollectionEntry<"posts"> | CollectionEntry<"courses">,
): entry is CollectionEntry<"courses"> {
	return "slug" in entry && "type" in entry.data;
}

/**
 * Type guard to check if a course entry is specifically a course (not section/lesson)
 */
export function isCourse(
	entry: CollectionEntry<"courses">,
): entry is CollectionEntry<"courses"> & {
	data: { type: "course" };
} {
	return entry.data.type === "course";
}

/**
 * Type guard to check if a course entry is a section
 */
export function isSection(
	entry: CollectionEntry<"courses">,
): entry is CollectionEntry<"courses"> & {
	data: { type: "section" };
} {
	return entry.data.type === "section";
}

/**
 * Type guard to check if a course entry is a lesson
 */
export function isLesson(
	entry: CollectionEntry<"courses">,
): entry is CollectionEntry<"courses"> & {
	data: { type: "lesson" };
} {
	return entry.data.type === "lesson";
}

// ===== Data Type Guards =====

/**
 * Type guard to check if a value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

/**
 * Type guard to check if a value is a valid Date
 */
export function isValidDate(value: unknown): value is Date {
	return value instanceof Date && !Number.isNaN(value.getTime());
}

/**
 * Type guard to check if a value is a valid number
 */
export function isValidNumber(value: unknown): value is number {
	return (
		typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value)
	);
}

/**
 * Type guard to check if a value is a positive integer
 */
export function isPositiveInteger(value: unknown): value is number {
	return isValidNumber(value) && value > 0 && Number.isInteger(value);
}

/**
 * Type guard to check if a value is an array
 */
export function isArray<T>(value: unknown): value is T[] {
	return Array.isArray(value);
}

/**
 * Type guard to check if a value is a non-empty array
 */
export function isNonEmptyArray<T>(value: unknown): value is T[] {
	return Array.isArray(value) && value.length > 0;
}

/**
 * Type guard to check if a value is an object (not null or array)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if a value is a plain object with string keys
 */
export function isPlainObject(
	value: unknown,
): value is Record<string, unknown> {
	return isObject(value) && Object.getPrototypeOf(value) === Object.prototype;
}

// ===== Content-Specific Type Guards =====

/**
 * Type guard to check if a post has required fields
 */
export function isValidPostData(data: unknown): data is {
	title: string;
	published: Date;
	description: string;
	category: string;
} {
	if (!isObject(data)) return false;

	return (
		isNonEmptyString(data.title) &&
		isValidDate(data.published) &&
		isNonEmptyString(data.description) &&
		isNonEmptyString(data.category)
	);
}

/**
 * Type guard to check if a post has minimum required fields (more lenient for drafts)
 */
export function isValidDraftPostData(data: unknown): data is {
	title: string;
	published: Date;
	description?: string;
	category?: string;
} {
	if (!isObject(data)) return false;

	return isNonEmptyString(data.title) && isValidDate(data.published);
}

/**
 * Type guard to check if a course has required fields
 */
export function isValidCourseData(data: unknown): data is {
	type: "course";
	title: string;
	published: Date;
	description: string;
	category: string;
	level: "Beginner" | "Intermediate" | "Advanced";
} {
	if (!isObject(data)) return false;

	return (
		data.type === "course" &&
		isNonEmptyString(data.title) &&
		isValidDate(data.published) &&
		isNonEmptyString(data.description) &&
		isNonEmptyString(data.category) &&
		typeof data.level === "string" &&
		["Beginner", "Intermediate", "Advanced"].includes(data.level as string)
	);
}

/**
 * Type guard to check if a section has required fields
 */
export function isValidSectionData(data: unknown): data is {
	type: "section";
	title: string;
	order: number;
} {
	if (!isObject(data)) return false;

	return (
		data.type === "section" &&
		isNonEmptyString(data.title) &&
		isPositiveInteger(data.order)
	);
}

/**
 * Type guard to check if a lesson has required fields
 */
export function isValidLessonData(data: unknown): data is {
	type: "lesson";
	title: string;
	order: number;
	published: Date;
} {
	if (!isObject(data)) return false;

	return (
		data.type === "lesson" &&
		isNonEmptyString(data.title) &&
		isPositiveInteger(data.order) &&
		isValidDate(data.published)
	);
}

// ===== DOM and Browser Type Guards =====

/**
 * Type guard to check if an element is an HTMLElement
 */
export function isHTMLElement(element: unknown): element is HTMLElement {
	return element instanceof HTMLElement;
}

/**
 * Type guard to check if an element is an HTMLAnchorElement
 */
export function isHTMLAnchorElement(
	element: unknown,
): element is HTMLAnchorElement {
	return element instanceof HTMLAnchorElement;
}

/**
 * Type guard to check if an element is an HTMLButtonElement
 */
export function isHTMLButtonElement(
	element: unknown,
): element is HTMLButtonElement {
	return element instanceof HTMLButtonElement;
}

/**
 * Type guard to check if an element is an HTMLInputElement
 */
export function isHTMLInputElement(
	element: unknown,
): element is HTMLInputElement {
	return element instanceof HTMLInputElement;
}

/**
 * Type guard to check if an event is a MouseEvent
 */
export function isMouseEvent(event: Event): event is MouseEvent {
	return event instanceof MouseEvent;
}

/**
 * Type guard to check if an event is a KeyboardEvent
 */
export function isKeyboardEvent(event: Event): event is KeyboardEvent {
	return event instanceof KeyboardEvent;
}

// ===== Utility Type Guards =====

/**
 * Type guard to check if a value exists (not null or undefined)
 */
export function exists<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined;
}

/**
 * Type guard to check if a value is null or undefined
 */
export function isNullish(value: unknown): value is null | undefined {
	return value === null || value === undefined;
}

/**
 * Type guard to check if a value is a function
 */
export function isFunction(
	value: unknown,
): value is (...args: unknown[]) => unknown {
	return typeof value === "function";
}

/**
 * Type guard to check if a value is a Promise
 */
export function isPromise<T>(value: unknown): value is Promise<T> {
	return value instanceof Promise;
}

// ===== Draft Content Filtering =====

/**
 * Check if debug mode is enabled
 * Debug mode can be enabled by:
 * 1. Setting VITE_DEBUG=true environment variable
 * 2. Adding ?debug=true to URL (client-side only)
 * 3. Development mode (not production)
 */
export function isDebugMode(): boolean {
	// Server-side: Check environment variables
	try {
		// Check VITE_DEBUG environment variable first
		if (import.meta.env.VITE_DEBUG === "true") {
			return true;
		}

		// Default to development mode (opposite of production)
		return !import.meta.env.PROD;
	} catch {
		// Fallback if import.meta is not available
		// Client-side: Check URL parameters
		if (typeof window !== "undefined") {
			const urlParams = new URLSearchParams(window.location.search);
			if (urlParams.get("debug") === "true") {
				return true;
			}
		}

		// Default to development mode if we can't determine environment
		return true;
	}
}

/**
 * Check if draft content should be included based on debug mode
 * @param hasDraft - Whether the content has a draft field
 * @param isDraft - Whether the content is marked as draft
 * @returns True if content should be included
 */
export function shouldIncludeDraft(
	hasDraft: boolean,
	isDraft: boolean,
): boolean {
	// If no draft field, always include
	if (!hasDraft) {
		return true;
	}

	// If not draft, always include
	if (!isDraft) {
		return true;
	}

	// If draft, only include in debug mode
	return isDebugMode();
}

/**
 * Type guard to check if content entry should be included based on draft status
 * @param entry - Content entry to check
 * @returns True if entry should be included
 */
export function shouldIncludeEntry(entry: {
	data: { draft?: boolean };
}): boolean {
	const hasDraft = "draft" in entry.data;
	const isDraft = entry.data.draft === true;

	return shouldIncludeDraft(hasDraft, isDraft);
}

// ===== Collection Validation =====

/**
 * Validates an array of entries and returns only valid posts
 */
export function validatePostEntries(
	entries: CollectionEntry<"posts">[],
): CollectionEntry<"posts">[] {
	return entries.filter((entry) => {
		try {
			const isDraft = entry.data.draft === true;
			const debugMode = isDebugMode();

			// Use more lenient validation for draft posts in debug mode
			if (isDraft && debugMode) {
				return isValidDraftPostData(entry.data);
			}

			// Use strict validation for published posts or in production
			return isValidPostData(entry.data);
		} catch (error) {
			console.warn(`Invalid post entry: ${entry.slug}`, error);
			return false;
		}
	});
}

/**
 * Validates an array of course entries and returns only valid courses
 */
export function validateCourseEntries(
	entries: CollectionEntry<"courses">[],
): CollectionEntry<"courses">[] {
	return entries.filter((entry) => {
		try {
			if (isCourse(entry)) {
				return isValidCourseData(entry.data);
			}
			if (isSection(entry)) {
				return isValidSectionData(entry.data);
			}
			if (isLesson(entry)) {
				return isValidLessonData(entry.data);
			}
			return false;
		} catch (error) {
			console.warn(`Invalid course entry: ${entry.slug}`, error);
			return false;
		}
	});
}

// ===== Runtime Assertions =====

/**
 * Asserts that a value is a non-empty string, throws if not
 */
export function assertNonEmptyString(
	value: unknown,
	context?: string,
): asserts value is string {
	if (!isNonEmptyString(value)) {
		throw new Error(
			`Expected non-empty string${context ? ` in ${context}` : ""}, got: ${typeof value}`,
		);
	}
}

/**
 * Asserts that a value is a valid date, throws if not
 */
export function assertValidDate(
	value: unknown,
	context?: string,
): asserts value is Date {
	if (!isValidDate(value)) {
		throw new Error(
			`Expected valid Date${context ? ` in ${context}` : ""}, got: ${typeof value}`,
		);
	}
}

/**
 * Asserts that a value exists (not null or undefined), throws if not
 */
export function assertExists<T>(
	value: T | null | undefined,
	context?: string,
): asserts value is T {
	if (!exists(value)) {
		throw new Error(
			`Expected value to exist${context ? ` in ${context}` : ""}, got: ${value}`,
		);
	}
}

/**
 * Asserts that an entry is a course, throws if not
 */
export function assertIsCourse(
	entry: CollectionEntry<"courses">,
	context?: string,
): asserts entry is CollectionEntry<"courses"> & { data: { type: "course" } } {
	if (!isCourse(entry)) {
		throw new Error(
			`Expected course entry${context ? ` in ${context}` : ""}, got: ${entry.data.type}`,
		);
	}
}

/**
 * Asserts that an entry is a section, throws if not
 */
export function assertIsSection(
	entry: CollectionEntry<"courses">,
	context?: string,
): asserts entry is CollectionEntry<"courses"> & { data: { type: "section" } } {
	if (!isSection(entry)) {
		throw new Error(
			`Expected section entry${context ? ` in ${context}` : ""}, got: ${entry.data.type}`,
		);
	}
}

/**
 * Asserts that an entry is a lesson, throws if not
 */
export function assertIsLesson(
	entry: CollectionEntry<"courses">,
	context?: string,
): asserts entry is CollectionEntry<"courses"> & { data: { type: "lesson" } } {
	if (!isLesson(entry)) {
		throw new Error(
			`Expected lesson entry${context ? ` in ${context}` : ""}, got: ${entry.data.type}`,
		);
	}
}
