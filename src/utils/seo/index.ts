// Export all SEO utilities from the modular structure

export {
	generateKeywords,
	KeywordGenerator,
} from "./keywords";
export {
	generateCoursePageTitle,
	generateMetaDescription,
	MetadataGenerator,
} from "./metadata-generators";
export {
	generateCourseListingStructuredData,
	generateCourseStructuredData,
	generateLessonStructuredData,
	StructuredDataFactory,
} from "./structured-data";

import { KeywordGenerator } from "./keywords";
import { MetadataGenerator } from "./metadata-generators";
// Re-export common instances for immediate use
import { StructuredDataFactory } from "./structured-data";

// Use the site domain from CNAME
const SITE_URL = "https://kosrat.dev";

export const structuredDataFactory = new StructuredDataFactory(SITE_URL);
export const keywordGenerator = new KeywordGenerator();
export const metadataGenerator = new MetadataGenerator();
