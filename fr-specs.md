# Feature Request Overview

This repository contains my personal blog, which is a fork of [Fuwari](https://github.com/saicaca/fuwari). I want to add a new "**Courses**" feature. The "Courses" feature will present a collection of articles organized into a hierarchy of **courses**, **sections**, and **lessons**. The goal is to deliver high-quality, text-based courses to users. For example:

- Flutter-Ship (Course)

  - Git & GitHub Workflow (Section)
    - Overview (Lesson)
    - Branch Strategy
    - Commit Messages
    - Changelog
    - Git Hooks
    - GitHub PR Checks
    - Source Code
  - Little Things That Matters Most (Section)
    - Overview (Lesson)
    - Linter & Formatter
    - Package Name & Bundle ID
    - Flavors
    - Splash Screen
    - ENVs
    - Update gitignore
    - Source Code
  - Other Sections
    - Other lessons

# Functional Requirements

## Feature Entry Point

The Courses feature should be easily accessible from the home page. It will be discoverable through the following entry points:

1. **Top Navigation Menu**: A "Courses" link will be added to the main navigation menu, positioned between "Home" and "Archived".
2. **Sidebar Card**: A new "Courses" card will be added to the sidebar, listing available courses.
3. **Pinned Post**: A course can be "pinned" to appear at the top of the main post list for increase visibility.

This entry points will ensure high visibility for the courses feature.

## Courses Screen

Clicking the "Courses" navigation link will take the user to a dedicated Courses screen, which lists all available courses. The existing `PostCard.astro` component can be adapted for this view with the following modifications.

Each course tile will displays:

1. Title
2. Cover image
3. Description
4. Level: Beginner, Intermediate, and Advanced
5. Category
6. Total number of lessons
7. "Start Course" or "Continue" button (based on progress).

## Course Detail

When a user clicks on a course, they will be navigated to the course detail page.

### Course Sections

- The course detail page shows the course information at the top of the page.
- Course name and its meta data will be shown.
- A "Reset Progress" button will be available at the top of the page.
- After the course info, the course sections will be displayed.
- Sections will be collapsible accordion elements.
- Clicking a section title will toggle its collapsed/expanded state.
- Clicking a lesson title will display its content in the lesson content page.
- The sections have a check mark to indicate that the lessons inside that section have been completed.
- The lessons inside a section have a check mark to indicate that this lesson has been completed.

## Lesson Content Page

This screen will display the content of the selected lesson. It is a good idea to have the course and section info at the top of the page.

### Content Specs

- The lesson content will be shown as the post content (`PostPage.astro`).
- "Next" and "Previous" buttons will be displayed at the bottom of each lesson to allow for easy navigation.
- The first lesson of the first section will not have a "Previous" button.
- The last lesson of the section will have a "Finish" button instead of a "Next" button.
- Progress will be tracked on a per-browser basis using `localStorage`, as there is no user authentication. Clicking "Next" will mark the current lesson as completed.

## Course Content Management

Course content will be managed in a new `src/content/courses` directory. This separation will keep course lessons distinct from standard blog posts.

## Archive Section

The existing Archive page, which lists all posts, will be updated to include lessons. A small chip or label ("Post" or "Lesson") will be displayed before or next to each item in the timeline to differentiate the content type.

## Searching Functionality

The global search functionality in the top navigation bar will be updated to include course and lesson content in its search results.
