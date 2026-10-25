import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { articles, getArticleBySlug } from "@/data/articles";
import { developer } from "@/data/apps";
import { seoTitle, seoDescription } from "@/lib/seo";
import { ArticleView } from "@/components/blog/ArticleView";

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slugEn,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: "Article Not Found" };

  const ogImageUrl = article.coverImage.startsWith("http")
    ? article.coverImage
    : `${developer.website}${article.coverImage.startsWith("/") ? "" : "/"}${article.coverImage}`;

  return {
    title: { absolute: `${seoTitle(article.metaTitleEn)} | D Lucky X` },
    description: seoDescription(article.metaDescriptionEn),
    keywords: article.keywordsEn,
    robots: article.noindex ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: `${developer.website}/en/blog/${article.slugEn}/`,
      languages: {
        "x-default": `${developer.website}/blog/${article.slug}/`,
        en: `${developer.website}/en/blog/${article.slugEn}/`,
        id: `${developer.website}/blog/${article.slug}/`,
      },
    },
    openGraph: {
      title: article.metaTitleEn,
      description: seoDescription(article.metaDescriptionEn),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.titleEn,
        },
      ],
      type: "article",
      publishedTime: article.publishedDate,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitleEn,
      description: seoDescription(article.metaDescriptionEn),
      images: [ogImageUrl],
    },
  };
}

export default function Page({ params }: PageProps) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();
  return <ArticleView article={article} lang="en" />;
}
