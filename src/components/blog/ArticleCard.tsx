import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArticleItem } from "@/data/articles";
import { apps } from "@/data/apps";
import { ArticleCover } from "@/components/blog/ArticleCover";

// Only what the card renders, so the blog hub can send a slim list to the browser.
export type CardArticle = Pick<ArticleItem, "slug" | "slugEn" | "title" | "titleEn" | "metaDescription" | "metaDescriptionEn" | "readTime" | "readTimeEn" | "publishedDate" | "category" | "targetAppSlug" | "affiliateProductIds">;

interface ArticleCardProps {
  article: CardArticle;
  featured?: boolean;
  lang?: "id" | "en";
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false, lang = "id" }) => {
  const isEn = lang === "en";
  const targetApp = apps.find((a) => a.slug === article.targetAppSlug);
  const title = isEn ? article.titleEn : article.title;
  const description = isEn ? article.metaDescriptionEn : article.metaDescription;
  const readTime = isEn ? article.readTimeEn : article.readTime;
  const href = isEn ? `/en/blog/${article.slugEn || article.slug}` : `/blog/${article.slug}`;
  const date = new Date(article.publishedDate).toLocaleDateString(isEn ? "en-US" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const meta = (
    <p className="text-sm text-slate-600">
      <span className="font-bold text-emerald-800 capitalize">{article.category}</span>
      {" · "}
      {readTime}
      {" · "}
      <time dateTime={article.publishedDate}>{date}</time>
    </p>
  );

  const cover = (
    <Link
      href={href}
      tabIndex={-1}
      aria-hidden="true"
      className={`relative block overflow-hidden bg-slate-100 ${featured ? "aspect-[16/9] lg:aspect-auto lg:min-h-full lg:col-span-5" : "aspect-[16/9]"}`}
    >
      <ArticleCover article={article} />
    </Link>
  );

  const body = (
    <div className={`p-5 sm:p-6 flex flex-col gap-3 ${featured ? "lg:col-span-7 lg:p-10 lg:justify-center" : "flex-1"}`}>
      {meta}
      <h3 className={`font-display font-bold text-slate-900 leading-snug ${featured ? "text-2xl sm:text-3xl" : "text-lg line-clamp-2"}`}>
        <Link href={href} className="hover:text-emerald-800">
          {title}
        </Link>
      </h3>
      <p className={`text-slate-700 leading-relaxed ${featured ? "text-base line-clamp-4" : "text-sm line-clamp-3"}`}>
        {description}
      </p>
      <div className="mt-auto pt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        {targetApp ? (
          <Link href={`/apps/${targetApp.slug}`} className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-950 min-h-[44px]">
            <Image src={targetApp.icon} alt="" width={28} height={28} className="rounded-lg" />
            <span className="font-semibold">{targetApp.name}</span>
          </Link>
        ) : (
          <span />
        )}
        <Link href={href} className="font-bold text-emerald-800 underline underline-offset-4 min-h-[44px] inline-flex items-center">
          {isEn ? "Read the guide" : "Baca panduan"}
        </Link>
      </div>
    </div>
  );

  return (
    <article
      className={`overflow-hidden rounded-xl border border-slate-200 bg-white ${
        featured ? "grid grid-cols-1 lg:grid-cols-12" : "flex flex-col"
      }`}
    >
      {cover}
      {body}
    </article>
  );
};
