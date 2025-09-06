/**
 * Redirect configuration for migrating old posts to courses
 *
 * This file contains all redirect mappings used by Astro's built-in redirect system.
 * Each redirect should include both trailing slash variants for maximum compatibility.
 */

/**
 * Post to Course redirects
 * Format: { "old-path": "new-path" }
 */
export const redirects = {
	// Migrate flutter-ship posts to course
	"/posts/flutter-ship/": "/courses/flutter-ship/",
	"/posts/flutter-ship/git-github/": "/courses/flutter-ship/",
};
