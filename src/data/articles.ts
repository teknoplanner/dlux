import { ArticleItem, ArticleSection } from "./articles/types";
import { offlinePdfArticles } from "./articles/offline-pdf";
import { stickmanPenaltyArticles } from "./articles/stickman-penalty";
import { miloCatArticles } from "./articles/milo-cat";
import { monsterMathArticles } from "./articles/monster-math";
import { babySharkArticles } from "./articles/baby-shark";
import { fruityMergeArticles } from "./articles/fruity-merge";
import { kucingAturDuitArticles } from "./articles/kucing-atur-duit";

export type { ArticleItem, ArticleSection };

export const articles: ArticleItem[] = [
  ...offlinePdfArticles,
  ...stickmanPenaltyArticles,
  ...miloCatArticles,
  ...monsterMathArticles,
  ...babySharkArticles,
  ...fruityMergeArticles,
  ...kucingAturDuitArticles
];

export function getArticleBySlug(slug: string): ArticleItem | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByApp(appSlug: string): ArticleItem[] {
  return articles.filter((article) => article.targetAppSlug === appSlug);
}

export function getRelatedArticles(currentSlug: string, limit = 3): ArticleItem[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) {
    return articles.filter((article) => article.slug !== currentSlug).slice(0, limit);
  }

  // Prioritize articles from the same app or same category
  const sameApp = articles.filter(
    (a) => a.slug !== currentSlug && a.targetAppSlug === current.targetAppSlug
  );
  if (sameApp.length >= limit) {
    return sameApp.slice(0, limit);
  }

  const otherApp = articles.filter(
    (a) => a.slug !== currentSlug && a.targetAppSlug !== current.targetAppSlug
  );
  return [...sameApp, ...otherApp].slice(0, limit);
}
