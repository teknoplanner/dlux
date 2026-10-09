export interface ArticleSection {
  id: string;
  title: string;
  content: string[];
  bulletPoints?: string[];
  tipBox?: {
    title: string;
    text: string;
    type?: "tip" | "highlight" | "warning";
  };
}

export interface ArticleItem {
  slug: string;       // Indonesian slug (for /blog/[slug]/)
  slugEn: string;     // English slug (for /en/blog/[slug]/)
  targetAppSlug: string;
  category: "productivity" | "gaming" | "education" | "finance" | "lifestyle";
  publishedDate: string;
  coverImage: string;
  author: string;
  affiliateProductIds?: string[];
  affiliateCategory?: "gaming" | "kids" | "productivity";

  // Indonesian Version
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  readTime: string;
  sections: ArticleSection[];
  faq: { q: string; a: string }[];

  // English Version (For International / Non-ID Visitors)
  titleEn: string;
  metaTitleEn: string;
  metaDescriptionEn: string;
  keywordsEn: string[];
  readTimeEn: string;
  englishSummary: string;
  sectionsEn: ArticleSection[];
  faqEn: { q: string; a: string }[];
}
