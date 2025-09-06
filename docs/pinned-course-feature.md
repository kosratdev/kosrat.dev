# Pinned Course Feature

This document explains how to use the pinned course feature that displays a course at the top of the home page for increased visibility.

## Configuration

The pinned course feature is configured in `src/config.ts`:

```typescript
pinnedCourse: {
    enable: true,                // Enable/disable the feature
    courseSlug: "flutter-ship",  // The course slug to pin
}
```

## Options

- **`enable`**: Set to `true` to enable pinning, `false` to disable
- **`courseSlug`**: The slug of the course you want to pin (must match the folder name in `src/content/courses/`)

## How it works

1. When enabled, the specified course appears at the top of the home page (first page only)
2. A "Pinned Course" section header is displayed with a pin icon
3. A "See all courses" button links to the courses page  
4. A "Latest Posts" section header separates the pinned course from regular posts
5. On subsequent pages, only regular posts are shown

## Visual Elements

- **Section Headers**: Clear titles with icons for both pinned course and posts
- **See All Courses Button**: Interactive button that links to `/courses`
- **Responsive Design**: Adapts to mobile and desktop layouts
- **Animations**: Staggered loading animations for smooth user experience

## Usage Examples

### Pin a specific course:
```typescript
pinnedCourse: {
    enable: true,
    courseSlug: "react-native-essentials",
}
```

### Disable pinning:
```typescript
pinnedCourse: {
    enable: false,
    courseSlug: undefined,
}
```

## Notes

- The pinned course must be published (not a draft) to appear
- Only one course can be pinned at a time
- The feature maintains consistent styling with the rest of the site
- Pinning only affects the home page (first page of posts)
