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

export function getArticlesByApp(appSlug: string): ArticleItem[] {
  return articles.filter((article) => article.targetAppSlug === appSlug);
}

export function getRelatedArticles(currentSlug: string, limit = 3): ArticleItem[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) {
    return articles
      .filter((article) => article.slug !== currentSlug && article.slugEn !== currentSlug)
      .slice(0, limit);
  }

  const sameApp = articles.filter(
    (a) => a.slug !== current.slug && a.slugEn !== current.slugEn && a.targetAppSlug === current.targetAppSlug
  );
  if (sameApp.length >= limit) {
    return sameApp.slice(0, limit);
  }

  const otherApp = articles.filter(
    (a) => a.slug !== current.slug && a.slugEn !== current.slugEn && a.targetAppSlug !== current.targetAppSlug
  );
  return [...sameApp, ...otherApp].slice(0, limit);
}
