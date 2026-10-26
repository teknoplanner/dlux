import { ArticleItem, ArticleSection } from "./articles/types";
import { offlinePdfArticles } from "./articles/offline-pdf";
import { stickmanPenaltyArticles } from "./articles/stickman-penalty";
import { miloCatArticles } from "./articles/milo-cat";
import { monsterMathArticles } from "./articles/monster-math";
import { babySharkArticles } from "./articles/baby-shark";
import { fruityMergeArticles } from "./articles/fruity-merge";
import { kucingAturDuitArticles } from "./articles/kucing-atur-duit";

// Active Published Gaming Meta Articles (Single pro feature live right now)
import { publishedGamingArticles } from "./articles/published-gaming";

// High-Intent Amazon Affiliate Hardware Buyer Guides (Priority for English & Global Visitors)
import { amazonBuyerGuides } from "./articles/amazon-buyer-guides";

// Queued Gaming Articles (149 articles staged for scheduled release)
export { queuedArticles } from "./articles/queue";

export type { ArticleItem, ArticleSection };

const unsortedArticles: ArticleItem[] = [
  ...amazonBuyerGuides,
  ...publishedGamingArticles,
  ...offlinePdfArticles,
  ...stickmanPenaltyArticles,
  ...miloCatArticles,
  ...monsterMathArticles,
  ...babySharkArticles,
  ...fruityMergeArticles,
  ...kucingAturDuitArticles,
];

// Always sort newest first so the latest published article is featured spotlight
export const articles: ArticleItem[] = unsortedArticles.sort(
  (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
);

export function getArticleBySlug(slug: string): ArticleItem | undefined {
  return articles.find((article) => article.slug === slug || article.slugEn === slug);
}

export function getArticlesByApp(appSlug: string, onlyIndexed = true): ArticleItem[] {
  return articles.filter((article) => {
    if (article.targetAppSlug !== appSlug) return false;
    if (onlyIndexed && article.noindex) return false;
    return true;
  });
}

export function getRelatedArticles(currentSlug: string, limit = 3): ArticleItem[] {
  const current = getArticleBySlug(currentSlug);
  // Strictly filter for indexed articles to channel link equity to ranking URLs
  const candidates = articles.filter(
    (a) => !a.noindex && a.slug !== currentSlug && a.slugEn !== currentSlug
  );

  if (!current) {
    return candidates.slice(0, limit);
  }

  const currentWords = new Set(
    `${current.slug} ${(current.keywords || []).join(" ")}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3)
  );

  // Score candidate articles for topical silo affinity
  const scored = candidates.map((a) => {
    let score = 0;
    // 1. Same target app (Hub-and-spoke cluster)
    if (a.targetAppSlug === current.targetAppSlug) score += 50;
    // 2. Same category silo (Gaming, Productivity, Education, etc.)
    if (a.category === current.category) score += 30;

    // 3. Keyword / sub-topic alignment
    const candWords = `${a.slug} ${(a.keywords || []).join(" ")}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3);

    for (const w of candWords) {
      if (currentWords.has(w)) score += 15;
    }

    return { article: a, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.article.publishedDate).getTime() - new Date(a.article.publishedDate).getTime();
  });

  return scored.slice(0, limit).map((s) => s.article);
}
