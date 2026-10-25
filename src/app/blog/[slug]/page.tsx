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
    slug: article.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: "Artikel Tidak Ditemukan" };

  const ogImageUrl = article.coverImage.startsWith("http")
    ? article.coverImage
    : `${developer.website}${article.coverImage.startsWith("/") ? "" : "/"}${article.coverImage}`;

  return {
    title: { absolute: `${seoTitle(article.metaTitle)} | D Lucky X` },
    description: seoDescription(article.metaDescription),
    keywords: article.keywords,
    robots: article.noindex ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: `${developer.website}/blog/${article.slug}/`,
      languages: {
        "x-default": `${developer.website}/blog/${article.slug}/`,
        id: `${developer.website}/blog/${article.slug}/`,
        en: `${developer.website}/en/blog/${article.slugEn}/`,
      },
    },
    openGraph: {
      title: article.metaTitle,
      description: seoDescription(article.metaDescription),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
      publishedTime: article.publishedDate,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: seoDescription(article.metaDescription),
      images: [ogImageUrl],
    },
  };
}

export default function Page({ params }: PageProps) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();
  return <ArticleView article={article} lang="id" />;
}
